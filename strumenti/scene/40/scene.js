// scontrino lungo e orologio (30 min) → 1 minuto → totale → contanti e carte → porta che si chiude alle 19
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const lMin = label('30 min', 0.95, 0.34, '#FF5A4F');
const lOne = label('1 min', 0.8, 0.34);
const lCash = label('Contanti € 380', 1.45, 0.34, '#111111');
const lCard = label('Carte € 860', 1.3, 0.34);
const lOre = label('19:00', 0.85, 0.36);
const CL = V(0.75, C.y+0.15, 0), CR = 1.0;
// scontrino
const RC = V(-1.15, C.y+1.25, 0.5), RL = 3.0;
const rGeo = new THREE.PlaneGeometry(0.95,1); rGeo.translate(0,-0.5,0);
const receipt = new THREE.Mesh(rGeo, new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.8, side:THREE.DoubleSide})); receipt.castShadow=true; scene.add(receipt);
LATE.push(()=>{ const tx=canvasTex(380,1200,(g,w,h)=>{ g.fillStyle='#FFFFFF'; g.fillRect(0,0,w,h); g.textBaseline='middle';
    const it=['Servizio','Trattamento','Prodotto','Pacchetto','Servizio','Ritocco'];
    for(let y=40,k=0;y<h-20;y+=46,k++){ g.fillStyle='#5F5F5F'; g.font='600 24px Inter'; g.fillText(it[k%6],24,y); g.textAlign='right'; g.fillStyle='#111111'; g.fillText('€ '+(15+(k*7)%40)+',00',w-24,y); g.textAlign='left'; }
  }); tx.wrapT=THREE.RepeatWrapping; receipt.material.map=tx; receipt.material.needsUpdate=true; });
const recLen = t => t<2.5 ? 0.3+2.7*E.inout(clamp((t-0.2)/2.1)) : RL*(1-E.inout(clamp((t-2.5)/0.55)));
// scheda totale
const SC = V(0, C.y+0.4, 0.4);
const card = new THREE.Group(); scene.add(card);
const cb = new THREE.Mesh(new RoundedBoxGeometry(2.3,1.3,0.1,4,0.1), new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.45})); cb.castShadow=true; card.add(cb);
const cf = new THREE.Mesh(new THREE.PlaneGeometry(2.22,1.22), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); cf.position.z=0.052; card.add(cf);
LATE.push(()=>{ cf.material.map=canvasTex(888,488,(g,w,h)=>{ g.fillStyle='#FFFFFF'; g.fillRect(0,0,w,h); g.textBaseline='middle';
  g.fillStyle='#775A18'; g.font='700 36px Inter'; g.fillText('TOTALE DI OGGI',60,80);
  g.fillStyle='#111111'; g.font='600 170px Inter'; g.fillText('€ 1.240',52,232);
  g.fillStyle='#EFE7DC'; g.beginPath(); g.roundRect(60,360,768,70,16); g.fill(); g.fillStyle='#C9B16C'; g.beginPath(); g.roundRect(60,360,531,70,16); g.fill();
  g.fillStyle='#111111'; g.font='700 32px Inter'; g.fillText('32 incassi · già sommati',84,396); }); cf.material.needsUpdate=true; });
// porta
const DOOR = V(0, C.y-1.1, -0.1), DW=1.3, DH=2.2;
const hinge = new THREE.Group(); hinge.position.copy(DOOR).add(V(-DW/2+0.06,0,0)); scene.add(hinge);
const panel = new THREE.Mesh(new RoundedBoxGeometry(DW-0.14,DH-0.1,0.08,3,0.03), new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.4})); panel.position.set((DW-0.14)/2,(DH-0.1)/2,0); panel.castShadow=true; hinge.add(panel);
const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05,16,12), new THREE.MeshStandardMaterial({color:0xC9B16C, metalness:0.8, roughness:0.25})); knob.position.set(DW-0.3,(DH-0.1)/2,0.07); hinge.add(knob);
const doorOutline = u => { const pts=[[-DW/2,0],[-DW/2,DH],[DW/2,DH],[DW/2,0]]; const L=DH*2+DW; let d=u*L;
  for(let k=0;k<3;k++){ const a=pts[k], b=pts[k+1], l=Math.hypot(b[0]-a[0],b[1]-a[1]); if(d<=l){ const f=d/l; return [a[0]+(b[0]-a[0])*f, a[1]+(b[1]-a[1])*f]; } d-=l; } return pts[3]; };

const F = {
  orologio(t){ const fill=30*E.inout(clamp((t-0.2)/2.0)); return orologioAt(t, fill); },
  minuto(t){ return orologioAt(t, 1); },
  pedana(t){ return R.map((r,i)=>{ const x=i%8, z=Math.floor(i/8); const w=Math.max(0,Math.sin(Math.PI*clamp((t-5.1-(x+z)*0.04)/0.45)));
      return { p:V((x-3.5)*0.27, C.y-0.75+w*0.18, SC.z-0.6+(z-3.5)*0.22), q:new THREE.Quaternion(), s:V(0.24,0.1,0.19), g:0.25+w*0.8, c:((x+z)%3===0)?1:0 }; }); },
  divisi(t){ return R.map((r,i)=>{ const cash=i<24, k=cash?i:i-24, x=k%4, z=Math.floor(k/4)%2, y=Math.floor(k/8);
      const w=Math.max(0,Math.sin(Math.PI*clamp((t-7.8-y*0.08-(cash?0:0.25))/0.4)));
      return { p:V((cash?-0.95:0.95)+(x-1.5)*0.27, C.y-0.95+y*0.2+w*0.06, (z-0.5)*0.3), q:new THREE.Quaternion(), s:V(0.25,0.17,0.27), g:cash?0.05:0.75+w*0.3, c:cash?1:0 }; }); },
  porta(t){ return R.map((r,i)=>{ const [x,y]=doorOutline(i/(N-1)); const w=Math.max(0,Math.sin(Math.PI*clamp((t-10.2-i*0.01)/0.4)));
      return { p:DOOR.clone().add(V(x,y,0)), q:new THREE.Quaternion(), s:V(0.15,0.15,0.2).multiplyScalar(1+0.3*w), g:0.55+w*0.5, c:(i%4===1)?1:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
function orologioAt(t, fill){ const hm=Math.PI/2 - fill/60*Math.PI*2;
  return R.map((r,i)=>{ if(i<60){ const a=Math.PI/2 - i/60*Math.PI*2, big=i%5===0;
      return { p:V(CL.x+Math.cos(a)*CR, CL.y+Math.sin(a)*CR, CL.z), q:qe(0,0,a), s:big?V(0.2,0.07,0.12):V(0.11,0.045,0.08), g:i<fill?0.95:0.02, c:(big&&i>=fill)?1:0 }; }
    if(i===60) return { p:CL.clone(), q:new THREE.Quaternion(), s:V(0.12,0.12,0.12), g:0.3, c:1 };
    const k=i-60; return { p:V(CL.x+Math.cos(hm)*0.24*k, CL.y+Math.sin(hm)*0.24*k, CL.z+0.06), q:qe(0,0,hm), s:V(0.22,0.06,0.06), g:0.2, c:1 }; }); }
const TR = [['orologio','minuto',2.35,0.5],['minuto','pedana',4.95,0.6],['pedana','divisi',7.4,0.7],['divisi','porta',9.75,0.8],['porta','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.2,0.4,10.6), V(0,-0.6,0), 3],
 [2.3,  V(-0.4,0.3,10.2), V(0,-0.6,0), 0],
 [2.9,  V(1.2,0.6,10.4),  V(0.2,-0.7,0), -2],
 [4.9,  V(0.6,0.5,10.0),  V(0.2,-0.7,0), -1],
 [5.4,  V(-1.4,1.4,9.8),  V(0,-0.8,0), 3],
 [7.3,  V(-0.8,1.2,9.6),  V(0,-0.8,0), 1],
 [7.9,  V(1.4,1.6,10.2),  V(0,-1.1,0), -2],
 [9.6,  V(0.8,1.4,9.8),   V(0,-1.1,0), -1],
 [10.2, V(-1.6,0.6,10.4), V(0,-0.4,0), 2],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const L=recLen(t); const on=E.soft(clamp((t-0.1)/SO)); receipt.visible=L>0.01 && t<3.2; receipt.position.copy(RC); receipt.scale.set(on,Math.max(0.001,L),1);
    receipt.rotation.set(0.15*Math.sin(t*1.3)*(L/RL), 0.25+0.08*Math.sin(t*0.9), 0.04*Math.sin(t*1.7));
    if(receipt.material.map){ receipt.material.map.repeat.y=L/RL; receipt.material.map.offset.y=1-L/RL; } }
  { const on=E.spring(clamp((t-1.0)/SP)), off=E.exit(clamp((t-2.35)/0.2)); lMin.position.copy(CL).add(V(0,-0.05,0.4)); face(lMin); show(lMin,on*(1-off)); }
  { const on=E.spring(clamp((t-2.75)/SP)), off=E.exit(clamp((t-4.85)/0.25)); lOne.position.copy(CL).add(V(0,-0.05,0.4)); face(lOne); show(lOne,on*(1-off)); }
  { const on=E.soft(clamp((t-5.05)/SO)), off=E.exit(clamp((t-7.35)/0.3)); const spin=1-E.enter(clamp((t-5.05)/0.6));
    card.position.copy(SC).add(V(0,0.05*Math.sin(t*1.2),0)); card.rotation.set(0.06*Math.sin(t*0.8), -spin*Math.PI*1.5+0.1*Math.sin(t*0.6), 0.03*Math.sin(t*0.7)); show(card,on*(1-off)); }
  { const on=E.spring(clamp((t-8.0)/SP)), off=E.exit(clamp((t-9.75)/0.25)); lCash.position.set(-0.95, C.y+0.05, 0.5); face(lCash); lCash.rotateZ(0.04); show(lCash,on*(1-off)); }
  { const on=E.spring(clamp((t-8.25)/SP)), off=E.exit(clamp((t-9.75)/0.25)); lCard.position.set(0.95, C.y+0.45, 0.5); face(lCard); lCard.rotateZ(-0.04); show(lCard,on*(1-off)); }
  { const on=E.soft(clamp((t-10.0)/SO)), off=E.exit(clamp((t-12.0)/0.35)); const close=E.inout(clamp((t-11.0)/0.5));
    hinge.rotation.y = -1.25*(1-close); show(hinge,on*(1-off));
    const lo=E.spring(clamp((t-11.4)/SP)), lf=E.exit(clamp((t-12.0)/0.3)); lOre.position.copy(DOOR).add(V(0.55,DH+0.3,0.4)); face(lOre); lOre.rotateZ(-0.05); show(lOre,lo*(1-lf)); }
  camAt(t); tilesAt(t, F, TR, 'orologio'); draw();
}
