import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');
const must=(ok,message)=>{if(!ok)throw new Error(message);};
const pages=['hearsay.html','review/hearsay-route-a.html','review/hearsay-route-b.html','review/hearsay-route-c.html','review/hearsay-motion-b.html','review/hearsay-motion-c.html'];
const quotes=['Five stars.',"He's never caused any problems in the building.",'That boy good.','A creative genius second to none.',"The sweetest boy you'll ever meet."];
const identities=['Ex girlfriend','Neighbor','Sweets','Gore Vidal','My mother'];

for(const page of pages){
  const html=read(page);
  must((html.match(/data-presence=/g)||[]).length===5,`${page}: expected five presences`);
  must((html.match(/<strong>/g)||[]).length===5,`${page}: only five identity elements should be bold`);
  must(!/(frame|card|carousel|payphone|handwriting)/i.test(html.replace(/filmbar/g,'')),`${page}: rejected wall/gallery language returned`);
  for(const quote of quotes)must(html.includes(quote),`${page}: missing exact quote ${quote}`);
  for(const identity of identities)must(html.includes(`<strong>${identity}</strong>`),`${page}: identity is not the bold-only attribution`);
}

const css=read('hearsay-system.css');
for(const id of ['ex','neighbor','sweets','vidal','mother']){
  must(css.includes(`mask-${id}.svg`),`missing individual ${id} mask`);
  must(fs.existsSync(path.join(root,`assets/hearsay/source-${id}.jpg`)),`missing source-${id}.jpg`);
  must(fs.existsSync(path.join(root,`assets/hearsay/mask-${id}.svg`)),`missing mask-${id}.svg`);
}
must(css.includes('calc(.982 + var(--p)*.038)'), 'approach scale exceeds or bypasses the 3.8% system');
must(css.includes('diagnostic-lift'), 'brightness-lift diagnostic missing');
must(css.includes('@media(prefers-reduced-motion:reduce)'), 'reduced-motion treatment missing');
must(css.includes('@media(max-width:700px)'), 'mobile index composition missing');

const js=read('hearsay-system.js');
must(js.includes('visibilitychange'),'tab hide/restore handling missing');
must(js.includes("event.key==='Escape'"),'manual-release keyboard behavior missing');
must(js.includes("['neighbor','sweets','vidal','mother']"),'irregular rotating cast missing');
must(!/setInterval/.test(js),'mechanical interval loop is forbidden');

const workflow=read('.github/workflows/hearsay-corrective-preview.yml');
must(workflow.includes('branches: [hearsay-elite-corrective]'),'workflow is not branch isolated');
must(workflow.includes('netlify-cli@latest deploy'),'workflow does not use Netlify CLI deploy');
must(!workflow.includes('--prod'),'corrective workflow must never promote a deploy');
must(workflow.includes('upload-artifact@v4'),'remote evidence preservation missing');

console.log(`Hearsay corrective audit passed: ${pages.length} pages, five original sources, three static routes, two motion finalists.`);
