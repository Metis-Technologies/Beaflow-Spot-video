// 26 · Mai più doppie prenotazioni (ossatura A): due appuntamenti sulla stessa casella → scudo d'oro, il secondo rimbalza → casella occupata bloccata, scivola sulla prima libera → online e gestionale deviati → agenda piena e ordinata
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }

// agenda: 7 giorni × 8 orari; T = casella contesa, F1–F3 = caselle libere
const T=[3,3], F1=[3,4], F2=[1,2], F3=[5,5];
const same=(c,r,s)=>c===s[0]&&r===s[1];
const busy=(c,r)=>!same(c,r,T)&&!same(c,r,F1)&&!same(c,r,F2)&&!same(c,r,F3)&&((c*5+r*3)%4===0||(c+r*2)%7===1);
const AY = C.y-0.35;
const slot=(c,r,sc=1,cy=AY)=>V((c-3)*0.3*sc, cy+(3.5-r)*0.24*sc, 0);
const LAY = t => t<7.35 ? [1,AY] : [0.8, C.y-0.72];          // nella scena 4 l'agenda scende per far posto ai due ingressi
function agenda(t, sc, cy, glowBusy=0.35){ const out=[];
  for(let i=0;i<56;i++){ const c=i%7, r=Math.floor(i/7), b=busy(c,r);
    out.push({ p:slot(c,r,sc,cy), q:new THREE.Quaternion(), s:V(0.27,0.205,0.06).multiplyScalar(sc), g:b?glowBusy:0.02, c:(b&&(c+r)%3===0)?1:0 }); }
  return out; }
const blk=(O,q,sc=1,z=0.08)=>O.clone().add(V(((q%2)-.5)*0.14*sc, (Math.floor(q/2)-.5)*0.105*sc, z));
const bt=(p,q,g,sc=1)=>({ p, q:q||new THREE.Quaternion(), s:V(0.135,0.1,0.12).multiplyScalar(sc), g, c:0 });
const TP = slot(...T), HOV = TP.clone().add(V(0.42,0.55,0.75));
const bez3=(a,b,c,u)=>a.clone().multiplyScalar((1-u)*(1-u)).add(b.clone().multiplyScalar(2*u*(1-u))).add(c.clone().multiplyScalar(u*u));

// scudo di luce e contorno della casella bloccata
const shield = new THREE.Group(); scene.add(shield);
const shDisc = new THREE.Mesh(new THREE.CircleGeometry(0.42,48), new THREE.MeshBasicMaterial({color:0xC9B16C, transparent:true, opacity:0.28, depthWrite:false, toneMapped:false})); shield.add(shDisc);
const shRing = new THREE.Mesh(new THREE.TorusGeometry(0.42,0.025,10,64), new THREE.MeshStandardMaterial({color:0xC9B16C, emissive:0xC9B16C, emissiveIntensity:0.6, metalness:0.6, roughness:0.3})); shield.add(shRing);
const lock = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.34,0.27,0.16)), new THREE.LineBasicMaterial({color:0x775A18, transparent:true})); scene.add(lock);
const lOcc = label('Occupato', 1.05, 0.32, '#111111');
const lLib = label('Libero', 0.8, 0.3);
const lOn = label('Online', 0.95, 0.32), lGest = label('Gestionale', 1.25, 0.32, '#111111');
// ingressi della scena 4: telefono a sinistra, banco (schermo) a destra
const SRC_L = V(-0.85, C.y+0.5, 0.3), SRC_R = V(0.8, C.y+0.5, 0.3);
const devMat = new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.4}), scrMat = new THREE.MeshStandardMaterial({color:0x111111, roughness:0.3, metalness:0.2});
const phone = new THREE.Group(); scene.add(phone); { const b=new THREE.Mesh(new RoundedBoxGeometry(0.42,0.78,0.06,4,0.06), devMat); b.castShadow=true; phone.add(b); const s=new THREE.Mesh(new RoundedBoxGeometry(0.36,0.66,0.01,3,0.04), scrMat); s.position.z=0.032; phone.add(s); }
const desk = new THREE.Group(); scene.add(desk); { const b=new THREE.Mesh(new RoundedBoxGeometry(0.95,0.6,0.06,4,0.04), devMat); b.castShadow=true; desk.add(b); const s=new THREE.Mesh(new RoundedBoxGeometry(0.87,0.5,0.01,3,0.03), scrMat); s.position.z=0.032; desk.add(s);
  const st=new THREE.Mesh(new RoundedBoxGeometry(0.08,0.22,0.06,2,0.02), devMat); st.position.y=-0.4; desk.add(st); const ba=new THREE.Mesh(new RoundedBoxGeometry(0.4,0.04,0.2,2,0.02), devMat); ba.position.y=-0.52; desk.add(ba); }

const F = {
  // scena 1 · due appuntamenti puntano sulla stessa casella e si scontrano
  scontro(t){ const out=agenda(t,1,AY,0.12);
    const a=E.inout(clamp((t-0.15)/1.15)), b=E.enter(clamp((t-0.35)/1.3)); const jit=t>1.55?0.025*Math.sin(t*38):0;
    const A0=V(-1.2,AY+1.1,1.3), B0=V(1.3,AY+1.2,1.5), Bt=TP.clone().add(V(0.06+jit,0.04,0.1));
    for(let q=0;q<4;q++) out.push(bt(blk(A0.clone().lerp(TP,a),q), qe(0,0,(1-a)*0.6), 0.95));
    for(let q=0;q<4;q++) out.push(bt(blk(B0.clone().lerp(Bt,b),q), qe(0,0,-(1-b)*0.7+jit*2), 0.95));
    return out; },
  // scena 2 · lo scudo respinge il secondo, che resta sospeso
  scudo(t){ const out=agenda(t,1,AY); const u=E.enter(clamp((t-2.6)/0.6));
    const Bp=bez3(TP.clone().add(V(0.06,0.04,0.1)), TP.clone().add(V(0.15,0.55,0.9)), HOV, u).add(V(0,0.04*Math.sin(t*2.2),0));
    for(let q=0;q<4;q++) out.push(bt(blk(TP,q), null, 0.85));
    for(let q=0;q<4;q++) out.push(bt(blk(Bp,q), qe(0.2*Math.sin(t*1.7)*u, 0, -0.25*u+0.6*Math.sin(Math.PI*u)), 0.55));
    return out; },
  // scena 3 · casella bloccata, il secondo scivola sulla prima libera
  blocca(t){ const out=agenda(t,1,AY); const u=E.inout(clamp((t-5.6)/0.7)); const F1P=slot(...F1);
    const Bp=bez3(HOV, F1P.clone().add(V(0.5,0.1,0.6)), F1P, u);
    for(let q=0;q<4;q++) out.push(bt(blk(TP,q), null, 0.6+0.3*Math.sin(t*5)));
    for(let q=0;q<4;q++) out.push(bt(blk(Bp,q), qe(0,0,(1-u)*-0.25), 0.55+0.4*u));
    return out; },
  // scena 4 · da online e dal gestionale: tutti e due deviati sulle caselle libere
  ingressi(t){ const [sc,cy]=LAY(t); const out=agenda(t,sc,cy); const Tp=slot(...T,sc,cy), F1P=slot(...F1,sc,cy), F2P=slot(...F2,sc,cy), F3P=slot(...F3,sc,cy);
    for(let q=0;q<4;q++) out.push(bt(blk(Tp,q,sc), null, 0.85, sc));
    out[F1[1]*7+F1[0]].g=0.75;                                // casella presa nella scena 3
    const run=(S,hit,end,t0)=>{ const a=E.inout(clamp((t-t0)/0.55)), b=E.inout(clamp((t-t0-0.6)/0.6));
      const H=Tp.clone().add(V(0,0,0.45)); return b>0 ? bez3(H, H.clone().lerp(end,0.5).add(V(0,0.35,0.4)), end, b) : S.clone().lerp(H,a); };
    const L=run(SRC_L.clone().add(V(0,-0.1,0.1)), Tp, F2P, 7.75), Rr=run(SRC_R.clone().add(V(0,-0.1,0.1)), Tp, F3P, 8.05);
    out.push(bt(blk(L,0,sc), null, 0.9, sc), bt(blk(L,1,sc), null, 0.9, sc));
    out.push(bt(blk(Rr,0,sc), null, 0.9, sc), bt(blk(Rr,1,sc), null, 0.9, sc));
    return out; },
  // scena 5 · agenda piena, colonne ordinate con un'onda d'oro
  piena(t){ return R.map((r,i)=>{ const c=i%8, rw=Math.floor(i/8); const w=Math.max(0,Math.sin(Math.PI*clamp((t-10.1-c*0.08-rw*0.03)/0.5)));
      return { p:V((c-3.5)*0.28, C.y+0.2-rw*0.23+w*0.05, w*0.18), q:new THREE.Quaternion(), s:V(0.25,0.19,0.08), g:((c+rw)%3===0?0.75:0.12)+w*0.4, c:((c*3+rw)%5===0)?1:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['scontro','scudo',2.35,0.3],['scudo','blocca',4.95,0.3],['blocca','ingressi',7.35,0.6],['ingressi','piena',9.75,0.8],['piena','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.2,0.9,10.6), V(0,-0.75,0), 3],
 [1.6,  V(-0.2,0.5,8.6),  V(0,-0.8,0), 1],
 [2.3,  V(0.1,0.5,8.9),   V(0,-0.8,0), 0],
 [2.9,  V(1.3,0.9,10.2),  V(0.1,-0.75,0), -2],
 [4.9,  V(0.7,0.7,9.8),   V(0.1,-0.75,0), -1],
 [5.4,  V(-1.3,1.3,9.8),  V(0,-0.8,0), 3],
 [7.3,  V(-0.7,1.1,9.6),  V(0,-0.8,0), 1],
 [7.9,  V(1.0,1.0,10.6),  V(0,-0.7,0), -2],
 [9.6,  V(0.5,0.9,10.2),  V(0,-0.7,0), -1],
 [10.2, V(-1.4,-0.4,10.2),V(0,-0.9,0), 2],
 [11.8, V(-0.4,1.6,10.0), V(0,-0.9,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  const [sc,cy]=LAY(t); const Tp=slot(...T,sc,cy);
  // scudo: scena 2 (sul rimbalzo) e scena 4 (sui due ingressi)
  { const a=E.spring(clamp((t-2.55)/SP))*(1-E.exit(clamp((t-4.8)/0.25))), b=E.spring(clamp((t-8.1)/SP))*(1-E.exit(clamp((t-9.65)/0.25)));
    const hit=Math.exp(-Math.max(0,t-2.62)*6)*(t>2.6?1:0)+Math.exp(-Math.max(0,t-8.3)*6)*(t>8.3?1:0)+Math.exp(-Math.max(0,t-8.6)*6)*(t>8.6?1:0);
    shield.position.copy(Tp).add(V(0,0,0.32)); face(shield); show(shield, Math.max(a,b), sc*(1+0.15*hit)); shDisc.material.opacity=0.22+0.3*hit; }
  { const on=E.enter(clamp((t-5.15)/0.3)), off=E.exit(clamp((t-7.3)/0.2)); lock.position.copy(TP).add(V(0,0,0.08)); lock.material.opacity=on*(1-off); lock.visible=lock.material.opacity>0.01; lock.scale.setScalar(1+0.06*Math.sin(t*5)); }
  { const on=E.spring(clamp((t-5.25)/SP)), off=E.exit(clamp((t-7.3)/0.25)); lOcc.position.copy(TP).add(V(-0.55,0.42,0.6)); face(lOcc); lOcc.rotateZ(0.04); show(lOcc,on*(1-off)); }
  { const on=E.spring(clamp((t-5.4)/SP)), off=E.exit(clamp((t-6.05)/0.2)); lLib.position.copy(slot(...F1)).add(V(0.15,-0.35,0.6)); face(lLib); show(lLib,on*(1-off)); }
  // scena 4 · ingressi
  [[phone,SRC_L,lOn,7.5],[desk,SRC_R,lGest,7.65]].forEach(([g,P,l,s0])=>{ const on=E.soft(clamp((t-s0)/SO)), off=E.exit(clamp((t-9.65)/0.3));
    g.position.copy(P).add(V(0,0.03*Math.sin(t*1.4+s0),0)); g.rotation.set(0.05, (P.x<0?0.25:-0.25)+0.05*Math.sin(t*0.8), 0); show(g,on*(1-off));
    const lo=E.spring(clamp((t-s0-0.2)/SP)); l.position.copy(P).add(V(0,0.62,0.4)); face(l); show(l,lo*(1-off)); });
  camAt(t); tilesAt(t, F, TR, 'scontro'); draw();
}
