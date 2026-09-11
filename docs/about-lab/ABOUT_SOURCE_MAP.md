# About source map

Status: branch-only current-state record for `about-iteration-lab-20260908-contd`. Updated September 11, 2026 after implementation and Chromium QA of the current finalist set.

## Governing hierarchy

1. Latest explicit About decisions from Ian in the active Portfolio Project.
2. `ABOUT — CURRENT STATE + LOCKS — 2026-09-08` in Drive, including its September 11 additions.
3. The current project source-of-truth documents in Drive.
4. `AGENTS.md` and current master handoff.
5. Locked Landing visual master.
6. Active Room 3 About baseline.
7. Current branch implementation and verified render evidence.
8. Historical Who/About material as voice evidence only.

## Locked visual references

- Landing: `LANDING — LOCKED MASTER — film pass.png` in Drive.
- About baseline: `ABOUT — foot-of-bed + CRT composite — current visual baseline.png` in Drive.
- Current site source: `/about.html`, `/about.webp`, `/tour-runtime.css`, `/tour-runtime.js`.
- Finalist shared review system: `/review/about/about-refined.css` and `/review/about/about-refined.js`.
- Diner geography crop: `/review/about/diner-window-crop.svg`, derived directly from the locked Landing source.

## Current truths

- About remains in Room 3.
- Landing is the visual North Star. Same film, different set.
- Preserve laws, not props.
- Ian is the subject. The room is not.
- Public-facing `Last Stop` is retired. It remains an internal production codename only.
- The diner is unnamed. The motel is unnamed.
- Visitor-facing About location metadata is `INT. MOTEL · ROOM 3 · NIGHT`.
- The old readable motel sign must not survive as visitor-facing geography.
- The current CRT portrait is a real source image and must not be regenerated or cosmetically altered.
- `The room is paid through Thursday.` remains a keeper.
- Fake reel / coming-soon behavior is dead.
- **INCIDENTALS is locked** as the understated label for the hidden secondary Ian material.
- INCIDENTals is discovered through CRT activation and swaps into the existing copy territory. No visible CTA, accordion, modal, card, or added motel prop.
- Opening INCIDENTals removes the hidden bio from the accessibility tree with `aria-hidden` plus `inert`; Escape closes and returns focus to the CRT control.

## September 11 finalist set

Only three current creative candidates remain:

1. **Route B refined**: human-signal lead, then immediate professional identification.
2. **Route A refined**: direct factual control.
3. **A/B hybrid**: direct professional identification plus one sourced English Lit / leather-jacket beat.

Route C is historical interaction-control evidence only. It is not a current creative finalist.

## Window geography

The About window now uses a restrained crop of the locked Landing diner as distant geography across the street and below the room. The crop is taken from a warm right-side diner-window region rather than a miniature view of the complete Landing page. It contains practical light and human trace but no readable portfolio typography.

The diner is not interactive and is not an Easter egg. It should remain fourth in attention after the About copy, CRT, and room geography. On phone, it is allowed to disappear entirely rather than forcing a miniature diner into the crop.

## Current rendered evidence

Actual Chromium rendering was run from the branch-local HTML/CSS/JS and real Room 3/Landing assets at:

- 1440x900
- 1366x768
- 1024x768
- 430x932
- 390x844

Direct localhost and `file://` navigation are blocked by the execution environment, so the browser loaded the exact branch structure and inlined local assets through Playwright `page.set_content`. This validates browser layout, pixels, CSS behavior, interaction, focus, viewport behavior, and console state. It is not a deployed-URL QA claim.

Verified corrections:

- 1024 tablet copy clipping fixed.
- Mobile no longer exposes the old readable motel sign.
- No horizontal document overflow in the tested viewports.
- CRT hit area remains comfortably larger than the minimum target at all tested sizes.
- INCIDENTals open/close behavior, `aria-expanded`, `aria-hidden`, `inert`, Escape, and focus return pass.
- Reduced-motion removes the relevant transitions.
- No console/page errors in the tested candidate/viewport combinations.
- Grayscale, heavy-blur, and brightness-lift diagnostics keep the diner/window trace subordinate and reveal no readable Landing typography.

## Current assessment

1. **B refined leads.** It has the highest personhood without materially delaying professional comprehension because `I'm Ian. Creative director and copywriter.` follows the short lead immediately.
2. **A refined is the safest control.** It is clear and compact but more conventional.
3. **A/B hybrid is third.** In rendered form the English Lit beat feels appended after an already complete professional introduction, so it gains less personality than B while adding more copy than A.

Do not invent another route before Ian reviews the current finalists.

## Historical material allowed as source

The canonical full-length Who document contains approved voice material including the English Lit / leather-jacket anecdote and the absurd secondary biography / impossible-credentials list. It is not permission to paste the old page into the motel-room About. Bracketed or stale employer facts remain excluded.

## Known source debt

A clean source plate without the baked `PAUSE II` label has not been located in Drive or the current repo. Do not cover the label with a visible CSS patch. Treat removal as source-level cleanup debt.

## Safety boundary

This lab is branch-only. Do not mutate `main`, the public staging alias, production, or the old production site while comparing finalists. No route is approved for merge until Ian selects it.
