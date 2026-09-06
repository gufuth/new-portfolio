import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root=process.cwd();
const outDir=path.join(root,'artifacts','ambient-lab');
fs.mkdirSync(outDir,{recursive:true});
const routes=new Map([['/work/','work.html'],['/work/more/','more-work.html']]);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif'};
function fileFor(raw){const u=new URL(raw,'http://127.0.0.1');let rel=routes.get(u.pathname)||decodeURIComponent(u.pathname).replace(/^\/+/, '');const abs=path.resolve(root,rel);return abs.startsWith(root+path.sep)?abs:null;}
const server=http.createServer((req,res)=>{const file=fileFor(req.url||'/');if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'content-type':types[path.extname(file).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(file).pipe(res);});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(4175,'127.0.0.1',resolve);});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
const page=await context.newPage();
const base='http://127.0.0.1:4175';

async function shot(name){await page.screenshot({path:path.join(outDir,name+'.png')});}
async function reset(){await page.evaluate(()=>{document.querySelector('.tour-road-life')?.classList.remove('is-passing');document.querySelector('.lab-electrical-life')?.classList.remove('is-catching');});}

await page.goto(base+'/work/?tourTest=road&detailTest=1',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(1700);
await shot('work-00-rest');

// Force the same production animation, then sample it at visually useful phases.
await page.evaluate(()=>{const el=document.querySelector('.tour-road-life');el?.classList.remove('is-passing');void el?.offsetWidth;el?.classList.add('is-passing');});
await page.waitForTimeout(650); await shot('work-01-road-early');
await page.waitForTimeout(1100); await shot('work-02-road-peak');
await page.waitForTimeout(1050); await shot('work-03-road-late');
await reset();

await page.evaluate(()=>{let el=document.querySelector('.lab-electrical-life');if(!el){el=document.createElement('span');el.className='lab-electrical-life';el.setAttribute('aria-hidden','true');document.querySelector('.scene-stage')?.appendChild(el);}el.classList.remove('is-catching');void el.offsetWidth;el.classList.add('is-catching');});
await page.waitForTimeout(85); await shot('work-04-electrical-first');
await page.waitForTimeout(95); await shot('work-05-electrical-dip');
await page.waitForTimeout(105); await shot('work-06-electrical-recover');
await reset();

await page.goto(base+'/work/more/?tourTest=road&detailTest=1',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(1700);
await shot('more-00-rest');
await page.evaluate(()=>{const el=document.querySelector('.tour-road-life');el?.classList.remove('is-passing');void el?.offsetWidth;el?.classList.add('is-passing');});
await page.waitForTimeout(1750); await shot('more-01-road-peak');
await reset();
await page.evaluate(()=>{let el=document.querySelector('.lab-electrical-life');if(!el){el=document.createElement('span');el.className='lab-electrical-life';el.setAttribute('aria-hidden','true');document.querySelector('.scene-stage')?.appendChild(el);}el.classList.remove('is-catching');void el.offsetWidth;el.classList.add('is-catching');});
await page.waitForTimeout(85); await shot('more-02-electrical');

fs.writeFileSync(path.join(outDir,'README.txt'),'Ambient visual QA. Production cadence remains rare; these frames force the existing event classes only for comparison.\n');
await context.close();
await browser.close();
await new Promise(resolve=>server.close(resolve));
