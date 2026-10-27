const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
(async()=>{ const out=path.join(__dirname,'reel'); fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out);
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('pageerror',e.message));
await p.goto('file://'+path.join(__dirname,'reel.html')); await p.evaluate(()=>window.__ready);
const n=Math.round(await p.evaluate(()=>window.__vidTotal())*30);
for(let f=0;f<n;f++){ await p.evaluate(f=>window.__vidFrame(f),f); await p.screenshot({path:path.join(out,'f'+String(f).padStart(4,'0')+'.png'),clip:{x:0,y:0,width:1080,height:1920}}); }
await b.close(); console.log('frames',n); })();
