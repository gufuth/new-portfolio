# HEARSAY — v8 addendum (2026-07-10)

> **STATUS: CURRENT HEARSAY DETAIL WITH INTERNAL CHRONOLOGY.** Later sections supersede earlier entries inside this file. Current state: exact-photo v10 plate, live `hearsay.html`, live HTML captions, unlisted surface, and a still-open measuring pass. The v6 master handoff outranks this file on overall project state.

Extends HANDOFF.md (2026-07-09). Read that first; this records the v8 session.

## What happened

1. **Operator produced three Gemini mockups** (shared inline in chat, still not saveable to disk — same gap as HANDOFF §11; described in `references/gemini_mockups_2026-07-10.md`). Two were taped-polaroid walls (kill-listed style, but with live ingredients), one a framed salon wall at an angle with green neon. Operator verdict: more interesting than our renders, but still not the vibe.
2. **Key discovery — the photos are not generic placeholders to be supplied "later."** They are the exact found images live on ianrluna.com/testimonials (Squarespace CDN):
   - Sweets → `.../barber-bow-tie-coming-to-america-1.jpg` (Coming to America barbershop still)
   - Neighbor → `.../CEZqdujW8AAqaJd.jpg`
   - My mother → `.../mom2.jpg`
   - Gore Vidal → `.../gore-vidal.jpg` (actual Vidal portrait — note: real-person likeness; fine as his own existing site content, flagged for awareness)
   - Ex girlfriend → `.../images.jpg`
   These exact pictures get composited into the wall. Full URLs in `references/exact_photo_sources.md`.
3. **Diagnosis of why the Gemini mockups feel more alive** (agreed with operator): (a) photos are CAST — faces play the joke straight; (b) the ghost photo is a *gag* (duplicate caption peeking out), not just wear; (c) loud accumulated history (tape scars/residue); (d) the wall lives in the diner. NOT the tape-and-pin styling itself, which stays killed.

## v8 (raw = concept_renders/hearsay_wall_v10_v1/v2 — NOTE NUMBERING OFFSET, see below)

Prompt `_hearsay_prompt_v10.txt` = v9 raw prompt plus: tape residue/sun-faded rectangles/torn paper scars on the paneling; five CAST placeholder photos matching the real five in character (barber in bow tie, stern elderly woman, smiling middle-aged woman, distinguished man in suit with cigarette, casual young woman snapshot); torn-corner detail re-added; ghost photo upgraded to a half-hidden smaller frame, bleached nearly blank. Everything else carried from v7: dead-on frontal, mismatched frames, blank cream mats (bottom third, for HTML captions), pink/magenta "...RSAY" fragment, ledge with ticket spike + matchbook, heavy grain, no text anywhere.

Two seeds rendered (one duplicate fire during pipeline debugging, ~$0.12 total):
- **v8a** (`hearsay_wall_v8a_treated.png`, from raw v10_v1) — sconce visible in frame (physics test explicit), denser cluster, heavier residue, ghost frame most bleached, subtler neon. Recommended primary.
- **v8b** (`hearsay_wall_v8b_treated.png`, from raw v10_v2) — bigger legible RSAY + wall glow, looser spread, better torn corner (real notch on mother's photo), ghost frame shows a faint image instead of blank.
Operator has not picked yet.

## RAW-vs-NARRATIVE NUMBERING TRAP (applies to the whole renders history)

`concept_renders/hearsay_wall_vN_v1.png` files are numbered by dispatch count, NOT by the narrative version in HANDOFF.md. Mapping: raw v7 = narrative v5, raw v8 = narrative v6, raw v9 = narrative v7, raw v10 = narrative v8. The `_treated.png` files follow narrative numbering. Anyone regenerating "from the v7 prompt file" gets narrative v5. Prompt .txt files at corridor root DO follow narrative numbering except _hearsay_prompt_v10.txt (named to match its raw label).

## Pipeline quirks learned this session (desktop-commander lane)

- desktop-commander + PowerShell launches python as a detached "document": returns rc 0 in <1s with NO stdout, while python actually runs async in the background. Do not interpret instant-exit as failure and re-fire (that duplicated one $0.06 render). Verify by file side-effects (render log + output files), never stdout. Piping (`| Out-File`) fails outright with "Cannot run a document in the middle of a pipeline."
- cmd shell mangles quoted arguments (as MASTER_HANDOFF warned).
- Working pattern: `& "<python.exe full path>" script args`, then poll expected output files via pz_file_read.
- plan.json status was already "open" and active corridor correct this session — checked BEFORE firing, per HANDOFF §9.

## Next steps

1. Operator picks v8a or v8b (or requests merge pass).
2. Composite the five exact site photos into the chosen plate's frames (dead-on angle keeps this simple; PIL or re-render with image input). Photos should get the same aged-print treatment as the plate so they sit IN the world.
3. HTML caption layer, 5 distinct legible hands (HANDOFF §5) — plus new idea now possible: the bleached ghost frame's mat gets a *faded duplicate* of Sweets' caption in HTML, landing the mockups' re-hung-review gag without baking text.
4. Build hearsay_live.html per about_live.html pattern; wire into _build_site.py.


## v9 (2026-07-10, raw = concept_renders/hearsay_wall_v11_v1.png -> hearsay_wall_v9_treated.png, CURRENT BEST, supersedes v8a/v8b)
Operator: RSAY letters were not good — replaced with faint diffuse pink glow from off-frame right, nearest frame glass catches pink sheen. Livening pass (fusion dispatch brainstorm, .002, filtered through kill lists) added: payphone bolt holes in the paneling (the rejected HEARSAY venue lives on as a scar — three raw holes where the phone was unbolted), spiderweb-cracked glass on the gilt frame (lands on Gore Vidal: genius behind broken glass), brittle dried rose tucked behind the Neighbor frame, chewed pencil stub on the ledge (the diegetic instrument of the future handwritten HTML captions), permanent water-ring stain on ledge, sixth frame cropped at left edge (wall continues). Cut from brainstorm: gum, spiderweb/dragonfly wing, tally notches, paperclip, gaffer residue (kill-list/too-small/redundant). All v8 ingredients carried. Differentiation now carried by objects + light, not signage letters.


## hearsay_live.html prototype (2026-07-10, corridor root)
Operator flagged in-mat captions would never be legible (v6 preview had already proven it). Built the FOCUSED-CAPTION pattern instead: mats stay blank in the plate; hover/click/focus a frame = lamp-lift (per /work grammar) + that caption renders in one fixed legible line (viewport layer, above the ledge band), each speaker in a distinct Google-Fonts hand (Caveat=Sweets 44px, Patrick Hand=Neighbor, Dancing Script=Mother, Pinyon Script=Vidal, Nothing You Could Do=Ex; local Segoe fallbacks). Arrow keys cycle in escalation order; loads with Sweets active (zero instructions). Ghost frame = easter-egg hotspot: shows faded cut-off duplicate of Sweets caption at 34% opacity (the re-hung-review gag, now interactive). aria-live narration, mono index line (HEARSAY - N OF 5), mobile <720px falls back to index-first quote list per lock 6. Stage = 1536x864 16:9 window over the 3:2 v9 plate, crop biased 78% low to keep the ledge; production should do a real _crop.py 16:9 pass. Sound: none (bell belongs to the door). One ambient motion: none — all light changes are interaction feedback.
Verified in Chrome via _serve.py (127.0.0.1:8791, cache-busted): caption legible at 1568px viewport, hover/focus switching works, no bar violations. Fixed during verify: caption originally in stage coords got cover-cropped below the fold on wide viewports — moved to viewport layer like .exits; then de-stacked to a single inline line so it stops covering the mother frame.
OPEN: hotspot rectangles eyeballed off the plate, not measured (quality contract says measure — do a luminance/edge pass before lock); Vidal quote at 46px runs near right edge on narrow-wide viewports; exact site photos still not composited (captions currently sit under placeholder faces).


## Prototype revision 2 (2026-07-10, post-operator review)
Operator: caption copy hard to read over mid-tone wall (real); cream nameplate mats now purposeless since captions moved out of them; nothing invites hovering (something missing).
REVIEWS RUN: whetstone dispatcher returned ZERO findings from 4 models — its v2 rubric is copy-tier and could not grip a UX surface; an empty review of a surface with three confirmed complaints is a tool mismatch, NOT a pass (logged so nobody mistakes it). Re-ran as ensemble design review: only gemini-2.5-flash returned (gpt-5.5 + sonar-pro timed out at 120s), cost .0026. Its diagnosis of the missing thing: THE ABSENCE OF AN INVITATION — page is a still life until interaction; the entrance beat is the handshake.
FIXES SHIPPED: (a) bottom scrim gradient (night pools at the floor of the shot) — caption now cream-on-near-black, fully legible, verified in Chrome; (c) one-time entrance roll-call on load — each frame lifts 300ms in reading order then settles on Sweets; threshold event, never repeats, reduced-motion skips straight to state; interrupted instantly by any user interaction; (NEW per ensemble) light-spill below the active frame — the lift light falls down the wall toward the caption band, tying speaker frame to copy with one shared practical light; stronger lift alpha (.16 to .24).
DECLINED WITH REASON: whole-room dip on selection (page always has a selection = permanent re-grade, not feedback); mono instruction line CLICK OR HOVER A PORTRAIT (the exact on-the-nose pattern the bar-nav decline killed; entrance beat + index line carry discoverability); ghost re-render as sepia artifact (P3, revisit only if the easter egg confuses in testing).
STILL OPEN / NEXT: re-render plate WITHOUT cream nameplate mats (full-bleed photos in frames) as part of the exact-photo composite pass — operator confirmed mats are vestigial now; hotspots still eyeballed (measure before lock); the two ensemble peer timeouts are an infra note for the dispatcher stack.


## v10 (2026-07-10) - EXACT PHOTOS COMPOSITED, MATS RETIRED. CURRENT BEST.
The five real photos from ianrluna.com/testimonials (references/exact_photos/) composited FULL-BLEED into the raw v11 render openings via scripts/_composite_exact_photos.py, then re-treated -> hearsay_wall_v10_treated.png. Cream nameplate mats are gone (covered), per operator: captions live in the HTML layer now, mats were vestigial. Per-slot treatment keeps the mixed doctrine: Vidal + Neighbor to warm b&w, Sweets/Mother/Ex faded warm color; 0.4px print softness; edge shadow so prints sit under glass; pink neon spill re-applied to Vidal glass (the baked sheen was overwritten by the paste). Casting note: Neighbor photo is a man mid-bite of a sandwich - deadpan gold. KNOWN LOSS: the spiderweb crack on the gilt frame glass is now mostly covered by the photo; a corner of it survives bottom-right. If the crack matters, add a drawn crack overlay pass or re-render later. Live page hearsay_live.html now points at v10 (hotspot geometry unchanged). Numbering map: raw v11_composited_v2 -> narrative v10_treated. Photos are personal-likeness content (mom, ex, film still, Vidal portrait) already published on the operator site - reused as-is at his direction.


## Prototype revision 3 (2026-07-10) - SPEECH-ADJACENT CAPTIONS
Operator on rev2: copy still not legible enough, no visible invite, counter unwanted, and the key note - the quote should pop up NEXT TO the person saying it, not in an isolated zone. Rebuilt the caption layer: per-speaker caption anchors in stage space beside each frame (Sweets right of frame, Neighbor left, Mother right, Vidal below, Ex right, ghost near ghost). Legibility without UI cards: each caption sits in a local pocket of feathered darkness (radial gradient, no edges) + heavy text shadows; per-slot hand sizes tuned (Vidal Pinyon down to 34px to fit below his frame). Counter REMOVED entirely. Invitation: resting state now demonstrates the mechanic (page loads with Sweets speaking beside his own face) + one self-retiring mono affordance line under the first caption - ( the others talk too ) - in the About-page affordance register; disappears permanently on first user interaction. Roll-call entrance kept. Verified in Chrome across squat + normal viewports: Sweets/Neighbor/Vidal checked frame-by-frame; two placement bugs caught and fixed during verify (Sweets clipping top bar; Vidal left-side placement ran across the Neighbor photo and clipped the attribution - moved below his frame). Standalone embed refreshed. Caption anchors are stage-space px and survive cover-crop at tested ratios; still eyeballed not measured - same open flag as hotspots.


## Prototype revision 4 (2026-07-10) - INVITATION + BOLT-HOLES WHISPER
Whetstone pass (logs/whetstone_hearsay_wall_2026-07-10.md) finally gripped: P1 killed the wholesale /work speaker-index import (the wall is discovered, not catalogued; connective-tissue complaint is atmospheric not navigational); P2 killed ASK THE WALL as hollow cleverness (house register is literal). Shipped per verdict + operator approval: (1) permanent quiet mono line bottom-right, POINT AT A FRAME - exactly /work CLICK A SIGN register and corner; temporary self-retiring invite line removed. (2) Payphone bolt-holes hotspot: hover/focus yields faded mono apparatus whisper - the payphone took the messages. its gone. - lore tissue to the rejected venue (concepts doc #2, May build Payphone.astro). No lamp-lift on the holes (not a frame); aria + reduced-motion handled. Ticket-spike click-to-cycle remains OPTIONAL, not built, operator has not called it. Verified in Chrome; standalone embed refreshed. Whetstone harness note: 2 of 4 critics truncated on token ceiling (run_critiques max_tokens) - infra fix flagged.


## Bolt-holes visibility fix (2026-07-10, late)
Operator could not find the holes - crushed in shadow, egg unfindable. First attempt (multiplicative dodge) invisible on dark pixels. Shipped fix: PAYPHONE GHOST PATCH - a faint pale rounded-rect fade (26% blend toward the plate's existing fade-mark tan) where the phone body hung, measured hole centers (img y 684/744/803) re-darkened to punch through; same visual grammar as the paneling's other sun-fade scars so it reads as 'something hung here' at a glance. scripts/_payphone_ghost_patch.py; pre-patch plate kept at hearsay_wall_v10_treated_predodge.png. Hotspot + whisper repositioned to measured hole location (spot stage 826,502 84x232; whisper 764,692). Standalone embed refreshed.
