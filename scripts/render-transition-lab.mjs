import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root=process.cwd();
const outDir=path.join(root,'artifacts','transition-lab');
fs.mkdirSync(outDir,{recursive:true});
const routes=new Map([['/','index.html'],['/work/','work.html']]);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.svg':'image/svg+xml'};
function fileFor(raw){const u=new URL(raw,'http://127.0.0.1');let rel=routes.get(u.pathname)||decodeURIComponent(u.pathname).replace(/^\/+/, '');const abs=path.resolve(root,rel||'index.html');return abs.startsWith(root+path.sep)||abs===root?abs:null;}
const server=http.createServer((req,res)=>{const file=fileFor(req.url||'/');if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'content-type':types[path.extname(file).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(file).pipe(res);});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(4174,'127.0.0.1',resolve);});
const base='http://127.0.0.1:4174';
const browser=await chromium.launch({headless:true});
const report={generatedAt:new Date().toISOString(),variants:{}};

async function bars(page){return page.evaluate(()=>{const r=(el)=>{const x=el?.getBoundingClientRect();return x?{x:x.x,y:x.y,width:x.width,height:x.height}:null;};return {top:r(document.querySelector('.filmbar.top')),bottom:r(document.querySelector('.filmbar.bottom')),labCut:document.querySelector('.lab-cut')?.className||null,body:document.body.className,href:location.href};});}
async function shot(page,name){await page.screenshot({path:path.join(outDir,name+'.png')});}

for(const variant of ['a','b','c']){
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  const page=await context.newPage();
  await page.goto(`${base}/?cut=${variant}`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(700);
  const before=await bars(page);
  await shot(page,`${variant}-00-before`);
  const started=Date.now();
  await page.locator('#hotWork').click({noWaitAfter:true});

  const preTimes=variant==='a'?[70,180,320]:variant==='b'?[45,105]:[45,90];
  let elapsed=0;
  for(let i=0;i<preTimes.length;i++){
    const delta=Math.max(0,preTimes[i]-elapsed); await page.waitForTimeout(delta); elapsed=preTimes[i];
    if(/\/work\//.test(new URL(page.url()).pathname)) break;
    await shot(page,`${variant}-0${i+1}-departure-${preTimes[i]}ms`);
  }
  await page.waitForURL(/\/work\//,{timeout:4000,waitUntil:'domcontentloaded'});
  const navMs=Date.now()-started;
  await page.waitForTimeout(45);
  const early=await bars(page); await shot(page,`${variant}-10-arrival-45ms`);
  await page.waitForTimeout(145); await shot(page,`${variant}-11-arrival-190ms`);
  await page.waitForTimeout(430);
  const settled=await bars(page); await shot(page,`${variant}-12-settled`);
  report.variants[variant]={navMs,before,early,settled,railsFixed:Boolean(before.top&&early.top&&settled.top&&before.top.y===early.top.y&&early.top.y===settled.top.y&&before.bottom.y===early.bottom.y&&early.bottom.y===settled.bottom.y)};
  await context.close();
}
fs.writeFileSync(path.join(outDir,'transition-report.json'),JSON.stringify(report,null,2));
await browser.close();
await new Promise(resolve=>server.close(resolve));
console.log(JSON.stringify(report,null,2));
