// node render2.js <board.html> <film> <story|post> <outdir> [preview]
// Writes f0000.png... (1080x1920 for story, 1080x1350 for post). With "preview", one frame per beat.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
(async () => {
  const [board, film, fmt, outdir, preview] = process.argv.slice(2);
  const H = fmt === 'post' ? 1350 : 1920;
  fs.mkdirSync(outdir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: H }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log('pageerror', e.message));
  await page.goto('file://' + path.resolve(board));
  await page.evaluate(() => window.__ready);
  await page.evaluate(f => window.__renderMode(f), fmt);
  const total = await page.evaluate(f => window.__film(f), film);
  const frames = Math.round(total * 30);
  const list = preview ? [...Array(Math.ceil(total / 0.6)).keys()].map(b => Math.round((b * 0.6 + 0.3) * 30)) : [...Array(frames).keys()];
  for (const f of list) {
    await page.evaluate(f => window.__frame(f), f);
    await page.screenshot({ path: path.join(outdir, `f${String(f).padStart(4, '0')}.png`), clip: { x: 0, y: 0, width: 1080, height: H } });
  }
  await browser.close();
  console.log(film, fmt, 'total', total, 'frames', list.length);
})();
