// node render.js stills 0.5 3.9 ...   |   node render.js segments [nome ...]   |   node render.js join
// Scena 3D (Three.js): la pagina va servita via http (i moduli ES non si caricano da file://). WebGL software (SwiftShader).
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const http = require('http'), fs = require('fs'), path = require('path');
const FPS = 30;
const SEG = [['s1',0,2.5],['s2',2.5,5],['s3',5,7.5],['s4',7.5,10],['s5',10,12.5],['s6',12.5,15]];
const ENC = ['-c:v','libx264','-crf','17','-preset','medium','-pix_fmt','yuv420p','-profile:v','high','-r',String(FPS)];
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.json':'application/json' };
const CHROME = process.env.CHROME || undefined;

function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const f = path.join(__dirname, decodeURIComponent(req.url.split('?')[0]));
      if (!f.startsWith(__dirname) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(rsp);
    }).listen(0, () => res(srv));
  });
}

(async () => {
  const [mode, ...rest] = process.argv.slice(2);
  if (mode === 'join') {
    fs.writeFileSync('out/list.txt', SEG.map(s => `file '${s[0]}.mp4'\n`).join(''));
    execFileSync('ffmpeg', ['-y','-loglevel','error','-f','concat','-safe','0','-i','out/list.txt','-c','copy','-movflags','+faststart','out/join.tmp.mp4']);
    fs.renameSync('out/join.tmp.mp4', 'muto.mp4'); console.log('ok muto.mp4'); return;
  }
  const srv = await serve();
  const b = await chromium.launch({ executablePath: CHROME, args: ['--force-color-profile=srgb','--font-render-hinting=none','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('pagina:', e.message));
  await p.goto(`http://localhost:${srv.address().port}/index.html?tema=${process.env.TEMA||'chiaro'}`); await p.evaluate('window.ready');
  if (mode === 'stills') {
    fs.mkdirSync('frames', { recursive: true });
    for (const t of rest) { await p.evaluate(t => seek(t), +t); await p.screenshot({ path: `frames/s_${(+t).toFixed(2).padStart(5,'0')}.jpg`, type: 'jpeg', quality: 80 }); }
  } else {
    fs.mkdirSync('out', { recursive: true });
    for (const [name, a, z] of SEG) {
      if (rest.length && !rest.includes(name)) continue;
      const n = Math.round((z - a) * FPS), t0 = Date.now();
      const ff = spawn('ffmpeg', ['-y','-loglevel','error','-f','image2pipe','-c:v','mjpeg','-framerate',String(FPS),'-i','-',...ENC,`out/${name}.tmp.mp4`], { stdio: ['pipe','inherit','inherit'] });
      for (let i = 0; i < n; i++) { await p.evaluate(t => seek(t), a + i / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
      ff.stdin.end(); const code = await new Promise(r => ff.on('close', r)); if (code !== 0) process.exit(1);
      fs.renameSync(`out/${name}.tmp.mp4`, `out/${name}.mp4`); console.log(name, n, 'frames', ((Date.now() - t0) / 1000).toFixed(1) + 's');
    }
  }
  await b.close(); srv.close();
})();
