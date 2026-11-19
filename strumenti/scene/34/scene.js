// carta fedeltà con timbri
const CARD = V(0, C.y+0.35, 0.3);
const card = new THREE.Group(); scene.add(card);
const cardBody = new THREE.Mesh(new RoundedBoxGeometry(2.4,1.5,0.1,4,0.1), new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.45}));
cardBody.castShadow=true; card.add(cardBody);
const cardFace = new THREE.Mesh(new THREE.PlaneGeometry(2.32,1.42), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); cardFace.position.z=0.052; card.add(cardFace);
const TEX=[];
function cardTex(n){ return canvasTex(920,560,(g,w,h)=>{ g.fillStyle='#FFFFFF'; g.fillRect(0,0,w,h); g.textBaseline='middle';
  g.fillStyle='#111111'; g.font='800 60px Inter'; g.fillText('Carta fedeltà',60,84);
  g.fillStyle='#5F5F5F'; g.font='600 38px Inter'; g.fillText(`Giulia R. · ${n*10} punti`,60,146);
  for(let k=0;k<10;k++){ const x=130+(k%5)*165, y=262+Math.floor(k/5)*124;
    g.beginPath(); g.arc(x,y,50,0,Math.PI*2); g.fillStyle = k<n ? (k===9?'#775A18':'#C9B16C') : '#EFE7DC'; g.fill();
    if(k<n){ g.strokeStyle='#FFFFFF'; g.lineWidth=10; g.lineCap='round'; g.lineJoin='round'; g.beginPath(); g.moveTo(x-20,y+2); g.lineTo(x-5,y+17); g.lineTo(x+22,y-14); g.stroke(); }
    else if(k===9){ g.fillStyle='#B5B5B5'; g.font='800 40px Inter'; g.textAlign='center'; g.fillText('★',x,y+2); g.textAlign='left'; } }
  if(n>=10){ g.fillStyle='#775A18'; g.beginPath(); g.roundRect(60,462,800,70,16); g.fill(); g.fillStyle='#FFFFFF'; g.font='700 36px Inter'; g.textAlign='center'; g.fillText('PREMIO SBLOCCATO',w/2,498); }
  else { g.fillStyle='#5F5F5F'; g.font='600 36px Inter'; g.textAlign='center'; g.fillText('Al decimo timbro, un premio',w/2,498); }
}); }
const stamps = t => t<5.2 ? 2 : t<7.6 ? Math.min(9, 3+Math.floor((t-5.2)/0.3)) : 10;
// etichette
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF'){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill();
    g.fillStyle=fg; g.font=`700 ${Math.round(h*0.4)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const lPunti = label('+10 punti', 1.05, 0.34);
const lPremio = label('Servizio in omaggio', 1.7, 0.36);
const lBen = label('Bentornata, Giulia!', 1.7, 0.36, '#FFFFFF', '#111111');
LATE.push(()=>{ for(let n=0;n<=10;n++) TEX[n]=cardTex(n); cardFace.material.map=TEX[2]; cardFace.material.needsUpdate=true; });

const GIFT = V(0.8, C.y-0.25, 0.2);
const F = {
  via(t){ return R.map((r,i)=>{ const ph=(r[0]+t*0.22)%1;
      const p=V((r[1]-0.5)*2.4, C.y+0.2+(r[2]-0.5)*1.4, 0.6).lerp(V(2.6+r[4]*1.2, C.y+0.6+r[3]*1.6, -6), E.inout(ph));
      return { p, q:qe(r[3]*6+t*0.7,r[4]*6,r[5]*6), s:V(0.17,0.17,0.17).multiplyScalar(1-ph*0.6), g:(i%5===0)?0.5:0.05, c:(i%3===1)?1:0 }; }); },
  anello(t){ return R.map((r,i)=>{ const a=i/N*Math.PI*2 + t*0.6;
      return { p:V(Math.cos(a)*2.3, CARD.y-1.05+Math.sin(a*3+t*2)*0.06, CARD.z-0.5+Math.sin(a)*1.0), q:qe(0, t*2.2+i, 0), s:V(0.26,0.26,0.07), g:(i%2)?0.8:0.25, c:0 }; }); },
  pioggia(t){ return R.map((r,i)=>{ const ph=(t*0.85 + r[2])%1; const fall=clamp(ph/0.7);
      const y = CARD.y+3.0 - E.exit(fall)*(CARD.y+3.0-GY-0.05);
      const sh = ph>0.85 ? 1-(ph-0.85)/0.15 : 1;
      return { p:V((r[0]-0.5)*4.4, y, CARD.z-0.7-r[1]*2.2), q:qe(fall<1? t*4+i : Math.PI/2, r[3]*3, 0), s:V(0.24,0.24,0.06).multiplyScalar(Math.max(0.05,sh)), g:fall<1?0.7:0.2, c:0 }; }); },
  regalo(t){ const lid=E.spring(clamp((t-9.2)/SP));
    return R.map((r,i)=>{ const ix=i%4, iy=Math.floor(i/4)%4, iz=Math.floor(i/16); const rib=(ix===1||ix===2||iz===1||iz===2);
      const p=V(GIFT.x+(ix-1.5)*0.27, GIFT.y+(iy-1.5)*0.27, GIFT.z+(iz-1.5)*0.27);
      if(iy===3){ p.y+=lid*0.42; p.x+=lid*0.12; }
      return { p, q:iy===3?qe(0,0,-0.25*lid):new THREE.Quaternion(), s:V(0.25,0.25,0.25), g:rib?0.95:0.05, c:rib?0:1 }; }); },
  ritorno(t){ const rot=t*0.9; return R.map((r,i)=>{
      if(i<56){ const a=rot + i/56*Math.PI*1.65; return { p:V(Math.cos(a)*2.05, CARD.y+Math.sin(a)*1.45, CARD.z-0.35), q:qe(0,0,a), s:V(0.15,0.15,0.15), g:0.35+0.5*(i/56), c:(i%4===1)?1:0 }; }
      const ae=rot+Math.PI*1.65, e=V(Math.cos(ae)*2.05, CARD.y+Math.sin(ae)*1.45, CARD.z-0.35);
      const T=V(-Math.sin(ae)*2.05, Math.cos(ae)*1.45, 0).normalize(), Nn=V(T.y,-T.x,0); const k=(i-56)%4+1, side=(i-56)<4?1:-1;
      const p=e.clone().add(T.clone().multiplyScalar(0.36-k*0.11)).add(Nn.clone().multiplyScalar(side*k*0.11));
      return { p, q:qe(0,0,ae), s:V(0.15,0.15,0.15), g:1.0, c:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['via','anello',2.3,0.8],['anello','pioggia',4.95,0.6],['pioggia','regalo',7.35,0.8],['regalo','ritorno',9.75,0.8],['ritorno','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.6,0.8,10.8),  V(0.6,-0.3,-1), 3],
 [2.3,  V(-0.6,0.6,10.2),  V(0.6,-0.3,-1), 0],
 [2.9,  V(1.8,1.1,10.2),   V(0,-0.4,0), -3],
 [4.9,  V(0.6,0.8,9.6),    V(0,-0.4,0), -1],
 [5.4,  V(-1.4,1.9,9.4),   V(0,-0.5,-0.6), 2],
 [7.3,  V(0.2,1.4,9.0),    V(0,-0.6,-0.6), 0],
 [7.9,  V(0.9,2.2,10.4),   V(0,-0.7,0), -2],
 [9.6,  V(0.3,1.8,9.8),    V(0,-0.7,0), -1],
 [10.2, V(-1.2,0.6,10.8),  V(0,-0.4,0), 2],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const out=E.exit(clamp((t-12.0)/0.35));
  { const inn=E.soft(clamp((t-2.3)/SO)); const spin=1-E.enter(clamp((t-2.3)/0.6));
    const n=stamps(t); if(TEX[n] && cardFace.material.map!==TEX[n]){ cardFace.material.map=TEX[n]; cardFace.material.needsUpdate=true; }
    const side=E.inout(clamp((t-7.45)/0.5))*(1-E.inout(clamp((t-9.8)/0.5)));
    const bump = (t>5.2&&t<7.4) ? Math.exp(-(((t-5.2)%0.3))*14)*0.05 : 0;
    const s=Math.max(0.0001,inn*(1-out)*(1-0.25*side)*(1+bump)); card.scale.setScalar(s); card.visible=s>0.001;
    card.rotation.set(0.06*Math.sin(t*0.8), -spin*Math.PI*1.5 + 0.12*Math.sin(t*0.6) + side*0.25, 0.03*Math.sin(t*0.7));
    card.position.copy(CARD).add(V(-0.8*side, 0.05*Math.sin(t*1.2)+0.15*side, 0)); }
  const face = m => m.quaternion.copy(cam.quaternion);
  { const on=E.spring(clamp((t-5.25)/SP)), off=E.exit(clamp((t-7.3)/0.3)); const b=(t>5.2&&t<7.4)?Math.exp(-((t-5.2)%0.3)*12)*0.15:0;
    lPunti.position.copy(CARD).add(V(0.85,1.0,0.5)); face(lPunti); const s=Math.max(0.0001,on*(1-off)*(1+b)); lPunti.scale.setScalar(s); lPunti.visible=s>0.002; }
  { const on=E.spring(clamp((t-9.35)/SP)), off=E.exit(clamp((t-9.75)/0.3));
    lPremio.position.copy(GIFT).add(V(0.05,1.05,0.4)); face(lPremio); lPremio.rotateZ(-0.04); const s=Math.max(0.0001,on*(1-off)); lPremio.scale.setScalar(s); lPremio.visible=s>0.002; }
  { const on=E.spring(clamp((t-10.5)/SP)), off=E.exit(clamp((t-12.0)/0.3));
    lBen.position.copy(CARD).add(V(-0.55,-1.12,0.6)); face(lBen); lBen.rotateZ(0.04); const s=Math.max(0.0001,on*(1-off)); lBen.scale.setScalar(s); lBen.visible=s>0.002; }
  camAt(t); tilesAt(t, F, TR, 'via'); draw();
}
