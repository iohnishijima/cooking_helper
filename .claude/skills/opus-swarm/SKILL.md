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
\n