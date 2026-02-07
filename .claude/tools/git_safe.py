import subprocess, sys
args=sys.argv[1:]
try:
    r=subprocess.run(['git', *args], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
    sys.stdout.write(r.stdout)
except Exception:
    pass
