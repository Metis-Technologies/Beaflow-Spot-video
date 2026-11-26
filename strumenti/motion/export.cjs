const { chromium } = require('playwright');
(async () => {
  const [file, out, fps='30'] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('PAGEERROR', e.message));
  await p.goto('file://' + file + '?clean=1');
  await p.waitForFunction('window.OPENER && window.OPENER.ready', { timeout: 30000 });
  require('fs').mkdirSync(out, { recursive: true });
  const D = await p.evaluate(() => OPENER.DURATION), F = Number(fps), n = Math.round(D * F);
  for (let i = 0; i < n; i++) {
    const t = i / F;
    await p.evaluate(async t => { OPENER.seek(t); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); OPENER.seek(t); }, t);
    await p.screenshot({ path: `${out}/f${String(i).padStart(5, '0')}.png` });
  }
  await b.close(); console.log('frames', n);
})();
