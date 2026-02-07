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
