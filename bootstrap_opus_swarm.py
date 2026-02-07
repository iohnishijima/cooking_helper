from __future__ import annotations
from pathlib import Path
import json
import textwrap
import datetime

root = Path.cwd()
claude_dir = root / '.claude'
skills_dir = claude_dir / 'skills' / 'opus-swarm'
agents_dir = claude_dir / 'agents'
hooks_dir  = claude_dir / 'hooks'
tools_dir  = claude_dir / 'tools'

claude_dir.mkdir(exist_ok=True)
skills_dir.mkdir(parents=True, exist_ok=True)
agents_dir.mkdir(parents=True, exist_ok=True)
hooks_dir.mkdir(parents=True, exist_ok=True)
tools_dir.mkdir(parents=True, exist_ok=True)

ts = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')

def safe_write(path: Path, content: str):
    if path.exists():
        bak = path.with_suffix(path.suffix + f'.bak-{ts}')
        bak.write_text(path.read_text(encoding='utf-8'), encoding='utf-8')
    path.write_text(content, encoding='utf-8')

# --- tools (no shell operators needed later) ---
safe_write(tools_dir / 'quick_tree.py', textwrap.dedent('''
from pathlib import Path
skip={'.git','.venv','node_modules','dist','build'}
items=[]
for p in sorted(Path('.').iterdir()):
    if p.name in skip: 
        continue
    items.append(p.name + ('/' if p.is_dir() else ''))
print('\\n'.join(items[:80]))
''').lstrip())

safe_write(tools_dir / 'git_safe.py', textwrap.dedent('''
import subprocess, sys
args=sys.argv[1:]
try:
    r=subprocess.run(['git', *args], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
    sys.stdout.write(r.stdout)
except Exception:
    pass
''').lstrip())

# --- settings (separate file; doesn't break existing settings.json) ---
settings = {
  '$schema': 'https://json.schemastore.org/claude-code-settings.json',
  'model': 'claude-opus-4-6',
  'teammateMode': 'in-process',
  'env': {
    'CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS': '1'
  },
  'permissions': {
    'defaultMode': 'acceptEdits',
    'allow': [
      'Read','Grep','Glob','Task',
      'Bash(git *)',
      'Bash(python *)','Bash(pytest *)',
      'Bash(uv *)','Bash(poetry *)',
      'Bash(npm *)','Bash(pnpm *)','Bash(yarn *)',
      'Bash(make *)','Bash(cmake *)',
      'Edit','Write'
    ],
    'ask': [
      'Bash(git push *)',
      'Bash(git reset *)',
      'Bash(git clean *)',
      'Bash(rm *)',
      'Bash(sudo *)'
    ],
    'deny': [
      'Read(**/.env)',
      'Read(**/.env.*)',
      'Read(**/secrets/**)',
      'Read(**/credentials.*)',
      'Edit(**/.env)',
      'Edit(**/.env.*)',
      'Edit(**/secrets/**)',
      'Write(**/.env)',
      'Write(**/.env.*)',
      'Write(**/secrets/**)'
    ]
  },
  'hooks': {
    'PreToolUse': [
      {
        'matcher': 'Edit|Write',
        'hooks': [
          { 'type': 'command', 'command': 'python .claude/hooks/protect_files.py' }
        ]
      }
    ],
    'TaskCompleted': [
      {
        'hooks': [
          { 'type': 'command', 'command': 'python .claude/hooks/task_completed.py' }
        ]
      }
    ]
  }
}
safe_write(claude_dir / 'settings.opus-swarm.json', json.dumps(settings, ensure_ascii=False, indent=2))

# --- hooks ---
protect_files_py = r'''
import json, sys
data = json.load(sys.stdin)
tool_input = data.get('tool_input') or {}
p = (tool_input.get('file_path') or '').replace('\\\\', '/')
protected = ['/.env','/.env.','/secrets/','/credentials.','/.git/']
for pat in protected:
  if pat in p:
    print(f'Blocked: {p} matches protected pattern {pat}', file=sys.stderr)
    sys.exit(2)
sys.exit(0)
'''.lstrip()

task_completed_py = r'''
import sys, subprocess
from pathlib import Path
_ = sys.stdin.read()
root = Path.cwd()
cmds = []
if (root/'pyproject.toml').exists() or (root/'pytest.ini').exists() or (root/'tests').exists():
    cmds.append(['python','-m','pytest','-q'])
if (root/'package.json').exists():
    cmds.append(['npm','test','--silent'])
if not cmds:
    sys.exit(0)
for c in cmds:
    r = subprocess.run(c, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if r.returncode != 0:
        print('TaskCompleted gate failed. Fix tests before completing the task.\\n', file=sys.stderr)
        print('Command:', ' '.join(c), file=sys.stderr)
        print('\\nSTDOUT:\\n', r.stdout[-4000:], file=sys.stderr)
        print('\\nSTDERR:\\n', r.stderr[-4000:], file=sys.stderr)
        sys.exit(2)
sys.exit(0)
'''.lstrip()

safe_write(hooks_dir / 'protect_files.py', protect_files_py)
safe_write(hooks_dir / 'task_completed.py', task_completed_py)

# --- SKILL (NO heredoc, NO redirect, NO ||) ---
skill = r'''
---
name: opus-swarm
description: Opus固定のAgent Teamsを立ち上げ、超並列で$ARGUMENTSを完遂する（既存CI/CDの挙動は絶対に壊さない）
argument-hint: "[やりたいタスク]"
disable-model-invocation: true
model: opus
allowed-tools: "Read, Grep, Glob, Task, Bash(git *), Bash(python *), Bash(pytest *), Bash(uv *), Bash(poetry *), Bash(npm *), Bash(pnpm *), Bash(yarn *), Bash(make *), Bash(cmake *), Edit, Write"
---

## Live repo snapshot
- cwd: !`pwd`
- git head: !`python .claude/tools/git_safe.py rev-parse --abbrev-ref HEAD`
- git status: !`python .claude/tools/git_safe.py status --porcelain=v1`
- last commit: !`python .claude/tools/git_safe.py log -1 --oneline`
- top-level: !`python .claude/tools/git_safe.py rev-parse --show-toplevel`
- quick tree: !`python .claude/tools/quick_tree.py`

## Mission
あなたは **Agent Team Lead**。以下を“必ずこの順番”で実行し、$ARGUMENTS を完遂せよ。

### 絶対ルール（破ったらやり直し）
1) **既存CI/CD・デプロイ・動作の互換性を壊す変更は禁止**
2) Team Lead は **delegate mode** に入り、実装は基本的に teammates にやらせる（自分は調整・統合・判断）
3) ファイル衝突を防ぐ：各 teammate に **ファイル所有範囲** を割り当て、同じファイルを同時に触らせない
4) 最初に “読む/理解する” タスクを多めに振り、設計→実装→検証→統合の順で進める
5) 進捗は必ず `docs/swarm/<teammate-id>/report.md` に残す

### Team を作れ（Opus固定・最大火力）
**12人**の teammates を作成し、全員 **Opus** を使用。役割は以下で固定：
T1 RepoArchaeologist
T2 Architect
T3 SpecWriter
T4 Impl-Core
T5 Impl-Edge
T6 Tests-Unit
T7 Tests-Integration
T8 Perf
T9 Sec
T10 CI-Release
T11 Reviewer-A
T12 Reviewer-B

### 実行
1) Team 作成 → すぐ delegate mode に入る
2) docs/swarm/ を作る（必要なら）
3) タスク割り当て → 並列実行 → 統合 → テスト合格 → 完了報告
'''
safe_write(skills_dir / 'SKILL.md', textwrap.dedent(skill).lstrip() + '\\n')

print('✅ bootstrap_opus_swarm.py created/updated everything safely')
