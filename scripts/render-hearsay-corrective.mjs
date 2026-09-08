import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base=(process.env.BASE_URL||'').replace(/\/$/,'');
if(!base)throw new Error('BASE_URL is required');
const out=path.resolve('artifacts/hearsay-corrective');
await fs.rm(out,{recursive:true,force:true});await fs.mkdir(out,{recursive:true});
const report={base_url:base,generated_at:new Date().toISOString(),screenshots:[],checks:[],console_errors:[],page_errors:[],motion:[]};
const browser=await chromium.launch({headless:true});

async function ready(page){
  await page.waitForLoadState('networkidle');
  await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,35));}scrollTo(0,0);});
  await page.waitForFunction(()=>Array.from(document.images).every(img=>img.complete&&img.naturalWidth>0));
}
async function inspect(page,label){
  const result=await page.evaluate(()=>{
    const hostileLift=document.body.classList.contains('diagnostic-lift');
    const bars=Array.from(document.querySelectorAll('.filmbar')).map(el=>{const r=el.getBoundingClientRect();return{top:r.top,bottom:r.bottom,height:r.height}});
    const clipped=hostileLift?[]:Array.from(document.querySelectorAll('.presence__voice')).filter(el=>{
      const host=el.closest('[data-presence]');
      if(!['near','middle'].includes(host?.dataset.state))return false;
      const hcs=getComputedStyle(host),ecs=getComputedStyle(el);
      if(hcs.display==='none'||hcs.visibility==='hidden'||ecs.display==='none'||ecs.visibility==='hidden'||Number.parseFloat(ecs.opacity||'1')<.02)return false;
      const r=el.getBoundingClientRect();return r.left<0||r.right>innerWidth||r.top<34||r.bottom>innerHeight-34;
    }).map(el=>el.closest('[data-presence]')?.dataset.presence);
    const lostPortraits=hostileLift?Array.from(document.querySelectorAll('[data-presence]')).filter(host=>{
      const p=host.querySelector('.presence__portrait');if(!p)return true;
      const cs=getComputedStyle(p);const r=p.getBoundingClientRect();
      return cs.display==='none'||cs.visibility==='hidden'||r.width<1||r.height<1||r.right<=0||r.left>=innerWidth||r.bottom<=34||r.top>=innerHeight-34;
    }).map(host=>host.dataset.presence):[];
    return {hostileLift,viewport:[innerWidth,innerHeight],overflow:document.documentElement.scrollWidth-innerWidth,broken:Array.from(document.images).filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),clipped,lostPortraits,bars,presences:document.querySelectorAll('[data-presence]').length,text:document.body.innerText};
  });
  if(result.overflow>1)throw new Error(`${label}: horizontal overflow ${result.overflow}`);
  if(result.broken.length)throw new Error(`${label}: broken images ${result.broken.join(', ')}`);
  if(result.clipped.length&&result.viewport[0]>700)throw new Error(`${label}: clipped testimony ${result.clipped.join(', ')}`);
  if(result.lostPortraits.length)throw new Error(`${label}: diagnostic portraits out of frame ${result.lostPortraits.join(', ')}`);
  if(result.presences!==5)throw new Error(`${label}: expected five presences`);
  report.checks.push({label,...result,text:undefined});
  return result;
}
async function shot(name,url,viewport,{fullPage=false,reducedMotion='no-preference',javaScriptEnabled=true}={}){
  const context=await browser.newContext({viewport,reducedMotion,javaScriptEnabled,colorScheme:'dark'});
  const page=await context.newPage();
  page.on('console',m=>{if(m.type()==='error')report.console_errors.push({name,text:m.text()});});
  page.on('pageerror',e=>report.page_errors.push({name,text:String(e)}));
  await page.goto(base+url,{waitUntil:'domcontentloaded'});await ready(page);await inspect(page,name);
  await page.screenshot({path:path.join(out,`${name}.png`),fullPage});report.screenshots.push(`${name}.png`);
  await context.close();
}

for(const route of ['a','b','c']){
  await shot(`route-${route}-1440x900`,`/review/hearsay-route-${route}.html?seed=117`,{width:1440,height:900});
  await shot(`route-${route}-1366x768`,`/review/hearsay-route-${route}.html?seed=117`,{width:1366,height:768});
  await shot(`route-${route}-brightness-lift`,`/review/hearsay-route-${route}.html?diagnostic=lift&seed=117`,{width:1366,height:768});
  await shot(`route-${route}-grayscale`,`/review/hearsay-route-${route}.html?diagnostic=grayscale&seed=117`,{width:1366,height:768});
  await shot(`route-${route}-heavy-blur`,`/review/hearsay-route-${route}.html?diagnostic=blur&seed=117`,{width:1366,height:768});
}
await shot('integrated-desktop-1440x900','/hearsay/?seed=117',{width:1440,height:900});
await shot('integrated-desktop-1366x768','/hearsay/?seed=117',{width:1366,height:768});
await shot('integrated-tablet-1024x768','/hearsay/?seed=117',{width:1024,height:768});
for(const [w,h] of [[430,932],[390,844],[375,667]])await shot(`integrated-mobile-${w}x${h}`,'/hearsay/?seed=117',{width:w,height:h},{fullPage:true});
await shot('integrated-reduced-motion','/hearsay/?seed=117',{width:1366,height:768},{reducedMotion:'reduce'});

// Keyboard: every witness must become visibly discoverable without pointer input.
{
  const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce'});const page=await context.newPage();
  await page.goto(base+'/hearsay/?seed=117');await ready(page);
  const reached=[];
  for(let i=0;i<16;i++){await page.keyboard.press('Tab');const id=await page.evaluate(()=>document.activeElement?.dataset?.presence||'');if(id&&!reached.includes(id))reached.push(id);}
  if(reached.length!==5)throw new Error(`keyboard reached ${reached.length}/5 presences: ${reached.join(',')}`);
  await page.screenshot({path:path.join(out,'keyboard-final-focus.png')});report.screenshots.push('keyboard-final-focus.png');report.checks.push({label:'keyboard',reached});await context.close();
}

// Phone interaction: tapping the room advances the next apparition, then lifecycle restore preserves it.
{
  const context=await browser.newContext({viewport:{width:430,height:932},hasTouch:true,isMobile:true});const page=await context.newPage();await page.goto(base+'/hearsay/?seed=117');await ready(page);
  await page.locator('.hearsay-room').tap({position:{x:215,y:420}});
  const state=await page.locator('[data-presence="neighbor"]').getAttribute('data-state');if(state!=='near')throw new Error(`room tap did not reveal neighbor: ${state}`);
  const cdp=await context.newCDPSession(page);await cdp.send('Page.setWebLifecycleState',{state:'frozen'});await new Promise(r=>setTimeout(r,250));await cdp.send('Page.setWebLifecycleState',{state:'active'});
  const restored=await page.locator('[data-presence="neighbor"]').getAttribute('data-state');if(restored!=='near')throw new Error(`lifecycle restore lost neighbor: ${restored}`);
  report.checks.push({label:'touch-and-restore',state:restored});await context.close();
}

async function motion(name,url){
  const videoDir=path.join(out,`video-${name}`);await fs.mkdir(videoDir,{recursive:true});
  const context=await browser.newContext({viewport:{width:1366,height:768},recordVideo:{dir:videoDir,size:{width:1366,height:768}},colorScheme:'dark'});const page=await context.newPage();
  page.on('console',m=>{if(m.type()==='error')report.console_errors.push({name,text:m.text()});});page.on('pageerror',e=>report.page_errors.push({name,text:String(e)}));
  await page.goto(base+url,{waitUntil:'domcontentloaded'});await ready(page);
  const samples=[];for(let t=0;t<36;t+=2){await new Promise(r=>setTimeout(r,2000));samples.push({t:t+2,states:await page.evaluate(()=>Object.fromEntries(Array.from(document.querySelectorAll('[data-presence]')).map(n=>[n.dataset.presence,n.dataset.state])))});}
  const video=page.video();await context.close();const raw=await video.path();const final=path.join(out,`${name}-36s.webm`);await fs.rename(raw,final);await fs.rm(videoDir,{recursive:true,force:true});report.motion.push({name,file:path.basename(final),duration_seconds:36,samples});
}
await motion('motion-b','/review/hearsay-motion-b.html?seed=117');
await motion('motion-c','/review/hearsay-motion-c.html?seed=117');

// Preserve the failed baselines at opening, middle, and late states for comparison.
for(const [key,url] of [['failed-v1','https://6a9f8f461d87de3be342ecf3--last-stop-diner-staging.netlify.app/hearsay'],['failed-v2','https://6a9f92a59334039b67e7acc7--last-stop-diner-staging.netlify.app/hearsay']]){
  const context=await browser.newContext({viewport:{width:1366,height:768}});const page=await context.newPage();await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForTimeout(1500);
  for(const [suffix,delay] of [['opening',0],['middle',7000],['late',7000]]){if(delay)await page.waitForTimeout(delay);await page.screenshot({path:path.join(out,`${key}-${suffix}.png`)});report.screenshots.push(`${key}-${suffix}.png`);}
  await context.close();
}

await fs.writeFile(path.join(out,'qa-report.json'),JSON.stringify(report,null,2));
await fs.writeFile(path.join(out,'preview-url.txt'),base+'\n');
await browser.close();
if(report.console_errors.length||report.page_errors.length)throw new Error(`browser errors: ${JSON.stringify({console:report.console_errors,page:report.page_errors})}`);
console.log(`Hearsay corrective render complete: ${report.screenshots.length} stills, ${report.motion.length} motion studies.`);