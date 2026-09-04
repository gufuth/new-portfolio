import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const outDir = path.join(root, 'artifacts', 'plate-audit');
fs.mkdirSync(outDir, { recursive: true });

const candidates = [
  ['work-candidate-D', '/docs/renders/02_Work_Billboards/candidate_D_bigsigns_filmtreated.png'],
  ['work-real-v1', '/docs/renders/02_Work_Billboards/pz_lastdiner_work_real_v1_v1.png'],
  ['work-v4-reframe', '/docs/renders/02_Work_Billboards/work_signs_v4_reframe.png'],
  ['work-v4-softlock', '/docs/renders/02_Work_Billboards/work_signs_v4_softlock_16x9.png'],
  ['diner2-full', '/docs/renders/10_Chat_Session_Renders/_diner2_full.png'],
  ['diner2-verify', '/docs/renders/10_Chat_Session_Renders/_diner2_verify.png'],
  ['outside-verify', '/docs/renders/10_Chat_Session_Renders/_outside_verify.png'],
  ['workA-verify', '/docs/renders/10_Chat_Session_Renders/_workA_verify.png'],
  ['workA-verify2', '/docs/renders/10_Chat_Session_Renders/_workA_verify2.png'],
];

const contentTypes = {'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.html':'text/html; charset=utf-8'};
const server = http.createServer((req,res)=>{
  const u = new URL(req.url || '/', 'http://127.0.0.1');
  const rel = decodeURIComponent(u.pathname).replace(/^\/+/, '');
  const abs = path.resolve(root, rel);
  if (!abs.startsWith(root + path.sep) || !fs.existsSync(abs)) {res.writeHead(404);res.end('not found');return;}
  res.writeHead(200, {'content-type': contentTypes[path.extname(abs).toLowerCase()] || 'application/octet-stream','cache-control':'no-store'});
  fs.createReadStream(abs).pipe(res);
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(4174,'127.0.0.1',resolve);});

const browser = await chromium.launch({headless:true});
const context = await browser.newContext({viewport:{width:1440,height:900}});
const meta = [];

try {
  for (const [name, src] of candidates) {
    const page = await context.newPage();
    await page.setContent(`<!doctype html><style>*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:#080706;color:#ece2c6;font-family:Arial,sans-serif}.frame{height:100%;display:grid;grid-template-rows:42px 1fr}.label{display:flex;align-items:center;padding:0 18px;font-size:13px;letter-spacing:.08em;background:#11110f}.well{min-height:0;display:flex;align-items:center;justify-content:center;background:#000}.well img{max-width:100%;max-height:100%;object-fit:contain;display:block}</style><div class="frame"><div class="label">${name}</div><div class="well"><img id="asset" src="http://127.0.0.1:4174${src}"></div></div>`);
    await page.locator('#asset').evaluate(img => img.complete ? true : new Promise(resolve => {img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});}));
    await page.waitForTimeout(150);
    const info = await page.locator('#asset').evaluate(img => ({naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,complete:img.complete}));
    meta.push({name,src,...info});
    await page.screenshot({path:path.join(outDir,`${name}.png`)});
    await page.close();
  }
  fs.writeFileSync(path.join(outDir,'plate-meta.json'),JSON.stringify(meta,null,2));
} finally {
  await context.close();
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
