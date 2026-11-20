// 43 · Le tue ore di punta (ossatura C, report Pro): mappa di calore già in rilievo con il picco oro di sabato alle 11 → la mappa torna piatta e si solleva giorno per giorno → classifica dei servizi più richiesti → tessere-persona che si posano sulle montagne → la mappa diventa un'agenda piena
document.fonts.load('600 40px Inter','€');
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const D = (typeof SPOT!=='undefined' && SPOT.dati) || {};
const Q0 = new THREE.Quaternion();
const NASC = () => ({ p:C.clone(), q:Q0.clone(), s:V(0.001,0.001,0.001), g:0, c:0 });

// mappa di calore: 6 giorni (righe, Lun→Sab verso la camera) × 10 ore; tessere 60–63 non usate
const FLOOR = C.y-0.95, HX = h => (h-4.5)*0.24, DZ = d => (d-2.5)*0.32;
const G = (x,s) => Math.exp(-x*x/s);
const calore = (d,h) => 0.06+1.05*G(h-2,2)*G(d-5,1.4)+0.7*G(h-7,2.5)*G(d-4,2)+0.35*G(h-5,3)*G(d-1,2);
const PICCO = [5,2];
function mappa(t, amp, wave){ return R.map((r,i)=>{ if(i>=60) return NASC(); const d=Math.floor(i/10), h=i%10; const a=typeof amp==='function'?amp(d,h):amp;
    const H=Math.max(0.03, calore(d,h)*a); const hot=calore(d,h);
    return { p:V(HX(h), FLOOR+H/2, DZ(d)), q:Q0.clone(), s:V(0.21,H,0.27), g:Math.min(0.95,0.04+0.9*hot)+(wave?0.06*Math.sin(t*2+h*0.5):0), c:0 }; }); }
const lPicco = label(D.picco || 'Sab · 11:00', 1.15, 0.32);
const lOre = label(D.ore || 'Ore di Punta', 1.3, 0.3, '#111111');
// classifica dei servizi più richiesti
const RANK = D.servizi || ['Taglio','Manicure','Massaggio'], RL = [10,8,6], RY = [C.y+0.15, C.y-0.5, C.y-1.15];
const lRank = RANK.map((s,k)=>label(`${k+1} · ${s}`, 1.3, 0.28, k===0?'#775A18':'#111111', '#FFFFFF', 0.5));
// tessere-persona: testa e corpo oro, si posano sui picchi
const persone = [[5,2],[4,7],[1,5]].map(([d,h],k)=>{ const g=new THREE.Group(); const m=new THREE.MeshStandardMaterial({color:0xC9B16C, emissive:0x775A18, emissiveIntensity:0.35, metalness:0.6, roughness:0.3});
  const testa=new THREE.Mesh(new THREE.SphereGeometry(0.09,24,16), m); testa.position.y=0.27; const corpo=new THREE.Mesh(new THREE.CapsuleGeometry(0.09,0.12,6,16), m); corpo.position.y=0.09;
  testa.castShadow=corpo.castShadow=true; g.add(testa,corpo); scene.add(g); return {g,d,h,k}; });

const F = {
  rilievo(t){ return mappa(t, 1, true); },
  solleva(t){ return mappa(t, (d,h)=>0.05+0.95*E.spring(clamp((t-2.85-d*0.18-h*0.02)/0.5)), false); },
  classifica(t){ return R.map((r,i)=>{ let k=-1, j=i; for(let b=0;b<3;b++){ const n=RL[b]*2; if(j<n){ k=b; break; } j-=n; } if(k<0) return NASC();
      const x=j%RL[k], y=Math.floor(j/RL[k]); const w=E.spring(clamp((t-5.25-k*0.2-x*0.03)/SP));
      return { p:V(-1.05+x*0.21, RY[k]+(y-0.5)*0.17, 0), q:Q0.clone(), s:V(0.19*Math.max(0.05,w),0.15,0.14), g:k===0?0.85:0.15, c:0 }; }); },
  montagne(t){ return mappa(t, 1, true); },
  agenda(t){ return R.map((r,i)=>{ if(i>=60) return NASC(); const d=Math.floor(i/10), h=i%10; const w=E.spring(clamp((t-10.15-h*0.04-d*0.05)/SP));
      return { p:V((d-2.5)*0.36, C.y+0.4-h*0.17+(1-w)*0.5, 0), q:Q0.clone(), s:V(0.32,0.14,0.1).multiplyScalar(Math.max(0.05,w)), g:(calore(d,h)>0.45)?0.85:0.25, c:(h===0)?1:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['rilievo','solleva',2.3,0.5,{arco:0}],['solleva','classifica',4.95,0.6],['classifica','montagne',7.35,0.7],['montagne','agenda',9.75,0.7],['agenda','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.6,2.6,8.8),  V(0,-1.05,0), 4],
 [2.3,  V(-0.6,2.2,8.6),  V(0,-1.05,0), 0],
 [2.9,  V(1.0,1.2,9.6),   V(0,-1.0,0), -2],
 [4.9,  V(0.4,2.0,9.0),   V(0,-1.0,0), -1],
 [5.4,  V(-1.1,0.6,9.2),  V(0,-0.75,0), 3],
 [7.3,  V(-0.5,0.5,9.0),  V(0,-0.75,0), 1],
 [7.9,  V(1.4,2.4,8.6),   V(0,-1.0,0), -3],
 [9.6,  V(0.4,2.1,8.4),   V(0,-1.0,0), -1],
 [10.2, V(-1.3,0.8,10.0), V(0,-0.75,0), 2],
 [11.8, V(-0.5,0.7,9.6),  V(0,-0.75,0), 0],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  const show = (m,on,s0=1) => { const s=Math.max(0.0001,on*s0); m.scale.setScalar(s); m.visible=s>0.002; };
  { const on1=E.spring(clamp((t-0.5)/SP))*(1-E.exit(clamp((t-2.2)/0.25))), on4=E.spring(clamp((t-9.0)/SP))*(1-E.exit(clamp((t-9.65)/0.2)));
    const [d,h]=PICCO; lPicco.position.set(HX(h), FLOOR+calore(d,h)+0.32, DZ(d)+0.2); face(lPicco); lPicco.rotateZ(0.03); show(lPicco, Math.max(on1,on4)); }
  { const on=E.spring(clamp((t-3.3)/SP)), off=E.exit(clamp((t-4.85)/0.25)); lOre.position.set(-0.6, FLOOR-0.3, DZ(5)+0.4); face(lOre); show(lOre,on*(1-off)); }
  lRank.forEach((l,k)=>{ const on=E.spring(clamp((t-5.4-k*0.2)/SP)), off=E.exit(clamp((t-7.25)/0.25)); l.position.set(-1.05+0.55, RY[k]+0.27, 0.3); face(l); show(l,on*(1-off)); });
  persone.forEach(({g,d,h,k})=>{ const f=E.inout(clamp((t-8.0-k*0.25)/0.55)), off=E.exit(clamp((t-9.7)/0.25)); const top=V(HX(h), FLOOR+calore(d,h), DZ(d));
    g.position.copy(top).add(V(0, 1.4*(1-f), 0)); g.rotation.y=t*0.8+k; show(g, (f>0?1:0)*(1-off)*Math.max(0.3,f)); });
  camAt(t); tilesAt(t, F, TR, 'rilievo'); draw();
}
