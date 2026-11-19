// 20 · Dal link in bio (ossatura B): messaggi che si avvolgono in un anello-link → volo dentro l'anello → pagina del Salone → servizi → orari → spunta «Confermata»
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
// scheda piatta con disegno su canvas (profilo, pagina di prenotazione)
function card(w, h, draw){ const grp=new THREE.Group(); scene.add(grp);
  const b=new THREE.Mesh(new RoundedBoxGeometry(w,h,0.08,4,0.06), new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.45})); b.castShadow=true; grp.add(b);
  const f=new THREE.Mesh(new THREE.PlaneGeometry(w-0.08,h-0.08), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); f.position.z=0.042; grp.add(f);
  LATE.push(()=>{ f.material.map=canvasTex(Math.round((w-0.08)*400),Math.round((h-0.08)*400),draw); f.material.needsUpdate=true; }); return grp; }

const SERV = (typeof SPOT!=='undefined' && SPOT.dati.servizi) || ['Taglio · 30 min','Manicure · 45 min','Massaggio · 50 min'];
const ORA = (typeof SPOT!=='undefined' && SPOT.dati.orario) || 'Ven 17:30';

// scena 1 · profilo con il link
const PROF = V(0, C.y-1.45, 0.35);
const prof = card(2.3, 0.62, (g,w,h)=>{ g.fillStyle='#FFFFFF'; g.fillRect(0,0,w,h);
  g.fillStyle='#EFE7DC'; g.beginPath(); g.arc(h/2, h/2, h*0.36, 0, Math.PI*2); g.fill();
  g.fillStyle='#C9B16C'; g.beginPath(); g.arc(h/2, h/2, h*0.2, 0, Math.PI*2); g.fill();
  g.textBaseline='middle'; g.fillStyle='#111111'; g.font='700 60px Inter'; g.fillText('Salone', h+10, h*0.33);
  g.fillStyle='#775A18'; g.font='600 46px Inter'; g.fillText('Link · Prenota ora', h+10, h*0.7); });
// scena 2 · pagina di prenotazione
const PAG = V(0, C.y-0.3, 0.3);
const pag = card(1.75, 2.0, (g,w,h)=>{ g.fillStyle='#FFFFFF'; g.fillRect(0,0,w,h); g.textBaseline='middle';
  g.fillStyle='#EFE7DC'; g.beginPath(); g.roundRect(40,40,w-80,190,22); g.fill();
  g.fillStyle='#C9B16C'; g.beginPath(); g.arc(135,135,58,0,Math.PI*2); g.fill();
  g.fillStyle='#111111'; g.font='700 64px Inter'; g.fillText('Salone',225,112); g.fillStyle='#5F5F5F'; g.font='500 36px Inter'; g.fillText('Aperto ora',225,172);
  for(let k=0;k<3;k++){ g.fillStyle='#F3EEE7'; g.beginPath(); g.roundRect(40,280+k*120,w-80,96,18); g.fill();
    g.fillStyle='#BDB5AA'; g.beginPath(); g.roundRect(70,312+k*120,260-k*40,30,10); g.fill(); g.beginPath(); g.roundRect(w-190,312+k*120,120,30,10); g.fill(); }
  g.fillStyle='#111111'; g.beginPath(); g.roundRect(40,h-170,w-80,120,20); g.fill();
  g.fillStyle='#FFFFFF'; g.font='700 52px Inter'; g.textAlign='center'; g.fillText('Prenota',w/2,h-108); });
// scena 3 · etichette dei servizi (la prima viene scelta)
const SY = k => C.y+0.32-k*0.66;
const lServ = SERV.map(s=>label(s, 1.75, 0.34, '#111111'));
const lServOk = label(SERV[0], 1.75, 0.34);
// scena 4 · orario scelto
const OSEL = [2,2];                       // colonna, riga dello slot scelto
const slotP = (c,r) => V((c-1.5)*0.55, C.y+0.15-r*0.5, 0);
const lOra = label(ORA, 1.15, 0.36);
// scena 5 · conferma e fumetti che spariscono
const lConf = label('Confermata', 1.6, 0.42, '#775A18', '#FFFFFF', 0.42);
const BUB = [[-1.35,0.55,-0.6],[1.3,0.2,-0.8],[-1.1,-0.9,-0.5],[1.25,-1.15,-0.7],[0.2,0.85,-1.1],[-0.3,-1.6,-0.9]];
const bubMat = new THREE.MeshStandardMaterial({color:0xD9D3CB, roughness:0.6});
const bubs = BUB.map(([x,y,z],k)=>{ const m=new THREE.Mesh(new RoundedBoxGeometry(k%2?0.62:0.5,0.3,0.06,3,0.1), bubMat); m.position.set(x,C.y+y,z); m.castShadow=true; scene.add(m); return m; });

const F = {
  // catena di fumetti in disordine che si allunga
  messaggi(t){ const grow=0.35+0.65*E.inout(clamp(t/0.9));
    return R.map((r,i)=>{ const u=i/N, on=u<grow?1:0.05;
      return { p:V(1.25*Math.sin(i*0.41+t*0.6)+0.25*Math.sin(i*1.7), C.y+0.95-u*2.2+0.18*Math.sin(i*0.9+t), 0.7*Math.cos(i*0.29+t*0.4)),
               q:qe(0.2*Math.sin(i), 0.4*Math.sin(i*0.7+t), (r[3]-.5)*0.6), s:V(0.34,0.2,0.06).multiplyScalar(on), g:(i%6===0)?0.7:0.05, c:(i%3===1)?1:0 }; }); },
  // anello-link oro
  anello(t){ const cy=C.y-0.2; return R.map((r,i)=>{ const a=i/N*Math.PI*2+t*0.7;
      return { p:V(Math.cos(a)*0.95, cy+Math.sin(a)*0.95, 0.15*Math.sin(a*2+t)), q:qe(0,0,a), s:V(0.11,0.2,0.16), g:(i%2)?0.95:0.35, c:(i%8===4)?1:0 }; }); },
  // l'anello si avvicina alla camera: ci si vola dentro
  portale(t){ return R.map((r,i)=>{ const a=i/N*Math.PI*2+t*0.9;
      return { p:V(Math.cos(a)*1.25, 0.15+Math.sin(a)*1.25, 7.2), q:qe(0,0,a), s:V(0.12,0.24,0.18), g:0.95, c:0 }; }); },
  // cornice attorno alla pagina
  cornice(t){ const w=1.95, h=2.2, L=2*(w+h);
    return R.map((r,i)=>{ let d=(i/N)*L+t*0.25; d%=L; let x,y;
      if(d<w){ x=-w/2+d; y=h/2; } else if(d<w+h){ x=w/2; y=h/2-(d-w); } else if(d<2*w+h){ x=w/2-(d-w-h); y=-h/2; } else { x=-w/2; y=-h/2+(d-2*w-h); }
      return { p:V(PAG.x+x, PAG.y+y, PAG.z-0.12), q:new THREE.Quaternion(), s:V(0.13,0.13,0.16), g:(i%4===0)?0.95:0.2, c:(i%4===2)?1:0 }; }); },
  // tre servizi: barre di tessere, la prima si accende
  servizi(t){ const sel=E.inout(clamp((t-5.9)/0.4));
    return R.map((r,i)=>{ if(i>=60) return { p:V(0,SY(1),-0.4), q:new THREE.Quaternion(), s:V(0.01,0.01,0.01), g:0, c:0 };
      const k=Math.floor(i/20), j=i%20, x=j%10, z=Math.floor(j/10); const me=k===0;
      const w=Math.max(0,Math.sin(Math.PI*clamp((t-5.05-x*0.03-k*0.12)/0.45)));
      return { p:V((x-4.5)*0.23, SY(k)+w*0.08+(me?sel*0.06:0), (z-0.5)*0.24-0.15+(me?sel*0.3:0)), q:new THREE.Quaternion(), s:V(0.21,0.2,0.2),
               g:me?0.15+sel*0.85:0.06+w*0.3, c:(!me&&x===0)?1:0 }; }); },
  // griglia degli orari: 16 slot di 2×2 tessere, uno si alza
  orari(t){ const sel=E.inout(clamp((t-8.0)/0.4));
    return R.map((r,i)=>{ const sl=Math.floor(i/4), c=sl%4, rw=Math.floor(sl/4), q4=i%4; const me=c===OSEL[0]&&rw===OSEL[1];
      const w=Math.max(0,Math.sin(Math.PI*clamp((t-7.55-(c+rw)*0.05)/0.45)));
      const busy=!me && ((c*3+rw*5)%4===0);
      const p=slotP(c,rw).add(V(((q4%2)-.5)*0.21, (Math.floor(q4/2)-.5)*0.19, (me?sel*0.45:0)+w*0.1));
      return { p, q:new THREE.Quaternion(), s:V(0.19,0.17,0.12).multiplyScalar(me?1+sel*0.12:1), g:me?0.1+sel*0.9:0.04+w*0.2, c:busy?1:0 }; }); },
  // spunta di conferma
  spunta(t){ const O=V(0, C.y-0.25, 0.1), A=V(-0.85,0.05,0), B=V(-0.3,-0.5,0), Cc=V(0.95,0.8,0); const l1=A.distanceTo(B), l2=B.distanceTo(Cc);
    return R.map((r,i)=>{ const d=i/(N-1)*(l1+l2); const p=d<l1? A.clone().lerp(B,d/l1) : B.clone().lerp(Cc,(d-l1)/l2);
      const w=Math.max(0,Math.sin(Math.PI*clamp((t-10.1-i*0.008)/0.4)));
      const ang=d<l1? Math.atan2(B.y-A.y,B.x-A.x) : Math.atan2(Cc.y-B.y,Cc.x-B.x);
      return { p:p.add(O).add(V(0,0,w*0.15)), q:qe(0,0,ang), s:V(0.16,0.16,0.18).multiplyScalar(1+0.25*w), g:0.75+w*0.3, c:(i%5===2)?1:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['messaggi','anello',0.95,0.8],['anello','portale',2.3,0.45],['portale','cornice',2.95,0.7],['cornice','servizi',4.95,0.6],['servizi','orari',7.4,0.7],['orari','spunta',9.75,0.8],['spunta','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.3,0.6,10.8), V(0,-0.7,0), 3],
 [2.2,  V(-0.3,0.4,10.2), V(0,-0.6,0), 0],
 [2.75, V(0,0.15,6.6),    V(0,0.05,0), 4],
 [3.5,  V(1.2,0.7,9.6),   V(0.1,-0.6,0), -2],
 [4.9,  V(0.6,0.6,10.0),  V(0.1,-0.6,0), -1],
 [5.4,  V(-1.4,1.4,9.8),  V(0,-0.75,0), 3],
 [7.3,  V(-0.8,1.2,9.6),  V(0,-0.75,0), 1],
 [7.9,  V(1.4,1.8,10.2),  V(0,-0.85,0), -2],
 [9.6,  V(0.8,1.6,9.8),   V(0,-0.85,0), -1],
 [10.2, V(-1.6,0.6,10.4), V(0,-0.6,0), 2],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const on=E.soft(clamp((t-0.9)/SO)), off=E.exit(clamp((t-2.2)/0.25)); prof.position.copy(PROF).add(V(0,0.04*Math.sin(t*1.3),0)); prof.rotation.set(-0.12, 0.12*Math.sin(t*0.7), 0.02); show(prof,on*(1-off)); }
  { const on=E.soft(clamp((t-3.3)/SO)), off=E.exit(clamp((t-4.8)/0.3)); const spin=1-E.enter(clamp((t-3.3)/0.6));
    pag.position.copy(PAG).add(V(0,0.04*Math.sin(t*1.1),0)); pag.rotation.set(0.05*Math.sin(t*0.8), -spin*Math.PI+0.1*Math.sin(t*0.6), 0); show(pag,on*(1-off)); }
  { const sel=E.inout(clamp((t-5.9)/0.4));
    lServ.forEach((l,k)=>{ const on=E.spring(clamp((t-5.2-k*0.12)/SP)), off=E.exit(clamp((t-7.3)/0.25)); l.position.set(0, SY(k)+0.02, 0.45+(k===0?sel*0.3:0)); face(l); show(l, on*(1-off)*(k===0?1-sel:1)); });
    const off=E.exit(clamp((t-7.3)/0.25)); lServOk.position.set(0, SY(0)+0.02, 0.75); face(lServOk); show(lServOk, sel*(1-off)); }
  { const on=E.spring(clamp((t-8.25)/SP)), off=E.exit(clamp((t-9.7)/0.25)); lOra.position.copy(slotP(OSEL[0],OSEL[1])).add(V(0,0.42,0.75)); face(lOra); lOra.rotateZ(-0.04); show(lOra,on*(1-off)); }
  { const on=E.spring(clamp((t-10.55)/SP)), off=E.exit(clamp((t-12.0)/0.3)); lConf.position.set(0, C.y-1.35, 0.6); face(lConf); show(lConf,on*(1-off)); }
  bubs.forEach((m,k)=>{ const on=E.soft(clamp((t-9.9-k*0.05)/SO)), off=E.exit(clamp((t-10.75-k*0.08)/0.35)); m.position.y=C.y+BUB[k][1]+off*0.4; m.rotation.set(0, 0.3*Math.sin(t+k), 0.1*Math.sin(t*0.8+k)); show(m, on*(1-off)); });
  camAt(t); tilesAt(t, F, TR, 'messaggi'); draw();
}
