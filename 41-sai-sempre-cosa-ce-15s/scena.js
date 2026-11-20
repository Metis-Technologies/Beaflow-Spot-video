// 41 · Sai sempre cosa c'è (ossatura A, magazzino Pro): scaffale di flaconi con un vuoto rosso → luce oro, lo scaffale si riempie → a ogni vendita un flacone se ne va e la giacenza scende → l'ultimo si accende: «Scorta bassa» → lo scaffale si ricarica a cascata
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const Q0 = new THREE.Quaternion();
const NASC = () => ({ p:C.clone(), q:Q0.clone(), s:V(0.001,0.001,0.001), g:0, c:0 });

// scaffale: 3 ripiani × 8 flaconi; tessere 0–23 corpi, 24–47 tappi, 48–63 non usate
const PY = [C.y+0.3, C.y-0.45, C.y-1.2], BXs = k => (k-3.5)*0.27;
const BODY = V(0.17,0.34,0.17), CAP = V(0.09,0.08,0.09);
const VUOTO = i => i>=12 && i<16;                                        // il vuoto rosso: metà destra del ripiano centrale
const piani = new THREE.Group(); scene.add(piani);
const plankMat = new THREE.MeshStandardMaterial({color:0xF3EEE4, roughness:0.55});
PY.forEach(y=>{ const p=new THREE.Mesh(new RoundedBoxGeometry(2.45,0.06,0.42,3,0.02), plankMat); p.position.y=y; p.castShadow=true; p.receiveShadow=true; piani.add(p); });
// ripiano singolo, più grande, per le scene 3 e 4
const RY = C.y-0.55, RX = k => (k-3.5)*0.34, RS = 1.35;
const piano1 = new THREE.Mesh(new RoundedBoxGeometry(3.0,0.07,0.55,3,0.025), plankMat); piano1.castShadow=true; scene.add(piano1);
const VENDITE = [5.45,6.05,6.65], VENDITE2 = [7.75,7.95,8.15];
const lGiac = ['12','11','10'].map(n=>label((D.giacenza||'Giacenza · ')+n, 1.55, 0.36, '#111111'));
const lScorta = label(D.scorta || 'Scorta bassa · 2', 1.6, 0.36);

function scaffale(t, opts){ return R.map((r,i)=>{ if(i>=48) return NASC(); const cap=i>=24, b=cap?i-24:i, row=Math.floor(b/8), k=b%8;
    const o=opts(b,row,k); if(!o) return NASC();
    const base=V(BXs(k), PY[row]+0.03+(cap?0.38:0.17)+(o.dy||0), 0);
    if(o.vuoto) return cap?NASC():{ p:V(BXs(k), PY[row]+0.04, 0), q:Q0.clone(), s:V(0.2,0.015,0.2), g:o.g, c:0 };
    return { p:base, q:Q0.clone(), s:(cap?CAP:BODY).clone().multiplyScalar(o.s??1), g:cap?0.1:o.g, c:cap?1:0 }; }); }
function riga(t, venduti, extra){ return R.map((r,i)=>{ if(i>=48) return NASC(); const cap=i>=24, b=cap?i-24:i; if(b>=8) return NASC();
    const vt=venduti[b]; const f=vt===undefined?0:E.inout(clamp((t-vt)/0.45)); if(f>=1) return NASC();
    const p=V(RX(b), RY+0.035+(cap?0.38*RS:0.17*RS), 0).add(V(2.2*f, 0.6*Math.sin(Math.PI*f), 0.4*f));
    const e=extra?extra(b):{g:0.12};
    return { p, q:qe(0,0,-0.6*f), s:(cap?CAP:BODY).clone().multiplyScalar(RS*(1-0.8*f)), g:cap?0.1:e.g, c:cap?1:0 }; }); }

const F = {
  vuoto(t){ return scaffale(t,(b,row,k)=>VUOTO(b)?{vuoto:true, g:0.5+0.45*Math.sin(t*5)**2}:{g:0.08}); },
  pieno(t){ return scaffale(t,(b,row,k)=>{ const w=VUOTO(b)?E.spring(clamp((t-2.85-(b-12)*0.08)/SP)):1; const wave=Math.max(0,Math.sin(t*2.5-k*0.5-row));
      return { g:0.1+0.5*wave+(VUOTO(b)?0.3:0), s:Math.max(0.05,w), dy:(1-w)*0.5 }; }); },
  vendite(t){ return riga(t, {7:VENDITE[0],6:VENDITE[1],5:VENDITE[2]}); },
  avviso(t){ const lit=E.enter(clamp((t-8.4)/0.3)); return riga(t, {7:0,6:0,5:0,4:VENDITE2[0],3:VENDITE2[1],2:VENDITE2[2]}, b=>({ g:b===1?0.15+0.8*lit*(0.7+0.3*Math.sin(t*6)):0.1 })); },
  ricarica(t){ return scaffale(t,(b,row,k)=>{ const w=E.spring(clamp((t-10.1-(2-row)*0.18-k*0.05)/SP)); return { g:0.12+0.6*w*(k%3===0?1:0.4), s:Math.max(0.05,w), dy:(1-w)*0.9 }; }); },
  punto:PUNTO, alone:ALONE,
};
// tra le scene 3 e 4 la riga resta ferma: niente arco
const TR = [['vuoto','pieno',2.35,0.3,{arco:0}],['pieno','vendite',4.95,0.65],['vendite','avviso',7.45,0.15,{arco:0}],['avviso','ricarica',9.75,0.6],['ricarica','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.3,0.8,10.0), V(0,-0.75,0), 3],
 [2.3,  V(-0.4,0.6,9.6),  V(0,-0.75,0), 0],
 [2.9,  V(1.2,0.9,10.2),  V(0,-0.75,0), -2],
 [4.9,  V(0.6,0.7,9.8),   V(0,-0.75,0), -1],
 [5.4,  V(-1.2,0.6,9.4),  V(0,-0.85,0), 2],
 [7.3,  V(-0.4,0.5,9.0),  V(0,-0.85,0), 1],
 [7.9,  V(0.6,0.4,8.8),   V(-0.6,-0.85,0), -2],
 [9.6,  V(0.2,0.4,8.6),   V(-0.6,-0.85,0), -1],
 [10.2, V(-1.4,1.0,10.4), V(0,-0.75,0), 2],
 [11.8, V(-0.5,0.8,10.0), V(0,-0.75,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const vis=(t<5.0)||(t>9.85&&t<12.15); const on=t<5.0?E.soft(clamp(t/0.3))*(1-E.exit(clamp((t-4.85)/0.2))):E.soft(clamp((t-9.85)/0.3))*(1-E.exit(clamp((t-12.05)/0.2)));
    piani.position.set(0,0,0); piani.rotation.y=0.05*Math.sin(t*0.5); show(piani, vis?on:0); }
  { const on=E.soft(clamp((t-5.05)/0.3)), off=E.exit(clamp((t-9.7)/0.2)); piano1.position.set(0,RY,0); show(piano1,on*(1-off)); }
  lGiac.forEach((l,n)=>{ const a=n===0?5.25:VENDITE[n-1]+0.25, b=n<2?VENDITE[n]+0.25:7.3; const on=E.spring(clamp((t-a)/0.25)), off=E.exit(clamp((t-b)/0.12));
    l.position.set(-0.55, RY-0.38, 0.6); face(l); show(l,on*(1-off)); });
  { const on=E.spring(clamp((t-8.45)/SP)), off=E.exit(clamp((t-9.7)/0.25)); lScorta.position.set(RX(1), RY+1.05, 0.6); face(lScorta); lScorta.rotateZ(0.04); show(lScorta,on*(1-off)); }
  camAt(t); tilesAt(t, F, TR, 'vuoto'); draw();
}
