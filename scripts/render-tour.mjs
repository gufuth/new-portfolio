import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const outDir = path.join(root, 'artifacts', 'tour-render');
fs.mkdirSync(outDir, { recursive: true });

const routes = new Map([
  ['/', 'index.html'],
  ['/work/', 'work.html'],
  ['/work/more/', 'more-work.html'],
  ['/about/', 'about.html'],
  ['/hearsay/', 'hearsay.html'],
  ['/work/nike-sb-panda-pigeon/', 'cases/nike.html'],
  ['/work/virgin-galactic-unity-22/', 'cases/virgin.html'],
  ['/work/porsche-lucasfilm-designer-alliance/', 'cases/porsche.html'],
  ['/work/selsun-blue-dan-driff/', 'cases/selsun.html'],
  ['/work/moneylion-beast-games/', 'cases/moneylion.html'],
  ['/work/alita-te-connectivity/', 'cases/alita.html'],
  ['/work/jose-cuervo/', 'cases/cuervo.html'],
  ['/work/outdoor-voices/', 'cases/outdoor-voices.html'],
  ['/work/the-atlantic/', 'cases/atlantic.html'],
]);

const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
};

function fileFor(rawUrl) {
  const u = new URL(rawUrl, 'http://127.0.0.1');
  let rel = routes.get(u.pathname);
  if (!rel) rel = decodeURIComponent(u.pathname).replace(/^\/+/, '');
  const abs = path.resolve(root, rel || 'index.html');
  if (!abs.startsWith(root + path.sep) && abs !== root) return null;
  return abs;
}

const server = http.createServer((req, res) => {
  const file = fileFor(req.url || '/');
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end('Not found'); return; }
  res.writeHead(200, { 'content-type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(4173, '127.0.0.1', resolve); });

const base = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const report = { generatedAt: new Date().toISOString(), assertions: [], pages: {}, transitions: {}, brokenImages: [] };

function assert(name, pass, detail = '') {
  report.assertions.push({ name, pass, detail });
  if (!pass) throw new Error(`${name}${detail ? `: ${detail}` : ''}`);
}

async function waitForPaint(page, ms = 1200) {
  await page.waitForTimeout(ms);
  await page.evaluate(async () => {
    const imgs = [...document.images];
    await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
      const done = () => resolve(); img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); setTimeout(done, 1800);
    })));
  });
  await page.waitForTimeout(120);
}

async function inspect(page, name) {
  const data = await page.evaluate(() => {
    const rect = el => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
    const visible = el => !!(el && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none');
    const billboards = [...document.querySelectorAll('.billboard')].filter(visible).map(el => ({ id: el.dataset.caseId, rect: rect(el), label: el.getAttribute('aria-label') }));
    const cards = [...document.querySelectorAll('.mobile-card')].filter(visible).map(el => ({ id: el.dataset.caseId, rect: rect(el) }));
    const topBar = rect(document.querySelector('.filmbar.top'));
    const bottomBar = rect(document.querySelector('.filmbar.bottom'));
    const paper = rect(document.querySelector('.paper'));
    return {
      url: location.href, width: innerWidth, height: innerHeight,
      documentScrollWidth: document.documentElement.scrollWidth,
      documentScrollHeight: document.documentElement.scrollHeight,
      billboards, cards, topBar, bottomBar, paper,
      sceneDisplay: document.querySelector('.scene-stage') ? getComputedStyle(document.querySelector('.scene-stage')).display : null,
      mobileListDisplay: document.querySelector('.mobile-list') ? getComputedStyle(document.querySelector('.mobile-list')).display : null,
      sound: document.querySelector('[data-tour-sound]')?.textContent?.trim() || null,
    };
  });
  report.pages[name] = data;
  return data;
}

async function snap(browserContext, { name, url, width, height, wait = 1300, fullPage = false }) {
  const page = await browserContext.newPage();
  const broken = [];
  page.on('response', r => { if (r.status() >= 400 && /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(r.url())) broken.push({ status: r.status(), url: r.url() }); });
  await page.setViewportSize({ width, height });
  await page.goto(base + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForPaint(page, wait);
  const data = await inspect(page, name);
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage });
  report.brokenImages.push(...broken.map(x => ({ page: name, ...x })));
  await page.close();
  return data;
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });

  const landing = await snap(context, { name: 'landing-1440x900', url: '/', width: 1440, height: 900 });
  const work1440 = await snap(context, { name: 'work-1440x900', url: '/work/', width: 1440, height: 900, wait: 1800 });
  const more1440 = await snap(context, { name: 'more-work-1440x900', url: '/work/more/', width: 1440, height: 900, wait: 1800 });

  /* Production helper: capture the current MORE WORK environment with its live
     billboard layers removed. This gives us an exact clean photographic plate
     from the same browser geometry for physical compositing, without changing
     the public page or baking browser UI into the environment. */
  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + '/work/more/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForPaint(page, 1600);
    await page.addStyleTag({ content: '.more-scene .billboard{display:none!important}' });
    await page.screenshot({ path: path.join(outDir, 'more-work-clean-1440x900.png') });
    await page.close();
  }

  const porsche1440 = await snap(context, { name: 'porsche-1440x900', url: '/work/porsche-lucasfilm-designer-alliance/', width: 1440, height: 900, wait: 1800 });
  const about1440 = await snap(context, { name: 'about-1440x900', url: '/about/', width: 1440, height: 900 });
  await snap(context, { name: 'work-1366x768', url: '/work/', width: 1366, height: 768, wait: 1600 });
  await snap(context, { name: 'more-work-1366x768', url: '/work/more/', width: 1366, height: 768, wait: 1600 });
  const work1024 = await snap(context, { name: 'work-1024x768', url: '/work/', width: 1024, height: 768, wait: 1600 });
  await snap(context, { name: 'more-work-1024x768', url: '/work/more/', width: 1024, height: 768, wait: 1600 });
  const work390 = await snap(context, { name: 'work-390x844', url: '/work/', width: 390, height: 844, wait: 1600 });
  const porsche390 = await snap(context, { name: 'porsche-390x844', url: '/work/porsche-lucasfilm-designer-alliance/', width: 390, height: 844, wait: 1600 });
  await snap(context, { name: 'about-390x844', url: '/about/', width: 390, height: 844 });
  await snap(context, { name: 'work-375x667', url: '/work/', width: 375, height: 667, wait: 1600 });

  assert('WORK has 5 desktop billboards', work1440.billboards.length === 5, String(work1440.billboards.length));
  assert('MORE WORK has 4 desktop billboards', more1440.billboards.length === 4, String(more1440.billboards.length));
  assert('Desktop WORK has top and bottom rails', Boolean(work1440.topBar && work1440.bottomBar));
  assert('1024 WORK has no horizontal document overflow', work1024.documentScrollWidth <= 1024 + 1, String(work1024.documentScrollWidth));
  assert('390 WORK uses mobile index', work390.sceneDisplay === 'none' && work390.mobileListDisplay !== 'none', JSON.stringify({ scene: work390.sceneDisplay, list: work390.mobileListDisplay }));
  assert('390 case retains paper/evidence surface', Boolean(porsche390.paper));
  assert('No visible broken images in static matrix', report.brokenImages.length === 0, `${report.brokenImages.length} broken`);

  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'transition-landing-before.png') });
    const start = Date.now();
    await page.locator('#hotWork').click({ noWaitAfter: true });
    await page.waitForTimeout(105);
    await page.screenshot({ path: path.join(outDir, 'transition-landing-work-mid.png') });
    await page.waitForURL(/\/work\/(?:\?|$)/, { timeout: 4000, waitUntil: 'domcontentloaded' });
    report.transitions.landingToWorkMs = Date.now() - start;
    await page.waitForTimeout(45);
    await page.screenshot({ path: path.join(outDir, 'transition-work-arrival-early.png') });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, 'transition-work-arrival-settled.png') });
    await page.close();
  }

  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + '/work/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const start = Date.now();
    await page.locator('.filmbar.bottom a[href="/work/more/"]').click({ noWaitAfter: true });
    await page.waitForTimeout(95);
    await page.screenshot({ path: path.join(outDir, 'transition-work-more-mid.png') });
    await page.waitForURL(/\/work\/more\/(?:\?|$)/, { timeout: 4000, waitUntil: 'domcontentloaded' });
    report.transitions.workToMoreMs = Date.now() - start;
    await page.waitForTimeout(70);
    await page.screenshot({ path: path.join(outDir, 'transition-more-arrival-early.png') });
    await page.waitForTimeout(320);
    await page.screenshot({ path: path.join(outDir, 'transition-more-arrival-settled.png') });
    await page.close();
  }

  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + '/work/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const chosen = page.locator('.billboard[data-case-id="porsche-lucasfilm-designer-alliance"]');
    await chosen.click({ noWaitAfter: true });
    await page.waitForTimeout(105);
    await page.screenshot({ path: path.join(outDir, 'transition-billboard-case-mid.png') });
    await page.waitForURL(/porsche-lucasfilm-designer-alliance/, { timeout: 4000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(outDir, 'transition-case-arrival.png') });
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(350);
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-case-id') || '');
    assert('Browser Back restores Porsche billboard focus', focused === 'porsche-lucasfilm-designer-alliance', focused);
    await page.close();
  }

  fs.writeFileSync(path.join(outDir, 'tour-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
