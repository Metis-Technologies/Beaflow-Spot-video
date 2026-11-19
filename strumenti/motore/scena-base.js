// SCENA DELLO SPOT — unico file da scrivere per la parte 3D. Il resto (motore, testi, chiusura) arriva da strumenti/motore/modello.html.
// Qui dentro sono già disponibili:
//   THREE, RoundedBoxGeometry, scene, cam, SCURO, N (64 tessere), C (centro della scena), GY (quota del pavimento), R (numeri casuali fissi per tessera)
//   V(x,y,z), qe(x,y,z), clamp, E.{enter,exit,inout,morph,spring,soft}, SP, SO, canvasTex(w,h,fn), LATE (funzioni da lanciare a font pronti)
//   PUNTO e ALONE (formazioni della chiusura), CLOSE_CK (camera della chiusura), makeCam, tilesAt, commonFrame, draw
// Da definire qui: F (formazioni delle tessere), TR (trasformazioni), camAt (camera), render3d(t).
// Regole: tutto è funzione di t (niente tempo reale, niente Math.random); cambi scena a 2,5 · 5 · 7,5 · 10 · 12,5;
// oggetti importanti sotto i titoli e dentro le zone sicure; un solo protagonista per scena.

document.fonts.load('600 40px Inter','€');
// etichetta piatta rivolta alla camera (es. prezzo, orario): label('testo', larghezza, altezza, fondo, colore testo)
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const lOk = label('Esempio', 1.2, 0.34);

// Formazioni: ogni funzione restituisce, per ognuna delle N tessere, { p: posizione, q: rotazione, s: scala, g: luce 0–1, c: 0 chiaro / 1 scuro }
const F = {
  // scena 1 · il problema: tessere sparse in disordine
  caos(t){ return R.map((r,i)=>({ p:V((r[0]-.5)*4.2, C.y+(r[1]-.5)*3.0+0.08*Math.sin(t*1.2+i), (r[2]-.5)*2.4), q:qe(r[3]*6+t*0.3, r[4]*6, r[5]*6), s:V(0.22,0.22,0.22), g:(i%5===0)?0.9:0.05, c:(i%3===0)?1:0 })); },
  // scena 2 · la soluzione: griglia ordinata 8×8
  griglia(t){ return R.map((r,i)=>{ const x=i%8, y=Math.floor(i/8); const w=Math.max(0,Math.sin(Math.PI*clamp((t-2.7-(x+y)*0.04)/0.45)));
      return { p:V((x-3.5)*0.32, C.y-0.3+(3.5-y)*0.32, w*0.25), q:new THREE.Quaternion(), s:V(0.28,0.28,0.1), g:0.2+w*0.8, c:0 }; }); },
  // scena 3 · colonne di altezza diversa
  colonne(t){ return R.map((r,i)=>{ const col=i%8, k=Math.floor(i/8), h=3+((col*5)%6); const on=k<h;
      return { p:V((col-3.5)*0.36, C.y-1.2+k*0.2, 0), q:new THREE.Quaternion(), s:on?V(0.3,0.17,0.3):V(0.02,0.02,0.02), g:(on&&k===h-1)?0.9:0.1, c:0 }; }); },
  // scena 4 · anello che ruota
  anello(t){ return R.map((r,i)=>{ const a=i/N*Math.PI*2+t*0.5; return { p:V(Math.cos(a)*1.25, C.y-0.35+Math.sin(a)*1.25, 0), q:qe(0,0,a), s:V(0.3,0.1,0.14), g:(i%4===0)?0.9:0.15, c:(i%4===2)?1:0 }; }); },
  // scena 5 · pannello compatto
  pannello(t){ return R.map((r,i)=>{ const x=i%8, y=Math.floor(i/8); return { p:V((x-3.5)*0.26, C.y+(3.5-y)*0.2, 0), q:new THREE.Quaternion(), s:V(0.24,0.18,0.08), g:y===0?0.8:0.1, c:0 }; }); },
  punto:PUNTO, alone:ALONE,       // chiusura comune: non cambiare
};
// Trasformazioni: [da, a, inizio, durata]. A cavallo del cambio scena; le ultime due sono la chiusura comune.
const TR = [['caos','griglia',2.3,0.8],['griglia','colonne',4.95,0.6],['colonne','anello',7.4,0.7],['anello','pannello',9.75,0.8],['pannello','punto',12.1,0.7],['punto','alone',12.86,0.9]];

// Camera: [tempo, posizione, punto guardato, rollio in gradi]. Mai ferma; lenta mentre si legge, veloce sui cambi scena.
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
  // oggetti extra: entrano a molla e spariscono prima del cambio scena
  { const on=E.spring(clamp((t-3.0)/SP)), off=E.exit(clamp((t-4.85)/0.25)); lOk.position.set(0, C.y+1.25, 0.6); face(lOk); show(lOk,on*(1-off)); }
  camAt(t); tilesAt(t, F, TR, 'caos'); draw();
}
