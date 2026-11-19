// 22 · Il passaparola, premiato (ossatura C): due clienti già premiati → si torna a uno che invita → punti a tutti e due → rete che fiorisce → pila di prenotazioni
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }

const PUNTI = (typeof SPOT!=='undefined' && SPOT.dati.punti) || '+ 50 punti';
const NUOVI = (typeof SPOT!=='undefined' && SPOT.dati.nuovi) || 'Nuovi clienti  +12';
// dischi-cliente fatti di tessere ad anelli concentrici
function discPts(n, step){ const out=[]; let k=0; while(out.length<n){ const cnt=k===0?1:6*k+ (k>2?1:0); for(let j=0;j<cnt&&out.length<n;j++){ const a=j/cnt*Math.PI*2+k*0.35; out.push([Math.cos(a)*k*step, Math.sin(a)*k*step, k]); } k++; } return out; }
const D32 = discPts(32, 0.19), D64 = discPts(64, 0.2);
const DY = C.y-0.25, DL = V(-0.78, DY, 0), DR = V(0.78, DY, 0);
const lP1 = label(PUNTI, 1.15, 0.34), lP2 = label(PUNTI, 1.15, 0.34);
const lQ1 = label(PUNTI, 1.15, 0.34), lQ2 = label(PUNTI, 1.15, 0.34);
const lInv = label('Invito', 0.95, 0.34, '#111111');
const lNuovi = label(NUOVI, 1.9, 0.38);
// rete del passaparola: nodi su anelli, ognuno legato al più vicino dell'anello prima
const RC = [1,6,12,18,27], RR = [0,0.32,0.6,0.88,1.15], NC = V(0, C.y-0.3, 0);
const NODI = []; RC.forEach((cnt,k)=>{ for(let j=0;j<cnt;j++){ const a=j/cnt*Math.PI*2+k*0.4; NODI.push({k, a, p:V(Math.cos(a)*RR[k], Math.sin(a)*RR[k]*0.82, (1.15-RR[k])*0.4)}); } });
NODI.forEach((n,i)=>{ if(n.k===0){ n.par=-1; return; } let best=-1, bd=1e9; NODI.forEach((m,j)=>{ if(m.k===n.k-1){ const d=n.p.distanceTo(m.p); if(d<bd){ bd=d; best=j; } } }); n.par=best; });
const lp = new Float32Array((NODI.length-1)*6); { let o=0; NODI.forEach(n=>{ if(n.par<0) return; const a=n.p, b=NODI[n.par].p; lp.set([a.x,a.y,a.z,b.x,b.y,b.z],o); o+=6; }); }
const lgeo = new THREE.BufferGeometry(); lgeo.setAttribute('position', new THREE.BufferAttribute(lp,3));
const lines = new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({color:0xC9B16C, transparent:true, opacity:0})); lines.position.copy(NC); scene.add(lines);
const nodeOn = (n,t) => E.enter(clamp((t-7.6-n.k*0.38-(n.a%1)*0.05)/0.35));

const F = {
  // due clienti già premiati
  due(t){ return R.map((r,i)=>{ const left=i<32, d=D32[left?i:i-32], O=left?DL:DR; const pulse=0.15*Math.max(0,Math.sin(t*4-d[2]));
      return { p:O.clone().add(V(d[0], d[1]+0.04*Math.sin(t*1.5+(left?0:1)), 0)), q:new THREE.Quaternion(), s:V(0.15,0.15,0.14), g:0.75+pulse, c:(d[2]===3&&i%3===0)?1:0 }; }); },
  // un cliente solo, poi si sdoppia: il secondo è l'amico invitato (ancora spento)
  uno(t){ const sp=E.inout(clamp((t-3.5)/0.6));
    return R.map((r,i)=>{ const left=i<32; const d=D32[left?i:i-32]; const O=V(0,DY,0).lerp(left?DL:DR, sp);
      return { p:O.clone().add(V(d[0]*(0.75+0.25*sp), d[1]*(0.75+0.25*sp), left?0:-0.02)), q:new THREE.Quaternion(), s:V(0.15,0.15,0.14).multiplyScalar(left?1:Math.max(0.05,sp)), g:left?0.3:0.3*(1-sp)+0.03, c:(d[2]===3&&i%3===0)?1:0 }; }); },
  // punti a tutti e due: i dischi si caricano d'oro dal centro
  premiati(t){ return R.map((r,i)=>{ const left=i<32, d=D32[left?i:i-32], O=left?DL:DR;
      const w=E.enter(clamp((t-5.3-(left?0:0.25)-d[2]*0.12)/0.3)), bump=Math.max(0,Math.sin(Math.PI*clamp((t-5.3-(left?0:0.25)-d[2]*0.12)/0.4)));
      return { p:O.clone().add(V(d[0], d[1], bump*0.15)), q:new THREE.Quaternion(), s:V(0.15,0.15,0.14), g:0.08+0.9*w, c:(d[2]===3&&i%3===0)?1:0 }; }); },
  // la rete che fiorisce dal centro verso la camera
  rete(t){ return R.map((r,i)=>{ const n=NODI[i], on=nodeOn(n,t);
      return { p:NC.clone().add(n.p).add(V(0,0,on*0.12)), q:qe(0,0,n.a), s:V(0.13,0.13,0.13).multiplyScalar(0.55+0.6*on), g:0.05+0.95*on, c:(n.k===4&&i%4===1)?1:0 }; }); },
  // pila di prenotazioni: 16 schede da 2×2 tessere
  pila(t){ return R.map((r,i)=>{ const lv=Math.floor(i/4), q4=i%4; const w=E.spring(clamp((t-10.05-lv*0.06)/SP));
      const p=V(-0.3+((q4%2)-.5)*0.42+0.06*Math.sin(lv*1.7), C.y-1.35+lv*0.12+(1-w)*1.2, ((Math.floor(q4/2))-.5)*0.3+0.05*Math.cos(lv*1.3));
      return { p, q:qe(0, 0.1*Math.sin(lv*0.9), 0), s:V(0.4,0.1,0.28), g:(lv%4===3)?0.85:0.12, c:(lv%5===2)?1:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['due','uno',2.3,0.7],['uno','premiati',4.95,0.3],['premiati','rete',7.35,0.75],['rete','pila',9.75,0.8],['pila','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.2,0.5,10.4), V(0,-0.55,0), 3],
 [2.3,  V(-0.4,0.3,10.0), V(0,-0.55,0), 0],
 [2.9,  V(1.3,0.7,10.6),  V(0,-0.6,0), -2],
 [4.9,  V(0.6,0.5,10.0),  V(0,-0.6,0), -1],
 [5.4,  V(-1.3,1.0,9.6),  V(0,-0.6,0), 3],
 [7.3,  V(-0.7,0.9,9.4),  V(0,-0.6,0), 1],
 [7.9,  V(1.2,-0.2,9.8),  V(0,-0.7,0), -2],
 [9.6,  V(0.5,0.2,9.0),   V(0,-0.7,0), -1],
 [10.2, V(-1.6,0.8,10.4), V(0,-0.7,0), 2],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  // scena 1 · «+ punti» sui due clienti
  [[lP1,DL,0.5],[lP2,DR,0.7]].forEach(([l,O,s0])=>{ const on=E.spring(clamp((t-s0)/SP)), off=E.exit(clamp((t-2.2)/0.25)); l.position.copy(O).add(V(0,0.95,0.5)); face(l); l.rotateZ(O.x<0?0.04:-0.04); show(l,on*(1-off)); });
  // scena 2 · l'invito vola dal primo al secondo
  { const on=E.spring(clamp((t-3.45)/SP)), off=E.exit(clamp((t-4.75)/0.25)); const f=E.inout(clamp((t-3.7)/0.7));
    lInv.position.copy(DL).lerp(DR,f).add(V(0,0.95+0.35*Math.sin(Math.PI*f),0.6)); face(lInv); lInv.rotateZ(0.06*Math.sin(Math.PI*f)); show(lInv,on*(1-off)); }
  // scena 3 · «+ punti» su tutti e due
  [[lQ1,DL,5.55],[lQ2,DR,5.8]].forEach(([l,O,s0])=>{ const on=E.spring(clamp((t-s0)/SP)), off=E.exit(clamp((t-7.25)/0.25)); l.position.copy(O).add(V(0,0.95,0.5)); face(l); l.rotateZ(O.x<0?0.04:-0.04); show(l,on*(1-off)); });
  // scena 4 · fili della rete
  { const on=E.enter(clamp((t-7.7)/1.2)), off=E.exit(clamp((t-9.7)/0.3)); lines.material.opacity=0.85*on*(1-off); lines.visible=lines.material.opacity>0.01; lgeo.setDrawRange(0, Math.round((NODI.length-1)*2*on)); }
  // scena 5 · nuovi clienti
  { const on=E.spring(clamp((t-10.7)/SP)), off=E.exit(clamp((t-12.0)/0.3)); lNuovi.position.set(0.05, C.y+0.85, 0.6); face(lNuovi); lNuovi.rotateZ(-0.04); show(lNuovi,on*(1-off)); }
  camAt(t); tilesAt(t, F, TR, 'due'); draw();
}
