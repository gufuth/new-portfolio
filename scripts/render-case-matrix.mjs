import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root=process.cwd();
const outDir=path.join(root,'artifacts','case-matrix');
fs.mkdirSync(outDir,{recursive:true});
const routes=new Map([
  ['/work/nike-sb-panda-pigeon/','cases/nike.html'],
  ['/work/virgin-galactic-unity-22/','cases/virgin.html'],
  ['/work/porsche-lucasfilm-designer-alliance/','cases/porsche.html'],
  ['/work/selsun-blue-dan-driff/','cases/selsun.html'],
  ['/work/moneylion-beast-games/','cases/moneylion.html'],
  ['/work/alita-te-connectivity/','cases/alita.html'],
  ['/work/jose-cuervo/','cases/cuervo.html'],
  ['/work/outdoor-voices/','cases/outdoor-voices.html'],
  ['/work/the-atlantic/','cases/atlantic.html'],
]);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.svg':'image/svg+xml'};
function fileFor(raw){const u=new URL(raw,'http://127.0.0.1');let rel=routes.get(u.pathname)||decodeURIComponent(u.pathname).replace(/^\/+/, '');const abs=path.resolve(root,rel||'index.html');return abs.startsWith(root+path.sep)||abs===root?abs:null;}
const server=http.createServer((req,res)=>{const file=fileFor(req.url||'/');if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'content-type':types[path.extname(file).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(file).pipe(res);});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(4176,'127.0.0.1',resolve);});
const base='http://127.0.0.1:4176';
const browser=await chromium.launch({headless:true});
const cases=[
  ['01-nike','/work/nike-sb-panda-pigeon/'],
  ['02-virgin','/work/virgin-galactic-unity-22/'],
  ['03-porsche','/work/porsche-lucasfilm-designer-alliance/'],
  ['04-selsun','/work/selsun-blue-dan-driff/'],
  ['05-moneylion','/work/moneylion-beast-games/'],
  ['06-alita','/work/alita-te-connectivity/'],
  ['07-cuervo','/work/jose-cuervo/'],
  ['08-outdoor-voices','/work/outdoor-voices/'],
  ['09-atlantic','/work/the-atlantic/'],
];
const viewports=[
  ['desktop',1440,900],
  ['phone-390',390,844],
  ['phone-430',430,932],
];
const report=[];
for(const [name,url] of cases){
  for(const [label,width,height] of viewports){
    const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference'});
    const page=await context.newPage();
    const broken=[];
    page.on('response',r=>{if(r.status()>=400&&/\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(r.url())) broken.push({status:r.status(),url:r.url()});});
    await page.goto(base+url,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForTimeout(1600);
    await page.evaluate(async()=>{
      const step=Math.max(innerHeight,600);
      for(let y=0;y<document.documentElement.scrollHeight;y+=step){
        scrollTo(0,y);
        await new Promise(resolve=>setTimeout(resolve,80));
      }
      scrollTo(0,0);
    });
    await page.waitForTimeout(500);
    const info=await page.evaluate(()=>{
      const hero=document.querySelector('.hero-media img');
      const images=[...document.images];
      const rect=element=>{if(!element)return null;const r=element.getBoundingClientRect();return {top:r.top,right:r.right,bottom:r.bottom,left:r.left,width:r.width,height:r.height};};
      const topBar=document.querySelector('.filmbar.top');
      const bottomBar=document.querySelector('.filmbar.bottom');
      const h1=document.querySelector('h1');
      const role=document.querySelector('.role');
      const facts=document.querySelector('.hero-facts');
      const railTargets=[...document.querySelectorAll('.filmbar.bottom .rail a')].map(link=>({text:link.textContent.trim(),...rect(link)}));
      const caseTargets=[...document.querySelectorAll('.case-nav a')].map(link=>({text:link.textContent.trim(),...rect(link)}));
      /* Rail anchors intentionally use an oversized invisible target/pseudo-element;
         scrollWidth therefore exceeds clientWidth even when the label is intact. */
      const clippedText=[...document.querySelectorAll('h1,.role,.hero-fact,.block p,.proof-item,.case-nav a')]
        .filter(element=>element.scrollWidth>element.clientWidth+1)
        .map(element=>element.textContent.trim().slice(0,80));
      return {
        h1:document.querySelector('h1')?.textContent?.trim()||'',
        role:document.querySelector('.role')?.textContent?.trim()||'',
        idea:document.querySelector('.hero-fact b')?.textContent?.trim()||'',
        topBar:Boolean(topBar),
        bottomBar:Boolean(bottomBar),
        topBarRect:rect(topBar),
        bottomBarRect:rect(bottomBar),
        paper:Boolean(document.querySelector('.paper')),
        scrollWidth:document.documentElement.scrollWidth,
        viewportWidth:innerWidth,
        visualViewportWidth:window.visualViewport?.width||innerWidth,
        heroColumns:getComputedStyle(document.querySelector('.case-hero')).gridTemplateColumns,
        firstViewport:{h1:rect(h1),role:rect(role),facts:rect(facts)},
        railTargets,
        caseTargets,
        clippedText,
        heroMedia:hero?.currentSrc||'',
        heroLoaded:Boolean(hero?.complete&&hero.naturalWidth>0&&hero.naturalHeight>0),
        failedImages:images.filter(image=>image.complete&&image.naturalWidth===0).map(image=>image.currentSrc||image.src),
      };
    });
    await page.screenshot({path:path.join(outDir,`${name}-${label}.png`)});
    if(label==='desktop') await page.screenshot({path:path.join(outDir,`${name}-desktop-full.png`),fullPage:true});
    if(label==='phone-390') await page.screenshot({path:path.join(outDir,`${name}-phone-390-full.png`),fullPage:true});
    report.push({name,label,url,...info,broken});
    await context.close();
  }
}
fs.writeFileSync(path.join(outDir,'case-matrix-report.json'),JSON.stringify(report,null,2));
await browser.close();
await new Promise(resolve=>server.close(resolve));
const failures=report.filter(r=>{
  const phone=r.label.startsWith('phone-');
  const railsInViewport=r.topBarRect?.top>=-1&&r.topBarRect?.right<=r.viewportWidth+1&&r.bottomBarRect?.left>=-1&&r.bottomBarRect?.right<=r.viewportWidth+1;
  const targetHeights=[...r.railTargets,...r.caseTargets].every(target=>target.height>=43);
  const firstScreen=phone&&r.firstViewport.h1&&r.firstViewport.role&&r.firstViewport.facts
    ? r.firstViewport.h1.top<r.firstViewport.role.top&&r.firstViewport.role.top<r.firstViewport.facts.top&&r.firstViewport.facts.top<844
    : true;
  const singleColumn=phone?/\d+(?:\.\d+)?px/.test(r.heroColumns)&&r.heroColumns.trim().split(/\s+/).length===1:true;
  return !r.topBar||!r.bottomBar||!r.paper||!r.heroLoaded||r.failedImages.length||r.scrollWidth>r.viewportWidth+1||r.broken.length||!railsInViewport||!targetHeights||!firstScreen||!singleColumn||r.clippedText.length;
});
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exit(1);}
console.log(`Rendered ${report.length} case/viewport pairs at desktop, 390px and 430px; no structural, image, clipping, rail or phone-width failures.`);
