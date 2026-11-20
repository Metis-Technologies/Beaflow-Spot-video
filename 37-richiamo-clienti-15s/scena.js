// 37 · Torna a trovarti (ossatura A): un cliente si allontana e sbiadisce in rosso → la luce vira all'oro e il cliente si ferma → il calendario conta i giorni e ne parte una busta oro → la busta arriva sul telefono, che si accende → torna come prenotazione oro nell'agenda
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const Q0 = new THREE.Quaternion();
const NASC = () => ({ p:C.clone(), q:Q0.clone(), s:V(0.001,0.001,0.001), g:0, c:0 });

// busta oro disegnata su un piano rivolto alla camera
function busta(w=0.72, h=0.48){ const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(w*400),Math.round(h*400),(g,W,H)=>{ g.fillStyle='#C9B16C'; g.beginPath(); g.roundRect(4,4,W-8,H-8,H*0.1); g.fill();
    g.strokeStyle='#FFFFFF'; g.lineWidth=10; g.lineJoin='round'; g.beginPath(); g.moveTo(18,20); g.lineTo(W/2,H*0.58); g.lineTo(W-18,20); g.stroke();
    g.globalAlpha=0.5; g.beginPath(); g.moveTo(18,H-20); g.lineTo(W*0.38,H*0.48); g.moveTo(W-18,H-20); g.lineTo(W*0.62,H*0.48); g.stroke(); }); m.material.needsUpdate=true; }); return m; }

// disco-cliente ad anelli (64 tessere)
function discPts(n, step){ const out=[]; let k=0; while(out.length<n){ const cnt=k===0?1:6*k+(k>2?1:0); for(let j=0;j<cnt&&out.length<n;j++){ const a=j/cnt*Math.PI*2+k*0.35; out.push([Math.cos(a)*k*step, Math.sin(a)*k*step, k]); } k++; } return out; }
const D64 = discPts(64, 0.17), DC = V(0, C.y-0.25, 0);
const lUltima = label(D.ultima || 'Ultima visita · 3 mesi fa', 2.1, 0.34, '#111111');
const lRich = label(D.richiamo || 'Richiamo automatico', 1.75, 0.34);

// calendario 8×8: i giorni passano, poi parte la busta dall'ultimo giorno acceso
const CAL = V(0, C.y-0.3, 0), GIORNI_ON = 44;
const calP = i => CAL.clone().add(V((i%8-3.5)*0.24, (3.5-Math.floor(i/8))*0.2, 0));
const bustaCal = busta(), lInv = label(D.inviato || 'Messaggio inviato', 1.6, 0.32, '#111111');
const BUSTA0 = calP(GIORNI_ON-1).add(V(0,0,0.35)), BUSTA1 = V(1.0, C.y+0.75, 0.9);

// telefono stilizzato: corpo nero, schermo di tessere 6×10
const PH = V(0, C.y-0.3, 0);
const phone = new THREE.Mesh(new RoundedBoxGeometry(1.32,2.32,0.12,6,0.16), new THREE.MeshStandardMaterial({color:0x111111, roughness:0.3, metalness:0.2})); phone.castShadow=true; scene.add(phone);
const bustaTel = busta(0.6,0.4);

// agenda 8×8 e prenotazione che arriva
const AG = V(0, C.y-0.35, 0), SLOT = [27,28,35,36];
const lPren = label(D.prenotazione || 'Prenotato · Mar 10:30', 1.9, 0.34);

const F = {
  allontana(t){ const u=E.inout(clamp((t-0.2)/1.9));
    return R.map((r,i)=>{ const d=D64[i]; const fade=E.inout(clamp((t-0.3-(4-d[2])*0.12)/1.0));
      return { p:DC.clone().add(V(d[0]*(1-0.25*u)+0.6*u, d[1]*(1-0.25*u)+0.25*u+0.03*Math.sin(t*1.5+i), -2.2*u)), q:qe(0,-0.35*u,0), s:V(0.14,0.14,0.13), g:0.05+0.8*fade, c:(d[2]===4&&i%3===0)?1:0 }; }); },
  ferma(t){ const u=E.spring(clamp((t-2.6)/0.9));
    return R.map((r,i)=>{ const d=D64[i]; const pulse=0.25*Math.max(0,Math.sin(t*3-d[2]*0.6));
      return { p:DC.clone().add(V(d[0]*(0.75+0.25*u)+0.6*(1-u), d[1]*(0.75+0.25*u)+0.25*(1-u), -2.2*(1-u))), q:qe(0,-0.35*(1-u),0), s:V(0.14,0.14,0.13), g:0.45+pulse, c:(d[2]===4&&i%3===0)?1:0 }; }); },
  calendario(t){ return R.map((r,i)=>{ const on=i<GIORNI_ON?E.enter(clamp((t-5.2-i*0.018)/0.12)):0; const last=i===GIORNI_ON-1;
      const pop=last?Math.max(0,Math.sin(Math.PI*clamp((t-6.0)/0.35))):0;
      return { p:calP(i).add(V(0,0,pop*0.2)), q:Q0.clone(), s:V(0.21,0.17,0.1), g:last?0.2+0.8*on:0.05+0.3*on, c:(i%8===0||i%8===7)?1:0 }; }); },
  telefono(t){ const lit=E.enter(clamp((t-8.45)/0.4));
    return R.map((r,i)=>{ if(i>=60) return NASC(); const x=i%6, y=Math.floor(i/6); const w=Math.max(0,Math.sin(Math.PI*clamp((t-8.45-y*0.04)/0.4)));
      return { p:PH.clone().add(V((x-2.5)*0.18, (4.5-y)*0.19, 0.1+w*0.08)), q:Q0.clone(), s:V(0.16,0.16,0.05), g:0.04+0.45*lit+0.4*w, c:0 }; }); },
  agenda(t){ return R.map((r,i)=>{ const x=i%8, y=Math.floor(i/8); const k=SLOT.indexOf(i); const base=AG.clone().add(V((x-3.5)*0.26, (3.5-y)*0.2, 0));
      if(k<0) return { p:base, q:Q0.clone(), s:V(0.23,0.17,0.1), g:(x+y)%5===0?0.2:0.06, c:(x===0)?1:0 };
      const u=E.inout(clamp((t-10.2-k*0.06)/0.7)); const from=PH.clone().add(V(0.5,1.4,0.6));
      return { p:from.lerp(base.clone().add(V(0,0,0.06)),u).add(V(0,0.4*Math.sin(Math.PI*u),0)), q:qe(0,0,(1-u)*0.5), s:V(0.23,0.17,0.12), g:0.3+0.65*u, c:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['allontana','ferma',2.35,0.35,{arco:0}],['ferma','calendario',4.95,0.6],['calendario','telefono',7.35,0.7],['telefono','agenda',9.75,0.7],['agenda','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.2,0.6,10.0), V(0,-0.7,0), 3],
 [2.3,  V(-0.4,0.5,10.6), V(0.2,-0.7,-0.6), 0],
 [2.9,  V(1.2,0.7,10.2),  V(0,-0.75,0), -2],
 [4.9,  V(0.6,0.5,9.8),   V(0,-0.75,0), -1],
 [5.4,  V(-1.3,1.2,9.6),  V(0,-0.8,0), 3],
 [7.3,  V(-0.7,1.0,9.4),  V(0,-0.8,0), 1],
 [7.9,  V(1.3,0.4,9.8),   V(0,-0.8,0), -2],
 [9.6,  V(0.6,0.3,9.2),   V(0,-0.8,0), -1],
 [10.2, V(-1.5,1.1,10.4), V(0,-0.75,0), 2],
 [11.8, V(-0.6,0.9,10.0), V(0,-0.75,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const on=E.spring(clamp((t-0.8)/SP)), off=E.exit(clamp((t-2.2)/0.25)); lUltima.position.set(0, C.y+0.85, 0.6); face(lUltima); lUltima.rotateZ(0.03); show(lUltima,on*(1-off)); }
  { const on=E.spring(clamp((t-3.2)/SP)), off=E.exit(clamp((t-4.8)/0.25)); lRich.position.set(0, C.y+0.85, 0.6); face(lRich); lRich.rotateZ(-0.03); show(lRich,on*(1-off)); }
  { const on=E.spring(clamp((t-6.05)/SP)), off=E.exit(clamp((t-7.25)/0.25)); const f=E.inout(clamp((t-6.35)/0.8));
    bustaCal.position.copy(BUSTA0).lerp(BUSTA1,f).add(V(0,0.3*Math.sin(Math.PI*f),0)); face(bustaCal); bustaCal.rotateZ(0.15*f); show(bustaCal,on*(1-off)); }
  { const on=E.spring(clamp((t-6.6)/SP)), off=E.exit(clamp((t-7.25)/0.25)); lInv.position.set(-0.55, C.y-1.25, 0.6); face(lInv); show(lInv,on*(1-off)); }
  { const on=E.spring(clamp((t-7.75)/SP)), off=E.inout(clamp((t-9.72)/0.45)); phone.position.copy(PH).add(V(0,0.03*Math.sin(t*1.2)-2.6*off,-0.12-1.5*off)); phone.rotation.set(0.04+0.6*off, 0.12*Math.sin(t*0.6), 0); show(phone,on); if(on<0.35||off>0.98) phone.visible=false; }
  { const on=E.spring(clamp((t-7.6)/SP)), off=E.exit(clamp((t-8.5)/0.2)); const f=E.inout(clamp((t-7.75)/0.7));
    bustaTel.position.copy(BUSTA1).lerp(PH.clone().add(V(0,0.2,0.4)),f); face(bustaTel); bustaTel.rotateZ(0.15*(1-f)); show(bustaTel,on*(1-off)); }
  { const on=E.spring(clamp((t-10.9)/SP)), off=E.exit(clamp((t-12.0)/0.3)); lPren.position.set(0, C.y+0.65, 0.6); face(lPren); lPren.rotateZ(-0.03); show(lPren,on*(1-off)); }
  camAt(t); tilesAt(t, F, TR, 'allontana'); draw();
}
