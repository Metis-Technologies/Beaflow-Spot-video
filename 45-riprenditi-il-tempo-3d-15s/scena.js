// 45 · Riprenditi il tuo tempo (ossatura B): clessidra di tessere con la sabbia oro che sale → le prenotazioni arrivano da sole, anche la sera → campanella del promemoria con onde → moneta che si incastra nella prenotazione (pagata prenotando) → la porta del salone si chiude su un tramonto
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const Q0 = new THREE.Quaternion();
const NASC = () => ({ p:C.clone(), q:Q0.clone(), s:V(0.001,0.001,0.001), g:0, c:0 });

// scena 1 · clessidra: 8 anelli × 8 tessere; sabbia oro che sale dal basso verso l'alto
const HC = V(0, C.y-0.3, 0), RINGY = [-0.85,-0.6,-0.35,-0.1,0.1,0.35,0.6,0.85], RAD = y => 0.12+0.62*Math.pow(Math.abs(y)/0.85,0.9);
const goldM = new THREE.MeshStandardMaterial({color:0xC9B16C, emissive:0xC9B16C, emissiveIntensity:0.45, metalness:0.4, roughness:0.35});
const pilaGiu = new THREE.Mesh(new THREE.ConeGeometry(0.55,0.42,32), goldM), pilaSu = new THREE.Mesh(new THREE.ConeGeometry(0.55,0.42,32), goldM);
pilaSu.rotation.x = Math.PI; scene.add(pilaGiu, pilaSu);
const NS = 220, sGeo = new THREE.BufferGeometry(), sPos = new Float32Array(NS*3); sGeo.setAttribute('position', new THREE.BufferAttribute(sPos,3));
const sabbia = new THREE.Points(sGeo, new THREE.PointsMaterial({color:0xE2C873, size:0.035, transparent:true, toneMapped:false})); scene.add(sabbia);
const SR = Array.from({length:NS},(_,i)=>[Math.abs(Math.sin(i*12.9898)*43758.5453)%1, Math.abs(Math.sin(i*78.233)*12345.678)%1, Math.abs(Math.sin(i*39.425)*24680.135)%1]);
const riempi = t => clamp(0.15+t/2.6);                                     // quanto è piena la parte alta

// scena 2 · prenotazioni che arrivano da sole: 8 schede da 2×4 tessere, con l'ora
const ORE = D.ore || ['22:40','23:15','07:10'];
const cardP = k => V(-0.55+(k%2)*1.1, C.y-1.05+Math.floor(k/2)*0.42, 0);
const lOre = ORE.map(o=>label(o, 0.75, 0.28, '#111111', '#FFFFFF', 0.55));

// scena 3 · campanella del promemoria (come lo spot 29)
const BC = V(0, C.y-0.95, 0), PIV = V(0, 1.25, 0);
const swing = t => 0.32*Math.sin((t-5.3)*11)*Math.exp(-Math.max(0,t-5.3)*1.6)*(t>5.3?1:0) + 0.2*Math.sin((t-6.2)*11)*Math.exp(-Math.max(0,t-6.2)*1.8)*(t>6.2?1:0);
const bellG = new THREE.Group(); scene.add(bellG);
{ const prof=[[0,-0.02],[0.78,-0.02],[0.8,0.03],[0.66,0.12],[0.52,0.32],[0.44,0.62],[0.4,0.92],[0.33,1.12],[0.2,1.22],[0,1.25]].map(([x,y])=>new THREE.Vector2(x,y));
  const gm=new THREE.MeshStandardMaterial({color:0xC9B16C, metalness:0.75, roughness:0.28, emissive:0x775A18, emissiveIntensity:0.15, side:THREE.DoubleSide});
  const b=new THREE.Mesh(new THREE.LatheGeometry(prof,64), gm); b.castShadow=true; b.position.y=-PIV.y; bellG.add(b);
  const k=new THREE.Mesh(new THREE.SphereGeometry(0.14,24,16), gm); k.position.y=-PIV.y-0.12; bellG.add(k);
  const h=new THREE.Mesh(new THREE.TorusGeometry(0.1,0.03,10,32), gm); h.position.y=-PIV.y+1.3; bellG.add(h); }
const waves=[5.35,5.65,6.25].map(t0=>{ const m=new THREE.Mesh(new THREE.TorusGeometry(0.75,0.018,8,64), new THREE.MeshBasicMaterial({color:0xC9B16C, transparent:true, toneMapped:false})); m.rotation.x=Math.PI/2; scene.add(m); return {m,t0}; });
const lProm = label(D.promemoria || 'Promemoria · domani 10:00', 2.1, 0.36, '#111111');

// scena 4 · moneta che si incastra nella prenotazione
const CARD = V(0, C.y-0.55, 0), SLOTP = CARD.clone().add(V(0,0.1,0.12));
const COIN=[]; [[1,0],[7,0.11],[16,0.22]].forEach(([n,r])=>{ for(let j=0;j<n;j++){ const a=j/n*Math.PI*2; COIN.push(V(Math.cos(a)*r, Math.sin(a)*r, 0)); } });
const coinPos = t => { const u=E.inout(clamp((t-7.65)/0.85)); return V(0.95, C.y+0.75, 0.9).lerp(SLOTP.clone().add(V(0,0,0.15)), u).add(V(0, 0.35*Math.sin(Math.PI*u), 0)); };
const lPag = label(D.pagato || 'Pagato prenotando', 1.6, 0.34);

// scena 5 · porta a due ante di 4×8 tessere che si chiude su un tramonto
const PORTA = V(0, C.y-0.35, 0), chiude = t => E.inout(clamp((t-10.35)/0.9));
const tramonto = new THREE.Mesh(new THREE.CircleGeometry(0.55,48), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(tramonto);
LATE.push(()=>{ tramonto.material.map=canvasTex(512,512,(g,w,h)=>{ const gr=g.createRadialGradient(w/2,h/2,10,w/2,h/2,w/2); gr.addColorStop(0,'#FFE6A8'); gr.addColorStop(0.55,'#F2B866'); gr.addColorStop(1,'rgba(232,150,80,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); }); tramonto.material.needsUpdate=true; });

const F = {
  clessidra(t){ return R.map((r,i)=>{ const k=Math.floor(i/8), j=i%8, y=RINGY[k], rad=RAD(y), a=j/8*Math.PI*2+t*0.35+(k%2)*0.39;
      return { p:HC.clone().add(V(Math.cos(a)*rad, y, Math.sin(a)*rad)), q:qe(0,-a,0), s:V(0.14,0.08,0.05), g:0.1+0.4*Math.max(0,Math.sin(t*2-k*0.6)), c:(k===0||k===7)?1:0 }; }); },
  arrivano(t){ return R.map((r,i)=>{ const k=Math.floor(i/8), j=i%8; const w=E.spring(clamp((t-2.7-k*0.22)/0.45)); const from=V((k%2?1:-1)*2.0, C.y+1.6, -0.6);
      const p=cardP(k).add(V((j%4-1.5)*0.2, (Math.floor(j/4)-0.5)*0.16, 0)); return { p:from.lerp(p,w), q:qe(0,0,(1-w)*0.8), s:V(0.18,0.14,0.1), g:(k<3)?0.75:0.2, c:(j===0||j===4)?1:0 }; }); },
  campana(t){ return R.map((r,i)=>{ const top=i>=36, n=top?28:36, j=top?i-36:i, a=j/n*Math.PI*2+t*(top?-0.6:0.5);
      const rad=top?0.95:1.18, y=top?0.55:0.02; const ring=Math.max(0,Math.sin(Math.PI*clamp((t-5.3-(top?0.1:0))/0.5)))+Math.max(0,Math.sin(Math.PI*clamp((t-6.2)/0.5)));
      return { p:BC.clone().add(V(Math.cos(a)*rad, y+0.05*Math.sin(a*3+t*2), Math.sin(a)*rad)), q:qe(0,-a,0), s:V(0.14,0.09,0.09), g:0.2+0.75*Math.min(1,ring), c:(j%6===3)?1:0 }; }); },
  moneta(t){ const fill=E.inout(clamp((t-8.45)/0.6)), C0=coinPos(t), spin=qe(0, (1-E.enter(clamp((t-8.0)/0.6)))*t*7, 0);
    return R.map((r,i)=>{ if(i<40){ const x=i%8, y=Math.floor(i/8); const w=Math.max(0,Math.sin(Math.PI*clamp((t-8.5-Math.abs(x-3.5)*0.05)/0.45)));
        const slotT=(y===1&&(x===3||x===4)); return { p:CARD.clone().add(V((x-3.5)*0.24, (2-y)*0.2, w*0.1)), q:Q0.clone(), s:V(0.22,0.18,0.07), g:(slotT?0.2:0.03)+fill*0.35+w*0.4, c:slotT?1:0 }; }
      const k=i-40; return { p:COIN[k].clone().applyQuaternion(spin).add(C0), q:spin.clone(), s:V(0.1,0.1,0.07), g:0.95, c:0 }; }); },
  porta(t){ const u=chiude(t); return R.map((r,i)=>{ const left=i<32, j=left?i:i-32, x=j%4, y=Math.floor(j/4);
      const ang=(1-u)*1.15*(left?1:-1), hinge=V(left?-0.98:0.98, 0, 0), off=V((left?1:-1)*(x+0.5)*0.245, 0, 0).applyQuaternion(qe(0,ang,0));
      const lit=u>0.98?E.enter(clamp((t-11.25)/0.3)):0; const edge=(x===3)?lit:0;
      return { p:PORTA.clone().add(hinge).add(off).add(V(0,(y-3.5)*0.24,0)), q:qe(0,ang,0), s:V(0.23,0.22,0.08), g:0.06+0.85*edge, c:(y===4&&x===2)?1:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['clessidra','arrivano',2.35,0.45],['arrivano','campana',4.95,0.7],['campana','moneta',7.35,0.7],['moneta','porta',9.75,0.6],['porta','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.2,1.0,9.6),  V(0,-0.75,0), 3],
 [2.3,  V(-0.4,0.8,9.2),  V(0,-0.75,0), 0],
 [2.9,  V(1.2,0.8,10.0),  V(0,-0.8,0), -2],
 [4.9,  V(0.6,0.6,9.6),   V(0,-0.8,0), -1],
 [5.4,  V(-1.2,0.0,9.6),  V(0,-0.8,0), 3],
 [7.3,  V(-0.6,0.3,9.4),  V(0,-0.8,0), 1],
 [7.9,  V(1.2,1.2,10.2),  V(0,-0.75,0), -2],
 [9.6,  V(0.6,1.0,9.8),   V(0,-0.75,0), -1],
 [10.2, V(-1.0,0.7,10.4), V(0,-0.75,0), 2],
 [11.8, V(-0.3,0.6,10.8), V(0,-0.75,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  // sabbia e mucchietti della clessidra
  { const vis=1-E.exit(clamp((t-2.3)/0.3)), f=riempi(t);
    pilaGiu.position.copy(HC).add(V(0,-0.85+0.21*(1-f),0)); pilaGiu.scale.set(1-0.6*f,Math.max(0.05,1-f),1-0.6*f); pilaGiu.visible=vis>0.02; pilaGiu.scale.multiplyScalar(vis);
    pilaSu.position.copy(HC).add(V(0,0.85-0.21*f,0)); pilaSu.scale.set(0.4+0.6*f,Math.max(0.05,f),0.4+0.6*f); pilaSu.visible=vis>0.02; pilaSu.scale.multiplyScalar(vis);
    for(let i=0;i<NS;i++){ const [a,b,c]=SR[i]; const s=(t*0.55+a)%1; const y=-0.7+1.45*s; const w=0.02+0.5*Math.pow(Math.abs(y)/0.85,1.2)*b;
      const ang=c*6.28+t; sPos[i*3]=HC.x+Math.cos(ang)*w*(y>0?1-s:0.25); sPos[i*3+1]=HC.y+y; sPos[i*3+2]=HC.z+Math.sin(ang)*w*(y>0?1-s:0.25); }
    sGeo.attributes.position.needsUpdate=true; sabbia.material.opacity=vis; sabbia.visible=vis>0.02; }
  lOre.forEach((l,k)=>{ const on=E.spring(clamp((t-3.0-k*0.22)/SP)), off=E.exit(clamp((t-4.85)/0.25)); l.position.copy(cardP(k)).add(V(0,0.3,0.4)); face(l); show(l,on*(1-off)); });
  { const on=E.soft(clamp((t-5.0)/SO)), off=E.exit(clamp((t-7.2)/0.3)); bellG.position.copy(BC).add(PIV); bellG.rotation.set(0, t*0.3, swing(t)); show(bellG,on*(1-off)); }
  waves.forEach(({m,t0})=>{ const x=clamp((t-t0)/0.8); m.position.copy(BC).add(V(0,0.05,0)); m.scale.setScalar(0.6+x*1.6); m.material.opacity=(1-x)*0.9; m.visible=x>0&&x<1&&t<7.4; });
  { const on=E.spring(clamp((t-5.6)/SP)), off=E.exit(clamp((t-7.25)/0.25)); lProm.position.set(0, C.y-1.55, 0.7); face(lProm); lProm.rotateZ(0.02); show(lProm,on*(1-off)); }
  { const on=E.spring(clamp((t-8.55)/SP)), off=E.exit(clamp((t-9.7)/0.25)); lPag.position.copy(CARD).add(V(0,0.85,0.5)); face(lPag); lPag.rotateZ(-0.03); show(lPag,on*(1-off)); }
  { const on=E.soft(clamp((t-10.0)/0.4)), off=E.exit(clamp((t-12.05)/0.25)); const u=chiude(t); tramonto.position.copy(PORTA).add(V(0,-0.25,-0.7)); tramonto.scale.setScalar(Math.max(0.0001,on*(1-off)*(1.0-0.15*u))); tramonto.visible=on*(1-off)>0.01; }
  camAt(t); tilesAt(t, F, TR, 'clessidra'); draw();
}
