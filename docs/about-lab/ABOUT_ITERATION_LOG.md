# About iteration log

## 2026-09-08 continuation

- Reconstructed the active About state from current project decisions, repo, Drive references, current staging metadata and existing branch artifacts.
- Confirmed the active Room 3 plate is the baseline and the problem is hierarchy, not the core set concept.
- Preserved the current shared FilmFrame runtime, rails, navigation and sound-off behavior.
- Kept `main`, staging alias and production untouched.
- Verified review Routes A, B and C exist on `about-iteration-lab-20260908-contd`.
- Rejected a generated image experiment because it changed Ian's likeness, altered the room and baked text into the image.
- Rejected a CSS patch over the baked `PAUSE II` label because it reads as a visible rectangular repair.
- Route A retained as the surgical control: factual first-person copy, localized sign demotion, CRT discovery.
- Route B strengthened into the human-signal route using sourced English Lit / leather jacket material from the canonical full Who document, without importing bracketed or stale facts.
- Route B hidden state uses the main copy territory so discovered text is readable rather than tiny secondary copy.
- Route C uses the same factual first-person base as A, with discovery moved to existing dresser detail and no new physical prop.
- Rejected the clickable `The room is paid through Thursday.` seam because it turns the strongest deadpan line into an obvious setup.
- Added branch documentation for source hierarchy and visual hierarchy studies.
- Updated final review: advance B, retain A as fallback, retain C as the interaction-control test.

## September 8 recovery lock

- Recovered the later governing Drive revision that explicitly locks **INCIDENTALS** as the understated label for the hidden secondary Ian material.
- Recorded that `Rumors`, `Hearsay`, `About, allegedly`, `The rest is hearsay`, and `Found in room 3` are superseded as user-facing labels unless Ian explicitly reopens the decision.
- Preserved the joke through understatement. No receipt, ledger, key tag, note, card, modal, badge, or new motel prop was added to justify it.
- Reconciled Route A to INCIDENTals while preserving its existing plate-relative CRT control.
- Reconciled Route B to INCIDENTals, removed visible return instructions, added show/hide accessible labels, and wrapped the room plate plus CRT hit area in `.visual` so phone coordinates stay registered to the 4:3 image.
- Reconciled Route C to INCIDENTals and applied the same plate-relative mobile hotspot correction.
- Updated `ABOUT_FINAL_REVIEW.md` so the branch documentation agrees with the governing Drive lock.
- Created `ABOUT — CURRENT STATE + LOCKS — 2026-09-08` inside `02 PAGE MASTERS / 03 ABOUT — ACTIVE` in the master Drive as the recovery checkpoint for future sessions.

## September 9 anti-drift cleanup

- Verified the About active Drive folder contains the current-state checkpoint and design audit alongside the August Room 3 baseline image.
- Replaced the stale `ABOUT_RUMORS_PROTOTYPES.md` branch record with `ABOUT_INCIDENTALS_PROTOTYPES.md`.
- Updated the source map, baseline audit, hierarchy studies, copy audit and final review so current-state language consistently uses INCIDENTals.
- Historical terms such as `Rumors` remain only when explicitly documenting superseded or rejected states.
- Current route interfaces expose `INCIDENTALS` plus semantic `Show incidentals` / `Hide incidentals` labels.
- This closed the recovery ambiguity that could otherwise make a future session reopen the naming decision.

## September 9 recovery source QA

- Re-read the current Drive locks, the September 8 autonomous prompt, the full About branch source, and the September 8-9 commit sequence before new work.
- Confirmed `main` remained unchanged while the About lab stayed isolated.
- Found one source-level accessibility defect in Route B: opening INCIDENTals visually hid `.bio` on desktop but did not remove the hidden biography from the accessibility tree.
- Confirmed the exact INCIDENTals body copy was not normalized across A, B, and C.
- Confirmed the mobile routes disabled the desktop sign-damp layer and depended on crop/darkening to demote the motel sign.

## September 11 recovery and new governing state

- Re-read recent Drive activity before continuing and found a newer About state that superseded the September 9 candidate logic.
- Recovered the public-name decision: `Last Stop` is an internal codename only. The diner and motel are unnamed in public-facing UI.
- Updated the visitor-facing About location line to `INT. MOTEL · ROOM 3 · NIGHT`.
- Recovered the three-candidate comparison: B refined, A refined, and an A/B hybrid. Route C is now historical interaction-control evidence only.
- Recovered the geography test: the locked Landing diner may appear through the Room 3 window only as distant, subordinate geography across the street and below the room.
- Recovered the Sep 11 copy kills: remove `Some rooms stay with you.`, reject `Ideas travel well.`, no VIEW WORK CTA, and no conventional INCIDENTals accordion/card/modal treatment.

## September 11 implementation reconciliation

- Found that only Route A had been updated to the new unnamed-geography direction in GitHub. Route B was still on the older public `Last Stop Motel` treatment, and no hybrid route existed.
- Added `/review/about/about-refined.css` so A, B, and hybrid use one shared visual system.
- Added `/review/about/about-refined.js` so the three finalists use one shared accessible CRT interaction.
- Added `/review/about/diner-window-crop.svg`, a crop definition using the locked Landing source rather than generated imagery.
- Updated Route A to the shared system.
- Updated Route B to the Sep 11 refined copy, neutral public naming, shared geography, and corrected accessibility behavior.
- Added `/review/about/route-hybrid/index.html` as the controlled A/B copy hedge.
- Normalized INCIDENTals body copy across the three current candidates.

## September 11 real browser QA

- Used Chromium with Playwright to render the exact branch-local HTML/CSS/JS and real Room 3/Landing assets.
- Direct localhost and `file://` navigation are blocked by the execution environment, so the browser used `page.set_content` with the branch structure and inlined local assets. This is real browser layout/pixel/interaction QA, not deployed-URL QA.
- Rendered A refined, B refined, and hybrid at 1440x900, 1366x768, 1024x768, 430x932, and 390x844.
- Ran INCIDENTals open/close interaction checks, keyboard focus checks, Escape dismissal, reduced-motion checks, and console/page-error checks.
- Verified no horizontal document overflow across the tested combinations.
- Verified zero page/console errors in the tested combinations.
- Verified the CRT hit area remains comfortably larger than the minimum pointer target at all tested sizes.
- Verified opening INCIDENTals marks the hidden bio `aria-hidden` and `inert`; Escape closes the state and returns focus to the CRT.
- Verified reduced-motion removes the relevant transitions.

## September 11 visual corrections from QA

- Found a 1024 tablet clipping defect caused by the cover-scaled stage. Corrected the copy territory for 761-1150px widths.
- Found that hiding the desktop window treatment on mobile exposed the old readable motel sign in the Room 3 source. Corrected the mobile crop so the old public motel name is fully offscreen while the CRT remains visible.
- Found the first Landing-in-window treatment too dark and patchlike. Replaced it with a restrained right-side warm-window crop from the locked Landing source that contains practical light and human trace but no readable portfolio typography.
- Ran grayscale, heavy-blur, and brightness-lift diagnostics on the corrected B desktop render.
- Verified the diner/window trace remains materially quieter than the CRT, live copy, and Room 3 practical light and does not reveal readable Landing typography under brightness lift.

## September 11 current judgment

1. **B refined leads.** `English Lit. Leather jacket.` supplies human signal, while `I'm Ian. Creative director and copywriter.` follows immediately enough to preserve professional comprehension.
2. **A refined remains the safe control.** It is fastest and clearest but more conventional.
3. **A/B hybrid is third.** The personal beat reads as appended after an already complete professional introduction, so it adds copy without matching B's personhood advantage.
4. Route C remains historical interaction-control evidence only.

## Remaining debt before merge

- Ian still needs to select the finalist.
- `PAUSE II` remains baked into the current Room 3 source. A clean source plate has not been located. Do not cover it with a visible CSS patch.
- A deployed unique-preview QA remains useful once a safe non-promoting deploy path is available.
- No merge or promotion until Ian approves the selected About direction.
