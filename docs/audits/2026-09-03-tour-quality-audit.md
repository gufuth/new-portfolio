# Last Stop — 10/10 Tour Quality Audit

**Date:** 2026-09-03  
**Status:** current audit / release-gate companion to Master Handoff v7

## Purpose

Judge the current Last Stop portfolio as a complete hiring experience, not as a collection of attractive screens. This audit separates concept quality, implementation maturity, recruiter usefulness, accessibility/performance, and world continuity.

## The panel

This is a simulated expert council, not a claim that external humans reviewed the site. Each seat exists to create a different failure mode and prevent aesthetic self-confirmation.

1. **Executive creative director / recruiter** — Would I understand Ian's level, thinking, role and strongest work fast enough to keep clicking?
2. **Editorial graphic design director** — Hierarchy, proportion, typography, spacing, pacing, restraint, campaign-image fidelity.
3. **Cinematographer / production designer** — Same-film continuity, depth, practical light, physical plausibility, negative space, whether the world looks observed rather than art-directed for a portfolio.
4. **Interaction + accessibility lead** — Discoverability, focus, keyboard, target size, reduced motion, direct routes, mobile, Back-state.
5. **Front-end performance engineer** — LCP/INP/CLS risk, image ownership, remote dependencies, caching, layout stability.
6. **Copy / strategy director** — Hook, role clarity, idea clarity, proof, brevity, defensibility, no invented claims.
7. **World-continuity editor** — Swap Test, motif inflation, physical logic, palette firewall, whether a surface belongs without cloning another surface.
8. **Red-team skeptic** — If removing a device makes the work easier to access or understand, remove it.

## Release scoring

A numeric score is diagnostic only. A page cannot be called 10/10 while any hard gate fails.

**Hard gates**
- First-time visitor recognizes separate projects within about 3 seconds on WORK / MORE WORK.
- Named project is findable/openable without instruction in about 10 seconds.
- Case first viewport answers: what is this, what did Ian do, what is the idea, why did it matter.
- No visitor-visible placeholder, coming-soon interaction presented as functional, bracketed metric, invented credit, or filler proof.
- All primary actions keyboard accessible with visible, unobscured focus.
- Mobile is an intentional experience, not a scaled desktop composition.
- Campaign art is not recolored to match Last Stop.
- No surface requires theatrical interaction before the work can be reached.
- Production media is controlled/reliable enough that third-party hotlink failure cannot break the book.
- Staging rendered-pixel QA passes desktop and mobile before domain cutover.

## Panel score — current implementation

| Surface / system | Current | Why it is not a 10 yet |
|---|---:|---|
| LANDING visual concept | 9.7 | Locked north star. Remaining risks are implementation-level, not a need to reconcept. |
| LANDING interaction / metadata | 7.4 | Current source defaults sound on, carries stale Netlify OG metadata, and still includes legacy dead script. Physical sign navigation itself remains strong. |
| WORK visual direction | 8.7 | Same-world continuity is strong. Current working plate still has over-regular billboard rhythm / repeated centered lamps and needs final live-art pixel verification. |
| MORE WORK visual direction | 8.8 | Distinct booth geometry works. Motel geography is useful but must remain background; final physical sign age/prominence needs pixel review. |
| WORK / MORE WORK UX | 9.0 | Direct semantic links, at-rest IDs, whole-face hit targets, mobile index, clean routes and restrained focus are the right system. Needs live pixel / keyboard / Back-state test. |
| Case-page information architecture | 8.8 | Recruiter gate is now strong: hook + role + idea + proof + dominant visual. Current pages unnecessarily repeat the exact idea again lower on the page. |
| Case-page visual system | 8.5 | Quiet evidence mode is correct and palette firewall is intact. Still needs a rendered typography/rhythm pass and a decision on whether fixed FilmFrame rails are too mechanically inherited from WORK. |
| Case content — strongest tier | 9.0 | MoneyLion, Porsche, Virgin, Nike carry clear idea + concrete evidence. Final sourcing/credits and stronger native media can still improve them. |
| Case content — middle tier | 7.7 | Alita and Atlantic have real anchors but include secondary statements labeled as proof that are actually description/provenance. |
| Case content — weakest tier | 6.9 | Selsun, Outdoor Voices and Cuervo currently rely on weak or non-quantified proof. Outdoor Voices has real shipped copy available and should show it instead of pretending generic statements are proof. |
| ABOUT implementation | 4.5 | Current source explicitly labels bio copy as placeholder and offers a TV interaction whose result is effectively "coming soon." This fails the project's Honesty Test. |
| HEARSAY implementation | 2.5 | Checked-in page is the superseded framed-photo/back-wall concept, not the later apparition-in-dark direction. It is correctly noindexed but cannot count as current tour quality. |
| Accessibility structure | 8.0 | Strong focus treatment and direct links on new work/cases. Older surfaces use custom role=button controls and need final target/focus/sound audit. |
| Performance / resilience | 6.8 | Static architecture is inherently light, but most case and billboard media is hotlinked to third parties and lacks controlled production delivery. Staging CWV is unmeasured. |
| Metadata / launch readiness | 6.5 | New work/cases have canonical metadata, but root surfaces are inconsistent; case OG cards are generic; sitemap/analytics/domain QA remain open. |

**Current tour score: ~7.6/10.** The core concept is significantly better than that score. The score is being dragged down by unfinished/stale surfaces and launch engineering, not by a need for another concept.

## Case-by-case judgment

### 01 Nike SB × Staple
**8.8 now.** Excellent hook, very clear idea, real sell-through proof. Keep. Remove duplicate idea lower on page. Native campaign imagery is good enough to build; final cover can improve later.

### 02 Virgin Galactic
**9.1 now.** One of the cleanest cases. Strong image, role, named idea, real reach/follower evidence. Remove duplicate idea lower on page. Final page should protect the negative-space photography.

### 03 Porsche × Lucasfilm
**9.2 now.** Best expression of the portfolio's "impossible idea, treated as ordinary" logic without forcing Last Stop onto the campaign. Remove duplicate idea lower on page. This remains the best master case for visual QA.

### 04 Selsun Blue
**7.4 now.** Excellent hook and memorable character idea. Current proof is weak and the Vimeo thumbnail is not final-cover quality. Do not invent metrics. Let the films/dialogue do the proof once source frames/lines are secured.

### 05 MoneyLion × Beast Games
**9.2 now.** Strong role, idea, business proof, cultural scale. Current square promo hero is serviceable rather than ideal; swap to a TVC/game-world frame later. Architecture is already good.

### 06 TE Connectivity × Alita
**8.1 now.** Shorty Gold is a legitimate anchor. The second "proof" is description, not proof. Better Weta/engineering imagery will raise the page quickly.

### 07 Jose Cuervo
**7.2 now.** Attractive real media and credible repeated relationship, but the current idea line reads partly like retrospective framing and proof is soft. Needs one harder anchor and a stronger poster frame before launch.

### 08 Outdoor Voices
**7.5 now.** The case has something the others need: daylight, human movement and real shipped copy. Current page hides its strongest evidence and substitutes weak generic proof statements. Surface the actual shipped lines instead.

### 09 The Atlantic
**8.2 now.** Strong restrained visual family and a real 41M-impression anchor. The second proof statement is merely asset provenance and should not be labeled proof.

## Visual council — WORK / MORE WORK

### Keep
- WORK = five-case lateral sweep, booth/mug foreground, road gap, dark right field.
- MORE WORK = four larger cases, more frontal bay, different foreground, motel geography.
- Dark field and ordinary-roadside scale.
- Campaign art as independent live layers.
- Cream at-rest ID strips.
- No scale-on-hover.

### Correct later, from pixels
- Repeated centered lamp above every WORK sign creates gallery regularity. Remove/disable several in the final plate; vary remaining fixtures/posts rather than decorating more.
- Motel sign should be more ignored/decayed and slightly less self-conscious if it competes with the fourth project.
- Re-check ID-band proportion only in the live scene. The current 24% band is larger than the 15% visual-law baseline, but shrinking it blindly would harm legibility on the smallest sign. Legibility wins; solve with final measured pixels, not doctrine.
- Do not globally add green/red to harmonize. Continuity should be local contamination only.

## Adversarial review of this audit plan

### Failure mode 1 — the council agrees because it is all one model
**Countermeasure:** use contradictory seats and external release criteria. Recruiter speed, WCAG, CWV and the anti-gimmick deletion test can overrule aesthetic preference.

### Failure mode 2 — 10/10 becomes endless perfectionism
**Countermeasure:** hard gates define release. Once a surface passes the gate and has no named material defect, stop iterating. Image perfection is not a blocker when swapping later is cheap.

### Failure mode 3 — code review gets mistaken for visual QA
**Countermeasure:** source audit and current working-image audit are marked separately. No final layout score becomes a release approval until staging is viewed at real desktop/mobile sizes.

### Failure mode 4 — fixing stale ABOUT/HEARSAY cosmetically makes them look current
**Countermeasure:** do not polish the wrong direction. ABOUT needs honest finished content/function. HEARSAY needs implementation of the later apparition direction rather than refinements to framed-photo code.

### Failure mode 5 — recruiter optimization sterilizes the site
**Countermeasure:** preserve theatricality on entry/WORK, but make cases ruthless evidence documents. Distinct modes are a feature, not inconsistency.

### Failure mode 6 — Last Stop palette contaminates campaign work
**Countermeasure:** permanent palette firewall remains binding: Last Stop can frame the work; it does not recolor it.

## Path to 10/10 — ordered by leverage

### P0 — truth and current-direction alignment
1. Replace ABOUT placeholder bio / fake reel affordance with a finished honest state. If no reel exists, remove the promise instead of simulating one.
2. Replace stale HEARSAY implementation with the locked/latest apparition-in-dark system using real photos + live quotes. Keep current old page noindexed until then.
3. Remove case-page filler proof and exact duplicate idea passages. Thin cases are allowed to be thin.

### P1 — staging visual proof
4. Get GitHub `main` onto Netlify staging through a Git-connected deploy lane.
5. Pixel-audit at minimum: 1440×900, 1366×768, 1024×768, 390×844, 375×667.
6. Test the recruiter tasks cold: identify projects, open Porsche, reach MORE WORK, return, direct-enter a case.
7. Measure final billboard registration and ID-band legibility against the actual plates.

### P1 — production media resilience
8. Vendor/localize the final hero + supporting media rather than hotlinking third-party sites wherever licensing/ownership permits.
9. Add explicit image dimensions / stable aspect reservations and responsive variants.
10. Final art-swap pass: Selsun, MoneyLion, Alita, Cuervo, Atlantic first; Nike/OV only if a materially better image exists.

### P2 — metadata / accessibility / performance
11. Case-specific OG cards; canonical metadata on root pages; sitemap/robots decision; analytics.
12. Sound OFF by default / opt-in everywhere.
13. Remove legacy dead keyboard-injection script from older surfaces after regression check.
14. Keyboard/focus/reduced-motion test across every surface.
15. CWV target at p75: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.

### P3 — production cutover
16. Only after staging passes: domain/DNS cutover, redirects from old portfolio URLs, final crawler check, form/contact check, analytics smoke test.

## Stop doing

- Do not restart WORK concepting.
- Do not wait for perfect billboard art before testing the system.
- Do not invent proof to make thin cases look thicker.
- Do not build another themed room for a case study.
- Do not polish the superseded HEARSAY wall.
- Do not point the real domain at an unviewed staging build.

## Definition of 10/10

The site is 10/10 when the theatrical world earns attention, the work is easier to retrieve because of the system rather than despite it, a recruiter understands Ian's level/role/ideas immediately, every case contains only defensible evidence, nothing unfinished masquerades as intentional mystery, mobile feels authored, accessibility and performance pass, and there is no remaining named defect with enough consequence to change a hiring decision.
