// 29 · Basta appuntamenti saltati (ossatura A): sedia vuota che sfuma in rosso → la luce vira all'oro → campanella del promemoria con onde → gettone-caparra nella prenotazione → regole chiare e sedia piena d'oro
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }

const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const PROM = D.promemoria || 'Promemoria · domani 10:00', CAP = D.caparra || 'Caparra 10 €';
const REG = D.regole || ['Disdetta gratis fino a 24 ore prima'];
// sedia di tessere: seduta 4×4, schienale 4×5, gambe 4×3, pedana 4×4
const SEAT = C.y-0.55, CH = V(0, SEAT, 0);
function sediaPts(){ const out=[];
  for(let j=0;j<4;j++) for(let i=0;i<4;i++) out.push({p:V((i-1.5)*0.2, 0, (j-1.5)*0.2), s:V(0.19,0.08,0.19), h:0.0});
  for(let r=0;r<5;r++) for(let i=0;i<4;i++) out.push({p:V((i-1.5)*0.2, 0.16+r*0.17, -0.34), s:V(0.19,0.16,0.07), h:0.16+r*0.17});
  for(const [x,z] of [[-0.3,-0.3],[0.3,-0.3],[-0.3,0.3],[0.3,0.3]]) for(let k=0;k<3;k++) out.push({p:V(x, -0.15-k*0.2, z), s:V(0.07,0.19,0.07), h:-0.15-k*0.2});
  for(let j=0;j<4;j++) for(let i=0;i<4;i++) out.push({p:V((i-1.5)*0.26, -0.78, (j-1.5)*0.26), s:V(0.24,0.03,0.24), h:-0.78, pad:true});
  return out; }
const SP_ = sediaPts();
function sedia(t, glow, dy=0){ const yaw=0.55+0.18*Math.sin(t*0.45), q=qe(0,yaw,0);
  return SP_.map((d,i)=>({ p:d.p.clone().applyQuaternion(q).add(CH).add(V(0,dy,0)), q:q.clone(), s:d.s, g:d.pad?0.02:glow(d,i), c:0 })); }
// campanella: anelli che si stringono verso l'alto, oscilla attorno al gancio
const BR=[[14,0.78,0],[12,0.62,0.2],[10,0.52,0.42],[9,0.47,0.64],[8,0.43,0.86],[6,0.34,1.06],[4,0.2,1.2]];
const BELL=[]; BR.forEach(([n,r,h],k)=>{ for(let j=0;j<n;j++){ const a=j/n*Math.PI*2+k*0.3; BELL.push({p:V(Math.cos(a)*r, h, Math.sin(a)*r), a, k}); } }); BELL.push({p:V(0,-0.16,0), a:0, k:-1});
const BC = V(0, C.y-1.0, 0), PIV = V(0, 1.25, 0);
const swing = t => 0.32*Math.sin((t-5.3)*11)*Math.exp(-Math.max(0,t-5.3)*1.6)*(t>5.3?1:0) + 0.2*Math.sin((t-6.2)*11)*Math.exp(-Math.max(0,t-6.2)*1.8)*(t>6.2?1:0);
// campanella vera e propria (tornio), oscilla attorno al gancio
const bellG = new THREE.Group(); scene.add(bellG);
{ const prof=[[0,-0.02],[0.78,-0.02],[0.8,0.03],[0.66,0.12],[0.52,0.32],[0.44,0.62],[0.4,0.92],[0.33,1.12],[0.2,1.22],[0,1.25]].map(([x,y])=>new THREE.Vector2(x,y));
  const gm=new THREE.MeshStandardMaterial({color:0xC9B16C, metalness:0.75, roughness:0.28, emissive:0x775A18, emissiveIntensity:0.15, side:THREE.DoubleSide});
  const b=new THREE.Mesh(new THREE.LatheGeometry(prof,64), gm); b.castShadow=true; b.position.y=-PIV.y; bellG.add(b);
  const k=new THREE.Mesh(new THREE.SphereGeometry(0.14,24,16), gm); k.position.y=-PIV.y-0.12; bellG.add(k);
  const h=new THREE.Mesh(new THREE.TorusGeometry(0.1,0.03,10,32), gm); h.position.y=-PIV.y+1.3; bellG.add(h); }
const waves=[5.35,5.65,6.25].map(t0=>{ const m=new THREE.Mesh(new THREE.TorusGeometry(0.75,0.018,8,64), new THREE.MeshBasicMaterial({color:0xC9B16C, transparent:true, toneMapped:false})); m.rotation.x=Math.PI/2; scene.add(m); return {m,t0}; });
const lProm = label(PROM, 2.1, 0.36, '#111111');
// prenotazione 8×5 e gettone-caparra di 24 tessere
const CARD = V(0, C.y-0.55, 0), SLOTP = CARD.clone().add(V(0,0.1,0.12));
const COIN=[]; [[1,0],[7,0.11],[16,0.22]].forEach(([n,r])=>{ for(let j=0;j<n;j++){ const a=j/n*Math.PI*2; COIN.push(V(Math.cos(a)*r, Math.sin(a)*r, 0)); } });
const coinPos = t => { const u=E.inout(clamp((t-7.65)/0.85)); return V(0.95, C.y+0.75, 0.9).lerp(SLOTP.clone().add(V(0,0,0.15)), u).add(V(0, 0.35*Math.sin(Math.PI*u), 0)); };
const lCap = label(CAP, 1.25, 0.34);
const lPren = label('Prenotazione', 1.4, 0.32, '#111111');
// scheda delle regole di cancellazione
const RG = V(0.0, C.y+0.48, 0.35);
const rules = new THREE.Group(); scene.add(rules);
{ const b=new THREE.Mesh(new RoundedBoxGeometry(2.1,0.8,0.06,4,0.05), new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.45})); b.castShadow=true; rules.add(b);
  const f=new THREE.Mesh(new THREE.PlaneGeometry(2.04,0.74), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); f.position.z=0.032; rules.add(f);
  LATE.push(()=>{ f.material.map=canvasTex(816,296,(g,w,h)=>{ g.fillStyle='#FFFFFF'; g.fillRect(0,0,w,h); g.textBaseline='middle';
    g.fillStyle='#775A18'; g.font='700 34px Inter'; g.fillText('REGOLE DI CANCELLAZIONE',44,58);
    REG.forEach((r,k)=>{ const y=(REG.length===1?175:140)+k*84; g.strokeStyle='#C9B16C'; g.lineWidth=9; g.lineCap='round'; g.beginPath(); g.moveTo(48,y); g.lineTo(64,y+16); g.lineTo(92,y-14); g.stroke();
      g.fillStyle='#111111'; g.font='600 36px Inter'; g.fillText(r,112,y+2); }); }); f.material.needsUpdate=true; }); }

const F = {
  // sedia vuota che sfuma in rosso dall'alto
  sedia(t){ return sedia(t,(d)=>0.05+0.85*E.inout(clamp((t-0.25-(1.0-d.h)*0.5)/1.0))); },
  // la luce vira all'oro: la sedia resta, accesa poco
  sediaOro(t){ return sedia(t,(d,i)=>0.4+0.4*Math.max(0,Math.sin(t*2.2+i*0.3))); },
  // tessere in due anelli attorno alla campanella, si accendono a ogni rintocco
  campana(t){ return R.map((r,i)=>{ const top=i>=36, n=top?28:36, j=top?i-36:i, a=j/n*Math.PI*2+t*(top?-0.6:0.5);
      const rad=top?0.95:1.18, y=top?0.55:0.02; const ring=Math.max(0,Math.sin(Math.PI*clamp((t-5.3-(top?0.1:0))/0.5)))+Math.max(0,Math.sin(Math.PI*clamp((t-6.2)/0.5)));
      return { p:BC.clone().add(V(Math.cos(a)*rad, y+0.05*Math.sin(a*3+t*2), Math.sin(a)*rad)), q:qe(0,-a,0), s:V(0.14,0.09,0.09), g:0.2+0.75*Math.min(1,ring), c:(j%6===3)?1:0 }; }); },
  gettone(t){ const fill=E.inout(clamp((t-8.45)/0.6)), C0=coinPos(t), spin=qe(0, (1-E.enter(clamp((t-8.0)/0.6)))*t*7, 0);
    return R.map((r,i)=>{ if(i<40){ const x=i%8, y=Math.floor(i/8); const w=Math.max(0,Math.sin(Math.PI*clamp((t-8.5-Math.abs(x-3.5)*0.05)/0.45)));
        const slotT=(y===1&&(x===3||x===4)); return { p:CARD.clone().add(V((x-3.5)*0.24, (2-y)*0.2, w*0.1)), q:new THREE.Quaternion(), s:V(0.22,0.18,0.07), g:(slotT?0.2:0.03)+fill*0.35+w*0.4, c:slotT?1:0 }; }
      const k=i-40; return { p:COIN[k].clone().applyQuaternion(spin).add(C0), q:spin.clone(), s:V(0.1,0.1,0.07), g:0.95, c:0 }; }); },
  // sedia piena d'oro dal basso verso l'alto
  piena(t){ return sedia(t,(d)=>0.08+0.87*E.inout(clamp((t-10.3-(d.h+0.8)*0.45)/0.5)),-0.36); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['sedia','sediaOro',2.35,0.35],['sediaOro','campana',4.95,0.7],['campana','gettone',7.35,0.7],['gettone','piena',9.75,0.8],['piena','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.4,1.6,10.2), V(0,-0.9,0), 3],
 [2.3,  V(-0.4,1.2,9.6),  V(0,-0.9,0), 0],
 [2.9,  V(1.3,0.9,10.0),  V(0,-0.85,0), -2],
 [4.9,  V(0.6,0.8,9.6),   V(0,-0.85,0), -1],
 [5.4,  V(-1.2,0.0,9.6),  V(0,-0.8,0), 3],
 [7.3,  V(-0.6,0.3,9.4),  V(0,-0.8,0), 1],
 [7.9,  V(1.2,1.2,10.2),  V(0,-0.75,0), -2],
 [9.6,  V(0.6,1.0,9.8),   V(0,-0.75,0), -1],
 [10.2, V(-1.5,1.4,10.4), V(0,-0.7,0), 2],
 [11.8, V(-0.6,1.1,10.0), V(0,-0.7,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const on=E.soft(clamp((t-5.0)/SO)), off=E.exit(clamp((t-7.2)/0.3)); bellG.position.copy(BC).add(PIV); bellG.rotation.set(0, t*0.3, swing(t)); show(bellG,on*(1-off)); }
  waves.forEach(({m,t0})=>{ const x=clamp((t-t0)/0.8); m.position.copy(BC).add(V(0,0.05,0)); m.scale.setScalar(0.6+x*1.6); m.material.opacity=(1-x)*0.9; m.visible=x>0&&x<1&&t<7.4; });
  { const on=E.spring(clamp((t-5.6)/SP)), off=E.exit(clamp((t-7.25)/0.25)); lProm.position.set(0, C.y+0.82, 0.6); face(lProm); lProm.rotateZ(0.02); show(lProm,on*(1-off)); }
  { const on=E.spring(clamp((t-7.75)/SP)), off=E.exit(clamp((t-8.45)/0.2)); lCap.position.copy(coinPos(t)).add(V(0,0.45,0.2)); face(lCap); show(lCap,on*(1-off)); }
  { const on=E.spring(clamp((t-7.6)/SP)), off=E.exit(clamp((t-9.65)/0.25)); lPren.position.copy(CARD).add(V(-0.35,-0.62,0.5)); face(lPren); lPren.rotateZ(0.03); show(lPren,on*(1-off)); }
  { const on=E.soft(clamp((t-10.4)/SO)), off=E.exit(clamp((t-12.0)/0.3)); rules.position.copy(RG).add(V(0,0.03*Math.sin(t*1.2),0)); rules.rotation.set(-0.06, 0.08*Math.sin(t*0.7), 0.02); show(rules,on*(1-off)); }
  camAt(t); tilesAt(t, F, TR, 'sedia'); draw();
}
