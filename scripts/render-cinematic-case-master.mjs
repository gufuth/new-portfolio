import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
const root=process.cwd(),out=path.join(root,'artifacts','cinematic-case-master');fs.mkdirSync(out,{recursive:true});
const routes=new Map([['/','index.html'],['/work/','work.html'],['/work/more/','more-work.html'],['/work/nike-sb-panda-pigeon/','cases/nike.html'],['/work/porsche-lucasfilm-designer-alliance/','cases/porsche.html'],['/work/jose-cuervo/','cases/cuervo.html'],['/work/scooba-love/','cases/scooba.html']]);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.svg':'image/svg+xml','.ico':'image/x-icon'};
function fileFor(raw){const u=new URL(raw,'http://127.0.0.1');let rel=routes.get(u.pathname)||decodeURIComponent(u.pathname).replace(/^\/+/, '');const abs=path.resolve(root,rel||'index.html');return abs.startsWith(root+path.sep)||abs===root?abs:null;}
const server=http.createServer((req,res)=>{const f=fileFor(req.url||'/');if(!f||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'content-type':types[path.extname(f).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(f).pipe(res);});
await new Promise((ok,bad)=>{server.once('error',bad);server.listen(4182,'127.0.0.1',ok)});const base='http://127.0.0.1:4182';
const browser=await chromium.launch({headless:true});const report={assertions:[],pages:{},broken:[]};
function assert(name,pass,detail=''){report.assertions.push({name,pass,detail});if(!pass)throw new Error(`${name}: ${detail}`)}
async function pageShot(name,url,w,h,full=false,reduced='no-preference'){
 const c=await browser.newContext({viewport:{width:w,height:h},reducedMotion:reduced});const p=await c.newPage();const broken=[];
 p.on('response',r=>{if(r.status()>=400&&/\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(r.url()))broken.push({status:r.status(),url:r.url()})});
 await p.goto(base+url,{waitUntil:'domcontentloaded'});await p.waitForTimeout(850);
 const info=await p.evaluate(()=>{const vis=e=>!!(e&&e.getClientRects().length&&getComputedStyle(e).display!=='none');const rect=e=>{if(!e)return null;let r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right}};return {
   scrollWidth:document.documentElement.scrollWidth,width:innerWidth,
   billboards:[...document.querySelectorAll('.billboard')].filter(vis).map(rect),
   mobileCards:[...document.querySelectorAll('.mobile-list .mobile-card')].filter(vis).length,
   nextBay:vis(document.querySelector('.next-bay')),
   hero:rect(document.querySelector('.depth-hero,.case-hero')),
   h1:rect(document.querySelector('h1')),
   role:rect(document.querySelector('.depth-role,.role')),
   fastRead:rect(document.querySelector('.depth-fast-read,.case-brief,.case-scan')),
   heroMedia:rect(document.querySelector('.depth-hero-media,.hero-media')),
   depthProof:rect(document.querySelector('.depth-proof')),
   cannes:rect(document.querySelector('.cannes-mark')),
   internalQuestions:rect(document.querySelector('.internal-questions')),
   bodyClass:document.body.className,
   paperBg:document.querySelector('.paper')?getComputedStyle(document.querySelector('.paper')).backgroundColor:'',
   publicLastStop:/last stop/i.test(document.title+' '+document.body.innerText),
   failed:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src)
 };});
 report.pages[name]=info;report.broken.push(...broken);await p.screenshot({path:path.join(out,`${name}.png`),fullPage:full});await c.close();return info;
}
try{
 const landing=await pageShot('landing-1440','/',1440,900);
 const w1440=await pageShot('work-1440','/work/',1440,900);const w1366=await pageShot('work-1366','/work/',1366,768);const w1024=await pageShot('work-1024','/work/',1024,768);
 const more=await pageShot('more-1440','/work/more/',1440,900);const more390=await pageShot('more-390','/work/more/',390,844);
 assert('Public portfolio no longer names Last Stop on landing/work/more',![landing,w1440,more].some(x=>x.publicLastStop));
 assert('Work keeps five physical destinations',w1440.billboards.length===5,String(w1440.billboards.length));
 assert('Work physical faces remain recruiter-readable at 1440',w1440.billboards[0]?.width>260,String(w1440.billboards[0]?.width));
 assert('Work cue is visible',w1440.nextBay);
 assert('Work has no overflow',[w1440,w1366,w1024].every(x=>x.scrollWidth<=x.width+1));
 assert('More Work keeps five physical destinations',more.billboards.length===5,String(more.billboards.length));
 const firstFour=more.billboards.slice(0,4).map(x=>x.width);const mean=firstFour.reduce((a,b)=>a+b,0)/firstFour.length;const fifth=more.billboards[4]?.width||0;
 assert('SCOOBA click geometry is equal-weight',fifth>=mean*.92&&fifth<=mean*1.08,JSON.stringify({firstFour,mean,fifth}));
 assert('SCOOBA is fifth mobile case',more390.mobileCards===5,String(more390.mobileCards));

 const cases=[
   ['porsche','/work/porsche-lucasfilm-designer-alliance/','case-feature'],
   ['cuervo','/work/jose-cuervo/','case-feature'],
   ['nike','/work/nike-sb-panda-pigeon/','case-standard'],
   ['scooba','/work/scooba-love/','case-internal']
 ];
 for(const [slug,url,depth] of cases){for(const [lab,w,h] of [['desktop',1440,900],['390',390,844],['430',430,932]]){
   let x=await pageShot(`${slug}-${lab}`,url,w,h,lab==='desktop');
   assert(`${slug} uses three-depth case system ${lab}`,x.bodyClass.includes('case-depth')&&x.bodyClass.includes(depth),x.bodyClass);
   assert(`${slug} dark cinematic surface ${lab}`,x.paperBg==='rgba(0, 0, 0, 0)'||x.paperBg==='rgb(7, 7, 6)',x.paperBg);
   assert(`${slug} no overflow ${lab}`,x.scrollWidth<=x.width+1,String(x.scrollWidth));
   assert(`${slug} fast orientation ${lab}`,!!x.h1&&!!x.role&&!!x.fastRead&&!!x.heroMedia,JSON.stringify({h1:x.h1,role:x.role,fastRead:x.fastRead,heroMedia:x.heroMedia}));
   assert(`${slug} no public Last Stop naming ${lab}`,!x.publicLastStop);
 }}
 const pCheck=report.pages['porsche-desktop'];assert('Porsche carries restrained Cannes evidence mark',!!pCheck.cannes,JSON.stringify(pCheck.cannes));
 const sCheck=report.pages['scooba-desktop'];assert('SCOOBA remains sparse with framework as evidence',!!sCheck.internalQuestions&&!sCheck.depthProof,JSON.stringify({internalQuestions:sCheck.internalQuestions,depthProof:sCheck.depthProof}));

 const videoDir=path.join(out,'transition-video');fs.mkdirSync(videoDir,{recursive:true});
 const c=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:videoDir,size:{width:1440,height:900}}});const p=await c.newPage();await p.goto(base+'/',{waitUntil:'domcontentloaded'});await p.waitForTimeout(700);await p.locator('#hotWork').click({noWaitAfter:true});await p.waitForTimeout(115);const transition=await p.evaluate(()=>{const cut=document.querySelector('.tour-cut--landing');const after=getComputedStyle(cut,'::after');return {cut:!!cut,afterContent:after.content,afterAnimation:after.animationName,bodyCutting:document.body.classList.contains('tour-cutting')}});await p.screenshot({path:path.join(out,'transition-landing-work-115ms.png')});await p.waitForTimeout(170);await p.screenshot({path:path.join(out,'transition-landing-work-285ms.png')});await p.waitForURL(/\/work\//,{timeout:3000});await p.waitForTimeout(700);await p.screenshot({path:path.join(out,'transition-landing-work-arrived.png')});assert('Landing to Work physical cut exists',transition.cut);assert('Architectural occluder animates',transition.afterAnimation.includes('tourArchitecturalOcclusion'),JSON.stringify(transition));const video=await p.video();await c.close();if(video){const src=await video.path();fs.copyFileSync(src,path.join(out,'landing-to-work-motion.webm'));}
 const r=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});const rp=await r.newPage();await rp.goto(base+'/',{waitUntil:'domcontentloaded'});await rp.locator('#hotWork').click({noWaitAfter:true});await rp.waitForURL(/\/work\//,{timeout:2500});assert('Reduced motion navigates directly',true);await r.close();
 assert('No broken visual assets',report.broken.length===0,JSON.stringify(report.broken));fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();await new Promise(ok=>server.close(ok));}
