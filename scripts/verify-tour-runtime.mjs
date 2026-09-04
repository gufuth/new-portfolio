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
expect('index.html', index, '/tour-runtime.css', 'shared tour CSS is not loaded');
expect('work.html', work, '/tour-runtime.css', 'shared tour CSS is not loaded');
expect('more-work.html', more, '/tour-runtime.css', 'shared tour CSS is not loaded');
expect('about.html', about, '/tour-runtime.css', 'shared tour CSS is not loaded');
expect('case-system.css', caseCss, "@import url('/tour-runtime.css')", 'case pages do not inherit tour CSS');

// Landing must no longer contain the superseded runtime/UI.
for (const [needle, label] of [
  ['Sound · On', 'sound-on default'],
  ['MMX — MMXXVI', 'old frame metadata'],
  ['id="clock"', 'UTC clock'],
  ['id="voltage"', 'old WORK voltage flicker'],
  ['keyboard-drill-down', 'legacy injected keyboard script'],
]) reject('index.html', index, needle, `superseded ${label} is still present`);
expect('index.html', index, 'EXTERIOR · THE LAST STOP DINER · NIGHT', 'new exterior top rail is missing');

// WORK and MORE WORK cast integrity.
if (count(work, /class="billboard\s+b\d"/g) !== 5) errors.push('work.html: expected exactly 5 desktop billboards');
if (count(more, /class="billboard\s+b\d"/g) !== 4) errors.push('more-work.html: expected exactly 4 desktop billboards');
const workIds = new Set([...work.matchAll(/class="billboard[^>]*data-case-id="([^"]+)"/g)].map(m => m[1]));
const moreIds = new Set([...more.matchAll(/class="billboard[^>]*data-case-id="([^"]+)"/g)].map(m => m[1]));
const expectedWork = ['nike-sb-panda-pigeon','virgin-galactic-unity-22','porsche-lucasfilm-designer-alliance','selsun-blue-dan-driff','moneylion-beast-games'];
const expectedMore = ['alita-te-connectivity','jose-cuervo','outdoor-voices','the-atlantic'];
for (const id of expectedWork) if (!workIds.has(id)) errors.push(`work.html: missing desktop case ${id}`);
for (const id of expectedMore) if (!moreIds.has(id)) errors.push(`more-work.html: missing desktop case ${id}`);

// Every case participates in the runtime and keeps direct recruiter navigation.
for (const [rel, slug] of cases) {
  const html = read(rel);
  expect(rel, html, 'data-tour-surface="case"', 'case surface flag missing');
  expect(rel, html, `data-case-id="${slug}"`, `case id ${slug} missing`);
  expect(rel, html, '/tour-runtime.js', 'shared tour runtime missing');
  expect(rel, html, 'class="case-nav"', 'Previous / All Work / Next navigation missing');
  reject(rel, html, 'IAN DECISION REQUIRED', 'visitor-visible unresolved marker');
  reject(rel, html, 'UNVERIFIED / NOT APPROVED', 'visitor-visible unresolved marker');
}

// ABOUT truth test.
for (const needle of ['placeholder', 'coming soon', 'reel is still rewinding', 'Press play on the TV']) {
  reject('about.html', about.toLowerCase(), needle.toLowerCase(), `unfinished ABOUT language remains: ${needle}`);
}
expect('about.html', about, 'aria-current="page" href="/about/"', 'ABOUT is not selected in unified bottom rail');

// Runtime behavior: sound off, one rare road-life family, reduced-motion branch, restore state.
expect('tour-runtime.js', runtime, "storageSet(localStorage,SOUND_KEY,'off')", 'sound does not default OFF');
expect('tour-runtime.js', runtime, "btn.textContent=on?'SOUND ON':'SOUND OFF'", 'shared sound label missing');
expect('tour-runtime.js', runtime, 'rand(38000,75000)', 'first road-life interval is not the approved rare range');
expect('tour-runtime.js', runtime, 'rand(90000,210000)', 'subsequent road-life interval is not the approved rare range');
expect('tour-runtime.js', runtime, "matchMedia('(prefers-reduced-motion: reduce)')", 'reduced-motion detection missing');
expect('tour-runtime.js', runtime, 'getBoundingClientRect()', 'Landing WORK transition is not anchored to rendered hotspot geometry');
expect('tour-runtime.js', runtime, 'RESTORE_PENDING', 'case Back-state restoration missing');
expect('tour-runtime.js', runtime, "contact.href='mailto:Ianr.luna@gmail.com'", 'CONTACT rail injection missing');
if (count(runtimeCss, /@keyframes\s+tourHeadlightPass/g) !== 1) errors.push('tour-runtime.css: ambient headlight must be one event family');
reject('tour-runtime.css', runtimeCss, 'infinite', 'tour runtime must not contain decorative infinite loops');
expect('tour-runtime.css', runtimeCss, '@media(prefers-reduced-motion:reduce)', 'CSS reduced-motion fallback missing');

// Netlify clean routes needed by the runtime.
for (const route of [
  '/work/ /work.html 200', '/work/more/ /more-work.html 200',
  '/work/nike-sb-panda-pigeon/', '/work/virgin-galactic-unity-22/',
  '/work/porsche-lucasfilm-designer-alliance/', '/work/selsun-blue-dan-driff/',
  '/work/moneylion-beast-games/', '/work/alita-te-connectivity/',
  '/work/jose-cuervo/', '/work/outdoor-voices/', '/work/the-atlantic/'
]) expect('_redirects', redirects, route, `missing route ${route}`);

notes.push('HEARSAY is intentionally excluded: Ian is actively building the current direction; repo version is known superseded.');
notes.push('This audit is source-level only. Rendered-pixel QA remains a staging gate.');

if (errors.length) {
  console.error(`Tour runtime audit FAILED (${errors.length})`);
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log('Tour runtime audit PASSED');
for (const n of notes) console.log(`- ${n}`);
