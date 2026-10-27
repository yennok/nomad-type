const { chromium } = require('playwright'); const path=require('path');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1350}});
 await p.goto('file://'+path.resolve(process.argv[2])); await p.evaluate(()=>window.__ready);
 for(const v of ['a','b']){ await p.evaluate(v=>{window.DIAG=true; build(v);},v); await p.waitForTimeout(100);
   await p.screenshot({path:path.join(path.dirname(process.argv[2]),'emblem-'+v+'-diag.png')}); }
 await b.close(); })();
