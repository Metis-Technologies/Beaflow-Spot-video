// 44 · Provvigioni senza calcoli (ossatura A, Pro): calcolatrice di tessere in rosso tra fogli che volano → luce oro, la calcolatrice si scompone e i fogli si mettono in pila → i tasti diventano quote, in colonne per operatore → ogni colonna accende il suo totale di fine mese → le colonne si allineano in un riepilogo unico
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const Q0 = new THREE.Quaternion();
const NASC = () => ({ p:C.clone(), q:Q0.clone(), s:V(0.001,0.001,0.001), g:0, c:0 });

// calcolatrice: tasti 4×6 (0–23), display (24–27), fogli (28–63)
const CC = V(0, C.y-0.15, 0);
const tasto = i => V((i%4-1.5)*0.3, -0.25-Math.floor(i/4)*0.26, 0.05);
const display = i => V((i-1.5)*0.27, 0.35, 0.05);
const foglio = (i,t) => { const r=R[i]; const a=r[0]*6.28+t*(0.4+r[1]*0.5); const rad=1.0+r[2]*0.5;
  return { p:CC.clone().add(V(Math.cos(a)*rad, -0.15+(r[3]-.5)*1.15+0.12*Math.sin(t*1.3+i), -0.5+Math.sin(a)*0.6)), q:qe(r[4]*3+t*0.9, r[5]*3+t*0.6, r[0]*2) }; };
const pila = k => CC.clone().add(V(1.05, -1.15+k*0.035, -0.4));
// colonne per operatore: 2 tessere di larghezza, righe 10 · 8 · 7
const OP = D.operatori || ['Giulia','Marco','Sara'], RH = [10,8,7], OX = [-0.85,0,0.85], BASE = C.y-1.25;
const TOT = D.totali || ['€ 1.240','€ 980','€ 860'];
const opDi = i => { let j=i; for(let k=0;k<3;k++){ const n=RH[k]*2; if(j<n) return [k,j]; j-=n; } return null; };
const lNomi = OP.map(n=>label(n, 0.8, 0.26, null, '#111111', 0.55));
const lTot = TOT.map(s=>label(s, 0.85, 0.3));
const lMese = label(D.mese || 'Fine mese · pronte', 1.6, 0.32, '#111111');
// riepilogo: righe orizzontali
const RRY = [C.y+0.05, C.y-0.5, C.y-1.05];
const lRiep = OP.map((n,k)=>label(`${n} · ${TOT[k]}`, 1.55, 0.28, k===0?'#775A18':'#111111', '#FFFFFF', 0.5));

const calc = (t, esplodi, oro) => R.map((r,i)=>{
  if(i<24){ const p=tasto(i).multiplyScalar(1+0.22*esplodi); return { p:CC.clone().add(p).add(V(0,0,0.3*esplodi*Math.sin(i))), q:qe(0,0,0.15*esplodi*Math.sin(i*1.7)), s:V(0.24,0.2,0.1), g:oro?(0.2+0.6*Math.max(0,Math.sin(t*3-i*0.3))):(i%4===3?0.85:0.25), c:(i%4===3)?1:0 }; }
  if(i<28){ return { p:CC.clone().add(display(i-24).multiplyScalar(1+0.22*esplodi)), q:Q0.clone(), s:V(0.26,0.3,0.08), g:oro?0.7:0.9, c:1 }; }
  if(!oro){ const f=foglio(i,t); return { p:f.p, q:f.q, s:V(0.32,0.42,0.012), g:0.06, c:0 }; }
  const u=E.inout(clamp((t-2.65-(i-28)*0.012)/0.6)); const f=foglio(i,2.6); return { p:f.p.lerp(pila(i-28),u), q:f.q.slerp(qe(-Math.PI/2,0,0),u), s:V(0.32,0.42,0.012), g:0.06, c:0 }; });

const F = {
  rossa(t){ return calc(t, 0, false); },
  oro(t){ return calc(t, E.spring(clamp((t-2.7)/0.8)), true); },
  colonne(t){ return R.map((r,i)=>{ const o=opDi(i); if(!o) return NASC(); const [k,j]=o, row=Math.floor(j/2), x=j%2; const w=E.spring(clamp((t-5.15-row*0.09-k*0.12)/SP));
      return { p:V(OX[k]+(x-0.5)*0.24, BASE+row*0.17+(1-w)*1.5, 0), q:qe(0,0,(1-w)*1.2), s:V(0.22,0.15,0.16), g:0.12+0.1*(row%3===0?1:0), c:0 }; }); },
  totali(t){ return R.map((r,i)=>{ const o=opDi(i); if(!o) return NASC(); const [k,j]=o, row=Math.floor(j/2), x=j%2; const lit=E.enter(clamp((t-8.0-k*0.25-row*0.03)/0.3));
      return { p:V(OX[k]+(x-0.5)*0.24, BASE+row*0.17, 0), q:Q0.clone(), s:V(0.22,0.15,0.16), g:0.1+0.75*lit, c:0 }; }); },
  riepilogo(t){ return R.map((r,i)=>{ const o=opDi(i); if(!o) return NASC(); const [k,j]=o, col=Math.floor(j/2), y=j%2;
      return { p:V(-1.15+col*0.2, RRY[k]+(y-0.5)*0.15, 0), q:Q0.clone(), s:V(0.18,0.13,0.14), g:k===0?0.8:0.3, c:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['rossa','oro',2.35,0.3,{arco:0}],['oro','colonne',4.95,0.6],['colonne','totali',7.45,0.15,{arco:0}],['totali','riepilogo',9.75,0.7],['riepilogo','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.4,0.9,11.0), V(0,-0.95,0), 4],
 [2.3,  V(-0.4,0.7,10.6), V(0,-0.95,0), 0],
 [2.9,  V(1.2,1.0,11.2),  V(0,-0.95,0), -2],
 [4.9,  V(0.6,0.8,10.8),  V(0,-0.95,0), -1],
 [5.4,  V(-1.2,0.9,9.8),  V(0,-0.9,0), 3],
 [7.3,  V(-0.6,0.8,9.6),  V(0,-0.9,0), 1],
 [7.9,  V(1.2,0.7,9.8),   V(0,-0.9,0), -2],
 [9.6,  V(0.6,0.6,9.4),   V(0,-0.9,0), -1],
 [10.2, V(-1.4,1.0,10.2), V(0,-0.8,0), 2],
 [11.8, V(-0.5,0.8,9.8),  V(0,-0.8,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  lNomi.forEach((l,k)=>{ const on=E.spring(clamp((t-5.6+0-k*0.1)/SP)), off=E.exit(clamp((t-9.7)/0.25)); l.position.set(OX[k], BASE-0.25, 0.3); face(l); show(l,on*(1-off)); });
  lTot.forEach((l,k)=>{ const on=E.spring(clamp((t-8.15-k*0.25)/SP)), off=E.exit(clamp((t-9.7)/0.25)); l.position.set(OX[k], BASE+RH[k]*0.17+0.22, 0.4); face(l); show(l,on*(1-off)); });
  { const on=0, off=0; lMese.position.set(0.25, BASE+RH[0]*0.17+0.75, 0.5); face(lMese); lMese.rotateZ(-0.03); show(lMese,on*(1-off)); }
  lRiep.forEach((l,k)=>{ const on=E.spring(clamp((t-10.4-k*0.15)/SP)), off=E.exit(clamp((t-12.0)/0.25)); l.position.set(-0.55, RRY[k]+0.27, 0.35); face(l); show(l,on*(1-off)); });
  camAt(t); tilesAt(t, F, TR, 'rossa'); draw();
}
