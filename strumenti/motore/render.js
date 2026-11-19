// Render comune a tutti gli spot Premium 3D. Di solito si lancia da strumenti/spot.py.
//   node strumenti/motore/render.js <cartella-spot> stills 0.5 3.9 ...     fotogrammi in sorgente/frames/
//   node strumenti/motore/render.js <cartella-spot> segments [s1 s3 ...]   una clip per scena in sorgente/out/
//   node strumenti/motore/render.js <cartella-spot> join                   sorgente/muto.mp4
//   node strumenti/motore/render.js <cartella-spot> zone                   testi dentro le zone sicure? (JSON)
// La pagina è <spot>/sorgente/index.html, servita via http. Three.js e font arrivano da strumenti/motore/node_modules,
// i loghi da comune/logo: nella cartella dello spot non serve installare né copiare nulla.
// Variabili: TEMA=chiaro|scuro · CHROME=/percorso/di/chrome · PARALLELI=n (scene rese insieme, default 2)
const { spawn, execFileSync, execSync } = require('child_process');
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');

const MOTORE = __dirname, REPO = path.resolve(MOTORE, '..', '..');
const FPS = 30;
const SEG = [['s1',0,2.5],['s2',2.5,5],['s3',5,7.5],['s4',7.5,10],['s5',10,12.5],['s6',12.5,15]];
const ENC = ['-c:v','libx264','-crf','17','-preset','medium','-pix_fmt','yuv420p','-profile:v','high','-r',String(FPS)];
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.json':'application/json' };
const SICURA = { sx: 80, dx: 960, alto: 250, basso: 1540 };           // 1080×1920 meno 80 / 120 / 250 / 380 px

function playwright() {
  const prove = ['playwright', path.join(MOTORE, 'node_modules', 'playwright')];
  try { prove.push(path.join(execSync('npm root -g', { stdio: ['ignore','pipe','ignore'] }).toString().trim(), 'playwright')); } catch {}
  prove.push('/opt/npm-tools/node_modules/playwright', '/usr/local/lib/node_modules/playwright');
  for (const p of prove) { try { return require(p); } catch {} }
  console.error('Playwright non trovato: lanciare  bash strumenti/prepara.sh'); process.exit(1);
}
function chrome() {
  if (process.env.CHROME) return process.env.CHROME;
  for (const p of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) if (fs.existsSync(p)) return p;
  return undefined;                                                    // il Chromium scaricato da Playwright
}

function serve(root) {
  const cerca = url => {
    const rel = decodeURIComponent(url.split('?')[0]).replace(/^\/+/, '');
    const prove = [path.join(root, rel)];
    if (rel.startsWith('node_modules/')) prove.push(path.join(MOTORE, rel));
    if (/^logo-(positivo|negativo)\.svg$/.test(rel)) prove.push(path.join(REPO, 'comune', 'logo', rel));
    return prove.find(f => (f.startsWith(root) || f.startsWith(MOTORE) || f.startsWith(path.join(REPO, 'comune'))) && fs.existsSync(f) && !fs.statSync(f).isDirectory());
  };
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const f = cerca(req.url);
      if (!f) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(rsp);
    }).listen(0, () => res(srv));
  });
}

(async () => {
  const [spot, mode, ...rest] = process.argv.slice(2);
  if (!spot || !mode) { console.error('uso: node render.js <cartella-spot> stills|segments|join|zone ...'); process.exit(1); }
  const root = path.resolve(spot, 'sorgente');
  if (!fs.existsSync(path.join(root, 'index.html'))) { console.error(`manca ${root}/index.html: lanciare prima  python3 strumenti/spot.py costruisci`); process.exit(1); }
  const out = path.join(root, 'out'), frames = path.join(root, 'frames');

  if (mode === 'join') {
    const mancanti = SEG.filter(s => !fs.existsSync(path.join(out, s[0] + '.mp4'))).map(s => s[0]);
    if (mancanti.length) { console.error('scene non ancora rese:', mancanti.join(' ')); process.exit(1); }
    fs.writeFileSync(path.join(out, 'list.txt'), SEG.map(s => `file '${s[0]}.mp4'\n`).join(''));
    execFileSync('ffmpeg', ['-y','-loglevel','error','-f','concat','-safe','0','-i',path.join(out,'list.txt'),'-c','copy','-movflags','+faststart',path.join(out,'join.tmp.mp4')]);
    fs.renameSync(path.join(out, 'join.tmp.mp4'), path.join(root, 'muto.mp4')); console.log('ok muto.mp4'); return;
  }

  // più scene insieme: un processo (e un browser) per gruppo di scene
  const N = Math.max(1, Math.min(+(process.env.PARALLELI || 2), os.cpus().length));
  if (mode === 'segments' && !process.env.RENDER_FIGLIO && N > 1) {
    const nomi = rest.length ? rest : SEG.map(s => s[0]);
    const gruppi = Array.from({ length: Math.min(N, nomi.length) }, () => []);
    nomi.forEach((n, i) => gruppi[i % gruppi.length].push(n));
    const t0 = Date.now();
    const codici = await Promise.all(gruppi.map(g => new Promise(r =>
      spawn(process.execPath, [__filename, spot, 'segments', ...g], { stdio: 'inherit', env: { ...process.env, RENDER_FIGLIO: '1' } }).on('close', r))));
    if (codici.some(c => c !== 0)) process.exit(1);
    console.log(`render: ${nomi.length} scene in ${((Date.now() - t0) / 1000).toFixed(0)} s (${gruppi.length} insieme)`); return;
  }

  const srv = await serve(root);
  const { chromium } = playwright();
  const b = await chromium.launch({ executablePath: chrome(), args: ['--force-color-profile=srgb','--font-render-hinting=none','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errori = [];
  p.on('pageerror', e => { errori.push(e.message); console.error('pagina:', e.message); });
  p.on('requestfailed', r => { errori.push('non caricato: ' + r.url()); console.error('non caricato:', r.url()); });
  p.on('response', r => { if (r.status() >= 400) { errori.push(`${r.status()} ${r.url()}`); console.error(r.status(), r.url()); } });
  await p.goto(`http://localhost:${srv.address().port}/index.html?tema=${process.env.TEMA || 'chiaro'}`); await p.evaluate('window.ready');
  if (errori.length) { console.error('La pagina ha errori: render interrotto.'); process.exit(1); }

  if (mode === 'stills') {
    fs.mkdirSync(frames, { recursive: true });
    for (const t of rest) { await p.evaluate(t => seek(t), +t); await p.screenshot({ path: path.join(frames, `s_${(+t).toFixed(2).padStart(5,'0')}.jpg`), type: 'jpeg', quality: 80 }); }
  } else if (mode === 'zone') {
    // a metà lettura di ogni scena: ogni testo visibile deve stare nelle zone sicure e non andare a capo da solo
    const tempi = [1.6, 3.9, 6.4, 8.9, 11.4, 14.6], problemi = [];
    for (const t of tempi) {
      await p.evaluate(t => seek(t), t);
      problemi.push(...await p.evaluate(([t, Z]) => {
        const out = [];
        for (const el of document.querySelectorAll('.ui, img.logo')) {
          const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity < 0.5) continue;
          const parti = el.querySelectorAll('.w').length ? [...el.querySelectorAll('.w')].filter(w => +getComputedStyle(w).opacity > 0.5) : [el];
          if (!parti.length) continue;
          const r = parti.map(x => x.getBoundingClientRect()).reduce((a, b) => ({ left: Math.min(a.left, b.left), right: Math.max(a.right, b.right), top: Math.min(a.top, b.top), bottom: Math.max(a.bottom, b.bottom) }));
          const nome = '#' + el.id, fuori = [];
          if (r.left < Z.sx - 1) fuori.push(`sinistra ${Math.round(r.left)} < ${Z.sx}`);
          if (r.right > Z.dx + 1) fuori.push(`destra ${Math.round(r.right)} > ${Z.dx}`);
          if (r.top < Z.alto - 1) fuori.push(`alto ${Math.round(r.top)} < ${Z.alto}`);
          if (r.bottom > Z.basso + 1) fuori.push(`basso ${Math.round(r.bottom)} > ${Z.basso}`);
          if (fuori.length) out.push({ t, elemento: nome, problema: 'fuori dalle zone sicure: ' + fuori.join(', ') });
          for (const blocco of el.matches('.tt') ? [el] : el.querySelectorAll('#t1, #t1b')) {
            const previste = blocco.querySelectorAll('br').length + 1;
            const reali = new Set([...blocco.querySelectorAll('.w')].map(w => Math.round(w.getBoundingClientRect().top))).size;
            if (reali > previste) out.push({ t, elemento: '#' + blocco.id, problema: `va a capo da solo: ${reali} righe invece di ${previste} (riga troppo lunga)` });
          }
        }
        return out;
      }, [t, SICURA]));
    }
    console.log(JSON.stringify({ tempi, problemi }));
  } else if (mode === 'segments') {
    fs.mkdirSync(out, { recursive: true });
    for (const [name, a, z] of SEG) {
      if (rest.length && !rest.includes(name)) continue;
      const n = Math.round((z - a) * FPS), t0 = Date.now();
      const ff = spawn('ffmpeg', ['-y','-loglevel','error','-f','image2pipe','-c:v','mjpeg','-framerate',String(FPS),'-i','-',...ENC,path.join(out, `${name}.tmp.mp4`)], { stdio: ['pipe','inherit','inherit'] });
      for (let i = 0; i < n; i++) { await p.evaluate(t => seek(t), a + i / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
      ff.stdin.end(); const code = await new Promise(r => ff.on('close', r)); if (code !== 0) process.exit(1);
      fs.renameSync(path.join(out, `${name}.tmp.mp4`), path.join(out, `${name}.mp4`)); console.log(name, n, 'frames', ((Date.now() - t0) / 1000).toFixed(1) + 's');
    }
  } else { console.error('modo sconosciuto:', mode); process.exit(1); }
  await b.close(); srv.close();
})();
