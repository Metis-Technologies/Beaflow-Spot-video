// 42 · I numeri parlano (ossatura B, report Pro): grafico 3D che cresce come una città, la camera ci vola sopra → «Ricavi nel Tempo» a 16 barre → «Scontrino Medio» su uno scontrino di tessere → «Prenotazioni Totali» a confronto con il periodo precedente → le barre si fondono in una linea di crescita oro
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const Q0 = new THREE.Quaternion();
const NASC = () => ({ p:C.clone(), q:Q0.clone(), s:V(0.001,0.001,0.001), g:0, c:0 });

// scena 1 · città di barre 8×8: più alte verso il fondo a destra
const FLOOR = C.y-1.1;
const altezza = i => { const x=i%8, z=Math.floor(i/8); return 0.15+1.1*Math.pow((x+(7-z))/14,1.4)+0.12*Math.abs(Math.sin(i*2.3)); };
// scena 2 · ricavi nel tempo: 16 barre da 4 tessere
const RIC = k => 0.3+1.25*Math.pow(k/15,1.15)+0.08*Math.sin(k*1.7);
const lRic = label(D.ricavi || 'Ricavi nel Tempo', 1.6, 0.34, '#111111');
// scena 3 · scontrino 8×8
const lScon = label(D.scontrino || 'Scontrino Medio · 38 €', 2.0, 0.42, '#775A18', '#FFFFFF', 0.42);
// scena 4 · prenotazioni totali: periodo precedente 4×7, questo periodo 4×8
const lTot = label(D.totali || 'Prenotazioni Totali  +12%', 2.15, 0.38);
const lPrima = label(D.prima || 'Periodo precedente', 1.25, 0.24, null, '#111111', 0.5), lOra = label(D.ora || 'Questo mese', 1.0, 0.24, null, '#111111', 0.5);
// scena 5 · linea di crescita
const LINEA = u => V(-1.25+2.5*u, C.y-1.0+1.55*Math.pow(u,1.6)+0.12*Math.sin(u*9)*(1-u), 0);
const freccia = new THREE.Mesh(new THREE.ConeGeometry(0.11,0.24,24), new THREE.MeshStandardMaterial({color:0xC9B16C, emissive:0xC9B16C, emissiveIntensity:0.7, metalness:0.5, roughness:0.3})); scene.add(freccia);

const F = {
  citta(t){ return R.map((r,i)=>{ const x=i%8, z=Math.floor(i/8); const w=E.spring(clamp((t-0.1-(x+(7-z))*0.07)/0.5)); const h=Math.max(0.02,altezza(i)*w);
      return { p:V((x-3.5)*0.3, FLOOR+h/2, (z-3.5)*0.3), q:Q0.clone(), s:V(0.24,h,0.24), g:altezza(i)>1.05?0.85:0.06+0.25*w*(x/7), c:(i%9===4)?1:0 }; }); },
  ricavi(t){ return R.map((r,i)=>{ const k=Math.floor(i/4), j=i%4; const w=E.spring(clamp((t-2.7-k*0.05)/0.5)); const h=RIC(k)*Math.max(0.03,w), seg=h/4;
      return { p:V((k-7.5)*0.155, FLOOR+0.05+seg*(j+0.5), 0), q:Q0.clone(), s:V(0.12,Math.max(0.005,seg-0.01),0.12), g:k>=13?0.8:0.08+0.04*k, c:(j===0&&k%4===0)?1:0 }; }); },
  scontrino(t){ const up=E.spring(clamp((t-5.1)/0.6));
    return R.map((r,i)=>{ const x=i%8, y=Math.floor(i/8); const zig=y===7?((x%2)?-0.05:0.03):0; const wave=0.04*Math.sin(t*2-y*0.6);
      return { p:V((x-3.5)*0.21, C.y-0.45+(3.5-y)*0.21+zig+(1-up)*-0.6, wave), q:qe(-0.12+0.05*Math.sin(t*0.8),0.2*Math.sin(t*0.5),0), s:V(0.205,0.205,0.04), g:(y===0)?0.75:0.05, c:0 }; }); },
  confronto(t){ return R.map((r,i)=>{ if(i>=60) return NASC(); const prima=i<28, j=prima?i:i-28, x=j%4, y=Math.floor(j/4);
      const w=E.spring(clamp((t-7.65-y*0.05-(prima?0:0.35))/SP));
      return { p:V((prima?-0.62:0.62)+(x-1.5)*0.22, FLOOR+0.15+y*0.2+(1-w)*0.6, 0), q:Q0.clone(), s:V(0.2,0.18,0.2).multiplyScalar(Math.max(0.02,w)), g:prima?0.06:0.35+0.45*(y/7), c:prima&&x===0?1:0 }; }); },
  linea(t){ return R.map((r,i)=>{ const u=i/63; const d=E.enter(clamp((t-10.1-u*0.8)/0.3));
      const p=LINEA(u), q=LINEA(Math.min(1,u+0.01)); const a=Math.atan2(q.y-p.y,q.x-p.x);
      return { p:p.clone().add(V(0,0,0.05*Math.sin(t*2+i*0.3))), q:qe(0,0,a), s:V(0.07,0.07,0.07).multiplyScalar(Math.max(0.05,d)), g:0.3+0.65*u*d, c:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['citta','ricavi',2.3,0.7],['ricavi','scontrino',4.95,0.6],['scontrino','confronto',7.35,0.7],['confronto','linea',9.75,0.7],['linea','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.7,1.9,10.2), V(-0.1,-1.05,0), 4],
 [1.2,  V(-0.6,1.5,9.8),  V(-0.1,-1.0,0), 0],
 [2.3,  V(0.6,1.6,10.2),  V(-0.1,-1.0,0), -2],
 [2.9,  V(0.8,0.4,9.6),   V(0,-0.9,0), -1],
 [4.9,  V(0.3,0.3,9.2),   V(0,-0.9,0), 0],
 [5.4,  V(-1.2,0.5,9.0),  V(0,-0.8,0), 3],
 [7.3,  V(-0.6,0.4,8.8),  V(0,-0.8,0), 1],
 [7.9,  V(1.2,0.6,9.6),   V(0,-0.85,0), -2],
 [9.6,  V(0.6,0.5,9.2),   V(0,-0.85,0), -1],
 [10.2, V(-1.3,0.8,10.0), V(0,-0.8,0), 2],
 [11.8, V(-0.5,0.7,9.6),  V(0,-0.8,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const on=E.spring(clamp((t-3.1)/SP)), off=E.exit(clamp((t-4.85)/0.25)); lRic.position.set(-0.45, FLOOR-0.28, 0.5); face(lRic); show(lRic,on*(1-off)); }
  { const on=E.spring(clamp((t-5.55)/SP)), off=E.exit(clamp((t-7.25)/0.25)); lScon.position.set(0, C.y-0.45, 0.3); face(lScon); lScon.rotateZ(0.02); show(lScon,on*(1-off)); }
  { const on=E.spring(clamp((t-8.3)/SP)), off=E.exit(clamp((t-9.7)/0.25)); lTot.position.set(0.1, FLOOR+2.0, 0.6); face(lTot); lTot.rotateZ(-0.03); show(lTot,on*(1-off)); }
  [[lPrima,-0.62],[lOra,0.62]].forEach(([l,x])=>{ const on=E.spring(clamp((t-7.9)/SP)), off=E.exit(clamp((t-9.7)/0.25)); l.position.set(x, FLOOR-0.12, 0.4); face(l); show(l,on*(1-off)); });
  { const on=E.spring(clamp((t-10.85)/SP)), off=E.exit(clamp((t-12.05)/0.25)); const p=LINEA(1), q=LINEA(0.98); freccia.position.copy(p).add(V(0.06,0.06,0)); freccia.rotation.set(0,0,Math.atan2(p.y-q.y,p.x-q.x)-Math.PI/2); show(freccia,on*(1-off)); }
  camAt(t); tilesAt(t, F, TR, 'citta'); draw();
}
