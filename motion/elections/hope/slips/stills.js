// node stills.js <board.html> <outdir> : the hope slips as static 4:5 stills, every word on every ground
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const [board, outdir] = process.argv.slice(2); fs.mkdirSync(outdir, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('pageerror', e.message));
  await p.goto('file://' + path.resolve(board)); await p.evaluate(() => window.__ready);
  await p.evaluate(() => { window.__renderMode('post'); window.__film('trayHope'); window.__frame(0); });
  const WORDS = [['ת','תקווה','he'],['ا','أمل','ar'],['ש','שלום','he'],['س','سلام','ar'],['ח','חיים','he'],['ح','حياة','ar'],['י','ישראל','he'],['ف','فلسطين','ar']];
  const GROUNDS = ['blue','red','yellow','grey'];
  for (const g of GROUNDS) for (let i = 0; i < WORDS.length; i++) {
    const [l, w, lang] = WORDS[i];
    await p.evaluate(([l, w, lang, g, i]) => {
      stage.innerHTML = '';
      if (g === 'grey') groundGrey(i); else ground({ blue: BLU, red: RED, yellow: YEL }[g]);
      if (lang === 'he') slip(260, BAND_T + 300, 560, 720, l, w, 300, 'ext', 'reg'); else slip(260, BAND_T + 300, 560, 720, l, w, 300, 'arR', 'arR');
    }, [l, w, lang, g, i]);
    await p.screenshot({ path: path.join(outdir, `${g}-${i + 1}.png`), clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  }
  await b.close(); console.log('stills done');
})();
