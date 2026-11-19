import sys, shutil, json, re
from pathlib import Path
R=Path('/home/claude/beaflow-spot-video'); B=R/'25-agenda-piena-15s'
SET={
 'barbieri':{'t1':'Barbiere,','t1b':'poltrona vuota?','voce':'Barbiere, poltrona vuota?','lab':['Taglio + barba · 9:30','Sfumatura · 15:00','Barba · 11:00'],'t1s':112,'t1bs':104},
 'estetica':{'t1':'Centro estetico,','t1b':'cabine vuote?','voce':'Centro estetico, cabine vuote?','lab':['Pulizia viso · 10:00','Laser · 16:30','Ceretta · 11:00'],'t1s':100,'t1bs':112},
 'unghie':{'t1':'Studio unghie,','t1b':'posti liberi?','voce':'Studio unghie, troppi posti liberi?','lab':['Refill · 10:00','Semipermanente · 15:30','Nail art · 11:00'],'t1s':104,'t1bs':112},
 'spa':{'t1':'Spa e massaggi,','t1b':'lettini liberi?','voce':'Spa e massaggi, lettini liberi?','lab':['Massaggio relax · 10:00','Percorso spa · 16:00','Rituale di coppia · 11:30'],'t1s':100,'t1bs':112},
}
for k,c in SET.items():
    d=R/f'25-agenda-piena-{k}-15s'; (d/'sorgente').mkdir(parents=True,exist_ok=True); (d/'audio').mkdir(exist_ok=True); (d/'export').mkdir(exist_ok=True)
    for f in ['render.js','sheet.py','package.json','package-lock.json','logo-positivo.svg','logo-negativo.svg','audio.py']: shutil.copy(B/'sorgente'/f, d/'sorgente'/f)
    shutil.copy(B/'.gitignore', d/'.gitignore') if (B/'.gitignore').exists() else shutil.copy(R/'33-storia-cliente-15s/.gitignore', d/'.gitignore')
    nm=d/'sorgente'/'node_modules'
    if not nm.exists(): nm.symlink_to('../../16-tutto-si-trasforma-15s/sorgente/node_modules')
    for n in range(2,7): shutil.copy(B/'audio'/f'line{n}.mp3', d/'audio'/f'line{n}.mp3')
    s=(B/'sorgente'/'index.html').read_text()
    w=lambda txt:' '.join(f'<span class="w">{x}</span>' for x in txt.split())
    s=s.replace('<div id="t1"><span class="w">Posti</span></div>', f'<div id="t1">{w(c["t1"])}</div>')
    s=s.replace('<div id="t1b"><span class="w">vuoti?</span></div>', f'<div id="t1b">{w(c["t1b"])}</div>')
    s=re.sub(r'#t1\{font-weight:800;font-size:\d+px', f'#t1{{font-weight:800;font-size:{c["t1s"]}px', s)
    s=re.sub(r'#t1b\{margin-top:0;font-weight:800;font-size:\d+px', f'#t1b{{margin-top:0;font-weight:800;font-size:{c["t1bs"]}px', s)
    s=re.sub(r'<title>.*?</title>', f'<title>Beaflow · Agenda piena · {k} · 15 s</title>', s)
    lab=json.dumps(c['lab'], ensure_ascii=False)
    code=f'''
// etichette di settore sulle colonne che si riempiono
const SLAB={lab}, SCOL=[0,2,5], SWIN=[[5.6,7.3],[8.1,9.75],[10.55,12.0]];
const slabs=SLAB.map(()=>{{ const m=new THREE.Mesh(new THREE.PlaneGeometry(1.9,0.4), new THREE.MeshBasicMaterial({{transparent:true, toneMapped:false}})); scene.add(m); return m; }});
function makeSlabs(){{ slabs.forEach((m,j)=>{{ const c=document.createElement('canvas'); c.width=760; c.height=160; const g=c.getContext('2d');
  g.font='700 54px Inter'; const tw2=g.measureText(SLAB[j]).width; const W=Math.min(760,tw2+150); const x0=(760-W)/2;
  g.fillStyle='#FFFFFF'; g.beginPath(); g.roundRect(x0,8,W,144,30); g.fill(); g.fillStyle='#C9B16C'; g.beginPath(); g.arc(x0+56,80,20,0,Math.PI*2); g.fill();
  g.fillStyle='#111111'; g.textBaseline='middle'; g.fillText(SLAB[j],x0+96,84);
  const tx=new THREE.CanvasTexture(c); tx.colorSpace=THREE.SRGBColorSpace; tx.anisotropy=4; m.material.map=tx; m.material.needsUpdate=true; }}); }}
function slabsAt(t){{ slabs.forEach((m,j)=>{{ const [a,b]=SWIN[j]; const on=E.spring(clamp((t-a)/SP)), off=E.exit(clamp((t-b)/0.3));
  const cx=colX(SCOL[j])*0.8+(SCOL[j]===0?0.6:SCOL[j]===5?-0.35:0); m.position.set(cx, TOPY-ROWS*RH*0.55, 0.9); m.quaternion.copy(cam.quaternion); m.rotateZ(j===1?-0.04:0.04);
  const s=Math.max(0.0001,on*(1-off)); m.scale.setScalar(s); m.visible=s>0.002; }}); }}
'''
    s=s.replace('function seek(t){ seek2d(t); render3d(t); }', code+'function seek(t){ seek2d(t); render3d(t); }')
    s=s.replace('  tilesAt(t); camAt(t);\n','  tilesAt(t); camAt(t); slabsAt(t);\n')
    s=s.replace('document.fonts.load(\'800 64px Inter\').then(()=>document.fonts.ready)','document.fonts.load(\'800 64px Inter\').then(()=>document.fonts.load(\'700 54px Inter\')).then(()=>document.fonts.ready)')
    s=s.replace('then(()=>{ makeHeads(); seek(0); return true; })','then(()=>{ makeHeads(); makeSlabs(); seek(0); return true; })')
    assert 'slabsAt(t);' in s and 'makeSlabs(); seek(0)' in s and c['t1b'].split()[0] in s
    (d/'sorgente'/'index.html').write_text(s)
    a=(d/'sorgente'/'audio.py').read_text()
    (d/'sorgente'/'audio.py').write_text(a)
    print('ok',d.name)
