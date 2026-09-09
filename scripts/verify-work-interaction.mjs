import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const outDir = path.join(root, 'artifacts', 'tour-render');
fs.mkdirSync(outDir, { recursive: true });

const routes = new Map([
  ['/work/', 'work.html'],
  ['/work/more/', 'more-work.html'],
  ['/work/alita-te-connectivity/', 'cases/alita.html'],
]);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.svg':'image/svg+xml'};
function resolveFile(rawUrl){
  const u = new URL(rawUrl, 'http://127.0.0.1');
  const rel = routes.get(u.pathname) || decodeURIComponent(u.pathname).replace(/^\/+/, '');
  const abs = path.resolve(root, rel || 'index.html');
  if (!abs.startsWith(root + path.sep) && abs !== root) return null;
  return abs;
}
const server=http.createServer((req,res)=>{
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'content-type':mime[path.extname(file).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(4177,'127.0.0.1',resolve);});

const base='http://127.0.0.1:4177';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
const results=[];
function check(name,pass,detail=''){results.push({name,pass,detail});if(!pass)throw new Error(`${name}${detail?`: ${detail}`:''}`);}

async function firstBillboardByKeyboard(url, expectedId, screenshot){
  const page=await context.newPage();
  await page.goto(base+url,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(500);
  await page.keyboard.press('Tab'); // skip link
  await page.keyboard.press('Tab'); // first billboard
  const state=await page.evaluate(()=>{
    const a=document.activeElement;
    if(!a) return null;
    const before=getComputedStyle(a,'::before');
    const after=getComputedStyle(a,'::after');
    return {id:a.getAttribute('data-case-id')||'',outline:getComputedStyle(a).outlineStyle,beforeOpacity:before.opacity,afterOpacity:after.opacity};
  });
  check(`${expectedId} is first project reached after skip link`,state?.id===expectedId,JSON.stringify(state));
  check(`${expectedId} has visible keyboard focus`,state?.outline!=='none' && state?.outline!=='',JSON.stringify(state));
  check(`${expectedId} focus activates physical surface response`,Number(state?.beforeOpacity)>0 && Number(state?.afterOpacity)>0,JSON.stringify(state));
  await page.screenshot({path:path.join(outDir,screenshot)});
  await page.close();
}

try{
  await firstBillboardByKeyboard('/work/','nike-sb-panda-pigeon','work-keyboard-focus.png');
  await firstBillboardByKeyboard('/work/more/','alita-te-connectivity','more-work-keyboard-focus.png');

  const page=await context.newPage();
  await page.goto(base+'/work/more/',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(500);
  const chosen=page.locator('.billboard[data-case-id="alita-te-connectivity"]');
  await chosen.click({noWaitAfter:true});
  await page.waitForURL(/alita-te-connectivity/,{timeout:4000,waitUntil:'domcontentloaded'});
  await page.waitForTimeout(220);
  await page.goBack({waitUntil:'domcontentloaded'});
  await page.waitForTimeout(350);
  const focused=await page.evaluate(()=>document.activeElement?.getAttribute('data-case-id')||'');
  check('Browser Back restores Alita billboard focus on More Work',focused==='alita-te-connectivity',focused);
  await page.screenshot({path:path.join(outDir,'more-work-return-focus.png')});
  await page.close();

  fs.writeFileSync(path.join(outDir,'work-interaction-report.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
}finally{
  await context.close();
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
