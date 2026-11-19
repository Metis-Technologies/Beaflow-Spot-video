# Costruisce index.html di uno spot partendo dal 33 (CSS, motore, tre.js comune) + pezzi specifici.
import sys, json, re
BASE='/home/claude/beaflow-spot-video/33-storia-cliente-15s/sorgente/index.html'
def build(out, title, titles, scene, extra_css='', extra_html='', extra_tl='', seed=1, t1=112, t1b=112):
    s=open(BASE).read()
    head=s[:s.index('<body>')]
    head=re.sub(r'<title>.*?</title>', f'<title>Beaflow · {title} · 15 s</title>', head)
    head=head.replace('#t1{font-weight:800;font-size:112px;line-height:1.04;letter-spacing:-.04em}', f'#t1{{font-weight:800;font-size:{t1}px;line-height:1.04;letter-spacing:-.04em}}')
    head=head.replace('#t1b{margin-top:0;font-weight:800;font-size:112px;line-height:1.04;letter-spacing:-.04em;color:var(--rosso)}', f'#t1b{{margin-top:0;font-weight:800;font-size:{t1b}px;line-height:1.04;letter-spacing:-.04em;color:var(--rosso)}}')
    head=head.replace('</style>', extra_css+'\n</style>')
    def words(txt): return '<br>'.join(' '.join(f'<span class="w">{w}</span>' for w in line.split()) for line in txt.split('|'))
    body=f'''<body>
<canvas id="gl" width="1080" height="1920"></canvas>
<div id="vig"></div>
<div id="shade"></div>
<div id="flash"></div>

<img id="logoS" class="logo" src="logo-positivo.svg" alt="">

<div id="h1" class="ui">
  <div id="t1">{words(titles[0])}</div>
  <div id="t1b">{words(titles[1])}</div>
</div>
<div id="t2" class="ui tt">{words(titles[2])}</div>
<div id="t3" class="ui tt">{words(titles[3])}</div>
<div id="t4" class="ui tt">{words(titles[4])}</div>
<div id="t5" class="ui tt">{words(titles[5])}</div>
{extra_html}
<img id="logoB" class="logo" src="logo-positivo.svg" alt="">
<div id="btn" class="ui">Inizia gratis</div>
<div id="offer" class="ui">Piano Free · 0 € per sempre</div>
<div id="url" class="ui">beaflow.it</div>
'''
    js=s[s.index('<script type="module">'):]
    engine=js[:js.index('/* ───────── timeline UI')]
    tl=js[js.index('/* ───────── timeline UI'):js.index('/* ───────── scena 3D ───────── */')]
    tl=tl.replace("const FL = SCURO", extra_tl+"\nconst FL = SCURO")
    tc=js[js.index('/* ───────── scena 3D ───────── */'):js.index('// scheda cliente')]
    tc=re.sub(r'let seed=\d+;', f'let seed={seed};', tc)
    common_tail=r'''
// particelle
const PN=420, pp=new Float32Array(PN*3), p0=[];
for(let i=0;i<PN;i++) p0.push([rnd()*18-9, rnd()*24-12, rnd()*26-18, 0.08+rnd()*0.25]);
const pgeo=new THREE.BufferGeometry(); pgeo.setAttribute('position',new THREE.BufferAttribute(pp,3));
const dot=document.createElement('canvas'); dot.width=dot.height=64; { const g=dot.getContext('2d');
  const gr=g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.35,'rgba(255,255,255,.6)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,64,64); }
const pmat=new THREE.PointsMaterial({size:SCURO?0.09:0.07, map:new THREE.CanvasTexture(dot), transparent:true, depthWrite:false, opacity:SCURO?1:0.55, blending:SCURO?THREE.AdditiveBlending:THREE.NormalBlending, color:0xC9B16C});
scene.add(new THREE.Points(pgeo,pmat));
const R = Array.from({length:N},()=>[rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd()]);
const PUNTO = t => R.map(()=>({ p:C.clone(), q:new THREE.Quaternion(), s:V(0.02,0.02,0.02), g:SCURO?4:1, c:0 }));
const ALONE = t => R.map((r,i)=>{ const a=i/N*Math.PI*2 + t*0.3; const tilt=qe(1.15,0,0.1);
  const p=V(Math.cos(a)*3.4, Math.sin(a)*3.4, 0).applyQuaternion(tilt).add(V(0,1.0,-3.4));
  return { p, q:tilt.clone().multiply(qe(0,0,a)), s:V(0.34,0.08,0.08), g:(i%2)?0.8:0.15, c:0 }; });
const white = new THREE.Color(SCURO?0x3a3a3a:0xffffff), black = new THREE.Color(0x1a1a1a), tmpC=new THREE.Color();
const M4=new THREE.Matrix4();
function tilesAt(t, F, TR, first){
  const cache={}; const get=n=>cache[n]??=F[n](t);
  for(let i=0;i<N;i++){
    let st=get(first)[i];
    for(const [a,b,s,d] of TR){ const del=(i/N)*0.28; if(t<s+del) break;
      const u=E.morph(clamp((t-s-del)/d)), A=get(a)[i], B=get(b)[i];
      const p=A.p.clone().lerp(B.p,u); const arc=Math.sin(Math.PI*u);
      p.add(V((R[i][0]-.5)*1.4*arc, (R[i][1]-.2)*1.4*arc, (R[i][2]-.2)*1.8*arc));
      st={ p, q:A.q.clone().slerp(B.q,u), s:A.s.clone().lerp(B.s,u), g:A.g+(B.g-A.g)*u+arc*0.3, c:A.c+(B.c-A.c)*u };
    }
    M4.compose(st.p, st.q, st.s); tiles.setMatrixAt(i,M4);
    aGlow.array[i]=st.g; tmpC.copy(white).lerp(black,st.c); tiles.setColorAt(i,tmpC);
  }
  tiles.instanceMatrix.needsUpdate=true; tiles.instanceColor.needsUpdate=true; aGlow.needsUpdate=true;
}
function makeCam(CK){ const posC=new THREE.CatmullRomCurve3(CK.map(k=>k[1]),false,'centripetal'), tgtC=new THREE.CatmullRomCurve3(CK.map(k=>k[2]),false,'centripetal');
  return t=>{ let i=0; while(i<CK.length-2 && t>=CK[i+1][0]) i++; const a=CK[i], b=CK[i+1], f=clamp((t-a[0])/(b[0]-a[0])), u=(i+f)/(CK.length-1);
    cam.position.copy(posC.getPoint(u)); cam.lookAt(tgtC.getPoint(u)); cam.rotateZ(THREE.MathUtils.degToRad(a[3]+(b[3]-a[3])*E.inout(f))); }; }
const CLOSE_CK = [[12.0, V(0,0.3,11.0), V(0,-0.2,0), 0],[12.75,V(0,-0.6,4.2),V(0,-0.8,0),6],[13.3,V(0,0.6,13.2),V(0,0.4,0),0],[15.0,V(0,0.5,14.6),V(0,0.4,0),0]];
let composer=null, bloom=null;
if (SCURO) { composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene,cam));
  bloom = new UnrealBloomPass(new THREE.Vector2(540,960), 0.8, 0.5, 0.7); composer.addPass(bloom); composer.addPass(new OutputPass()); }
const RED=new THREE.Color(0xFF5A4F), GOLD=new THREE.Color(0xC9B16C);
function commonFrame(t){
  const k=E.inout(clamp((t-2.35)/0.3)); const col=RED.clone().lerp(GOLD,k);
  glowU.value.copy(col).multiplyScalar(SCURO?1.5:1.0); rim.color.copy(col);
  for(let i=0;i<PN;i++){ const q=p0[i]; pp[i*3]=q[0]+Math.sin(t*0.4+i)*0.2; pp[i*3+1]=((q[1]+t*q[3]+12)%24+24)%24-12; pp[i*3+2]=q[2]; }
  pgeo.attributes.position.needsUpdate=true;
  if (bloom) { let pulse=0; for(const b of [2.5,5,7.5,10,12.5,13]) { const dd=t-b; if(dd>-0.05&&dd<0.4) pulse=Math.max(pulse,Math.exp(-Math.max(dd,0)*8)); } bloom.strength = 0.78 + 0.7*pulse; }
}
function draw(){ if (composer) composer.render(); else renderer.render(scene, cam); }
function canvasTex(w,h,fn){ const c=document.createElement('canvas'); c.width=w; c.height=h; const g=c.getContext('2d'); fn(g,w,h); const tx=new THREE.CanvasTexture(c); tx.colorSpace=THREE.SRGBColorSpace; tx.anisotropy=4; return tx; }
const LATE=[];  // funzioni da chiamare quando i font sono pronti
'''
    end=r'''
function seek(t){ seek2d(t); render3d(t); }
window.seek = seek;
window.ready = document.fonts.load('800 64px Inter').then(()=>document.fonts.load('700 52px Inter')).then(()=>document.fonts.load('600 40px Inter')).then(()=>document.fonts.ready)
  .then(()=>Promise.all([...document.images].map(im=>im.decode().catch(()=>{})))).then(()=>{ LATE.forEach(f=>f()); seek(0); return true; });
if(location.search.includes('play')){ window.ready.then(()=>{ const t0=performance.now();
  (function loop(){ seek(((performance.now()-t0)/1000)%DURATION); requestAnimationFrame(loop); })(); }); }
</script>
</body>
</html>
'''
    open(out,'w').write(head+body+engine+tl+tc+common_tail+scene+end)

if __name__=='__main__':
    spec=json.load(open(sys.argv[1]))
    build(spec['out'], spec['title'], spec['titles'], open(spec['scene']).read(), spec.get('css',''), spec.get('html',''), spec.get('tl',''), spec.get('seed',1), spec.get('t1',112), spec.get('t1b',112))
