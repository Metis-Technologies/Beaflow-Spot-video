// 27 · Sposti con un tocco (ossatura B): appuntamento già in volo con scia d'oro → trascinato col dito → l'agenda si riassesta a onda → foglio con gomma e cancellature che si sbriciola in tessere → agenda in ordine
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }

const NUOVA = (typeof SPOT!=='undefined' && SPOT.dati.nuova) || 'Gio 16:00';
// agenda 6 giorni × 8 orari (48 tessere) + 4 appuntamenti da 2×2 tessere
const AY = C.y-0.35;
const slot=(c,r)=>V((c-2.5)*0.34, AY+(3.5-r)*0.22, 0);
const blk=(O,q)=>O.clone().add(V(((q%2)-.5)*0.15, (Math.floor(q/2)-.5)*0.09, 0));
const S0=slot(0,1), S1=slot(4,5), S2=slot(2,3), S2H=S2.clone().add(V(0,0.12,0.55));
const OTH=[[[2,3],[2,4]],[[2,4],[2,5]],[[2,5],[2,6]]];          // gli altri appuntamenti della colonna scendono di un posto
const bez3=(a,b,c,u)=>a.clone().multiplyScalar((1-u)*(1-u)).add(b.clone().multiplyScalar(2*u*(1-u))).add(c.clone().multiplyScalar(u*u));
function MP(t){                                                   // centro dell'appuntamento che si sposta
  if(t<2.6){ const u=E.inout(clamp((t-0.15)/1.75)); return bez3(S0.clone().add(V(0,0,0.06)), S0.clone().lerp(S1,0.5).add(V(0,0.55,1.1)), S1.clone().add(V(0,0,0.06)), u); }
  if(t<5.3){ const u=E.inout(clamp((t-2.85)/1.1)); return bez3(S1.clone().add(V(0,0,0.06)), S1.clone().lerp(S2H,0.5).add(V(0,0.25,0.6)), S2H, u).add(V(0,0.03*Math.sin(t*3)*clamp(t-3.95),0)); }
  const v=E.spring(clamp((t-5.55)/SP)); return S2H.clone().lerp(S2.clone().add(V(0,0,0.06)), v); }
const ripple=(p,t,O,t0)=>{ const d=p.distanceTo(O), x=t-t0-d*0.35; return x>0&&x<0.45 ? Math.sin(Math.PI*x/0.45) : 0; };
// scia d'oro dietro all'appuntamento
const TN=18; const trail=new THREE.InstancedMesh(new THREE.SphereGeometry(1,12,8), new THREE.MeshStandardMaterial({color:0xC9B16C, emissive:0xC9B16C, emissiveIntensity:0.45, roughness:0.4}), TN); trail.frustumCulled=false; scene.add(trail);
// tocco del dito: anello d'oro che si allarga
const taps=[[S0,0.12],[S1,2.8],[S2,5.6]].map(([P,t0])=>{ const m=new THREE.Mesh(new THREE.TorusGeometry(0.16,0.012,8,48), new THREE.MeshBasicMaterial({color:0xC9B16C, transparent:true, toneMapped:false})); scene.add(m); return {m,P,t0}; });
const finger=new THREE.Mesh(new THREE.SphereGeometry(0.09,24,16), new THREE.MeshStandardMaterial({color:0xC9B16C, emissive:0xC9B16C, emissiveIntensity:0.5, transparent:true})); scene.add(finger);
const lNuova = label(NUOVA, 1.15, 0.34);
// foglio di carta con gomma e cancellature
const SH = V(0, AY, 0.22);
const sheet = new THREE.Mesh(new THREE.PlaneGeometry(2.15,1.95), new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.9, transparent:true})); sheet.castShadow=true; scene.add(sheet);
LATE.push(()=>{ sheet.material.map=canvasTex(860,780,(g,w,h)=>{ g.fillStyle='#FFFDF8'; g.fillRect(0,0,w,h);
  g.strokeStyle='#D9E2EA'; g.lineWidth=3; for(let y=70;y<h;y+=60){ g.beginPath(); g.moveTo(30,y); g.lineTo(w-30,y); g.stroke(); }
  g.fillStyle='#9A9A9A'; g.font='500 30px Inter'; for(let k=0;k<11;k++) g.fillText(String(9+k),38,62+k*60);
  g.fillStyle='rgba(205,190,185,.55)'; [[170,120,260,70],[420,300,300,80],[230,520,240,70],[520,610,210,60]].forEach(([x,y,ww,hh])=>{ g.beginPath(); g.roundRect(x,y,ww,hh,30); g.fill(); });
  g.strokeStyle='#5E5E5E'; g.lineCap='round';
  const scr=(x,y,ww,n,seed)=>{ g.lineWidth=5; g.beginPath(); g.moveTo(x,y); for(let i=1;i<=n;i++){ g.lineTo(x+ww*i/n, y+((i*seed)%3-1)*10+(i%2?8:-8)); } g.stroke(); };
  scr(180,150,230,9,2); scr(440,330,250,10,5); scr(250,550,200,8,7); scr(540,640,170,7,4); scr(150,210,200,8,1); scr(470,440,230,9,3);
  g.lineWidth=6; [[430,320,680,350],[430,350,680,320],[245,540,450,575]].forEach(([a,b,c,d])=>{ g.beginPath(); g.moveTo(a,b); g.lineTo(c,d); g.stroke(); });
  g.strokeStyle='#8E8E8E'; g.lineWidth=4; g.beginPath(); g.arc(300,420,40,0,Math.PI*1.7); g.stroke(); }); sheet.material.needsUpdate=true; });

function agendaAt(t){ const out=[];
  for(let i=0;i<48;i++){ const c=i%6, r=Math.floor(i/6), p=slot(c,r); const busy=((c*5+r*3)%7===0); const rp=ripple(p,t,S2,5.25)+ripple(p,t,S0,0.12)*0.6+ripple(p,t,S1,2.8)*0.6;
    out.push({ p:p.clone().add(V(0,0,rp*0.14)), q:new THREE.Quaternion(), s:V(0.31,0.19,0.06), g:0.02+rp*0.6, c:busy?1:0 }); }
  const M=MP(t); for(let q=0;q<4;q++) out.push({ p:blk(M,q), q:qe(0,0,0.15*Math.sin(Math.PI*clamp((t-2.85)/1.1))), s:V(0.16,0.095,0.14), g:0.95, c:0 });
  OTH.forEach(([a,b],k)=>{ const u=E.spring(clamp((t-5.2-k*0.13)/SP)); const P=slot(...a).lerp(slot(...b),u).add(V(0,0,0.06+0.2*Math.sin(Math.PI*clamp((t-5.2-k*0.13)/0.4))));
    for(let q=0;q<4;q++) out.push({ p:blk(P,q), q:new THREE.Quaternion(), s:V(0.145,0.085,0.12), g:0.3, c:0 }); });
  return out; }
const F = {
  agenda: agendaAt,
  // tessere appiattite dietro al foglio
  foglio(t){ return R.map((r,i)=>{ const x=i%8, y=Math.floor(i/8); return { p:SH.clone().add(V((x-3.5)*0.24, (3.5-y)*0.22, -0.1)), q:new THREE.Quaternion(), s:V(0.2,0.18,0.03), g:0.05, c:0 }; }); },
  // agenda pulita, poi un riflesso d'oro la attraversa
  pulita(t){ const base=agendaAt(7.0); return base.map((b,i)=>{ const x=(b.p.x+1)/2, y=(AY+0.9-b.p.y); const w=Math.max(0,Math.sin(Math.PI*clamp((t-10.15-(x+y)*0.45)/0.5)));
      return { p:b.p.clone().add(V(0,0,w*0.16)), q:b.q, s:b.s, g:(i>=48&&i<52?0.95:b.g*0.6)+w*0.7, c:b.c }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['agenda','foglio',7.35,0.6],['foglio','pulita',8.65,0.75],['pulita','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.1,1.0,9.8),  V(0,-0.8,0), 3],
 [2.3,  V(-0.3,0.8,9.4),  V(0,-0.8,0), 0],
 [2.9,  V(1.3,1.2,10.0),  V(0.1,-0.8,0), -2],
 [4.9,  V(0.6,1.0,9.6),   V(0.1,-0.8,0), -1],
 [5.4,  V(-1.2,1.6,9.6),  V(0,-0.85,0), 3],
 [7.3,  V(-0.6,1.4,9.4),  V(0,-0.85,0), 1],
 [7.9,  V(1.1,0.6,10.2),  V(0,-0.75,0), -2],
 [9.6,  V(0.5,0.6,9.8),   V(0,-0.75,0), -1],
 [10.2, V(-1.5,1.4,10.2), V(0,-0.8,0), 2],
 [11.8, V(-0.5,1.8,9.8),  V(0,-0.8,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  // scia: posizioni dell'appuntamento negli ultimi 0,4 s, solo mentre vola
  { const moving=(t>0.2&&t<2.05)||(t>2.9&&t<4.05); const op=moving?1:0;
    for(let k=0;k<TN;k++){ const tt=Math.max(t-0.45*k/(TN-1), t<2.6?0.15:2.85); const P=MP(tt).add(V(0,0,0.02)); const r=0.055*(1-k/TN)*op; M4.compose(P, new THREE.Quaternion(), V(r,r,r)); trail.setMatrixAt(k,M4); }
    trail.instanceMatrix.needsUpdate=true; trail.visible=op>0; }
  taps.forEach(({m,P,t0})=>{ const x=clamp((t-t0)/0.5); m.position.copy(P).add(V(0,0,0.2)); face(m); show(m, x>0&&x<1?1:0, 0.5+x*1.6); m.material.opacity=1-x; });
  // dito che trascina (scena 2)
  { const on=E.spring(clamp((t-2.7)/SP))*(1-E.exit(clamp((t-4.6)/0.25))); finger.position.copy(MP(t)).add(V(0.12,-0.06,0.22)); show(finger,on); finger.material.opacity=0.95; }
  { const on=E.spring(clamp((t-5.75)/SP)), off=E.exit(clamp((t-7.25)/0.25)); lNuova.position.copy(S2).add(V(0.6,0.38,0.6)); face(lNuova); lNuova.rotateZ(-0.04); show(lNuova,on*(1-off)); }
  // foglio: entra, poi si sbriciola nelle tessere
  { const on=E.soft(clamp((t-7.4)/SO)), off=E.exit(clamp((t-8.6)/0.3)); sheet.position.copy(SH).add(V(0,0.03*Math.sin(t*1.3),0)); sheet.rotation.set(-0.08, 0.1*Math.sin(t*0.7), 0.04+off*0.3);
    sheet.material.opacity=1-off; show(sheet, on*(1-0.4*off)); }
  camAt(t); tilesAt(t, F, TR, 'agenda'); draw();
}
