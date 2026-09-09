import { chromium } from 'playwright';
import fs from 'node:fs';

const out='/tmp/work-case-lock';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
let failures=[];
function check(cond,msg){if(!cond) failures.push(msg);}

async function render(path,name,width,height,fullPage=false){
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];
  page.on('console',m=>{if(m.type()==='error') errors.push(`console: ${m.text()}`)});
  page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
  await page.goto(`http://127.0.0.1:4173${path}`,{waitUntil:'networkidle'});
  // QA must distinguish a hidden lazy image from a genuinely bad source. Force
  // all declared case media to load/decode before testing naturalWidth.
  await page.locator('img').evaluateAll(async imgs=>{
    for(const img of imgs){ img.loading='eager'; }
    await Promise.all(imgs.map(img=>img.decode().catch(()=>null)));
  });
  await page.waitForTimeout(120);
  await page.screenshot({path:`${out}/${name}.png`,fullPage});
  const geom=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
  check(geom.sw<=geom.cw+1,`${name}: horizontal overflow ${geom.sw}/${geom.cw}`);
  check(errors.length===0,`${name}: ${errors.join(' | ')}`);
  const bad=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.getAttribute('src')));
  check(bad.length===0,`${name}: broken images ${bad.join(', ')}`);
  return page;
}

// Direct .html paths are used only because this isolated QA server does not
// apply Netlify _redirects. Production URLs remain unchanged.
{
 const page=await render('/work.html','work-1440',1440,900,false);
 check(await page.locator('.work-scene .billboard').count()===5,'Work: expected 5 physical destinations');
 check(await page.locator('.next-bay').count()===1,'Work: missing subtle More Work cue');
 const bg=await page.locator('.work-scene').evaluate(el=>getComputedStyle(el).backgroundImage);
 check(bg.includes('work-panorama-physical-v2.webp'),'Work: wrong background plate');
 const href=await page.locator('.next-bay').getAttribute('href');
 check(href==='/work/more/','Work: next-bay wrong destination');
 await page.keyboard.press('Tab');
 for(let i=0;i<8;i++){
   const focus=await page.evaluate(()=>document.activeElement?.getAttribute('data-case-id'));
   if(focus==='nike-sb-panda-pigeon') break;
   await page.keyboard.press('Tab');
 }
 check((await page.evaluate(()=>document.activeElement?.getAttribute('data-case-id')))==='nike-sb-panda-pigeon','Work: keyboard did not reach first billboard');
 await page.close();
}

{
 const page=await render('/more-work.html','more-work-1440',1440,900,false);
 check(await page.locator('.more-scene .billboard').count()===5,'More Work: expected 5 physical destinations');
 check(await page.locator('.more-scene .b5[data-case-id="scooba-love"]').count()===1,'More Work: SCOOBA is not b5');
 check(await page.locator('.more-index-cue').count()===0,'More Work: obsolete floating SCOOBA cue returned');
 const bg=await page.locator('.more-scene').evaluate(el=>getComputedStyle(el).backgroundImage);
 check(bg.includes('more-work-panorama-five-v1.webp'),'More Work: wrong five-board plate');
 const boxes=await page.locator('.more-scene .billboard').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}));
 check(boxes.length===5 && boxes[4].x>boxes[3].x,'More Work: SCOOBA does not occupy distinct fifth destination');
 let seen=[];
 for(let i=0;i<14;i++){
   await page.keyboard.press('Tab');
   const id=await page.evaluate(()=>document.activeElement?.getAttribute('data-case-id'));
   if(id && !seen.includes(id)) seen.push(id);
 }
 check(seen.includes('scooba-love'),`More Work: keyboard did not reach SCOOBA; saw ${seen.join(',')}`);
 await page.close();
}

for(const c of [
 {path:'/cases/porsche.html',name:'porsche',honors:true},
 {path:'/cases/cuervo.html',name:'cuervo',honors:false},
]){
 const page=await render(c.path,`${c.name}-desktop`,1440,900,true);
 check(await page.locator('body.case-master-v3').count()===1,`${c.name}: v3 case master not active`);
 check(await page.locator('.proof-rail .proof-stat').count()===3,`${c.name}: expected exactly 3 proof signals`);
 const proofText=await page.locator('.proof-rail').innerText();
 check(proofText.includes('*'),`${c.name}: temporary proof asterisk missing`);
 const note=await page.locator('.proof-note').innerText();
 check(note.toLowerCase().includes('temporary'),`${c.name}: temporary-proof note missing`);
 check(await page.locator('.hero-media img').count()===1,`${c.name}: hero should contain one dominant image`);
 if(c.honors){
   check(await page.locator('.honors-strip').count()===1,'Porsche: honors strip missing');
   check((await page.locator('.honors-strip').innerText()).includes('*'),'Porsche: temporary Cannes honor is not marked');
 }
 await page.close();
 for(const [w,h,label] of [[430,932,'430'],[390,844,'390']]){
   const mobile=await render(c.path,`${c.name}-${label}`,w,h,false);
   check(await mobile.locator('.proof-rail .proof-stat').count()===3,`${c.name}-${label}: proof rail changed count`);
   await mobile.close();
 }
}

await browser.close();
if(failures.length){
 console.error('\nQA FAILURES\n'+failures.map(x=>' - '+x).join('\n'));
 process.exit(1);
}
console.log('PASS: Work 1 / More Work identity, fifth SCOOBA destination, Porsche/Cuervo case-master v3, desktop/mobile integrity.');
