// 30 · Servizi lunghi, zero incastri (ossatura B): barre di durata diversa che si incastrano in una colonna d'agenda → tre servizi con la loro durata → pausa che si apre dentro il servizio lungo → tre servizi che diventano un pacchetto → agenda di quattro giorni piena, senza buchi
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const Q0 = new THREE.Quaternion();
const NASC = () => ({ p:C.clone(), q:Q0.clone(), s:V(0.001,0.001,0.001), g:0, c:0 });

// scena 1 · colonna d'agenda 4×16: cinque servizi di durata diversa (in righe), il terzo è quello lungo
const DUR = [2,3,6,2,3], RIGA = []; DUR.forEach((d,b)=>{ for(let k=0;k<d;k++) RIGA.push([b,k]); });
const START = [0]; DUR.forEach((d,b)=>START.push(START[b]+d));
const COLY = r => C.y-1.2+r*0.15;
const TB = [1.0,1.25,0.35,1.45,1.6];                       // istante dell'incastro di ogni barra (la lunga per prima)
const DIS = DUR.map((d,b)=>({ p:V([-1.1,1.0,-0.2,0.9,-0.9][b], C.y+[0.5,0.2,-0.1,-0.8,-0.9][b], [0.3,-0.4,0.5,0.2,-0.3][b]), q:qe([0.4,-0.3,0.2,0.5,-0.4][b],[0.6,-0.5,0.3,-0.4,0.5][b],[0.5,-0.7,0.25,0.6,-0.45][b]) }));
const lTre = label(D.lungo || '3 ore', 1.0, 0.32);

// scena 2 · tre servizi con la loro durata (barre orizzontali di 2 righe, lunghe 4 · 8 · 12 tessere)
const SERV = D.servizi || ['Taglio · 30 min','Trattamento viso · 60 min','Massaggio · 90 min'];
const BL = [4,8,12], BY = [C.y+0.55, C.y-0.15, C.y-0.85];
const lServ = SERV.map(s=>label(s, 0.068*s.length+0.3, 0.28, '#111111', '#FFFFFF', 0.46));

// scena 3 · il servizio lungo da vicino: 8×8 tessere; le due righe centrali si aprono nella pausa
const lPausa = label(D.pausa || 'Pausa · 30 min', 1.45, 0.34);
const gap = new THREE.Mesh(new RoundedBoxGeometry(1.95,0.34,0.05,4,0.04), new THREE.MeshStandardMaterial({color:0xE9D9A6, emissive:0xC9B16C, emissiveIntensity:0.9, roughness:0.4, transparent:true}));
scene.add(gap);

// scena 4 · tre servizi da 4×5 che si fondono in un pacchetto 8×8
const BX = [-0.98, 0, 0.98];
const lPac = label(D.pacchetto || 'Pacchetto · 3 servizi', 1.75, 0.36);

// scena 5 · quattro giorni pieni
const GIORNI = [[3,2,6,2,3],[2,4,4,3,3],[6,2,2,3,3],[3,3,2,5,3]];
const blocco = (d,r) => { let s=0; for(let b=0;b<5;b++){ s+=GIORNI[d][b]; if(r<s) return b; } return 4; };
const lGiorni = ['Lun','Mar','Mer','Gio'].map(g=>label(g, 0.5, 0.26, null, '#111111', 0.62));

const F = {
  incastro(t){ return R.map((r,i)=>{ const row=Math.floor(i/4), col=i%4, [b,k]=RIGA[row], h=DUR[b];
      const u=E.inout(clamp((t-TB[b])/0.45)), drift=0.06*Math.sin(t*1.3+b*1.7);
      const loc=V((col-1.5)*0.21, (k-(h-1)/2)*0.155, 0);
      const a=loc.clone().applyQuaternion(DIS[b].q).add(DIS[b].p).add(V(0,drift,0)), z=V((col-1.5)*0.21, COLY(row), 0);
      const q=DIS[b].q.clone().slerp(Q0,u), snap=Math.max(0,Math.sin(Math.PI*clamp((t-TB[b]-0.4)/0.3)));
      return { p:a.lerp(z,u).add(V(0,0,snap*0.12)), q, s:V(0.19,0.13,0.12), g:b===2?0.85:(0.08+0.5*snap), c:(b===1||b===4)&&col===0?1:0 }; }); },
  durate(t){ return R.map((r,i)=>{ let b=-1, j=i; for(let k=0;k<3;k++){ const n=BL[k]*2; if(j<n){ b=k; break; } j-=n; } if(b<0) return NASC();
      const x=j%BL[b], y=Math.floor(j/BL[b]); const w=E.spring(clamp((t-2.75-b*0.25-x*0.03)/SP));
      return { p:V(-1.3+x*0.2+0.1, BY[b]+(y-0.5)*0.16, 0), q:Q0.clone(), s:V(0.18*Math.max(0.05,w),0.14,0.12), g:b===2?0.75:0.12+0.1*b, c:(x===0)?1:0 }; }); },
  pausa(t){ const o=E.inout(clamp((t-5.45)/0.6));
    return R.map((r,i)=>{ const x=i%8, y=Math.floor(i/8); const mid=(y===3||y===4); const dy=y<3?-0.2*o:(y>4?0.2*o:0);
      return { p:V((x-3.5)*0.25, C.y-0.35+(y-3.5)*0.19+dy, 0), q:Q0.clone(), s:mid?V(0.22,0.17*(1-o)+0.004,0.13):V(0.22,0.17,0.13), g:mid?0.9:0.45+0.2*Math.sin(t*2+x*0.4), c:(x===0||x===7)&&!mid?1:0 }; }); },
  pacchetto(t){ const m=E.inout(clamp((t-8.25)/0.65)), pop=Math.max(0,Math.sin(Math.PI*clamp((t-8.8)/0.35)));
    return R.map((r,i)=>{ const z=V((i%8-3.5)*0.22, C.y-0.35+(Math.floor(i/8)-3.5)*0.19, pop*0.15);
      if(i>=60) return { p:z, q:Q0.clone(), s:V(0.2,0.17,0.13).multiplyScalar(Math.max(0.01,m)), g:0.9, c:0 };
      const b=Math.floor(i/20), j=i%20; const a=V(BX[b]+(j%4-1.5)*0.2, C.y-0.35+(Math.floor(j/4)-2)*0.2+0.05*Math.sin(t*1.6+b), 0);
      return { p:a.lerp(z,m), q:qe(0,0,(1-m)*0.08*(b-1)), s:V(0.18+0.02*m,0.16+0.01*m,0.13), g:0.15+0.75*m+(1-m)*(j<4?0.5:0), c:(1-m)>0.5&&j<4?1:0 }; }); },
  agenda(t){ return R.map((r,i)=>{ const d=Math.floor(i/16), row=i%16, b=blocco(d,row), lungo=GIORNI[d][b]>=5;
      const w=E.spring(clamp((t-10.1-row*0.04-d*0.07)/SP));
      return { p:V((d-1.5)*0.55, C.y-1.2+row*0.15+(1-w)*0.9, 0), q:Q0.clone(), s:V(0.46,0.13,0.12), g:lungo?0.8:(b%2?0.12:0.25), c:(b===1&&d%2===0)||(b===3&&d%2===1)?1:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['incastro','durate',2.3,0.75],['durate','pausa',4.95,0.6],['pausa','pacchetto',7.35,0.7],['pacchetto','agenda',9.75,0.7],['agenda','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.3,0.9,10.4), V(0,-0.75,0), 3],
 [2.3,  V(-0.4,0.6,9.8),  V(0,-0.75,0), 0],
 [2.9,  V(1.2,0.7,10.4),  V(0,-0.8,0), -2],
 [4.9,  V(0.6,0.5,10.0),  V(0,-0.8,0), -1],
 [5.4,  V(-1.2,0.3,9.4),  V(0,-0.8,0), 3],
 [7.3,  V(-0.6,0.4,9.2),  V(0,-0.8,0), 1],
 [7.9,  V(1.3,1.0,10.0),  V(0,-0.8,0), -2],
 [9.6,  V(0.6,0.8,9.6),   V(0,-0.8,0), -1],
 [10.2, V(-1.4,1.2,10.8), V(0,-0.75,0), 2],
 [11.8, V(-0.5,1.0,11.4), V(0,-0.75,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const on=E.spring(clamp((t-0.65)/SP)), off=E.exit(clamp((t-2.2)/0.25)); lTre.position.set(0.95, COLY(START[2]+3), 0.5); face(lTre); lTre.rotateZ(-0.04); show(lTre,on*(1-off)); }
  lServ.forEach((l,b)=>{ const on=E.spring(clamp((t-3.0-b*0.25)/SP)), off=E.exit(clamp((t-4.8)/0.25)); const w=l.geometry.parameters.width;
    l.position.set(-1.2+w/2, BY[b]+0.33, 0.3); face(l); show(l,on*(1-off)); });
  { const o=E.inout(clamp((t-5.5)/0.6)), off=E.exit(clamp((t-7.2)/0.3)); gap.position.set(0, C.y-0.35, 0); gap.scale.set(1, Math.max(0.001,o), 1); gap.material.opacity=o*(1-off); gap.visible=o*(1-off)>0.01; }
  { const on=E.spring(clamp((t-5.95)/SP)), off=E.exit(clamp((t-7.2)/0.25)); lPausa.position.set(0, C.y-0.35, 0.45); face(lPausa); show(lPausa,on*(1-off)); }
  { const on=E.spring(clamp((t-8.95)/SP)), off=E.exit(clamp((t-9.7)/0.25)); lPac.position.set(0, C.y+0.6, 0.6); face(lPac); lPac.rotateZ(0.03); show(lPac,on*(1-off)); }
  lGiorni.forEach((l,d)=>{ const on=E.spring(clamp((t-10.3-d*0.08)/SP)), off=E.exit(clamp((t-12.0)/0.25)); l.position.set((d-1.5)*0.55, C.y-1.42, 0.3); face(l); show(l,on*(1-off)); });
  camAt(t); tilesAt(t, F, TR, 'incastro'); draw();
}
