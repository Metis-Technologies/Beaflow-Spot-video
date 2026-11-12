// node render.js stills 0.5 3.9 ...   |   node render.js segments [nome ...]   |   node render.js join
const { chromium } = require('/usr/local/lib/node_modules/playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const FPS = 30;
const SEG = [['s1',0,2],['s2',2,4.5],['s3',4.5,7],['s4',7,10],['s5',10,13],['s6',13,15]];
const ENC = ['-c:v','libx264','-crf','17','-preset','medium','-pix_fmt','yuv420p','-profile:v','high','-r',String(FPS)];
(async () => {
  const [mode, ...rest] = process.argv.slice(2);
  if (mode === 'join') {
    fs.writeFileSync('out/list.txt', SEG.map(s => `file '${s[0]}.mp4'\n`).join(''));
    execFileSync('ffmpeg', ['-y','-loglevel','error','-f','concat','-safe','0','-i','out/list.txt','-c','copy','-movflags','+faststart','out/join.tmp.mp4']);
    fs.renameSync('out/join.tmp.mp4', 'muto.mp4'); console.log('ok muto.mp4'); return;
  }
  const b = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + __dirname + '/index.html'); await p.evaluate('window.ready');
  if (mode === 'stills') {
    for (const t of rest) { await p.evaluate(t => seek(t), +t); await p.screenshot({ path: `frames/s_${(+t).toFixed(2).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 80 }); }
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
  await b.close();
})();
