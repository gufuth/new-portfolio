# Last Stop — Staging Pixel QA Matrix

**Date:** 2026-09-03  
**Use:** run immediately after Git-connected Netlify staging is available. Do not substitute source review for this pass.

## Viewports

Desktop / laptop:
- 1440×900
- 1366×768
- 1024×768

Mobile:
- 390×844
- 375×667

Optional stress tests:
- 1536×864
- 1280×720
- 320×568
- 200% browser zoom

## Cold recruiter tasks

Use first-time viewers with no explanation if possible.

### Task A — orientation
Prompt: **"What is this site and what does Ian do?"**
- target: answer in about 3 seconds on Landing/WORK
- fail if user thinks it is a restaurant/motel site before recognizing portfolio purpose

### Task B — project recognition
Prompt: **"Show me the Porsche work."**
- target: correct case opened in about 10 seconds
- fail if hover is needed to identify projects or user clicks decor

### Task C — breadth
Prompt: **"Show me more work."**
- target: MORE WORK reached in ≤5 seconds
- fail if user assumes WORK is the entire book

### Task D — case gate
Prompt after direct-opening Porsche: **"What did Ian do, what was the idea, and why did it matter?"**
- target: answerable from first viewport / first quick scan
- fail if role or idea is hidden below process copy

### Task E — return
Prompt: **"Go back to the project list and open another case."**
- target: no hesitation; browser Back behaves normally

## LANDING checks

- locked image crops correctly without losing IAN LUNA / WORK / ABOUT / HEARSAY landmarks
- WORK hit area matches visible physical window/sign
- ABOUT / HEARSAY hit areas match physical cues
- focus indicator visible over image
- no user must discover invisible hotspots by accident
- sound defaults OFF when production law is applied
- reduced motion skips voltage/fade theater cleanly
- no stale Netlify metadata at production

## WORK checks

### Composition
- 5 projects recognized as separate within 3 seconds
- no billboard reads as a hero only because of accidental scale
- repeated lamps do not make the set feel like an art gallery
- road gap remains visible; diner foreground → glass → road → work depth is legible
- far-right dark field survives

### Billboard art
For every sign:
- client + project readable at rest
- art remains dominant
- crop still communicates campaign at small scale
- no source image becomes muddy after perspective/size reduction
- color remains campaign-native

### Interaction
- entire face clickable
- hover/focus = slight exposure only
- no scale/floating
- 2px focus outline visible and unobscured
- tab order follows left-to-right visual order

## MORE WORK checks

- clearly same world but not same composition
- 4 signs feel larger/more isolated than WORK
- motel geography stays background; does not compete with Atlantic / fourth sign
- motel sign looks maintained badly, not art-directed decay
- no readable fake WORK reflection / extra green signage
- foreground differs enough from WORK to make "one booth over" intuitive

## Case-page checks

For all nine:
- first viewport contains client/project, hook, Ian role, idea and strongest available proof
- dominant real work image shares first viewport on desktop
- no exact idea repetition lower on page
- no filler proof
- no invented or bracketed numbers
- line length comfortable at 100% and 200% zoom
- page reads in 30-second skim and 3–5 minute deeper read
- campaign colors remain native
- media sequence is deliberate, not masonry dumping
- Previous / All Work / Next all work
- direct URL works without visiting Landing first

### Special cases
- Selsun: film frame must be better than generic Vimeo thumbnail before production
- MoneyLion: replace square promo hero if stronger TVC/game-world frame is available
- Alita: search Weta/engineering visual before final lock
- Cuervo: poster-frame extraction rather than motion-first hero
- Outdoor Voices: daylight stays daylight
- Atlantic: local poster hero; supporting GIFs should become controlled/local media

## ABOUT checks

Do not test current repo version as a final candidate until the honesty fix is made.

Final ABOUT must:
- contain no placeholder comment/copy
- contain no fake reel affordance if no reel exists
- communicate Ian as creative director/copywriter quickly
- retain "The room is paid through Thursday" only if it still earns the register
- offer obvious route back to WORK / HOME
- remain same-film without turning into another interaction puzzle

## HEARSAY checks

Do not polish/test the old framed-photo implementation as current direction.

Current intended direction must:
- feel nearly roomless / black
- use actual photos in full color
- keep quote + photo together
- one strong foreground presence at a time; other voices recede
- no constellation of little heads
- no picture-frame wall grammar
- no neon effect stack
- live readable text / attribution
- interaction optional; quotes cannot be hidden behind waiting/theater
- reduced motion remains complete

## Accessibility checks

WCAG 2.2 baseline:
- all primary functionality keyboard operable
- focus visible and not obscured
- minimum pointer targets meet AA 24×24; target 44×44 where practical
- no content depends on hover only
- semantic links/buttons rather than clickable generic containers where possible
- alt text or intentionally empty alt for decorative/redundant linked imagery
- no drag-only behavior
- 200% zoom without content loss
- reduced-motion preference respected

## Performance checks

Field target / Lighthouse proxy before field data:
- LCP ≤2.5s
- INP ≤200ms target
- CLS ≤0.1

Audit especially:
- hero media source latency
- remote CDN failures
- GIF weight
- missing intrinsic dimensions
- preload only truly critical image
- no layout jump when lazy media arrives

## Release decision

A page is not 10/10 because reviewers "like it." It passes when:
- no hard task fails
- no accessibility blocker remains
- no visible unfinished state remains
- no known production media dependency can break the experience
- no named aesthetic defect is consequential enough to change recruiter comprehension or authored-world quality
