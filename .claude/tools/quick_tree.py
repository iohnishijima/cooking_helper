from pathlib import Path
skip={'.git','.venv','node_modules','dist','build'}
items=[]
for p in sorted(Path('.').iterdir()):
    if p.name in skip: 
        continue
    items.append(p.name + ('/' if p.is_dir() else ''))
print('\n'.join(items[:80]))
