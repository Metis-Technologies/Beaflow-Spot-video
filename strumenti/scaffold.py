# uso: scaffold.py NN-cartella prefisso_voce(es. 34) "Titolo" sfx.py
import sys, shutil, re
from pathlib import Path
R=Path('/home/claude/beaflow-spot-video'); S33=R/'33-storia-cliente-15s'
d=R/sys.argv[1]; pre=sys.argv[2]; title=sys.argv[3]; sfx=Path(sys.argv[4]).read_text()
(d/'sorgente').mkdir(parents=True,exist_ok=True); (d/'audio').mkdir(exist_ok=True); (d/'export').mkdir(exist_ok=True)
for f in ['render.js','sheet.py','package.json','package-lock.json','logo-positivo.svg','logo-negativo.svg']:
    shutil.copy(S33/'sorgente'/f, d/'sorgente'/f)
nm=d/'sorgente'/'node_modules'
if not nm.exists(): nm.symlink_to('../../16-tutto-si-trasforma-15s/sorgente/node_modules')
for k in range(1,6): shutil.copy(f'/home/claude/vox/v{pre}{k}.mp3', d/'audio'/f'line{k}.mp3')
shutil.copy(S33/'audio'/'line6.mp3', d/'audio'/'line6.mp3')
a=(S33/'sorgente'/'audio.py').read_text()
a=a.replace('«Ogni cliente, la sua storia»', f'«{title}»')
i=a.index('def build_sfx():'); j=a.index('def decode(')
a=a[:i]+sfx.strip()+'\n\n'+a[j:]
(d/'sorgente'/'audio.py').write_text(a)
print('ok', d)
