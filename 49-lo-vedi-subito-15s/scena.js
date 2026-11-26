// 49 · Lo vedi subito (ossatura B): sul telefono il cliente tocca «Prenota» → la prenotazione esce come tessera oro e vola verso l'agenda → si incastra nello spazio delle 15:00 di oggi → cornetta e messaggi spariscono, altre prenotazioni atterrano da sole → la giornata piena, con una spunta
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const Q0 = new THREE.Quaternion();
const NASC = () => ({ p:C.clone(), q:Q0.clone(), s:V(0.001,0.001,0.001), g:0, c:0 });
const seg = (a,b,n) => Array.from({length:n},(_,k)=>{ const u=n===1?0:k/(n-1); return [a[0]+(b[0]-a[0])*u, a[1]+(b[1]-a[1])*u]; });

// ── telefono (scena 1 grande, scena 2 piccolo a sinistra): schermo di 5×8 tessere (0–39), riga 6 = bottone «Prenota»
const PH = V(0, C.y-0.35, 0), PHS = V(-0.68, C.y-0.5, 0), PSC = 0.55;
const phone = new THREE.Mesh(new RoundedBoxGeometry(1.32,2.32,0.12,6,0.16), new THREE.MeshStandardMaterial({color:0x111111, roughness:0.3, metalness:0.2})); phone.castShadow=true; scene.add(phone);
const scr = i => V((i%5-2)*0.22, (3.5-Math.floor(i/5))*0.25, 0.1);
const BTN = V(0, -0.625, 0.1);
const lPren = label(D.prenota || 'Prenota', 0.95, 0.3, '#775A18', '#FFFFFF', 0.55);
const onda = new THREE.Mesh(new THREE.RingGeometry(0.9,1,48), new THREE.MeshBasicMaterial({color:0xC9B16C, transparent:true, toneMapped:false})); scene.add(onda);

// ── agenda di oggi: 8 spazi (40–47); in scena 2 più piccola a destra, dalla scena 3 grande al centro
const ORE = D.ore || ['9:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'];
const L2 = { x:0.5, y:C.y-0.45, w:0.8, dy:0.2, h:0.15 }, L3 = { x:0.25, y:C.y-0.42, w:1.0, dy:0.24, h:0.18 };
const slot = (k,L) => V(L.x, L.y+(3.5-k)*L.dy, 0);
const QUI = 5;                      // le 15:00
const ALTRE = [[1,8.45],[3,8.85],[7,9.25]];          // altre prenotazioni che atterrano da sole (spazio, istante)
const RESTO = [0,2,4,6];                              // si riempiono nella scena 5
const lOggi = label(D.oggi || 'Oggi', 0.7, 0.24, '#111111', '#FFFFFF', 0.55);
const lCliente = label(D.cliente || 'Giulia · Taglio', 1.0, 0.18, '#775A18', '#FFFFFF', 0.55);
const orari = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 8*L3.dy), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(orari);
LATE.push(()=>{ orari.material.map=canvasTex(220, Math.round(8*L3.dy*400), (g,w,h)=>{ g.fillStyle='#111111'; g.font=`600 ${Math.round(h/8*0.36)}px Inter`; g.textAlign='right'; g.textBaseline='middle';
  ORE.forEach((o,k)=>g.fillText(o, w-14, (k+0.5)*h/8)); }); orari.material.needsUpdate=true; });

// ── scena 4: «Chiamata persa» e «3 messaggi» davanti all'agenda, che spariscono
const lChiam = label(D.chiamata || 'Chiamata persa', 1.3, 0.3, '#111111');
const lMsg = label(D.messaggi || '3 messaggi', 1.05, 0.3, '#FFFFFF', '#111111');
const CORN = Array.from({length:6},(_,k)=>{ const a=Math.PI*(0.15+0.7*k/5); return V(-0.5+Math.cos(a)*0.34, C.y-0.05+Math.sin(a)*0.34-0.15, 0.8); });
const FUM = [[0.42,0.2],[0.75,0.02],[0.48,-0.2],[0.8,-0.38],[0.4,-0.58],[0.72,-0.75]].map(([x,y])=>V(x, C.y+y-0.1, 0.8));
// ── scena 5: spunta (0–15) davanti all'agenda
const SPUNTA = [...seg([-0.32,0.0],[-0.08,-0.26],6), ...seg([-0.04,-0.22],[0.36,0.3],10)];

const riga = i => Math.floor(i/5);
const F = {
  telefono(t){ return R.map((r,i)=>{
      if(i<40){ const y=riga(i), w=E.spring(clamp((t+0.25-y*0.05)/SP));
        return { p:PH.clone().add(scr(i)).add(V(0,0,(1-w)*0.3)), q:Q0.clone(), s:V(0.19,0.21*Math.max(0.05,w),0.05), g:y===0?0.8:(y===6?0.95:(y===7?0.08:(y%2?0.25:0.08))), c:0 }; }
      if(i===60){ const pop=E.spring(clamp((t-1.3)/SP)), up=E.inout(clamp((t-1.6)/0.5));
        return { p:PH.clone().add(BTN).add(V(0,up*0.25,0.12+up*0.3)), q:Q0.clone(), s:V(0.5,0.16,0.06).multiplyScalar(Math.max(0.01,pop)), g:1, c:0 }; }
      return NASC(); }); },
  volo(t){ return R.map((r,i)=>{
      if(i<40) return { p:PHS.clone().add(scr(i).multiplyScalar(PSC)), q:Q0.clone(), s:V(0.19,0.21,0.05).multiplyScalar(PSC), g:riga(i)===0?0.8:(riga(i)===6?0.4:0.08), c:0 };
      if(i<48){ const k=i-40, pop=E.spring(clamp((t-2.7-k*0.05)/SP)); return { p:slot(k,L2), q:Q0.clone(), s:V(L2.w,L2.h*Math.max(0.05,pop),0.05), g:0.08, c:0 }; }
      if(i===60){ const u=E.inout(clamp((t-2.75)/1.05)); const a=PHS.clone().add(BTN.clone().multiplyScalar(PSC)).add(V(0,0.14,0.42)), b=slot(QUI,L2).add(V(0,0,0.5));
        const p=a.clone().lerp(b,u).add(V(0,0.55*Math.sin(Math.PI*u),0.3*Math.sin(Math.PI*u)));
        return { p, q:qe(0.2*Math.sin(Math.PI*u), Math.PI*2*u, 0), s:V(0.5+0.3*u,0.16,0.06), g:1, c:0 }; }
      return NASC(); }); },
  giorno(t){ return R.map((r,i)=>{
      if(i>=40 && i<48) return { p:slot(i-40,L3), q:Q0.clone(), s:V(L3.w,L3.h,0.05), g:0.08, c:0 };
      if(i===60){ const sn=E.spring(clamp((t-5.2)/SP)); return { p:slot(QUI,L3).add(V(0,0,0.5-0.46*sn)), q:Q0.clone(), s:V(L3.w*0.8+L3.w*0.2*sn,L3.h,0.07), g:1, c:0 }; }
      return NASC(); }); },
  niente(t){ return R.map((r,i)=>{
      if(i>=40 && i<48) return { p:slot(i-40,L3), q:Q0.clone(), s:V(L3.w,L3.h,0.05), g:0.08, c:0 };
      if(i===60) return { p:slot(QUI,L3).add(V(0,0,0.04)), q:Q0.clone(), s:V(L3.w,L3.h,0.07), g:1, c:0 };
      if(i>=61){ const [k,T]=ALTRE[i-61], u=E.inout(clamp((t-(T-0.38))/0.38)), sn=E.spring(clamp((t-T)/SP));
        const p=slot(k,L3).add(V(0.35*(1-u),0.25*(1-u),1.8*(1-u)+0.04)); return { p, q:qe((1-u)*0.5,0,(1-u)*0.3), s:V(L3.w*(0.7+0.3*sn),L3.h,0.07).multiplyScalar(Math.max(0.01,clamp((t-(T-0.45))/0.1))), g:1, c:0 }; }
      return NASC(); }); },
  piena(t){ return R.map((r,i)=>{
      if(i>=40 && i<48){ const k=i-40, j=RESTO.indexOf(k), on=j<0?0:E.enter(clamp((t-10.1-j*0.12)/0.25)); return { p:slot(k,L3).add(V(0,0,on*0.05)), q:Q0.clone(), s:V(L3.w,L3.h,0.05+on*0.02), g:0.08+0.5*on, c:0 }; }
      if(i===60) return { p:slot(QUI,L3).add(V(0,0,0.04)), q:Q0.clone(), s:V(L3.w,L3.h,0.07), g:1, c:0 };
      if(i>=61){ const [k]=ALTRE[i-61]; return { p:slot(k,L3).add(V(0,0,0.04)), q:Q0.clone(), s:V(L3.w,L3.h,0.07), g:1, c:0 }; }
      if(i<16){ const sp=E.spring(clamp((t-10.85-i*0.015)/SP)), [x,y]=SPUNTA[i]; return { p:V(L3.x+0.62+x*0.7, L3.y+4*L3.dy+0.14+y*0.7, 0.1), q:Q0.clone(), s:V(0.075,0.075,0.07).multiplyScalar(Math.max(0.01,sp)), g:0.95, c:0 }; }
      return NASC(); }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['telefono','volo',2.45,0.42],['volo','giorno',4.85,0.5],['giorno','niente',7.45,0.4],['niente','piena',9.85,0.4],['piena','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-0.9,0.5,9.4),  V(0,-0.8,0), 2],
 [2.3,  V(-0.3,0.4,9.0),  V(0,-0.8,0), 0],
 [2.7,  V(0.8,0.7,10.2),  V(0,-0.8,0), -2],
 [4.8,  V(0.3,0.5,9.9),   V(0,-0.8,0), -1],
 [5.2,  V(-0.7,0.4,9.1),  V(0,-0.8,0), 2],
 [7.3,  V(-0.2,0.3,8.9),  V(0,-0.8,0), 1],
 [7.7,  V(0.9,0.6,9.7),   V(0,-0.8,0), -2],
 [9.7,  V(0.4,0.5,9.5),   V(0,-0.8,0), -1],
 [10.1, V(-0.7,0.5,9.8),  V(0,-0.8,0), 2],
 [11.8, V(-0.2,0.4,9.6),  V(0,-0.8,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  // telefono: grande, poi piccolo a sinistra, poi sparisce rimpicciolendo
  const rid=E.inout(clamp((t-2.45)/0.42)), sz=1+(PSC-1)*rid;
  { const on=E.spring(clamp((t+0.3)/SP)), off=E.exit(clamp((t-4.55)/0.25)); phone.position.copy(PH).lerp(PHS,rid).add(V(0,0.03*Math.sin(t*1.2),-0.02)); phone.rotation.set(0.04,0.1*Math.sin(t*0.6)*(1-rid),0); show(phone,on*(1-off),sz); if(on*(1-off)<0.4) phone.visible=false; }
  { const on=E.spring(clamp((t-0.55)/SP)), off=E.exit(clamp((t-2.3)/0.18)), tap=Math.exp(-Math.pow((t-1.12)/0.08,2)); lPren.position.copy(PH).add(BTN).add(V(0,0,0.05)); lPren.quaternion.copy(phone.quaternion); show(lPren,on*(1-off)*(1-0.12*tap)); }
  { const u=clamp((t-1.1)/0.5); onda.position.copy(PH).add(BTN).add(V(0,0,0.16)); onda.scale.setScalar(0.05+0.5*u); onda.material.opacity=(u>0&&u<1)?(1-u)*0.9:0; onda.visible=u>0&&u<1; }
  // agenda: etichetta «Oggi», orari e nome sulla prenotazione delle 15:00
  const m3=E.inout(clamp((t-4.85)/0.5)), L={ x:L2.x+(L3.x-L2.x)*m3, y:L2.y+(L3.y-L2.y)*m3, w:L2.w+(L3.w-L2.w)*m3, dy:L2.dy+(L3.dy-L2.dy)*m3 };
  { const on=E.spring(clamp((t-2.95)/SP)), off=E.exit(clamp((t-12.0)/0.2)); lOggi.position.set(L.x, L.y+4*L.dy+0.12, 0.05); lOggi.quaternion.copy(Q0); show(lOggi,on*(1-off),0.8+0.2*m3); }
  { const on=E.spring(clamp((t-5.05)/SP)), off=E.exit(clamp((t-12.0)/0.2)); orari.position.set(L3.x-L3.w/2-0.32, L3.y, 0.02); show(orari,on*(1-off)); }
  { const on=E.spring(clamp((t-5.45)/SP)), off=E.exit(clamp((t-12.0)/0.2)); lCliente.position.copy(slot(QUI,L3)).add(V(0,0,0.085)); show(lCliente,on*(1-off)); }
  { const on=E.spring(clamp((t-7.6)/SP)), via=E.exit(clamp((t-8.05)/0.3)); lChiam.position.set(-0.15, C.y+0.15, 0.9); face(lChiam); lChiam.rotateZ(0.05+via*0.6); show(lChiam,on*(1-via)); }
  { const on=E.spring(clamp((t-7.7)/SP)), via=E.exit(clamp((t-8.12)/0.3)); lMsg.position.set(0.55, C.y-0.6, 0.9); face(lMsg); lMsg.rotateZ(-0.05-via*0.6); show(lMsg,on*(1-via)); }
  camAt(t); tilesAt(t, F, TR, 'telefono'); draw();
}
