const { chromium } = require('playwright'); const path=require('path');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1350}});
p.on('pageerror',e=>console.log('pageerror',e.message));
await p.goto('file://'+path.join(__dirname,'two.html')); await p.evaluate(()=>window.__ready);
const n=await p.evaluate(()=>window.__slide(0));
for(let i=0;i<n;i++){ await p.evaluate(i=>window.__slide(i),i); await p.waitForTimeout(80); await p.screenshot({path:path.join(__dirname,`two-${i+1}.png`),clip:{x:0,y:0,width:1080,height:1350}}); }
await b.close(); console.log('slides',n); })();
