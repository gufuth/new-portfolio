# BUILD PLAN v2 — LAST STOP DINER

> **STATUS: SUPERSEDED / HISTORICAL.** This plan predates the implemented static site, decided HEARSAY wall, July copy-book reset, and July 15 `/work` render. Do not use its phase order, Astro revival, Cloudflare lane, or old cast as current instruction. Use the v6 handoff.

2026-07-03. Supersedes the June "Build Plan and Asset Notes" (Drive). That doc's layer architecture and interaction rules carry forward; this version folds in everything decided since: the /work soft-lock, the FilmFrame lock, the case-page pattern, the mobile grammar, and HEARSAY's content decision.

## LOCKED DECISIONS (the constitution of the build)
1. Landing: locked.
2. /work base: soft-locked (work_signs_v4_softlock_16x9.png).
3. FilmFrame letterbox: locked on every surface. Bars never animate, never scale, text silent during cuts. See FILMFRAME_LOCK.md.
4. Case pages: "the morning after" pattern. Quiet document-grade surface keeping three threads of the world: the grain (one pass), the sign-face typography, one practical-light cue. The world is the night; the work is the daylight of the same place.
5. Mobile: the index becomes the interface. Scene becomes darkened backdrop, one sign face as header, the soft-lock list full-bleed. No portrait plate generation.
6. HEARSAY: it is the testimonials surface, funny fake reviews kept, played dead straight. Venue PINNED (candidates in hearsay_concepts_v1.md, payphone recommended). Nothing builds until Ian picks.
7. Case studies are written after design locks. Beast Games is hero.
8. World bible (five lines, every surface inherits): entered through a threshold under 1.2s; always night; one locked camera at human height; practical light sources visible in frame; the FilmFrame bars are the constant.

## PHASES

### Phase A — ABOUT (now)
A1. Direction doc: about_direction_v1.md (this session). Operator sign-off gate.
A2. Plate: motel room in the CURRENT warm grade (not the May green-teal). Blank TV screen, controlled empty shadow void for copy, no baked nav or copy. gpt-image-2, functional prompt language, then the same film-treatment pass as /work, then 16:9 crop.
A3. Composites: TV screen content (paused B&W bio frame + optional short video), TV glow onto nearby surfaces, live HTML bio copy in the void.
A4. Live page: about_live.html prototype inside FilmFrame. One motion source (the TV).

### Phase B — /work production hardening
B1. Blank the four baked cabinet faces in the soft-locked frame (one controlled edit; raw backups exist).
B2. Composite all sign faces as live layers per the spec in site_creative_review_v1.md section 2: faces emit light, halation bleeds past cabinet edges, glass/rain layer sits ABOVE the faces, one shared grade and grain pass at the top of the stack.
B3. Stagger: two cabinets near, two far, a few degrees on one. Kill the even row.
B4. Accessibility: focus states = the lamp-lift hover treatment, aria-live on hero change, real text everywhere (composite gives this free), placeholder rows legible or collapsed to "+6 more".
B5. Honest index: ship 8 real projects over a padded 10.

### Phase C — Case-study surface (anatomy adopted 2026-07-07 from external design audit, operator-approved)
C0. CAST-LIST RECONCILIATION FIRST. The mockup signs (Go/ESPN, Hometown/HBO, Quiet Issue/NYT) do not match the rebuilt book (MrBeast×MoneyLion, Star Wars×Porsche, Nike SB, etc.). One master list of the real 8-10 projects becomes the single source of truth for signs, index, and case pages before anything else in this phase builds.
C1. Template: "INTO THE SIGN." The case page is the clicked lightbox at full scale: cream paper field, dark ink, maximum legibility; the world held at the edges (slugline strip top with case slug + frame counter, dark vignette margins, footer bar). Atmosphere frames the page, never sits behind text. The work is literally the light source. Transition honors the never-scale lock: the clicked sign burns to white, cut, cream page.
   Page anatomy: (1) slugline strip; (2) the hook as the marquee, one large display-type moment; (3) context strip in small caps (client · year · agency · role), same treatment as the sign's subtitle line; (4) hero media immediately, work before words; (5) Problem → Idea in short paragraphs, the named idea gets the single mid-scroll display moment; (6) numbers as 2-4 stamped blocks, big figure + small sourcing line; (7) credits as end titles, team as film crew; (8) footer bar: NEXT SIGN → [next case] + "The counter's open: ianr.luna@gmail.com". No case page ever dead-ends.
   Rules: two typefaces total; body always dark-on-cream at full contrast; ~300 words + media, one screen-ish scroll; identical paper surface across all cases. Mobile: straight vertical paper scroll, slugline strip pinned.
   DROPPED (2026-07-07, operator call): the "lines I wrote as screenplay pages" device — attribution records don't exist for every project, and claimed lines must be provable. May revive per-project ONLY where authorship is certain and documented; never as a template requirement.
C2. Beast Games written and built first (source: Drive "Beast Games Portfolio" + "Beast games vids"). Then remaining cases. Case walkthrough videos (60-90s), when they exist, live on the motel TV: "press play" per case.

### Phase D — HEARSAY (unblocks when venue is picked)
D1. Venue decision (operator). D2. Direction doc. D3. Plate + composite. D4. The reviews themselves: real-stamped copy work, deadpan register.

### Phase E — Threshold transition (last)
Click WORK: sign-voltage flicker, old door chime (user-gesture gated), exposure handoff, inside view. Under 1.2s. Behind static FilmFrame bars; meta text fades during the cut. Reduced-motion: plain crossfade, no chime.

### Phase F — Production build and ship
F1. Revive the Astro repo (github.com/gufuth/new-portfolio) or port to a fresh static build; re-derive design tokens for the warm grade; strip view-transition-names from FilmFrame bars per the lock.
F2. Performance — ELEVATED TO LOAD-BEARING (2026-07-07, operator: "very, very important"). The concept lives or dies on the world feeling effortless; a cinematic site that stutters reads as a student project. Plates as AVIF/WebP, preload the three frames, lazy-load case media, blurred placeholder behind each plate, grain once via overlay, honest total page weight. A renderer stall was observed twice during review on heavy PNG decode; treat smoothness as a design requirement, not cleanup. Do this work DURING case-page build, not after.
F3. Deploy via Cloudflare (existing lane), domain decision, meta/OG images (a sign face makes the OG card).
F4. Whetstone deep pass + accessibility audit before public.

## LAYER ARCHITECTURE (per surface, carried from June plan and extended)
Plate → subject composites (sign faces / TV screen) → treatment (glow, halation, glass, grime) → live HTML text layers (nav, index, copy) → interaction hit areas → shared grade + grain (once) → FilmFrame bars + meta overlay (top).

## STANDING TESTS (every phase gates on these)
- Stranger test: cold visitor on a phone reaches Beast Games and understands Ian's role inside 15 seconds and 3 interactions.
- Kill lists: Visual Rules doc (Drive) + the /work non-negotiables in MASTER_HANDOFF_v2.
- Physics test: nothing attractive-but-impossible survives review.
- One motion source per surface. No looping neon flicker anywhere.

## ORDER OF WORK FROM HERE
1. ABOUT direction sign-off (gate).
2. ABOUT plate + composites + live page.
3. /work hardening (B1-B5).
4. Case template + Beast Games.
5. HEARSAY when venue picked.
6. Transition, production build, ship.
