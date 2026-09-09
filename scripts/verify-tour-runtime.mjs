import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const notes = [];

function read(rel) {
  try { return fs.readFileSync(path.join(root, rel), 'utf8'); }
  catch (err) { errors.push(`${rel}: cannot read (${err.message})`); return ''; }
}
function expect(rel, text, needle, message) {
  if (!text.includes(needle)) errors.push(`${rel}: ${message || `missing ${needle}`}`);
}
function reject(rel, text, needle, message) {
  if (text.includes(needle)) errors.push(`${rel}: ${message || `must not contain ${needle}`}`);
}
function count(text, re) { return [...text.matchAll(re)].length; }

const cases = [
  ['cases/nike.html', 'nike-sb-panda-pigeon'],
  ['cases/virgin.html', 'virgin-galactic-unity-22'],
  ['cases/porsche.html', 'porsche-lucasfilm-designer-alliance'],
  ['cases/selsun.html', 'selsun-blue-dan-driff'],
  ['cases/moneylion.html', 'moneylion-beast-games'],
  ['cases/alita.html', 'alita-te-connectivity'],
  ['cases/cuervo.html', 'jose-cuervo'],
  ['cases/outdoor-voices.html', 'outdoor-voices'],
  ['cases/atlantic.html', 'the-atlantic'],
];

const index = read('index.html');
const work = read('work.html');
const more = read('more-work.html');
const about = read('about.html');
const runtime = read('tour-runtime.js');
const runtimeCss = read('tour-runtime.css');
const workCss = read('work-system.css');
const caseCss = read('case-system.css');
const redirects = read('_redirects');

// Shared runtime surfaces.
for (const [rel, text, surface] of [
  ['index.html', index, 'landing'],
  ['work.html', work, 'work'],
  ['more-work.html', more, 'more'],
  ['about.html', about, 'about'],
]) {
  expect(rel, text, `data-tour-surface="${surface}"`, `missing data-tour-surface=${surface}`);
  expect(rel, text, '/tour-runtime.js', 'shared tour runtime is not loaded');
}
expect('index.html', index, '/tour-runtime.css?v=20260908-physical2', 'Landing tour CSS is not cache-busted for the physical proof');
expect('work.html', work, '/tour-runtime.css', 'shared tour CSS is not loaded');
expect('more-work.html', more, '/tour-runtime.css', 'shared tour CSS is not loaded');
expect('about.html', about, '/tour-runtime.css', 'shared tour CSS is not loaded');
expect('case-system.css', caseCss, "@import url('/tour-runtime.css?v=20260908-physical2')", 'case pages do not inherit the cache-busted tour CSS');

// Clean-route asset safety. Netlify rewrites keep /work/... in the browser URL, so page-critical local assets must be root-absolute.
expect('work.html', work, 'href="/work-system.css?v=20260908-finish1"', 'WORK CSS is not root-absolute and cache-busted for /work/');
expect('work.html', work, 'href="/assets/work-panorama-physical-v1.webp"', 'WORK physical panorama preload is not root-absolute for /work/');
expect('more-work.html', more, 'href="/work-system.css?v=20260908-finish1"', 'MORE WORK CSS is not root-absolute and cache-busted for /work/more/');
expect('more-work.html', more, 'href="/assets/more-work-panorama-current.webp"', 'MORE WORK panorama is not root-absolute for /work/more/');
expect('about.html', about, 'src="/about.webp"', 'ABOUT plate is not root-absolute for /about/');
reject('work.html', work, 'href="work-system.css"', 'relative WORK CSS would break on clean routes');
reject('more-work.html', more, 'href="work-system.css"', 'relative MORE WORK CSS would break on clean routes');
reject('about.html', about, 'src="about.webp"', 'relative ABOUT plate would break on clean routes');

// Landing must no longer contain the superseded runtime/UI.
for (const [needle, label] of [
  ['Sound · On', 'sound-on default'],
  ['MMX — MMXXVI', 'old frame metadata'],
  ['id="clock"', 'UTC clock'],
  ['id="voltage"', 'old WORK voltage flicker'],
  ['keyboard-drill-down', 'legacy injected keyboard script'],
]) reject('index.html', index, needle, `superseded ${label} is still present`);
expect('index.html', index, 'EXT. · THE LAST STOP DINER · NIGHT', 'screenplay-style exterior top rail is missing');
expect('work.html', work, 'INT. · THE LAST STOP DINER · NIGHT', 'screenplay-style WORK interior top rail is missing');
expect('more-work.html', more, 'INT. · THE LAST STOP DINER · NIGHT', 'screenplay-style MORE WORK interior top rail is missing');
reject('index.html', index, 'EXTERIOR · THE LAST STOP DINER · NIGHT', 'spelled-out exterior slug remains');
reject('work.html', work, 'INTERIOR · THE LAST STOP DINER · NIGHT', 'spelled-out WORK interior slug remains');
reject('more-work.html', more, 'INTERIOR · THE LAST STOP DINER · NIGHT', 'spelled-out MORE WORK interior slug remains');

// Production surfaces must not load the superseded transition lab. It creates a second ambient-motion family.
reject('index.html', index, 'transition-lab', 'obsolete transition lab is loaded on Landing');
reject('work.html', work, 'transition-lab', 'obsolete transition lab is loaded on WORK');
reject('more-work.html', more, 'transition-lab', 'obsolete transition lab is loaded on MORE WORK');

// WORK and MORE WORK cast integrity.
if (count(work, /class="billboard\s+b\d"/g) !== 5) errors.push('work.html: expected exactly 5 desktop billboards');
if (count(more, /class="billboard\s+b\d"/g) !== 4) errors.push('more-work.html: expected exactly 4 desktop billboards');
const workIds = new Set([...work.matchAll(/class="billboard[^>]*data-case-id="([^"]+)"/g)].map(m => m[1]));
const moreIds = new Set([...more.matchAll(/class="billboard[^>]*data-case-id="([^"]+)"/g)].map(m => m[1]));
const expectedWork = ['nike-sb-panda-pigeon','virgin-galactic-unity-22','porsche-lucasfilm-designer-alliance','selsun-blue-dan-driff','moneylion-beast-games'];
const expectedMore = ['alita-te-connectivity','jose-cuervo','outdoor-voices','the-atlantic'];
for (const id of expectedWork) if (!workIds.has(id)) errors.push(`work.html: missing desktop case ${id}`);
for (const id of expectedMore) if (!moreIds.has(id)) errors.push(`more-work.html: missing desktop case ${id}`);

// Desktop billboard DOM is semantic interaction geometry only; visible art and naming are baked into the plate.
const workDesktopScene = work.match(/<div class="scene-stage work-scene">([\s\S]*?)<div aria-hidden="true" class="mobile-title">/)?.[1] || '';
const moreDesktopScene = more.match(/<div class="scene-stage more-scene">([\s\S]*?)<div aria-hidden="true" class="mobile-title">/)?.[1] || '';
reject('work.html', workDesktopScene, '<img', 'desktop WORK billboard contains a live image payload');
reject('more-work.html', moreDesktopScene, '<img', 'desktop MORE WORK billboard contains a live image payload');
reject('work.html', workDesktopScene, 'class="id"', 'desktop WORK billboard contains a live visual label');
reject('more-work.html', moreDesktopScene, 'class="id"', 'desktop MORE WORK billboard contains a live visual label');

// Mobile is a direct project index, never a compressed or gesture-only version of the scene.
const workMobileIds = new Set([...work.matchAll(/class="mobile-card"[^>]*data-case-id="([^"]+)"/g)].map(m => m[1]));
const moreMobileIds = new Set([...more.matchAll(/class="mobile-card"[^>]*data-case-id="([^"]+)"/g)].map(m => m[1]));
if (workMobileIds.size !== expectedWork.length) errors.push(`work.html: expected exactly ${expectedWork.length} mobile cards`);
if (moreMobileIds.size !== expectedMore.length) errors.push(`more-work.html: expected exactly ${expectedMore.length} mobile cards`);
for (const id of expectedWork) if (!workMobileIds.has(id)) errors.push(`work.html: missing mobile card ${id}`);
for (const id of expectedMore) if (!moreMobileIds.has(id)) errors.push(`more-work.html: missing mobile card ${id}`);
expect('work.html', work, '<main id="projects" tabindex="-1">', 'Skip to projects target is not a focusable main landmark');
expect('more-work.html', more, '<main id="projects" tabindex="-1">', 'Skip to projects target is not a focusable main landmark');
expect('work-system.css', workCss, '@media(max-width:760px)', 'mobile breakpoint is missing');
expect('work-system.css', workCss, '.scene-stage{display:none}', 'desktop scene is not removed from the mobile flow');
expect('work-system.css', workCss, '.mobile-list{display:grid', 'mobile project index is not displayed');
expect('work-system.css', workCss, '.mobile-card{display:grid', 'mobile projects are not direct cards');
expect('work-system.css', workCss, 'min-height:142px', 'mobile card target height regressed');
expect('work-system.css', workCss, '.rail a{font-size:9px;min-height:44px}', 'mobile WORK rail target height regressed');
expect('tour-runtime.css', runtimeCss, '.tour-sound{display:none}', 'dead mobile sound control is not removed');
expect('tour-runtime.css', runtimeCss, '.tour-road-life{display:none}', 'road-life event is not disabled on mobile');
expect('case-system.css', caseCss, '.case-hero{grid-template-columns:1fr;min-height:0}', 'mobile case hero is not single-column');
expect('case-system.css', caseCss, '.media-band,.media-band.two{width:100%;padding:0 12px;grid-template-columns:1fr', 'mobile case media is not single-column');
expect('case-system.css', caseCss, '.proof{grid-template-columns:1fr}', 'mobile proof block is not single-column');
expect('case-system.css', caseCss, '.case-nav a{display:flex;align-items:center;min-height:44px', 'case navigation target height regressed');

// Every case participates in the runtime, is clean-route safe, and keeps direct recruiter navigation.
for (const [rel, slug] of cases) {
  const html = read(rel);
  expect(rel, html, 'data-tour-surface="case"', 'case surface flag missing');
  expect(rel, html, `data-case-id="${slug}"`, `case id ${slug} missing`);
  expect(rel, html, '/tour-runtime.js', 'shared tour runtime missing');
  expect(rel, html, 'href="/case-system.css?v=20260908-finish1"', 'case CSS must be root-absolute and cache-busted under /work/<slug>/');
  expect(rel, html, 'href="/favicon.png"', 'case favicon must be root-absolute under /work/<slug>/');
  reject(rel, html, '../case-system.css', 'relative case CSS breaks clean routes');
  reject(rel, html, '../favicon.png', 'relative favicon breaks clean routes');
  reject(rel, html, '../assets/', 'relative local asset path breaks clean routes');
  expect(rel, html, 'class="case-nav"', 'Previous / All Work / Next navigation missing');
  expect(rel, html, '<a class="skip" href="#case">Skip to case</a>', 'case skip link missing');
  expect(rel, html, '<main class="paper" id="case" tabindex="-1">', 'case root is not a focusable main landmark');
  expect(rel, html, '<nav aria-label="Primary" class="rail">', 'primary navigation landmark is not labelled');
  const nav = html.match(/<nav class="case-nav">([\s\S]*?)<\/nav>/)?.[1] || '';
  if (count(nav, /<a\b/g) !== 3) errors.push(`${rel}: expected Previous / All Work / Next links`);
  const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
  for (const tag of imageTags) {
    if (!/\balt="[^"]+"/.test(tag)) errors.push(`${rel}: case image lacks useful alt text`);
    if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) errors.push(`${rel}: case image lacks intrinsic dimensions`);
    if (!/\bdecoding="async"/.test(tag)) errors.push(`${rel}: case image lacks async decoding`);
  }
  reject(rel, html, 'IAN DECISION REQUIRED', 'visitor-visible unresolved marker');
  reject(rel, html, 'UNVERIFIED / NOT APPROVED', 'visitor-visible unresolved marker');
}

// More Work pages must return to their owning index even on direct entry with no session state.
for (const rel of ['cases/alita.html','cases/cuervo.html','cases/outdoor-voices.html','cases/atlantic.html']) {
  const html = read(rel);
  expect(rel, html, 'href="/work/more/">All work</a>', 'More Work case does not statically return to More Work');
}

// ABOUT truth test.
for (const needle of ['placeholder', 'coming soon', 'reel is still rewinding', 'Press play on the TV']) {
  reject('about.html', about.toLowerCase(), needle.toLowerCase(), `unfinished ABOUT language remains: ${needle}`);
}
expect('about.html', about, 'aria-current="page" href="/about/"', 'ABOUT is not selected in unified bottom rail');
expect('about.html', about, '<section class="bio" id="bio" tabindex="-1">', 'ABOUT skip target is not focusable');

// Runtime behavior: sound off, one rare road-life family, reduced-motion branch, restore state.
expect('tour-runtime.js', runtime, "storageSet(localStorage,SOUND_KEY,'off')", 'sound does not default OFF');
expect('tour-runtime.js', runtime, "btn.textContent=on?'SOUND ON':'SOUND OFF'", 'shared sound label missing');
expect('tour-runtime.js', runtime, 'rand(38000,75000)', 'first road-life interval is not the approved rare range');
expect('tour-runtime.js', runtime, 'rand(90000,210000)', 'subsequent road-life interval is not the approved rare range');
expect('tour-runtime.js', runtime, "matchMedia('(prefers-reduced-motion: reduce)')", 'reduced-motion detection missing');
expect('tour-runtime.js', runtime, 'getBoundingClientRect()', 'Landing WORK transition is not anchored to rendered hotspot geometry');
expect('tour-runtime.js', runtime, 'RESTORE_PENDING', 'case Back-state restoration missing');
expect('tour-runtime.js', runtime, 'if(event.persisted){resetRestoredCut();}', 'BFCache return does not clear a stale transition curtain');
expect('tour-runtime.js', runtime, "contact.href='mailto:Ianr.luna@gmail.com'", 'CONTACT rail injection missing');
if (count(runtimeCss, /@keyframes\s+tourHeadlightPass/g) !== 1) errors.push('tour-runtime.css: ambient headlight must be one event family');
reject('tour-runtime.css', runtimeCss, 'infinite', 'tour runtime must not contain decorative infinite loops');
expect('tour-runtime.css', runtimeCss, '@media(prefers-reduced-motion:reduce)', 'CSS reduced-motion fallback missing');
expect('tour-runtime.css', runtimeCss, "url('/assets/work-panorama-physical-v1.webp?v=20260908-1')", 'Landing-to-WORK cut does not use the physical Porsche plate');
reject('tour-runtime.css', runtimeCss, "url('/assets/work-panorama-current.webp')", 'Landing-to-WORK cut still exposes the baked Porsche plate');
reject('tour-runtime.css', runtimeCss, 'tour-cut--mullion', 'WORK/MORE WORK still uses the rejected mullion wipe');
expect('tour-runtime.css', runtimeCss, 'tour-cut--exposure', 'WORK/MORE WORK exposure cut is missing');

// Netlify clean routes needed by the runtime.
for (const route of [
  '/work/ /work.html 200', '/work/more/ /more-work.html 200',
  '/work/nike-sb-panda-pigeon/', '/work/virgin-galactic-unity-22/',
  '/work/porsche-lucasfilm-designer-alliance/', '/work/selsun-blue-dan-driff/',
  '/work/moneylion-beast-games/', '/work/alita-te-connectivity/',
  '/work/jose-cuervo/', '/work/outdoor-voices/', '/work/the-atlantic/'
]) expect('_redirects', redirects, route, `missing route ${route}`);

notes.push('HEARSAY is intentionally excluded: Ian is actively building the current direction; repo version is known superseded.');
notes.push('This audit is source-level only. Rendered-pixel QA is handled separately by the Chromium render workflow.');

if (errors.length) {
  console.error(`Tour runtime audit FAILED (${errors.length})`);
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log('Tour runtime audit PASSED');
for (const n of notes) console.log(`- ${n}`);
