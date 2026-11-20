// 46 · Gratis, per sempre (ossatura C, piano Free): cartellino del prezzo fermo su «0 €» → si torna indietro: i rulli delle cifre girano verso il basso → si fermano di scatto su «0 €» → una sede e due operatori → tessere che salgono a gradini oro (senza anello: la chiusura è quella comune)
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const Q0 = new THREE.Quaternion();
const NASC = () => ({ p:C.clone(), q:Q0.clone(), s:V(0.001,0.001,0.001), g:0, c:0 });

// cartellino del prezzo: 8×6 tessere con l'angolo sinistro tagliato e il foro, più un cordino di 16 tessere
const TAG = V(0.1, C.y-0.35, 0), TAGQ = t => qe(0.05, 0.25*Math.sin(t*0.6), -0.12+0.04*Math.sin(t*0.9));
const TAGP = []; for(let y=0;y<6;y++) for(let x=0;x<8;x++){ const cut=(x===0&&(y===0||y===5))||(x===1&&(y===0||y===5)&&false); TAGP.push(cut?null:V((x-3.5)*0.26, (2.5-y)*0.24, 0)); }
const FORO = V(-0.72, 0, 0.02);
const lZero = label(D.zero || '0 €', 1.3, 0.62, '#775A18', '#FFFFFF', 0.62);
// rulli delle cifre: 3 cilindri da 16 tessere che girano attorno all'asse x
const RX = [-0.62, 0, 0.62], RC = V(0, C.y-0.35, 0);
const giro = t => { const v=t<2.5?0:(t<5.0?(t-2.5)*9:22.5+ (1-Math.pow(1-clamp((t-5.0)/0.35),3))*2.0); return v; };
// sede e due operatori
const SEDE = V(-0.65, C.y-0.75, 0), OPS = [V(0.45, C.y-0.75, 0), V(0.95, C.y-0.75, 0)];
const lSede = label(D.sede || '1 sede', 0.8, 0.28, '#111111', '#FFFFFF', 0.55), lOp = label(D.operatori || '2 operatori', 1.15, 0.28, '#111111', '#FFFFFF', 0.55);
// gradini: 7 gradini alti 1…7 tessere, profondi 2

const F = {
  cartellino(t){ const q=TAGQ(t); let k=0;
    return R.map((r,i)=>{ if(i<48){ const p=TAGP[i]; if(!p) return NASC(); return { p:p.clone().applyQuaternion(q).add(TAG), q:q.clone(), s:V(0.24,0.22,0.08), g:(i%8===7)?0.85:0.35, c:0 }; }
      const j=i-48, a=j/16*Math.PI*1.2+0.3; const loc=FORO.clone().add(V(-0.25-Math.sin(a)*0.35, 0.35*Math.cos(a)-0.1+0.4, 0.05));
      return { p:loc.applyQuaternion(q).add(TAG), q:q.clone(), s:V(0.06,0.06,0.06), g:0.6, c:1 }; }); },
  rulli(t){ const a0=giro(t); return R.map((r,i)=>{ if(i>=48) return NASC(); const d=Math.floor(i/16), j=i%16; const a=j/16*Math.PI*2-a0*(1+d*0.15);
      return { p:RC.clone().add(V(RX[d], Math.sin(a)*0.5, Math.cos(a)*0.5)), q:qe(-a,0,0), s:V(0.5,0.18,0.05), g:Math.cos(a)>0.85?0.85:0.08, c:(j%4===2)?1:0 }; }); },
  sede(t){ return R.map((r,i)=>{ const w=E.spring(clamp((t-7.6-(i%13)*0.03)/SP));
      if(i<25){ const x=i%5, y=Math.floor(i/5); const porta=(x===2&&y>=3); return { p:SEDE.clone().add(V((x-2)*0.2, (4-y)*0.2+0.1, 0)), q:Q0.clone(), s:V(0.18,0.18,0.18).multiplyScalar(Math.max(0.05,w)), g:porta?0.9:0.12, c:(y===0)?1:0 }; }
      if(i<39){ const k=Math.floor((i-25)/7), j=(i-25)%7; const O=OPS[k]; const w2=E.spring(clamp((t-8.0-k*0.2)/SP));
        const p=j===0?V(0,0.66,0):V(((j-1)%2-0.5)*0.17, 0.12+Math.floor((j-1)/2)*0.2, 0);
        return { p:O.clone().add(p), q:Q0.clone(), s:(j===0?V(0.17,0.17,0.17):V(0.15,0.18,0.15)).multiplyScalar(Math.max(0.05,w2)), g:0.8, c:0 }; }
      return NASC(); }); },
  gradini(t){ return R.map((r,i)=>{ if(i>=56) return NASC(); let k=0, j=i; while(j>=(k+1)*2){ j-=(k+1)*2; k++; } const h=Math.floor(j/2), z=j%2;
      const w=E.spring(clamp((t-10.1-k*0.12-h*0.03)/SP));
      return { p:V((k-3)*0.3, C.y-1.2+h*0.22+(1-w)*-0.6, (z-0.5)*0.26), q:Q0.clone(), s:V(0.27,0.2,0.24).multiplyScalar(Math.max(0.05,w)), g:0.1+0.8*(k/6)*(h===k?1:0.5), c:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['cartellino','rulli',2.3,0.6],['rulli','rulli',4.95,0.05,{arco:0}],['rulli','sede',7.35,0.7],['sede','gradini',9.75,0.7],['gradini','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.2,0.6,9.6),  V(0,-0.8,0), 3],
 [2.3,  V(-0.4,0.5,9.2),  V(0,-0.8,0), 0],
 [2.9,  V(1.6,0.5,9.4),   V(0,-0.8,0), -3],
 [4.9,  V(0.9,0.4,9.0),   V(0,-0.8,0), -1],
 [5.4,  V(-0.4,0.4,8.6),  V(0,-0.8,0), 2],
 [7.3,  V(-0.2,0.3,8.4),  V(0,-0.8,0), 1],
 [7.9,  V(1.2,0.9,9.6),   V(0.1,-0.85,0), -2],
 [9.6,  V(0.6,0.7,9.2),   V(0.1,-0.85,0), -1],
 [10.2, V(-1.6,1.4,10.2), V(0,-0.85,0), 3],
 [11.8, V(-0.8,1.2,9.8),  V(0,-0.85,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const on1=E.spring(clamp((t-0.15)/SP))*(1-E.exit(clamp((t-2.2)/0.2))), on3=E.spring(clamp((t-5.35)/SP))*(1-E.exit(clamp((t-7.25)/0.25)));
    if(t<3){ lZero.position.copy(TAG).add(V(0.25,0,0.25).applyQuaternion(TAGQ(t))); lZero.quaternion.copy(TAGQ(t)); show(lZero,on1); }
    else { lZero.position.copy(RC).add(V(0,0,0.75)); face(lZero); show(lZero,on3,1.15); } }
  { const on=E.spring(clamp((t-7.9)/SP)), off=E.exit(clamp((t-9.7)/0.25)); lSede.position.copy(SEDE).add(V(0,-0.28,0.4)); face(lSede); show(lSede,on*(1-off)); }
  { const on=E.spring(clamp((t-8.3)/SP)), off=E.exit(clamp((t-9.7)/0.25)); lOp.position.set((OPS[0].x+OPS[1].x)/2, SEDE.y-0.28, 0.4); face(lOp); show(lOp,on*(1-off)); }
  camAt(t); tilesAt(t, F, TR, 'cartellino'); draw();
}
