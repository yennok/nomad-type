const { chromium } = require('playwright'); const path=require('path');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1350}});
p.on('pageerror',e=>console.log('pageerror',e.message));
await p.goto('file://'+path.join(__dirname,'scene.html')); await p.evaluate(()=>window.__ready);
for(let n=0;n<6;n++){ await p.evaluate(n=>window.__slide(n),n); await p.waitForTimeout(100); await p.screenshot({path:path.join(__dirname,`slide-${n+1}.png`),clip:{x:0,y:0,width:1080,height:1350}}); }
await b.close(); })();
