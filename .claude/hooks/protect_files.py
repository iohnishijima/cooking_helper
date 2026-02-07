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
