// settimana di tessere, buono promo, aeroplanini verso le case
const DAYS = 7, H = 9, FILL0 = [5,1,2,6,7,8,3];
const colX = d => (d-3)*0.42, rowY = k => C.y-1.0+k*0.235;
const VOU = V(0, C.y+0.35, 0.4);
const vou = new THREE.Group(); scene.add(vou);
const vBody = new THREE.Mesh(new RoundedBoxGeometry(2.3,1.25,0.08,4,0.08), new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.45})); vBody.castShadow=true; vou.add(vBody);
const vFace = new THREE.Mesh(new THREE.PlaneGeometry(2.22,1.17), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); vFace.position.z=0.042; vou.add(vFace);
LATE.push(()=>{ vFace.material.map=canvasTex(888,468,(g,w,h)=>{ g.fillStyle='#FFFFFF'; g.fillRect(0,0,w,h);
  g.fillStyle='#C9B16C'; g.fillRect(0,0,150,h); g.fillStyle='#FFFFFF'; for(let y=18;y<h;y+=44){ g.beginPath(); g.arc(150,y,9,0,Math.PI*2); g.fill(); }
  g.save(); g.translate(75,h/2); g.rotate(-Math.PI/2); g.fillStyle='#FFFFFF'; g.font='800 46px Inter'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('PROMO',0,2); g.restore();
  g.textBaseline='middle'; g.fillStyle='#775A18'; g.font='700 36px Inter'; g.fillText('PROMO DEL MARTEDÌ',200,86);
  g.fillStyle='#111111'; g.font='800 170px Inter'; g.fillText('−20%',194,226);
  g.fillStyle='#5F5F5F'; g.font='600 38px Inter'; g.fillText('su tutti i servizi',200,370); }); vFace.material.needsUpdate=true; });
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
const lPub = label('Pubblica', 1.1, 0.34, '#111111');
const lPren = label('+12 prenotazioni', 1.6, 0.36);
const dayRow = new THREE.Mesh(new THREE.PlaneGeometry(3.0,0.25), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(dayRow);
LATE.push(()=>{ dayRow.material.map=canvasTex(1440,120,(g,w,h)=>{ g.font='700 56px Inter'; g.textAlign='center'; g.textBaseline='middle';
  ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'].forEach((d,k)=>{ g.fillStyle=(k===1||k===2)?'#FF5A4F':'#5F5F5F'; g.fillText(d, w/2+(k-3)*0.42/3.0*w, h/2); }); }); dayRow.material.needsUpdate=true; });
// case
const HN=8, ORD=[3,4,2,5,1,6,0,7];
const housePos = j => { const a=-1.0+j/(HN-1)*2.0; return V(Math.sin(a)*1.95, C.y-0.85, -0.5-Math.cos(a)*1.5); };
const HS=1.1;
const arrive = j => 7.55 + ORD.indexOf(j)*0.12 + 1.0;
// aeroplanini
const pg=new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0,0,0.5, -0.36,0.02,-0.3, 0,-0.12,-0.3,  0,0,0.5, 0,-0.12,-0.3, 0.36,0.02,-0.3]),3)); pg.computeVertexNormals();
const pmatP=new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.5, side:THREE.DoubleSide});
const planes=[...Array(HN)].map(()=>{ const m=new THREE.Mesh(pg,pmatP); m.castShadow=true; scene.add(m); return m; });
const planeAt=(j,u)=>{ const E2=housePos(j).add(V(0,1.0,0)); return VOU.clone().lerp(E2,u).add(V(0,Math.sin(Math.PI*u)*1.1,Math.sin(Math.PI*u)*0.6)); };

const F = {
  settimana(t){ return R.map((r,i)=>{ const d=Math.floor(i/H), k=i%H; if(d>=DAYS) return { p:C.clone(), q:new THREE.Quaternion(), s:V(0.001,0.001,0.001), g:0, c:0 };
      const on=k<FILL0[d], low=FILL0[d]<=2, pulse=0.5+0.5*Math.sin(t*6);
      return { p:V(colX(d), rowY(k), 0), q:new THREE.Quaternion(), s:on?V(0.34,0.19,0.2):V(0.3,0.04,0.04), g:on&&low?0.5+0.4*pulse:0.02, c:on&&!low&&(k%2)?1:0 }; }); },
  scintille(t){ return R.map((r,i)=>{ const a=i/N*Math.PI*2 + t*0.7;
      return { p:V(Math.cos(a)*1.75, VOU.y+Math.sin(a)*1.15, VOU.z-0.6-r[0]*0.3), q:qe(t*2+i,r[1]*3,a), s:V(0.12,0.12,0.12), g:(i%3===0)?1:0.3, c:(i%4===1)?1:0 }; }); },
  onde(t){ return R.map((r,i)=>{ const ring=i%3, a=Math.floor(i/3)/Math.ceil(N/3)*Math.PI*2 + ring*0.3;
      let w=0; for(const tp of [5.5,6.4]){ const d=t-tp; if(d>0) w=Math.max(w, Math.exp(-d*3)*Math.sin(Math.min(d*8,Math.PI))); }
      const rad=0.95+ring*0.42 + w*0.35*(ring+1);
      return { p:V(Math.cos(a)*rad*1.25, VOU.y-0.05+Math.sin(a)*rad*0.85, VOU.z-0.45), q:qe(0,0,a), s:V(0.1,0.1,0.1).multiplyScalar(1+w), g:0.3+w*1.2, c:(ring===1)?1:0 }; }); },
  case(t){ return R.map((r,i)=>{ const j=Math.floor(i/8), k=i%8, b=housePos(j); const lit=E.enter(clamp((t-arrive(j))/0.3));
      let p, q=new THREE.Quaternion(), s=V(0.22,0.22,0.22); const o=(x,y,z)=>V(x*HS,y*HS,z*HS);
      if(k<4){ p=b.clone().add(o(k%2?0.12:-0.12, Math.floor(k/2)*0.24, 0)); }
      else if(k<6){ const sd=k===4?-1:1; p=b.clone().add(o(sd*0.13,0.44,0)); q=qe(0,0,-sd*0.7); s=V(0.36,0.07,0.26); }
      else if(k===6){ p=b.clone().add(o(0,0.56,0)); s=V(0.08,0.08,0.26); }
      else { p=b.clone().add(o(0,0.0,0.12)); s=V(0.09,0.14,0.02); }
      s.multiplyScalar(HS);
      return { p, q, s, g:k===7?0.3+lit*0.8:lit*0.85, c:(k<4 && !lit)?((k+j)%2):0 }; }); },
  piena(t){ return R.map((r,i)=>{ const d=Math.floor(i/H), k=i%H; if(d>=DAYS) return { p:C.clone(), q:new THREE.Quaternion(), s:V(0.001,0.001,0.001), g:0, c:0 };
      const neu=k>=FILL0[d]; const w=Math.max(0,Math.sin(Math.PI*clamp((t-10.3-d*0.08-k*0.03)/0.4)));
      return { p:V(colX(d), rowY(k), 0), q:new THREE.Quaternion(), s:V(0.34,0.19,0.2).multiplyScalar(1+w*0.15), g:neu?0.85:0.02+w*0.4, c:(!neu&&(k%2))?1:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['settimana','scintille',2.3,0.8],['scintille','onde',4.95,0.6],['onde','case',7.35,0.8],['case','piena',9.75,0.8],['piena','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.8,0.8,10.8),  V(0,-1.0,0), 3],
 [2.3,  V(-0.8,0.6,10.2),  V(0,-1.0,0), 0],
 [2.9,  V(1.6,0.9,9.8),   V(0,-0.5,0), -3],
 [4.9,  V(0.6,0.7,9.2),   V(0,-0.5,0), -1],
 [5.4,  V(-0.8,0.4,8.4),  V(0,-0.6,0), 1],
 [7.3,  V(0,0.5,8.8),     V(0,-0.6,0), 0],
 [7.9,  V(0,2.3,11.2),    V(0,-0.9,-1.2), 0],
 [9.6,  V(0.8,2.0,10.4),  V(0,-0.9,-1.2), -2],
 [10.2, V(-1.2,0.6,11.4),  V(0,-1.2,0), 2],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  { const inn=E.soft(clamp((t-2.35)/SO)), off=E.exit(clamp((t-7.35)/0.25)); const spin=1-E.enter(clamp((t-2.35)/0.6));
    let tap=0; for(const tp of [5.5,6.4]){ const d=t-tp; if(d>-0.08&&d<0.4) tap=Math.max(tap, d<0?(d+0.08)/0.08:Math.exp(-d*10)); }
    const s=Math.max(0.0001,inn*(1-off)*(1-0.05*tap)); vou.scale.setScalar(s); vou.visible=s>0.001;
    vou.position.copy(VOU).add(V(0,0.05*Math.sin(t*1.2),0)); vou.rotation.set(0.05*Math.sin(t*0.8), -spin*Math.PI*1.5+0.1*Math.sin(t*0.6), 0.03*Math.sin(t*0.7)+off*0.6); }
  { const on=E.spring(clamp((t-5.1)/SP)), off=E.exit(clamp((t-7.25)/0.25));
    let tap=0; for(const tp of [5.5,6.4]){ const d=t-tp; if(d>-0.08&&d<0.4) tap=Math.max(tap, d<0?(d+0.08)/0.08:Math.exp(-d*10)); }
    lPub.position.copy(VOU).add(V(0.55,-0.9,0.45)); face(lPub); const s=Math.max(0.0001,on*(1-off)*(1-0.12*tap)); lPub.scale.setScalar(s); lPub.visible=s>0.002; }
  { const vis=(1-E.exit(clamp((t-2.2)/0.3))) + E.enter(clamp((t-10.0)/0.4))*(1-E.exit(clamp((t-12.0)/0.3)));
    dayRow.position.set(0, rowY(0)-0.38, 0.2); dayRow.quaternion.identity(); const s=Math.max(0.0001,vis); dayRow.scale.setScalar(s); dayRow.visible=s>0.002; }
  { const on=E.spring(clamp((t-10.6)/SP)), off=E.exit(clamp((t-12.0)/0.3));
    lPren.position.set(0.75, rowY(H-1)+0.42, 0.5); face(lPren); lPren.rotateZ(-0.04); const s=Math.max(0.0001,on*(1-off)); lPren.scale.setScalar(s); lPren.visible=s>0.002; }
  planes.forEach((m,j)=>{ const t0=7.55+ORD.indexOf(j)*0.12, u=E.inout(clamp((t-t0)/1.0));
    const vis = t>t0 && u<1 ? Math.min(1,(t-t0)/0.12)*(1-clamp((u-0.9)/0.1)) : 0;
    m.visible=vis>0.01; if(!m.visible) return; m.position.copy(planeAt(j,u)); m.lookAt(planeAt(j,Math.min(1,u+0.02))); m.scale.setScalar(0.55*vis); });
  camAt(t); tilesAt(t, F, TR, 'settimana'); draw();
}
