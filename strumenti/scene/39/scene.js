// monete sparse → telefono (online) e POS (in sede) → cassetto che si chiude
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const qm = label('?', 0.62, 0.62, '#FF5A4F', '#FFFFFF', 0.75);
const lOn = label('+ € 45 online', 1.4, 0.34);
const lSede = label('+ € 30 in sede', 1.4, 0.34, '#111111');
const lOk = label('Tutto registrato', 1.6, 0.36);
const dark = new THREE.MeshStandardMaterial({color:0x1c1c1c, roughness:0.4, metalness:0.2});
const PH = V(-1.3, C.y+0.45, 0.3), PO = V(1.3, C.y+0.35, 0.3), DR = V(0, C.y-0.95, 0.2);
function device(w,h,d,sw,sh,draw){ const gr=new THREE.Group(); scene.add(gr);
  const b=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,4,0.06), dark); b.castShadow=true; gr.add(b);
  const sc=new THREE.Mesh(new THREE.PlaneGeometry(sw,sh), new THREE.MeshBasicMaterial({toneMapped:false})); sc.position.z=d/2+0.003; gr.add(sc);
  LATE.push(()=>{ sc.material.map=canvasTex(Math.round(sw*500),Math.round(sh*500),draw); sc.material.needsUpdate=true; }); return [gr,sc]; }
const [phone] = device(0.9,1.7,0.1,0.8,1.55,(g,w,h)=>{ g.fillStyle='#FBF8F4'; g.fillRect(0,0,w,h); g.textAlign='center'; g.textBaseline='middle';
  g.fillStyle='#111111'; g.font='800 40px Inter'; g.fillText('Prenotazione',w/2,150); g.fillText('confermata',w/2,198);
  g.fillStyle='#C9B16C'; g.beginPath(); g.arc(w/2,350,70,0,Math.PI*2); g.fill(); g.strokeStyle='#FFFFFF'; g.lineWidth=14; g.lineCap='round'; g.beginPath(); g.moveTo(w/2-30,352); g.lineTo(w/2-8,374); g.lineTo(w/2+32,330); g.stroke();
  g.fillStyle='#5F5F5F'; g.font='600 34px Inter'; g.fillText('Pagato online',w/2,490); g.fillStyle='#111111'; g.font='600 64px Inter'; g.fillText('€ 45,00',w/2,560);
  g.fillStyle='#111111'; g.beginPath(); g.roundRect(40,650,w-80,80,14); g.fill(); g.fillStyle='#FFFFFF'; g.font='700 32px Inter'; g.fillText('Ricevuta',w/2,692); });
const [pos] = device(0.85,1.25,0.22,0.65,0.5,(g,w,h)=>{ g.fillStyle='#FBF8F4'; g.fillRect(0,0,w,h); g.textAlign='center'; g.textBaseline='middle';
  g.fillStyle='#111111'; g.font='600 72px Inter'; g.fillText('€ 30,00',w/2,100); g.fillStyle='#775A18'; g.font='700 34px Inter'; g.fillText('PAGATO ✓',w/2,185); });
{ const keys=new THREE.Group(); pos.add(keys); const km=new THREE.MeshStandardMaterial({color:0x3a3a3a, roughness:0.5});
  for(let r=0;r<3;r++) for(let c=0;c<3;c++){ const k=new THREE.Mesh(new RoundedBoxGeometry(0.15,0.09,0.04,2,0.02),km); k.position.set((c-1)*0.2,-0.2-r*0.13,0.12); keys.add(k); }
  pos.children[1].position.y=0.27; }
// cassetto: involucro scuro + vassoio con due scomparti
const drawer = new THREE.Group(); scene.add(drawer); drawer.position.copy(DR);
const housing = new THREE.Mesh(new RoundedBoxGeometry(2.3,0.62,1.5,3,0.06), dark); housing.position.set(0,0.0,-0.25); housing.castShadow=true; drawer.add(housing);
const tray = new THREE.Group(); drawer.add(tray);
const trayM = new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.5});
const box=(w,h,d,x,y,z,m=trayM)=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); b.position.set(x,y,z); b.castShadow=true; b.receiveShadow=true; tray.add(b); return b; };
box(2.1,0.05,1.3, 0,-0.27,0); box(0.05,0.42,1.3,-1.05,-0.06,0); box(0.05,0.42,1.3,1.05,-0.06,0); box(2.1,0.42,0.05,0,-0.06,-0.65); box(0.04,0.38,1.3,0,-0.07,0);
box(2.2,0.5,0.08, 0,-0.04,0.69, new THREE.MeshStandardMaterial({color:0xC9B16C, roughness:0.35, metalness:0.5}));
const trayZ = t => 1.05*(1-E.inout(clamp((t-11.1)/0.45)));   // aperto → chiuso
const slot = (i,t) => { const left=i<32, k=i%32, col=k%4, row=Math.floor(k/4)%2, lay=Math.floor(k/8);
  return DR.clone().add(V((left?-0.52:0.52)+(col-1.5)*0.23, -0.2+lay*0.075, trayZ(t)+(row-0.5)*0.45)); };

const coin = V(0.26,0.26,0.07);
const F = {
  caos(t){ return R.map((r,i)=>({ p:V((r[0]-0.5)*4.6+Math.sin(t*0.5+i)*0.15, C.y-1.0+r[1]*2.4+Math.sin(t*1.1+i)*0.08, -1.8+r[2]*2.6), q:qe(r[3]*6+t*1.2,r[4]*6+t*0.8,0), s:coin.clone(), g:(i%6===0)?0.6:0.05, c:(i%3===1)?1:0 })); },
  registro(t){ return R.map((r,i)=>{ const col=i%8, row=Math.floor(i/8); const w=Math.max(0,Math.sin(Math.PI*clamp((t-2.8-row*0.1)/0.4)));
      return { p:V((col-3.5)*0.21, C.y+0.55-row*0.21, -1.2), q:new THREE.Quaternion(), s:V(0.17,0.17,0.06).multiplyScalar(1+0.2*w), g:(row%2)?0.15+w*0.6:0.6+w*0.4, c:(row%2&&col%3===0)?1:0 }; }); },
  online(t){ return R.map((r,i)=>{ const u=(t*0.75 + i/N)%1; const B=DR.clone().add(V(-0.52+(r[0]-0.5)*0.6, 0.1, 0.9+(r[1]-0.5)*0.4));
      const p=PH.clone().add(V(0.2+(r[2]-0.5)*0.3,-0.3,0.2)).lerp(B,u).add(V((r[3]-0.5)*0.5*Math.sin(Math.PI*u),Math.sin(Math.PI*u)*0.9,0.3*Math.sin(Math.PI*u)));
      return { p, q:qe(t*3+i,0.4,0), s:coin.clone().multiplyScalar(0.65), g:0.85, c:0 }; }); },
  sede(t){ return R.map((r,i)=>{ const u=(t*0.75 + i/N)%1; const B=DR.clone().add(V(0.52+(r[0]-0.5)*0.6, 0.1, 0.9+(r[1]-0.5)*0.4));
      const p=PO.clone().add(V(-0.1+(r[2]-0.5)*0.3,0.2,0.3)).lerp(B,u).add(V((r[3]-0.5)*0.5*Math.sin(Math.PI*u),Math.sin(Math.PI*u)*0.9,0.3*Math.sin(Math.PI*u)));
      return { p, q:qe(t*3+i,-0.4,0), s:coin.clone().multiplyScalar(0.65), g:0.1, c:1 }; }); },
  cassetto(t){ return R.map((r,i)=>({ p:slot(i,t), q:qe(Math.PI/2,0,0), s:V(0.2,0.2,0.06), g:i<32?0.85:0.05, c:i<32?0:1 })); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['caos','registro',2.3,0.8],['registro','online',4.95,0.6],['online','sede',7.4,0.6],['sede','cassetto',9.75,0.8],['cassetto','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.6,1.0,10.4), V(0,-0.6,-0.4), 3],
 [2.3,  V(-0.6,0.8,9.8),  V(0,-0.6,-0.4), 0],
 [2.9,  V(1.2,1.3,11.4),  V(0,-0.35,0), -2],
 [4.9,  V(0.4,1.2,11.0),  V(0,-0.4,0), -1],
 [5.4,  V(-1.4,1.6,11.0), V(-0.3,-1.1,0), 3],
 [7.3,  V(-0.9,1.4,10.8), V(-0.3,-1.1,0), 1],
 [7.9,  V(1.4,1.6,11.0),  V(0.3,-1.1,0), -3],
 [9.6,  V(0.9,1.4,10.8),  V(0.3,-1.1,0), -1],
 [10.2, V(-0.6,2.4,9.6),  V(0,-1.2,0), 1],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const on=E.spring(clamp((t-0.5)/SP)), off=E.exit(clamp((t-2.2)/0.25));
    qm.position.set(0.9, C.y+1.2+0.06*Math.sin(t*2), 0.8); face(qm); qm.rotateZ(0.1*Math.sin(t*1.5)); show(qm,on*(1-off)); }
  const devOff = E.exit(clamp((t-10.0)/0.35));
  { const on=E.soft(clamp((t-2.45)/SO)); const hi=E.inout(clamp((t-5.0)/0.3))*(1-E.inout(clamp((t-7.45)/0.3)));
    phone.position.copy(PH).add(V(0,0.05*Math.sin(t*1.1),0.25*hi)); phone.rotation.set(0.04*Math.sin(t*0.7), 0.35-0.25*hi+(1-on)*1.2, 0.04); show(phone,on*(1-devOff),1+0.08*hi); }
  { const on=E.soft(clamp((t-2.6)/SO)); const hi=E.inout(clamp((t-7.5)/0.3))*(1-E.inout(clamp((t-9.9)/0.3)));
    pos.position.copy(PO).add(V(0,0.05*Math.sin(t*1.0+1),0.25*hi)); pos.rotation.set(-0.12+0.04*Math.sin(t*0.6), -0.35+0.25*hi-(1-on)*1.2, -0.04); show(pos,on*(1-devOff),1+0.08*hi); }
  { const on=E.soft(clamp((t-4.7)/SO)), off=E.exit(clamp((t-12.0)/0.35));
    drawer.position.copy(DR); tray.position.z=trayZ(t); show(drawer,on*(1-off)); }
  { const on=E.spring(clamp((t-5.6)/SP)), off=E.exit(clamp((t-7.3)/0.25)); lOn.position.copy(PH).add(V(1.05,0.55,0.6)); face(lOn); lOn.rotateZ(0.04); show(lOn,on*(1-off)); }
  { const on=E.spring(clamp((t-8.1)/SP)), off=E.exit(clamp((t-9.75)/0.25)); lSede.position.copy(PO).add(V(-1.0,0.7,0.6)); face(lSede); lSede.rotateZ(-0.04); show(lSede,on*(1-off)); }
  { const on=E.spring(clamp((t-11.45)/SP)), off=E.exit(clamp((t-12.0)/0.3)); lOk.position.copy(DR).add(V(0,0.85,0.9)); face(lOk); show(lOk,on*(1-off)); }
  camAt(t); tilesAt(t, F, TR, 'caos'); draw();
}
