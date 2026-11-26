// 48 · Chi sei v2 (ossatura D «Per chi è», gancio su due scene): le tessere diventano a turno forbici, rasoio, pennello, fiore di loto, smalto, pietre e macchinetta da tatuaggio (le sette attività) → messaggi, quaderno e telefono in disordine → si ricompongono nella pagina di prenotazione sul telefono → anello di avanzamento che si chiude in una spunta
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const Q0 = new THREE.Quaternion();
const NASC = () => ({ p:C.clone(), q:Q0.clone(), s:V(0.001,0.001,0.001), g:0, c:0 });

// ── icone dei mestieri: 64 punti nel piano, con un peso «oro» per le parti in metallo o setola
const seg = (a,b,n) => Array.from({length:n},(_,k)=>{ const u=n===1?0:k/(n-1); return [a[0]+(b[0]-a[0])*u, a[1]+(b[1]-a[1])*u]; });
const anello = (c,r,n,a0=0) => Array.from({length:n},(_,k)=>{ const a=a0+k/n*Math.PI*2; return [c[0]+Math.cos(a)*r, c[1]+Math.sin(a)*r]; });
const griglia = (x0,y0,x1,y1,nx,ny) => { const o=[]; for(let j=0;j<ny;j++) for(let i=0;i<nx;i++) o.push([x0+(x1-x0)*(nx===1?0:i/(nx-1)), y0+(y1-y0)*(ny===1?0:j/(ny-1))]); return o; };
const ICONE = {
  forbici: [ ...anello([-0.36,-0.62],0.22,14).map(p=>[...p,0]), ...anello([0.36,-0.62],0.22,14).map(p=>[...p,0]),
             ...seg([-0.2,-0.38],[0.5,0.88],18).map(p=>[...p,1]), ...seg([0.2,-0.38],[-0.5,0.88],18).map(p=>[...p,1]) ],
  rasoio:  [ ...seg([-0.7,-0.75],[0.05,0.0],22).map(p=>[...p,0]), ...seg([-0.62,-0.82],[0.1,-0.1],8).map(p=>[...p,0]), ...anello([0.08,0.02],0.09,6).map(p=>[...p,1]),
             ...griglia(0.12,0.08,0.72,0.62,7,4).map(([x,y])=>[x-(y-0.08)*0.35,y,1]) ],
  pennello:[ ...seg([0,-0.95],[0,0.1],14).map(p=>[p[0]-0.05,p[1],0]), ...seg([0,-0.95],[0,0.1],14).map(p=>[p[0]+0.05,p[1],0]),
             ...griglia(-0.12,0.15,0.12,0.3,3,2).map(p=>[...p,0.4]),
             ...Array.from({length:30},(_,k)=>{ const r=Math.sqrt((k+0.5)/30), a=k*2.399; return [Math.cos(a)*0.24*r, 0.62+Math.sin(a)*0.34*r, 1]; }) ],
  loto:    (()=>{ const petalo=(ang,len,wid,n,oro)=>Array.from({length:n},(_,k)=>{ const r=Math.sqrt((k+0.5)/n), q=k*2.399, u=r*Math.cos(q), v=r*Math.sin(q);
               const y=len*(v+1)/2, x=wid*u*Math.sin(Math.PI*(v+1)/2), c=Math.cos(ang), s=Math.sin(ang); return [x*c-y*s, -0.5+x*s+y*c, oro]; });
             return [...petalo(0,1.0,0.3,24,1), ...petalo(0.8,0.8,0.26,20,0.5), ...petalo(-0.8,0.8,0.26,20,0.5)]; })(),
  smalto:  [ ...griglia(-0.32,-0.85,0.32,-0.2,5,5).map(p=>[...p,1]), ...seg([-0.36,-0.12],[0.36,-0.12],7).map(p=>[...p,0.5]), ...griglia(-0.1,-0.04,0.1,0.04,3,2).map(p=>[...p,0]),
             ...griglia(-0.14,0.12,0.14,0.8,3,6).map(p=>[...p,0]), ...seg([-0.4,-0.95],[0.4,-0.95],8).map(p=>[...p,0.3]) ],
  pietre:  (()=>{ const riga=(y,w,n,oro)=>seg([-w,y],[w,y],n).map(p=>[...p,oro]);
             return [...riga(-0.8,0.5,11,0), ...riga(-0.7,0.42,11,0), ...riga(-0.5,0.38,9,0), ...riga(-0.4,0.3,9,0), ...riga(-0.2,0.27,7,1), ...riga(-0.1,0.2,7,1),
                     ...seg([0.02,0.0],[0.12,0.45],6).map(p=>[...p,0.8]), ...[[0.2,0.3,1],[0.22,0.4,1],[-0.06,0.25,1],[-0.08,0.35,1]]]; })(),
  tatuaggio:(()=>{ const d=[0.55,-0.83], n=[0.83,0.55], s0=[-0.42,0.72], at=(u,o)=>[s0[0]+d[0]*u+n[0]*o, s0[1]+d[1]*u+n[1]*o], o=[];
             for(let k=0;k<12;k++){ const u=k/11*0.85; o.push([...at(u,-0.1),0],[...at(u,0.1),0]); }
             for(let k=0;k<6;k++) for(const f of [-0.07,0,0.07]) o.push([...at(0.88+k/5*0.32,f),0.5]);
             for(let k=0;k<5;k++) o.push([...at(1.22+k/4*0.2,0),1]);
             for(let k=0;k<9;k++){ const u=k/8; o.push([s0[0]-0.08-u*0.35, s0[1]+0.05+0.12*Math.sin(u*Math.PI), 0]); }
             const tip=at(1.44,0); for(let k=0;k<8;k++){ const u=(k+1)/8; o.push([tip[0]+u*0.45, tip[1]-0.03+0.06*Math.sin(u*Math.PI*1.5), 1]); }
             return o; })(),
};
for (const k in ICONE) { while(ICONE[k].length<64) ICONE[k].push(ICONE[k][ICONE[k].length%8]); ICONE[k].length=64; }
const IC = V(0, C.y-0.45, 0);
// icona e istante in cui è completa (la trasformazione dura 0,28 s e finisce lì): sulle parole della voce
const SEQ = [['forbici',0],['rasoio',0.93],['pennello',1.73],['loto',2.72],['smalto',3.15],['pietre',3.78],['tatuaggio',4.58]];
const SCALA = { loto:1.25, pietre:1.3 };
const icona = (nome,i,t,sc=SCALA[nome]||1) => { const [x,y,oro]=ICONE[nome][i]; return { p:IC.clone().add(V(x*sc, y*sc, 0)), oro }; };

// ── scena 3 · disordine: 20 fumetti di messaggio, 2 pagine di quaderno (24), telefono che squilla (20)
const lPersa = label(D.persa || 'Chiamata persa', 1.4, 0.32, '#111111');
const lMsg = label(D.messaggi || '12 messaggi', 1.15, 0.3);
// ── scena 4 · telefono con la pagina di prenotazione
const PH = V(0, C.y-0.35, 0);
const phone = new THREE.Mesh(new RoundedBoxGeometry(1.32,2.32,0.12,6,0.16), new THREE.MeshStandardMaterial({color:0x111111, roughness:0.3, metalness:0.2})); phone.castShadow=true; scene.add(phone);
const scrLoc = i => V((i%6-2.5)*0.18, (4.5-Math.floor(i/6))*0.19, 0.1);
const lPren = label(D.prenota || 'Prenota', 0.95, 0.3, '#775A18', '#FFFFFF', 0.55);
// ── scena 5 · anello di avanzamento (48) e spunta (16)
const RC = V(0, C.y-0.4, 0), RR = 0.78;
const SPUNTA = [...seg([-0.32,0.0],[-0.08,-0.26],6), ...seg([-0.04,-0.22],[0.36,0.3],10)];

const F = {
  mestieri(t){ const rot=qe(0,0.35*Math.sin(t*1.4),0);
    let A='forbici', B='forbici', a=0; for(let k=0;k<SEQ.length;k++){ if(t>=SEQ[k][1]){ A=SEQ[k][0]; B=SEQ[k+1]?SEQ[k+1][0]:A; a=SEQ[k+1]?E.inout(clamp((t-SEQ[k+1][1]+0.28)/0.28)):0; } }
    return R.map((r,i)=>{ const P=icona(A,i,t), Q=icona(B,i,t); const p=P.p.clone().lerp(Q.p,a), oro=P.oro+(Q.oro-P.oro)*a;
      const loc=p.clone().sub(IC).applyQuaternion(rot).add(IC);
      return { p:loc, q:rot.clone(), s:V(0.1,0.1,0.1), g:0.15+0.75*oro, c:oro<0.2?1:0 }; }); },
  disordine(t){ return R.map((r,i)=>{ const j=(n)=>0.05*Math.sin(t*(9+n)+i*1.7);
      if(i<20){ const x=(r[0]-.5)*2.0, y=(r[1]-.5)*1.7; const pop=E.spring(clamp((t-5.1-i*0.06)/SP));
        return { p:V(x+j(1), C.y-0.25+y+j(2), (r[2]-.5)*0.8), q:qe(0,0,(r[3]-.5)*0.6), s:V(0.36,0.2,0.04).multiplyScalar(Math.max(0.02,pop)), g:0.12, c:i%5===0?1:0 }; }
      if(i<44){ const k=i-20, pg=k<12?0:1, x=(k%3-1)*0.16, y=(Math.floor((k%12)/3)-1.5)*0.14;
        const base=V(pg?0.55:-0.6, C.y-0.75, 0.2), q=qe(-0.5,pg?-0.3:0.3,pg?0.2:-0.25); return { p:base.clone().add(V(x,y,0).applyQuaternion(q)), q, s:V(0.14,0.12,0.02), g:0.05, c:0 }; }
      const k=i-44, sh=0.04*Math.sin(t*40)*(Math.sin(t*6)>0?1:0);
      return { p:V(0.2+(k%4-1.5)*0.13+sh, C.y+0.35+(Math.floor(k/4)-2)*0.15, 0.4), q:qe(0,0,0.15), s:V(0.11,0.12,0.06), g:0.3+0.5*(Math.sin(t*6)>0?1:0), c:(k===0||k===3)?1:0 }; }); },
  pagina(t){ return R.map((r,i)=>{ if(i>=60) return NASC(); const y=Math.floor(i/6); const w=E.spring(clamp((t-7.75-y*0.06)/SP));
      const bottone=(y===8); return { p:PH.clone().add(scrLoc(i)).add(V(0,0,(1-w)*0.3)), q:Q0.clone(), s:V(0.16,0.16*Math.max(0.05,w),0.05), g:y===0?0.8:(bottone?0.95:(y%3===1?0.25:0.08)), c:0 }; }); },
  pronto(t){ const giro=clamp((t-10.1)/1.05), sp=E.spring(clamp((t-11.15)/SP));
    return R.map((r,i)=>{ if(i<48){ const a=Math.PI/2-i/48*Math.PI*2, on=i/48<=giro?1:0;
        return { p:RC.clone().add(V(Math.cos(a)*RR, Math.sin(a)*RR, 0)), q:qe(0,0,a), s:V(0.09,0.09,0.08), g:0.08+0.85*on, c:0 }; }
      const [x,y]=SPUNTA[i-48]; return { p:RC.clone().add(V(x*1.3,y*1.3,0.05)), q:Q0.clone(), s:V(0.12,0.12,0.1).multiplyScalar(Math.max(0.01,sp)), g:0.95, c:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['mestieri','disordine',4.85,0.6],['disordine','pagina',7.45,0.6],['pagina','pronto',9.75,0.6],['pronto','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.2,0.6,9.8),  V(0,-0.8,0), 3],
 [2.3,  V(-0.4,0.5,9.4),  V(0,-0.8,0), 0],
 [2.9,  V(1.1,0.7,10.2),  V(0,-0.8,0), -2],
 [4.9,  V(0.5,0.5,9.8),   V(0,-0.8,0), -1],
 [5.4,  V(-0.9,0.5,9.4),  V(0,-0.8,0), 2],
 [7.3,  V(-0.3,0.4,9.0),  V(0,-0.8,0), 1],
 [7.9,  V(1.1,0.8,10.0),  V(0,-0.8,0), -2],
 [9.6,  V(0.5,0.6,9.6),   V(0,-0.8,0), -1],
 [10.2, V(-0.8,0.5,9.8),  V(0,-0.8,0), 2],
 [11.8, V(-0.2,0.4,9.6),  V(0,-0.8,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const on=E.spring(clamp((t-5.7)/SP)), off=E.exit(clamp((t-7.3)/0.25)); lPersa.position.set(0.4, C.y-1.2, 0.6); face(lPersa); lPersa.rotateZ(0.04); show(lPersa,on*(1-off)); }
  { const on=E.spring(clamp((t-6.1)/SP)), off=E.exit(clamp((t-7.3)/0.25)); lMsg.position.set(-0.5, C.y+0.05, 0.7); face(lMsg); lMsg.rotateZ(-0.03); show(lMsg,on*(1-off)); }
  { const on=E.spring(clamp((t-7.55)/SP)), off=E.exit(clamp((t-9.8)/0.2)); phone.position.copy(PH).add(V(0,0.03*Math.sin(t*1.2),-0.02)); phone.rotation.set(0.04,0.1*Math.sin(t*0.6),0); show(phone,on*(1-off)); if(on*(1-off)<0.4) phone.visible=false; }
  { const on=E.spring(clamp((t-8.4)/SP)), off=E.exit(clamp((t-9.75)/0.2)); lPren.position.copy(PH).add(scrLoc(50)).add(V(0.09,0,0.12)); lPren.quaternion.copy(phone.quaternion); show(lPren,on*(1-off)); }
  camAt(t); tilesAt(t, F, TR, 'mestieri'); draw();
}
