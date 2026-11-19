// folla di clienti → grafico ad anello (ritorno / nuovi) → barre in crescita
const D = V(0, C.y-0.3, 0), RAD = 1.1, NG = 44;   // 44/64 ≈ 68% di ritorno
function label(txt, pw, ph, bg='#775A18', fg='#FFFFFF', fs=0.4){ const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(m);
  LATE.push(()=>{ m.material.map=canvasTex(Math.round(pw*400),Math.round(ph*400),(g,w,h)=>{ if(bg){ g.fillStyle=bg; g.beginPath(); g.roundRect(0,0,w,h,h*0.2); g.fill(); }
    g.fillStyle=fg; g.font=`700 ${Math.round(h*fs)}px Inter`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+3); }); m.material.needsUpdate=true; }); return m; }
function bigTex(num, sub, col){ return canvasTex(800,440,(g,w,h)=>{ g.textAlign='center'; g.textBaseline='middle';
  g.fillStyle=col; g.font='800 230px Inter'; g.fillText(num,w/2,170); g.fillStyle='#5F5F5F'; g.font='700 64px Inter'; g.fillText(sub,w/2,350); }); }
const center = new THREE.Mesh(new THREE.PlaneGeometry(1.3,0.715), new THREE.MeshBasicMaterial({transparent:true, toneMapped:false})); scene.add(center);
const CT={};
LATE.push(()=>{ CT.a=bigTex('68%','tornano','#111111'); CT.b=bigTex('68%','di ritorno','#775A18'); CT.c=bigTex('32%','nuovi','#111111'); center.material.map=CT.a; center.material.needsUpdate=true; });
const qm = label('?', 0.62, 0.62, '#FF5A4F', '#FFFFFF', 0.75);
const lUp = label('+12% di ritorni', 1.6, 0.36);
const BH=[3,4,5,6,7,9];
const barOf = i => { let k=i; for(let b=0;b<BH.length;b++){ if(k<BH[b]) return [b,k]; k-=BH[b]; } return null; };

const F = {
  folla(t){ return R.map((r,i)=>{ const x=(r[0]-0.5)*4.4+Math.sin(t*0.6+i)*0.12, z=-2.2+r[1]*3.0;
      const red = (i%7===0); const pulse=0.5+0.5*Math.sin(t*5+i);
      return { p:V(x, C.y-0.9+r[2]*2.0+Math.sin(t*1.3+i*0.7)*0.06, z), q:qe(r[3]*6+t*0.5,r[4]*6,0), s:V(0.2,0.2,0.2), g:red?0.4+0.5*pulse:0.03, c:(i%3===1)?1:0 }; }); },
  torta(t){ const sweep=clamp((t-2.65)/1.1), h3=E.inout(clamp((t-5.05)/0.4))*(1-E.inout(clamp((t-7.45)/0.4))), h4=E.inout(clamp((t-7.55)/0.4));
    const rot=0.12*Math.sin(t*0.5);
    return R.map((r,i)=>{ const a=Math.PI/2 - (i+0.5)/N*Math.PI*2 + rot, gold=i<NG, rev=(i+0.5)/N<sweep;
      const pop = gold ? h3 : h4; const w=Math.max(0,Math.sin(Math.PI*clamp((t-(gold?5.1:7.6)-(gold?i:(i-NG))*0.012)/0.35)));
      const rr = RAD + pop*0.24 + w*0.08;
      return { p:V(Math.cos(a)*rr, D.y+Math.sin(a)*rr, D.z+pop*0.3), q:qe(0,0,a), s:V(0.3,0.095,0.22).multiplyScalar(1+0.15*w),
        g: !rev?0.02 : gold ? (0.55 + 0.45*h3 - 0.4*h4) : (0.02 + 0.5*h4), c: rev&&!gold ? 1 : 0 }; }); },
  barre(t){ return R.map((r,i)=>{ const bk=barOf(i); if(!bk) return { p:D.clone(), q:new THREE.Quaternion(), s:V(0.001,0.001,0.001), g:0, c:0 };
      const [b,k]=bk; const on=E.enter(clamp((t-10.05-b*0.09-k*0.025)/0.3)); const last=b===BH.length-1;
      return { p:V((b-2.5)*0.5, C.y-1.15+k*0.24, 0), q:new THREE.Quaternion(), s:V(0.38,0.2,0.26).multiplyScalar(Math.max(0.001,on)), g:last?0.9:(b===4?0.4:0.03), c:(!last&&b!==4&&(k%2))?1:0 }; }); },
  punto:PUNTO, alone:ALONE,
};
const TR = [['folla','torta',2.3,0.8],['torta','barre',9.75,0.8],['barre','punto',12.1,0.7],['punto','alone',12.86,0.9]];

const camAt = makeCam([
 [0.0,  V(-1.6,1.2,10.4), V(0,-0.7,-0.4), 3],
 [2.3,  V(-0.6,1.0,9.8),  V(0,-0.7,-0.4), 0],
 [2.9,  V(1.4,0.6,10.4),  V(0,-1.0,0), -3],
 [4.9,  V(0.4,0.4,9.8),   V(0,-1.0,0), -1],
 [5.4,  V(-1.2,0.7,9.6),  V(0,-1.0,0), 3],
 [7.3,  V(-0.8,0.5,9.4),  V(0,-1.0,0), 1],
 [7.9,  V(1.2,0.4,9.8),   V(0,-1.0,0), -3],
 [9.6,  V(0.8,0.5,9.6),   V(0,-1.0,0), -1],
 [10.2, V(-1.2,0.8,10.0), V(0,-0.9,0), 2],
 ...CLOSE_CK,
]);

function render3d(t){
  commonFrame(t);
  const face = m => m.quaternion.copy(cam.quaternion);
  { const on=E.spring(clamp((t-0.5)/SP)), off=E.exit(clamp((t-2.2)/0.25));
    qm.position.set(0.9, C.y+1.0+0.06*Math.sin(t*2), 0.6); face(qm); qm.rotateZ(0.1*Math.sin(t*1.5)); const s=Math.max(0.0001,on*(1-off)); qm.scale.setScalar(s); qm.visible=s>0.002; }
  { const on=E.soft(clamp((t-3.3)/SO)), off=E.exit(clamp((t-9.7)/0.3));
    const want = t<5.1 ? CT.a : t<7.6 ? CT.b : CT.c; if(want && center.material.map!==want){ center.material.map=want; center.material.needsUpdate=true; }
    let b=0; for(const tp of [5.1,7.6]){ const d=t-tp; if(d>0&&d<0.5) b=Math.max(b,Math.exp(-d*9)); }
    center.position.copy(D).add(V(0,0,0.15)); face(center); const s=Math.max(0.0001,on*(1-off)*(1+0.12*b)); center.scale.setScalar(s); center.visible=s>0.002; }
  { const on=E.spring(clamp((t-10.7)/SP)), off=E.exit(clamp((t-12.0)/0.3));
    lUp.position.set(0.55, C.y-1.15+8*0.24+0.42, 0.4); face(lUp); lUp.rotateZ(-0.04); const s=Math.max(0.0001,on*(1-off)); lUp.scale.setScalar(s); lUp.visible=s>0.002; }
  camAt(t); tilesAt(t, F, TR, 'folla'); draw();
}
