const { chromium } = require('playwright'); const path=require('path');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1350}});
 p.on('pageerror',e=>console.log('pageerror',e.message));
 await p.goto('file://'+path.resolve(process.argv[2])); await p.evaluate(()=>window.__ready);
 for(const v of ['a','b']){ await p.evaluate(v=>build(v),v); await p.waitForTimeout(100);
   const bb=await p.evaluate(()=>{ return [...document.querySelectorAll('text, g')].map(e=>{const r=e.getBBox(); return (e.textContent||'word')+':'+[r.x,r.y,r.width,r.height].map(Math.round).join(',');}); });
   console.log(v,bb.join(' | '));
   await p.screenshot({path:path.join(path.dirname(process.argv[2]),'emblem-'+v+'.png')}); }
 await b.close(); })();
