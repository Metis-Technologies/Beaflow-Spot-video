// 38 · Il salone in tasca (ossatura C, PWA dal browser, niente store): telefono già pieno con l'agenda → la pagina si apre dal sito → diventa un'icona sulla schermata → un tocco e si apre l'agenda → il telefono entra in tasca e arriva «Nuova prenotazione»
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const Q0 = new THREE.Quaternion();
const NASC = () => ({ p:C.clone(), q:Q0.clone(), s:V(0.001,0.001,0.001), g:0, c:0 });

// telefono: corpo nero; le tessere dello schermo seguono il telefono
const PH = V(0, C.y-0.3, 0);
const phone = new THREE.Mesh(new RoundedBoxGeometry(1.32,2.32,0.12,6,0.16), new THREE.MeshStandardMaterial({color:0x111111, roughness:0.3, metalness:0.2})); phone.castShadow=true; scene.add(phone);
const giu = t => E.inout(clamp((t-10.2)/0.75));                         // il telefono scende in tasca
const phPos = t => PH.clone().add(V(0, 0.03*Math.sin(t*1.1)-0.95*giu(t), 0));
const phQ = t => qe(0.05, 0.16*Math.sin(t*0.5), 0.03*Math.sin(t*0.4));
const onPhone = (t, loc) => loc.clone().applyQuaternion(phQ(t)).add(phPos(t));
const screenLoc = i => V((i%6-2.5)*0.18, (4.5-Math.floor(i/6))*0.19, 0.1);
// agenda sullo schermo: blocchi accesi d'oro
const AGON = new Set([8,9,14,15,22,23,28,34,35,41,46,47,52,53]);

// schermata con le icone: 4×6 posti, il quinto della terza riga è Beaflow (4×4 tessere piccole)
const SLOT = 9, slotLoc = k => V((k%4-1.5)*0.3, (2.5-Math.floor(k/4))*0.34, 0.1);
function homeLoc(i, t){ const f=E.inout(clamp((t-5.35)/0.7));
  if(i<16){ const ic=slotLoc(SLOT).add(V((i%4-1.5)*0.072, (1.5-Math.floor(i/4))*0.072, 0.02)); return { p:screenLoc(i*3).lerp(ic,f), s:V(0.16-0.095*f,0.16-0.095*f,0.05), g:0.3+0.6*f, c:0 }; }
  const k=i-16; if(k>=23) return null; const slot=k>=SLOT?k+1:k; const pop=E.spring(clamp((t-5.2-slot*0.03)/SP));
  return { p:slotLoc(slot), s:V(0.21,0.21,0.06).multiplyScalar(Math.max(0.02,pop)), g:0.08, c:(slot%3===1)?1:0 }; }
const lUrl = label(D.sito || 'beaflow.it', 1.05, 0.26, '#FFFFFF', '#111111', 0.5);
const lAgg = label(D.aggiunta || 'Aggiunta alla schermata', 2.05, 0.34);
const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2,0.015,8,48), new THREE.MeshBasicMaterial({color:0xC9B16C, transparent:true, toneMapped:false})); scene.add(ring);

// tasca: pannello porcellana davanti alla parte bassa del telefono, con cucitura oro
const tasca = new THREE.Group(); scene.add(tasca);
{ const b=new THREE.Mesh(new RoundedBoxGeometry(2.1,1.5,0.14,6,0.12), new THREE.MeshStandardMaterial({color:0xF3EEE4, roughness:0.6})); b.castShadow=true; tasca.add(b);
  const cu=new THREE.Mesh(new THREE.BoxGeometry(1.9,0.025,0.02), new THREE.MeshStandardMaterial({color:0xC9B16C, emissive:0x775A18, emissiveIntensity:0.4, metalness:0.6, roughness:0.3})); cu.position.set(0,0.62,0.08); tasca.add(cu); }
const lNuova = label(D.nuova || 'Nuova prenotazione', 1.8, 0.36);

const F = {
  pieno(t){ return R.map((r,i)=>{ if(i>=60) return NASC(); const on=AGON.has(i); const w=0.15*Math.max(0,Math.sin(t*2.4-Math.floor(i/6)*0.5));
      return { p:onPhone(t, screenLoc(i)), q:phQ(t), s:V(0.16,0.16,0.05), g:on?0.75+w:0.06, c:(i%6===0)?1:0 }; }); },
  carica(t){ return R.map((r,i)=>{ if(i>=60) return NASC(); const y=Math.floor(i/6); const w=E.spring(clamp((t-2.75-y*0.12)/SP));
      return { p:onPhone(t, screenLoc(i).add(V(0,0,0.02*(1-w)))), q:phQ(t), s:V(0.16,0.16*Math.max(0.05,w),0.05), g:y===0?0.8:(y===8?0.05:0.1), c:(y===8)?1:0 }; }); },
  home(t){ return R.map((r,i)=>{ const h=homeLoc(i,t); if(!h) return NASC(); return { p:onPhone(t,h.p), q:phQ(t), s:h.s, g:h.g, c:h.c }; }); },
  apre(t){ const u=E.inout(clamp((t-8.15)/0.65));
    return R.map((r,i)=>{ if(i>=60) return NASC(); const h=homeLoc(i,7.3); const a=h?h.p:slotLoc(SLOT); const e=screenLoc(i); const lit=E.enter(clamp((t-8.6)/0.4));
      return { p:onPhone(t, a.clone().lerp(e,u)), q:phQ(t), s:(h?h.s:V(0.001,0.001,0.001)).clone().lerp(V(0.16,0.16,0.05),u), g:h&&i<16?0.9-0.3*u:0.06+(AGON.has(i)?0.7*lit:0), c:(i%6===0)&&u>0.5?1:0 }; }); },
  tasca(t){ const nuovo=E.enter(clamp((t-11.0)/0.3));
    return R.map((r,i)=>{ if(i>=60) return NASC(); const on=AGON.has(i)||((i===2||i===3)&&nuovo>0.5);
      return { p:onPhone(t, screenLoc(i)), q:phQ(t), s:V(0.16,0.16,0.05), g:on?0.8:0.06, c:(i%6===0)?1:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['pieno','carica',2.3,0.4,{arco:0}],['carica','home',4.95,0.4,{arco:0}],['home','apre',7.35,0.2,{arco:0}],['apre','tasca',9.75,0.3,{arco:0}],['tasca','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.4,0.9,9.6),  V(0,-0.75,0), 4],
 [2.3,  V(-0.5,0.6,9.0),  V(0,-0.75,0), 1],
 [2.9,  V(1.3,0.6,9.4),   V(0,-0.7,0), -2],
 [4.9,  V(0.7,0.5,9.0),   V(0,-0.7,0), -1],
 [5.4,  V(-1.0,0.8,8.8),  V(0,-0.7,0), 2],
 [7.3,  V(-0.4,0.7,8.4),  V(0,-0.7,0), 1],
 [7.9,  V(0.9,0.5,8.6),   V(0,-0.7,0), -2],
 [9.6,  V(0.5,0.4,9.0),   V(0,-0.75,0), -1],
 [10.2, V(-1.3,1.0,10.0), V(0,-0.9,0), 2],
 [11.8, V(-0.5,0.8,10.4), V(0,-0.9,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const on=E.spring(clamp((t-0.0)/0.3)), off=E.exit(clamp((t-12.05)/0.25)); phone.position.copy(phPos(t)); phone.quaternion.copy(phQ(t)); show(phone,on*(1-off)); }
  { const on=E.spring(clamp((t-2.6)/SP)), off=E.exit(clamp((t-4.85)/0.25)); lUrl.position.copy(onPhone(t, V(0,1.35,0.15))); face(lUrl); show(lUrl,on*(1-off)); }
  { const on=E.spring(clamp((t-6.0)/SP)), off=E.exit(clamp((t-7.25)/0.25)); lAgg.position.copy(onPhone(t, V(0,-0.8,0.5))); face(lAgg); lAgg.rotateZ(0.03); show(lAgg,on*(1-off)); }
  { const x=clamp((t-7.85)/0.55); ring.position.copy(onPhone(t, slotLoc(SLOT).add(V(0,0,0.05)))); ring.quaternion.copy(phQ(t)); ring.scale.setScalar(0.6+1.6*x); ring.material.opacity=(1-x)*0.95; ring.visible=x>0&&x<1; }
  { const on=E.inout(clamp((t-9.95)/0.5)), off=E.exit(clamp((t-12.05)/0.25)); tasca.position.copy(PH).add(V(0,-1.25-1.6*(1-on),0.42)); tasca.rotation.set(0,0.08*Math.sin(t*0.5),0); show(tasca,(on>0.01?1:0)*(1-off)); }
  { const on=E.spring(clamp((t-11.0)/SP)), off=E.exit(clamp((t-12.0)/0.3)); lNuova.position.copy(phPos(t)).add(V(0.15,1.45,0.6)); face(lNuova); lNuova.rotateZ(-0.04); show(lNuova,on*(1-off)); }
  camAt(t); tilesAt(t, F, TR, 'pieno'); draw();
}
