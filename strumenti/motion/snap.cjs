const { chromium } = require('playwright');
(async () => {
  const [file, out, ...times] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('PAGEERROR', e.message));
  p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await p.goto('file://' + file + '?clean=1');
  await p.waitForFunction('window.OPENER && window.OPENER.ready', { timeout: 30000 });
  require('fs').mkdirSync(out, { recursive: true });
  for (const ts of times) {
    const t = Number(ts);
    await p.evaluate(async t => { OPENER.seek(t); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); OPENER.seek(t); }, t);
    await p.screenshot({ path: `${out}/t${t.toFixed(2)}.png` });
  }
  await b.close();
})();
