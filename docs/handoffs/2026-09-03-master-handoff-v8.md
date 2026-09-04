# Last Stop Diner — Master Handoff v8

> **STATUS: CURRENT SOURCE OF TRUTH.** Dated 2026-09-03. Supersedes `2026-09-02-master-handoff-v7.md` for current implementation state and next actions. Historical handoffs remain useful for lineage only.

## 1. What changed in v8

Ian explicitly directed an autonomous implementation sprint for the connective tour system after correctly identifying that the prior build had WORK/MORE WORK and case pages in source but did **not** yet have the designed transitions, ambient road life, unified rails, sound behavior, or return-state behavior.

That runtime is now implemented in `main`.

New shared runtime files:
- `tour-runtime.css`
- `tour-runtime.js`

Regression audit:
- `scripts/verify-tour-runtime.mjs`
- `.github/workflows/verify-tour.yml`

The runtime is wired into:
- LANDING
- WORK
- MORE WORK
- ABOUT
- all nine case-study pages

**HEARSAY is intentionally excluded from this runtime integration pass.** Ian is actively developing the current Hearsay apparition direction separately; the checked-in framed-photo implementation is known superseded and must not be polished or treated as current.

## 2. Governing transition law

The tour uses **edits, not travel simulation**.

- no camera fly-through
- no walking animation
- no 3D ride
- no sign growth
- no prerequisite theater before work
- FilmFrame bars stay fixed while scenes cut beneath them
- reduced-motion users get immediate navigation without arrival animation

The purpose of the transitions is continuity and orientation, not spectacle.

## 3. LANDING → WORK

Implemented behavior:

1. The physical LANDING WORK hotspot remains the entry.
2. On click, the runtime measures the **actual rendered `#hotWork` rectangle** with `getBoundingClientRect()`.
3. That rendered window/sign territory becomes the geometric origin of a black exposure cut.
4. The black region expands to the full scene over roughly 430ms.
5. Navigation occurs at roughly 445ms.
6. WORK arrives from black with one brief, faint **non-letter green contamination** at the left side of the interior frame, then settles.
7. Top and bottom rails remain fixed and do not scale or fly with the scene.

This replaces the old implementation that used a WORK-area voltage flicker, UTC clock, old frame metadata, and a slower bell/flicker-to-black threshold.

The old legacy Landing runtime was removed from `index.html`.

## 4. WORK ↔ MORE WORK

Implemented behavior:

- bottom navigation is the primary mechanism
- click WORK / MORE WORK
- rails remain fixed
- one dark vertical architectural band / mullion grows into the cut over ~175–180ms
- destination scene reverses out of that band over ~230ms
- no lateral camera pan
- no simulated walking to another booth
- reduced-motion = immediate navigation

This is intentionally quieter than LANDING → WORK.

## 5. Billboard → case-study transition

Implemented behavior:

1. Whole billboard remains the semantic link.
2. Selected billboard receives a slight exposure lift.
3. Other boards drop only slightly in brightness.
4. After ~75ms the scene begins a short black cut.
5. Case navigation occurs at ~215ms.
6. Case page resolves from black.

Case-to-case Previous / Next links use the same restrained cut at ~135ms rather than a cinematic ride.

The case pages remain evidence mode; the tour does not force diner scenography into them.

## 6. Return / Back-state behavior

Implemented with session state:
- source surface (`work` or `more`)
- selected case ID
- pending focus restoration

When the visitor returns to the appropriate WORK surface, focus is restored to the correct visible billboard/card without scrolling the page unexpectedly.

The runtime distinguishes desktop billboards from mobile cards and focuses whichever representation is actually visible.

Case-to-case navigation now updates the remembered case and its owning WORK/MORE WORK surface, so returning after moving through cases does not incorrectly focus the original project.

Global WORK/MORE WORK navigation from a case clears stale restoration state rather than surprising the visitor later.

## 7. Top and bottom FilmFrame bars

Current shared grammar:

Top:
- `IAN LUNA · CREATIVE DIRECTOR`
- surface/location metadata, e.g. `EXTERIOR · THE LAST STOP DINER · NIGHT` or `INTERIOR · THE LAST STOP DINER · NIGHT`

Bottom primary navigation:
- HOME
- WORK
- MORE WORK
- ABOUT
- HEARSAY
- CONTACT
- SOUND OFF / SOUND ON

Rules:
- active surface remains visible
- rails do not animate during cuts
- at narrower widths, nonessential right-side metadata disappears before primary navigation is compromised
- nav can horizontally scroll on small screens
- focus remains visible

ABOUT now uses the same primary rail instead of the older separate gold exit links. The Room 3 plate and factual short bio remain unchanged.

## 8. Sound behavior

Permanent default is now:

> **SOUND OFF**

The preference is shared through `localStorage`.

The runtime does not play audio on load.

The sound control is a real button with `aria-pressed` and an explicit accessible label.

Because browser audio permission is gesture-gated, the WebAudio context is primed only through a user gesture or by the act of enabling sound.

The old LANDING `Sound · On` default was removed.

## 9. Rare road life on WORK / MORE WORK

The single ambient-motion family for the two WORK surfaces is now a passing-road-light event.

Normal timing:
- first eligible event: randomized roughly **38–75 seconds** after arrival
- subsequent events: randomized roughly **90–210 seconds**

Behavior:
- weak off-axis headlight contamination crosses the road/glass
- a faint glass glint follows the same physical event
- no visible cartoon car is required
- no repeating loop
- nothing happens on mobile
- nothing happens for reduced-motion users

If sound is enabled, the same event can produce a very quiet synthesized passing-car sound:
- filtered broadband tire/road noise
- low engine/road rumble
- left-to-right stereo movement
- no external sample dependency

This is **one event family**, not separate headlights + car + neon + fog + rain systems.

For staging QA only, appending `?tourTest=road` to WORK/MORE WORK triggers the **first** road event after approximately five seconds. Normal subsequent timing remains rare. The test hook has no visible UI.

## 10. Current WORK / MORE WORK build

WORK contains five direct cases:
1. Nike SB × Staple — Panda Pigeon
2. Virgin Galactic — Unity 22
3. Porsche × Lucasfilm — The Designer Alliance
4. Selsun Blue — Dan Driff
5. MoneyLion × Beast Games — Beast Games Giveaway

MORE WORK contains four:
6. TE Connectivity × Alita — The Science Behind Science Fiction
7. Jose Cuervo — Playamar + Tradicional Cristalino
8. Outdoor Voices — Let's Play
9. The Atlantic — Social voice

Every billboard:
- is a direct semantic link
- has Client + Project visible at rest
- uses independently replaceable artwork
- has a matching mobile card
- does not require hover to identify the project

Current imagery remains good-enough working art by explicit Ian decision. Final art swaps must not block implementation.

## 11. Case-study system

All nine cases remain built in the recruiter-first shared editorial system.

Current sequence:
- Hook
- Role
- Idea
- strongest available proof
- dominant campaign image
- Problem
- Work
- selected media / actual copy where useful
- defensible proof
- Previous / All Work / Next

The Sept 3 audit removed duplicate idea passages and removed weak provenance/descriptive statements that were masquerading as proof.

No case should be padded to match another case's length.

## 12. Source-level QA now automated

`scripts/verify-tour-runtime.mjs` audits:
- runtime loaded on all intended surfaces
- correct surface flags
- 5 WORK / 4 MORE WORK billboard cast
- case IDs
- all nine case runtime integrations
- old Landing clock / frame metadata / sound-on / voltage / dead keyboard system removed
- ABOUT unfinished language absent
- SOUND OFF default
- rare road intervals
- reduced-motion support
- rendered hotspot measurement for the Landing cut
- Back-state implementation
- CONTACT injection
- no infinite animation in the tour runtime
- required Netlify clean routes

`.github/workflows/verify-tour.yml` runs:
1. `node --check tour-runtime.js`
2. `node scripts/verify-tour-runtime.mjs`

A full run against the post-runtime state completed successfully on GitHub Actions on 2026-09-03/04 UTC. Source syntax and wiring therefore have an independent executable check rather than relying on the agent saying the code looks correct.

## 13. What is NOT yet certified

**Rendered-pixel quality is not certified.**

The current execution environment still cannot complete normal Chromium/Playwright visual navigation, and the new GitHub source is not yet successfully deployed to the Netlify staging project.

Therefore the following remain staging gates, not completed claims:
- exact perceived quality of LANDING → WORK cut
- exact mullion location/timing WORK ↔ MORE WORK
- headlight opacity / speed / physical plausibility
- synthesized road sound volume / realism
- final billboard registration and ID-band proportions
- repeated WORK lamp correction
- MORE WORK motel prominence/aging
- case typography/crop rhythm at real viewport sizes
- mobile rendered-pixel QA
- browser Back behavior in a real deployed session
- CWV / field performance

Do not convert source implementation into “visually approved” until those are viewed.

## 14. Staging state

Netlify staging project:
- `last-stop-diner-staging`
- site ID `a01e14a9-cc73-4b33-a657-6bc4671a59a3`

The connector can manage the project but its static upload operation still hands off to a local `npx @netlify/mcp` command that the current runtime cannot reach.

The clean solution remains to connect the staging project to GitHub repo `gufuth/new-portfolio`, branch `main`, publish directory repo root, no build command. Once Git-connected, every runtime correction can be visually checked immediately.

Existing old `last-stop-diner` deployment remains intentionally untouched.

## 15. Governing next move

Do **not** reopen the tour concept.

Do **not** rebuild the transitions from scratch before seeing them.

Do **not** polish the superseded HEARSAY wall; Ian is separately progressing the current Hearsay direction.

Next sequence:

**Git-connect Netlify staging → inspect runtime at real pixels → tune only named visual/audio defects → merge current Hearsay → localize final production media → metadata/accessibility/performance pass → production-domain cutover.**

The transition/runtime architecture now exists. The next meaningful judgments are sensory ones, not another planning document.
