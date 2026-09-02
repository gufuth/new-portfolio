# Last Stop Diner — Master Handoff v7

> **STATUS: CURRENT SOURCE OF TRUTH.** Dated 2026-09-02. Supersedes `2026-08-11-master-handoff-v6.md` for current implementation state and next actions.

## Current state

Ian explicitly authorized autonomous implementation on 2026-09-02: secure usable imagery for all nine cases, populate all nine billboards, build Porsche and a contrasting second case, lock the case system, establish mobile behavior, roll out the remaining seven, refine imagery later, polish interaction, QA, and test/launch through Netlify.

That authorization supersedes v6's implementation stop condition around the July 15 WORK render.

### Current nine-case cast

WORK:
1. Nike SB × Staple — Panda Pigeon
2. Virgin Galactic — Unity 22
3. Porsche × Lucasfilm — The Designer Alliance
4. Selsun Blue — Dan Driff
5. MoneyLion × Beast Games — Beast Games Giveaway

MORE WORK:
6. TE Connectivity × Alita — The Science Behind Science Fiction
7. Jose Cuervo — Playamar + Tradicional Cristalino
8. Outdoor Voices — Let's Play
9. The Atlantic — Social voice

## Implementation in `main`

Merged PR #2 (`9d01f60ddc75231b9b8538ed071674d902c7ffc1`) added:
- `work.html`
- `more-work.html`
- `work-system.css`
- `case-system.css`
- nine direct case pages under `cases/`

LANDING, ABOUT, HEARSAY, 404, and their existing runtime image assets were not changed by that merge.

WORK / MORE WORK now use direct semantic case links, live Client + Project IDs, whole-billboard hit areas, restrained hover/focus, persistent navigation, direct case URLs, and index-first mobile behavior. Project artwork is independent and replaceable.

## Case-study system

All nine case pages use one restrained recruiter-first editorial system: dark site frame, dirty-cream field, native campaign color, project-native accent, hook + role + campaign visual at the top, then Problem → Idea → Work → selected media → Proof → Previous / All Work / Next.

No themed project rooms, no case-file UI, no scroll-jacking. Unknown/bracketed publication fields were omitted rather than invented.

Permanent palette rule:

> **Last Stop can frame the work. It should not recolor the work.**

## Imagery

All nine cases have at least two authentic source options in the working image bank. Current implementation uses good-enough, replaceable working art by explicit Ian decision. Image perfection is not a blocker. Final art upgrades later should prioritize originals / official sources and production-controlled files.

## QA completed 2026-09-02

Structural QA confirmed:
- 9/9 case pages
- 9/9 desktop billboard links
- 9/9 mobile cards
- zero broken internal links in the new system
- one H1 per page
- zero duplicate IDs
- zero images missing alt text
- zero bracketed publication placeholders in new case pages
- complete Previous / All Work / Next cycle

Rendered-pixel browser verification could not be completed in the current execution environment because Chromium/Playwright navigation is blocked by administrator policy. Do not call pixel QA complete until staging is viewed in a normal browser.

## Netlify

Existing site `last-stop-diner`, site ID `7b4083c6-3e6a-4e85-81bf-1368f14a6afa`, still serves the older July 11 upload-based deploy and was intentionally left untouched.

A separate staging project was created:
- `last-stop-diner-staging`
- site ID `a01e14a9-cc73-4b33-a657-6bc4671a59a3`

A staging source package was prepared locally with WORK, MORE WORK, all nine cases, shared CSS, a temporary staging index, and a work plate. Netlify requires an `npx @netlify/mcp` CLI handoff for upload; the current runtime cannot reach npm/Netlify through the shell, so a successful staging deploy has not yet been verified. Do not call the new build live until Netlify reports a ready deploy.

## Remaining final-pass work

1. Deploy/view staging at desktop + mobile sizes.
2. Measure billboard registration against final WORK / MORE WORK plates.
3. Remove/replace any fake CSS motel trace that violates physical logic.
4. Tighten the case first viewport if needed so role + assignment + idea + strongest proof are faster to absorb.
5. Decide whether final case pages retain full FilmFrame rails or a quieter related utility line.
6. Upgrade/copy final production images, especially Selsun, MoneyLion, Alita, Cuervo, Atlantic poster frames.
7. Verify final role/credit language where public evidence is incomplete.
8. Add OG images, canonical metadata, sitemap/robots, analytics, and final domain cutover at launch.
9. Run keyboard, focus, reduced-motion, direct-entry, mobile, Back-state, and performance tests on the deployed build.

## Governing next move

Do not restart concepting. Do not reopen the nine-case cast. Do not block on perfect imagery.

**Deploy staging → rendered-pixel audit → surgical fixes → final asset/metadata pass → production cutover.**
