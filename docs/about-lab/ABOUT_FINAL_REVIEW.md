# ABOUT final review - September 11 branch checkpoint

> Status: rendered finalist checkpoint, not shipping approval. The branch is isolated. `main`, the public staging alias, production, and the old production site remain untouched.

## Current governing decisions

- Room 3 stays.
- Public-facing `Last Stop` naming is retired. It remains an internal project codename only.
- The diner is unnamed. The motel is unnamed.
- Visitor-facing location metadata is `INT. MOTEL · ROOM 3 · NIGHT`.
- Ian's real CRT portrait stays. Do not generate or cosmetically alter his likeness.
- `The room is paid through Thursday.` stays.
- **INCIDENTALS** remains locked as the understated label for the hidden secondary Ian material.
- Preferred INCIDENTals behavior is CRT activation that swaps the live About copy territory. No visible instruction, accordion, card, modal, badge, or added motel prop.
- The locked Landing diner may appear only as distant, subordinate geography through the Room 3 window. It is not interactive and not an Easter egg.

## Current finalist set

The September 11 comparison is intentionally limited to three controlled copy states on the same visual and interaction system.

### 1. Route B refined - current leader

`English Lit. Leather jacket.` is followed immediately by `I'm Ian. Creative director and copywriter.`

Why it currently wins:

- It gives the page a person before it gives the room more mythology.
- Professional identification arrives immediately after the two-beat personal lead, so the earlier recruiter-latency problem is materially reduced.
- The body copy is specific and sourced.
- In the rendered page it feels authored without becoming a long autobiography.
- It retains the same Room 3, CRT, navigation, window geography, and INCIDENTals interaction as the controls.

Risk: the lead is terse and consciously written. Do not expand it back into the longer anecdote unless Ian explicitly reopens the copy.

### 2. Route A refined - safe control

The direct first-person professional version remains the clarity benchmark.

Why it remains valuable:

- fastest professional comprehension
- factual and compact
- least likely to distract from the work
- useful fallback if B feels too writerly to Ian in the actual page

Why it is currently second: the room and CRT already carry atmosphere and character, so A can read as a conventional portfolio bio placed inside an unusual setting.

### 3. A/B hybrid - third

The hybrid starts with A's direct professional identification and then adds `English Lit. Leather jacket.`

Rendered judgment: the personal beat feels appended after the introduction has already completed its job. It gains less personhood than B and carries more copy than A. Keep it as a controlled hedge, not the recommendation.

### Route C

Historical interaction-control evidence only. It is no longer a current creative finalist. The Sep 11 direction favors CRT discovery, so C should not be promoted back into the primary comparison without new evidence.

## Shared implementation

The three current finalists now share:

- `/review/about/about-refined.css`
- `/review/about/about-refined.js`
- `/review/about/diner-window-crop.svg`

This prevents visual and technical drift between copy candidates.

The diner crop is derived directly from the locked Landing source and uses a right-side warm-window region containing practical lights and human trace without readable portfolio typography. It is deliberately dim, soft, and subordinate.

On phone, the diner overlay is allowed to disappear. The Room 3 plate crops to the right so the old readable motel sign does not re-enter the public page.

## Real browser QA

Chromium rendering was completed for Route A refined, Route B refined, and the hybrid at:

- 1440x900
- 1366x768
- 1024x768
- 430x932
- 390x844

Direct localhost and `file://` navigation are blocked by the execution environment. The test therefore loaded the exact branch-local HTML/CSS/JS and real Room 3/Landing assets into Chromium using Playwright `page.set_content`. This validates browser layout, pixel rendering, CSS behavior, viewport behavior, interaction, focus, and console state. It is not a deployed-URL QA claim.

### Functional results

- no horizontal document overflow in the tested viewport/candidate combinations
- no page/console errors in the tested candidate/viewport combinations
- CRT discovery control remains comfortably larger than the minimum target at every tested size
- INCIDENTals toggles `aria-expanded` correctly
- revealed INCIDENTals becomes available while the hidden bio becomes `aria-hidden` and `inert`
- Escape closes the revealed state and returns focus to the CRT control
- reduced-motion removes the relevant transitions
- the 1024 tablet copy-clipping defect is corrected
- the mobile public-name leak is corrected because the readable old motel sign is cropped out

### Visual hierarchy results

Grayscale, heavy-blur, and brightness-lift diagnostics were run on the current B desktop render.

Result:

- CRT remains the strongest compact human/light signal.
- The room's practical lamp remains a secondary environmental light source.
- The live copy maintains strong readable authority.
- The diner/window trace is materially quieter and nearly disappears under heavy blur.
- Brightness lift does not expose readable Landing typography in the window.
- The diner geography no longer behaves like a miniature portfolio page or branded sign.

The desired order is now much closer to:

1. Ian / About copy
2. CRT human trace
3. Room 3 geography
4. distant diner geography

## KEEP

- foot-of-bed camera
- bed foreground obstruction
- chair, dresser, lamp, window, and ordinary motel materials
- existing real CRT portrait
- near-black copy field
- fixed FilmFrame rails and existing navigation
- sound off by default
- `The room is paid through Thursday.`
- INCIDENTals through CRT discovery
- unnamed diner/motel geography
- subtle Landing-derived warm window trace on desktop/tablet only

## KILL / DO NOT REINTRODUCE

- public-facing `Last Stop Motel`
- readable motel sign as geography
- fake reel, play, loading, or coming-soon behavior
- `Rumors`, `Hearsay`, `About, allegedly`, or equivalent user-facing names for INCIDENTals
- visible INCIDENTals CTA, accordion, modal, card, badge, or instruction copy
- `Some rooms stay with you.`
- `Ideas travel well.`
- VIEW WORK CTA inside About
- new motel props or lore
- generated Ian likenesses
- CSS rectangle covering `PAUSE II`
- a fourth About concept before Ian reviews the current three

## Remaining source debt

`PAUSE II` remains baked into the current Room 3 source. A clean source plate has not been located. This is source-level cleanup debt and is not a reason to redesign the page.

## Deployment safety

No Netlify deployment was performed in this pass. Use only a unique non-promoting draft preview when a safe path is available. Do not overwrite the public staging alias. Do not merge or promote anything until Ian selects a finalist.

## Current decision

**Advance Route B refined for Ian's selection. Keep Route A refined as the safe fallback. Keep the A/B hybrid available as the controlled hedge. Route C is historical evidence only.**
