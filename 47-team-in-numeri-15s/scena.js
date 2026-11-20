// 47 · Il team, in numeri (ossatura A, report Pro «Performance Operatori»): tessere-persona in penombra rossa, senza numeri → luce oro, pannello «Performance Operatori» → tre indicatori: prenotazioni per operatore → gli indicatori passano al fatturato → tre linee oro che salgono insieme
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const Q0 = new THREE.Quaternion();
const NASC = () => ({ p:C.clone(), q:Q0.clone(), s:V(0.001,0.001,0.001), g:0, c:0 });

// scena 1 · cinque tessere-persona (testa + corpo 2×3)
const PX = [-1.0,-0.5,0,0.5,1.0], PB = C.y-1.0;
const persona = (k,j) => j===0 ? V(PX[k], PB+0.68, 0) : V(PX[k]+((j-1)%2-0.5)*0.17, PB+0.12+Math.floor((j-1)/2)*0.2, 0);
// scena 2 · pannello 8×6
const lPerf = label(D.pannello || 'Performance Operatori', 2.0, 0.34, '#775A18', '#FFFFFF', 0.46);
// scene 3 e 4 · tre indicatori a semicerchio da 16 tessere
const OP = D.operatori || ['Giulia','Marco','Sara'], GX = [-0.85,0,0.85], GAUY = C.y-0.45, GR = 0.36;
const PREN = D.prenotazioni || [42,35,28], FATT = D.fatturato || ['€ 2.100','€ 2.350','€ 1.600'];
const PP = [0.85,0.7,0.56], PF = [0.78,0.9,0.6];
const lNomi = OP.map(n=>label(n, 0.8, 0.26, null, '#111111', 0.55));
const lPren = PREN.map(n=>label(String(n), 0.5, 0.3, null, '#111111', 0.62));
const lFatt = FATT.map(n=>label(n, 0.78, 0.28));
const lTitPren = label(D.titolo_pren || 'Prenotazioni', 1.25, 0.3, '#111111'), lTitFatt = label(D.titolo_fatt || 'Fatturato', 1.0, 0.3, '#111111');
const arco = (k,j) => { const a=Math.PI-j/15*Math.PI; return V(GX[k]+Math.cos(a)*GR, GAUY+Math.sin(a)*GR, 0); };
// scena 5 · tre linee che salgono insieme
const LIN = (L,u) => V(-1.15+2.3*u, C.y-1.15+L*0.22+1.25*Math.pow(u,1.3)-L*0.18*u, 0);

const F = {
  persone(t){ return R.map((r,i)=>{ if(i>=35) return NASC(); const k=Math.floor(i/7), j=i%7; const sway=0.03*Math.sin(t*1.3+k);
      return { p:persona(k,j).add(V(sway,0,0)), q:Q0.clone(), s:j===0?V(0.17,0.17,0.17):V(0.15,0.18,0.15), g:0.15+0.5*Math.max(0,Math.sin(t*1.6+k*1.3)), c:(k===2&&j>0)?1:0 }; }); },
  pannello(t){ return R.map((r,i)=>{ if(i>=48) return NASC(); const x=i%8, y=Math.floor(i/8); const w=Math.max(0,Math.sin(Math.PI*clamp((t-2.75-(x+y)*0.04)/0.45)));
      return { p:V((x-3.5)*0.27, C.y+0.2-y*0.22, w*0.15), q:Q0.clone(), s:V(0.25,0.2,0.08), g:y===0?0.85:0.06+0.5*w, c:(x===0&&y>0)?1:0 }; }); },
  prenotazioni(t){ return R.map((r,i)=>{ if(i>=48) return NASC(); const k=Math.floor(i/16), j=i%16; const on=E.enter(clamp((t-5.2-k*0.15-j*0.04)/0.15))*(j<Math.round(16*PP[k])?1:0);
      const a=Math.PI-j/15*Math.PI; return { p:arco(k,j), q:qe(0,0,a-Math.PI/2), s:V(0.07,0.13,0.1), g:0.05+0.8*on, c:0 }; }); },
  fatturato(t){ return R.map((r,i)=>{ if(i>=48) return NASC(); const k=Math.floor(i/16), j=i%16; const pr=PP[k]+(PF[k]-PP[k])*E.inout(clamp((t-7.8-k*0.15)/0.7));
      const on=j<16*pr?1:0; const a=Math.PI-j/15*Math.PI; return { p:arco(k,j).add(V(0,0,on*0.05)), q:qe(0,0,a-Math.PI/2), s:V(0.07,0.13,0.1), g:0.05+0.9*on, c:0 }; }); },
  linee(t){ return R.map((r,i)=>{ if(i>=48) return NASC(); const L=Math.floor(i/16), j=i%16, u=j/15; const d=E.spring(clamp((t-10.1-u*0.6-L*0.1)/SP));
      return { p:LIN(L,u).add(V(0,(1-d)*-0.5,0)), q:qe(0,0,0.5*u), s:V(0.12,0.12,0.12).multiplyScalar(Math.max(0.05,d)), g:0.2+0.75*u, c:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['persone','pannello',2.3,0.7],['pannello','prenotazioni',4.95,0.6],['prenotazioni','fatturato',7.45,0.1,{arco:0}],['fatturato','linee',9.75,0.7],['linee','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.3,0.7,9.8),  V(0,-0.85,0), 3],
 [2.3,  V(-0.4,0.5,9.4),  V(0,-0.85,0), 0],
 [2.9,  V(1.2,0.6,10.0),  V(0,-0.8,0), -2],
 [4.9,  V(0.6,0.5,9.6),   V(0,-0.8,0), -1],
 [5.4,  V(-1.1,0.3,9.4),  V(0,-0.8,0), 2],
 [7.3,  V(-0.4,0.3,9.2),  V(0,-0.8,0), 1],
 [7.9,  V(1.0,0.5,9.4),   V(0,-0.8,0), -2],
 [9.6,  V(0.4,0.4,9.2),   V(0,-0.8,0), -1],
 [10.2, V(-1.4,0.9,10.2), V(0,-0.8,0), 2],
 [11.8, V(-0.5,0.7,9.8),  V(0,-0.8,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const on=E.spring(clamp((t-3.0)/SP)), off=E.exit(clamp((t-4.85)/0.25)); lPerf.position.set(0, C.y+0.2, 0.35); face(lPerf); show(lPerf,on*(1-off)); }
  lNomi.forEach((l,k)=>{ const on=E.spring(clamp((t-5.3+0-k*0.1)/SP)), off=E.exit(clamp((t-9.7)/0.25)); l.position.set(GX[k], GAUY-0.22, 0.3); face(l); show(l,on*(1-off)); });
  lPren.forEach((l,k)=>{ const on=E.spring(clamp((t-5.6-k*0.15)/SP)), off=E.exit(clamp((t-7.5)/0.2)); l.position.set(GX[k], GAUY+0.08, 0.3); face(l); show(l,on*(1-off)); });
  lFatt.forEach((l,k)=>{ const on=E.spring(clamp((t-8.1-k*0.15)/SP)), off=E.exit(clamp((t-9.7)/0.25)); l.position.set(GX[k], GAUY+0.08, 0.35); face(l); show(l,on*(1-off)); });
  { const on=E.spring(clamp((t-5.2)/SP)), off=E.exit(clamp((t-7.45)/0.2)); lTitPren.position.set(0, GAUY+0.75, 0.4); face(lTitPren); show(lTitPren,on*(1-off)); }
  { const on=E.spring(clamp((t-7.65)/SP)), off=E.exit(clamp((t-9.7)/0.25)); lTitFatt.position.set(0, GAUY+0.75, 0.4); face(lTitFatt); show(lTitFatt,on*(1-off)); }
  camAt(t); tilesAt(t, F, TR, 'persone'); draw();
}
