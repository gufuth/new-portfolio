import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
const root=process.cwd();
const out=path.join(root,'artifacts','porsche-proof-preview');
fs.mkdirSync(out,{recursive:true});
const routes=new Map([['/work/porsche-proof-preview/','cases/porsche-proof-preview.html']]);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
function resolveFile(raw){const u=new URL(raw,'http://127.0.0.1');const rel=routes.get(u.pathname)||decodeURIComponent(u.pathname).replace(/^\/+/, '');const abs=path.resolve(root,rel||'index.html');return abs.startsWith(root+path.sep)?abs:null;}
const server=http.createServer((req,res)=>{const f=resolveFile(req.url||'/');if(!f||!fs.existsSync(f)){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(f).pipe(res);});
await new Promise((ok,bad)=>{server.once('error',bad);server.listen(4187,'127.0.0.1',ok)});
const browser=await chromium.launch({headless:true});
try{for(const [name,w,h] of [['desktop',1440,900],['laptop',1366,768],['mobile',390,844]]){const ctx=await browser.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();const bad=[];p.on('response',r=>{if(r.status()>=400)bad.push({status:r.status(),url:r.url()})});await p.goto('http://127.0.0.1:4187/work/porsche-proof-preview/',{waitUntil:'networkidle'});await p.screenshot({path:path.join(out,`porsche-proof-${name}.png`),fullPage:name==='desktop'});const state=await p.evaluate(()=>({w:innerWidth,sw:document.documentElement.scrollWidth,verify:document.body.innerText.includes('VERIFY'),signals:document.querySelectorAll('.hero-signal').length,honors:!!document.querySelector('.honors-strip'),evidence:!!document.querySelector('.evidence-frame img')}));if(state.sw>state.w+1)throw new Error(`overflow ${name}: ${JSON.stringify(state)}`);if(!state.verify||state.signals!==2||!state.honors||!state.evidence)throw new Error(`preview structure ${name}: ${JSON.stringify(state)}`);if(bad.length)throw new Error(`broken responses ${name}: ${JSON.stringify(bad)}`);await ctx.close();}console.log('Porsche proof preview passed.');}finally{await browser.close();await new Promise(ok=>server.close(ok));}
