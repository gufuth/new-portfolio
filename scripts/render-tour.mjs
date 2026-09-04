import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const outDir = path.join(root, 'artifacts', 'tour-render');
fs.mkdirSync(outDir, { recursive: true });

const routeMap = new Map([
  ['/', 'index.html'],
  ['/work/', 'work.html'],
  ['/work/more/', 'more-work.html'],
  ['/work/nike-sb-panda-pigeon/', 'cases/nike.html'],
  ['/work/virgin-galactic-unity-22/', 'cases/virgin.html'],
  ['/work/porsche-lucasfilm-designer-alliance/', 'cases/porsche.html'],
  ['/work/selsun-blue-dan-driff/', 'cases/selsun.html'],
  ['/work/moneylion-beast-games/', 'cases/moneylion.html'],
  ['/work/alita-te-connectivity/', 'cases/alita.html'],
  ['/work/jose-cuervo/', 'cases/cuervo.html'],
  ['/work/outdoor-voices/', 'cases/outdoor-voices.html'],
  ['/work/the-atlantic/', 'cases/atlantic.html'],
  ['/about/', 'about.html'],
  ['/hearsay/', 'hearsay.html'],
]);

const contentType = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function safeFileForUrl(rawUrl) {
  const u = new URL(rawUrl, 'http://127.0.0.1');
  let rel = routeMap.get(u.pathname);
  if (!rel) rel = decodeURIComponent(u.pathname).replace(/^\/+/, '');
  const abs = path.resolve(root, rel || 'index.html');
  if (!abs.startsWith(root + path.sep) && abs !== root) return null;
  return abs;
}

const server = http.createServer((req, res) => {
  const file = safeFileForUrl(req.url || '/');
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, {
    'content-type': contentType[ext] || 'application/octet-stream',
    'cache-control': 'no-store',
  });
  fs.createReadStream(file).pipe(res);
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(4173, '127.0.0.1', resolve);
});

const base = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const report = {
  generatedAt: new Date().toISOString(),
  assertions: [],
  snapshots: [],
  transitions: {},
  brokenImages: [],
};

function assert(name, condition, detail = '') {
  report.assertions.push({ name, pass: Boolean(condition), detail });
  if (!condition) console.error(`ASSERT FAIL: ${name}${detail ? ` — ${detail}` : ''}`);
}

async function waitForPaint(page, ms = 1300) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(ms);
}

async function inspect(page, name) {
  const data = await page.evaluate(() => {
    const rect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom, right: r.right };
    };
    const imgs = [...document.images].map((img) => ({
      src: img.currentSrc || img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      visible: Boolean(img.getClientRects().length),
    }));
    return {
      title: document.title,
      url: location.href,
      viewport: { width: innerWidth, height: innerHeight },
      bodyScrollWidth: document.body.scrollWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      topBar: rect('.filmbar.top'),
      bottomBar: rect('.filmbar.bottom'),
      scene: rect('.scene-stage'),
      paper: rect('.paper'),
      mobileListDisplay: (() => {
        const el = document.querySelector('.mobile-list');
        return el ? getComputedStyle(el).display : null;
      })(),
      sceneDisplay: (() => {
        const el = document.querySelector('.scene-stage');
        return el ? getComputedStyle(el).display : null;
      })(),
      billboards: [...document.querySelectorAll('.billboard')].map((el) => ({
        id: el.dataset.caseId || '',
        rect: rect(`.billboard[data-case-id="${el.dataset.caseId}"]`),
      })),
      focusedCase: document.activeElement?.dataset?.caseId || null,
      images: imgs,
    };
  });
  report.snapshots.push({ name, ...data });
  for (const img of data.images) {
    if (img.visible && img.complete && img.naturalWidth === 0) {
      report.brokenImages.push({ snapshot: name, src: img.src });
    }
  }
  return data;
}

async function snap(browserContext, { name, url, width, height, wait = 1300, fullPage = false }) {
  const page = await browserContext.newPage();
  await page.setViewportSize({ width, height });
  await page.goto(base + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForPaint(page, wait);
  const data = await inspect(page, name);
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage });
  await page.close();
  return data;
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });

  const landing = await snap(context, { name: 'landing-1440x900', url: '/', width: 1440, height: 900 });
  const work1440 = await snap(context, { name: 'work-1440x900', url: '/work/', width: 1440, height: 900, wait: 1800 });
  const more1440 = await snap(context, { name: 'more-work-1440x900', url: '/work/more/', width: 1440, height: 900, wait: 1800 });
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
    await page.waitForTimeout(210);
    await page.screenshot({ path: path.join(outDir, 'transition-landing-work-mid.png') });
    await page.waitForURL(/\/work\/$/, { timeout: 4000, waitUntil: 'domcontentloaded' });
    report.transitions.landingToWorkMs = Date.now() - start;
    await page.waitForTimeout(70);
    await page.screenshot({ path: path.join(outDir, 'transition-work-arrival-early.png') });
    await page.waitForTimeout(600);
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
    await page.waitForURL(/\/work\/more\/$/, { timeout: 4000, waitUntil: 'domcontentloaded' });
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
    await page.waitForTimeout(650);
    const porsche = page.locator('[data-case-id="porsche-lucasfilm-designer-alliance"]').first();
    await porsche.click({ noWaitAfter: true });
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(outDir, 'transition-billboard-case-mid.png') });
    await page.waitForURL(/porsche-lucasfilm-designer-alliance/, { timeout: 4000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(260);
    await page.screenshot({ path: path.join(outDir, 'transition-case-arrival.png') });
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    const focused = await page.evaluate(() => document.activeElement?.dataset?.caseId || null);
    report.transitions.backFocusedCase = focused;
    assert('Back restores Porsche billboard focus', focused === 'porsche-lucasfilm-designer-alliance', String(focused));
    await page.screenshot({ path: path.join(outDir, 'transition-back-restored.png') });
    await page.close();
  }

  {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + '/work/?tourTest=road', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6100);
    const passing = await page.locator('.tour-road-life').evaluate((el) => el.classList.contains('is-passing'));
    report.transitions.roadLifeTestActive = passing;
    assert('QA road-life hook enters passing state', passing === true, String(passing));
    await page.screenshot({ path: path.join(outDir, 'work-road-life-test.png') });
    await page.close();
  }

  await context.close();

  {
    const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await reducedContext.newPage();
    await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const nativeSetTimeout = window.setTimeout.bind(window);
      window.setTimeout = function(fn, ms, ...args) {
        sessionStorage.setItem('__tour_qa_nav_delay', String(Number(ms) || 0));
        return nativeSetTimeout(fn, ms, ...args);
      };
    });
    await page.locator('#hotWork').click({ noWaitAfter: true });
    await page.waitForURL(/\/work\/$/, { timeout: 3000, waitUntil: 'domcontentloaded' });
    const requestedDelay = await page.evaluate(() => Number(sessionStorage.getItem('__tour_qa_nav_delay')));
    report.transitions.reducedLandingIntentDelayMs = requestedDelay;
    assert('Reduced-motion LANDING -> WORK requests zero tour delay', requestedDelay === 0, `${requestedDelay}ms`);
    await page.close();
    await reducedContext.close();
  }

  fs.writeFileSync(path.join(outDir, 'metrics.json'), JSON.stringify(report, null, 2));
  const failed = report.assertions.filter((a) => !a.pass);
  console.log(`Tour browser QA: ${report.assertions.length - failed.length}/${report.assertions.length} assertions passed`);
  if (failed.length) process.exitCode = 1;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
