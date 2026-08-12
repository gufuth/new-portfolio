# CLAUDE.md — context for AI agents working in this repo

Read this before touching anything. Last stop diner is a hand-built, no-framework
site (plain HTML/CSS/JS, no build step) — not the Astro scaffold this repo used
to contain (that attempt is archived at `gufuth/new-portfolio-archive-astro-attempt`).
Design has been through 30+ rounds of adversarial review; the decisions below are
locked for a reason. Propose changes, don't silently drift from them.

## What this is

Ian Luna's portfolio, codename **Last Stop Diner**. Every page is a cinematic
scene in one consistent world: a diner at night, shot like a 35mm film. Landing
= the diner exterior. /work = a booth looking at illuminated sign cabinets
across the street (the case studies). /about = a motel room. /hearsay = the
diner's back wall, testimonials as framed photos (unlisted, reached only
through the pink door).

Live: **https://last-stop-diner.netlify.app**

## Locked decisions — do not re-litigate

**Stack:** plain HTML/CSS/vanilla JS. No framework, no build step. Each page is
self-contained (styles and scripts inline). Deploy is `netlify deploy` from the
`site/` output of a local build script — not GitHub-triggered CI as of this
writing (see Open questions below).

**FilmFrame bars:** thin black letterbox bars, top and bottom, on every page.
Carry the identity chrome (name/title, frame number, scene slugline, live
clock) so the scenes themselves stay clean. **The bars never animate, never
scale, and their text goes silent during cuts.** Full reasoning:
`docs/design/filmframe-lock.md`.

**One motion source per surface, nothing decorative loops.** Landing: none.
/work: rare passing headlights. /about: TV static whisper. /hearsay:
interaction feedback only (hover/focus lifts a frame). Sound only fires on
gesture or threshold, never on load, never ambient loops.

**Color-to-section mapping:** WORK = lime green, ABOUT = red/amber neon,
HEARSAY = magenta/pink glow. Cinematography reference: Wim Wenders / Roger
Deakins / Robbie Müller grades — cool night sky, warm tungsten interior,
sodium-green key light, neon accents.

**Cuts, not crossfades.** The View Transitions API was evaluated and
**rejected** (2026-07-11): default crossfades fight the site's cut grammar,
and it has scar history with the FilmFrame bars (an earlier build scaled the
bars 14x during a VT-driven letterbox close). Threshold transitions use a
manual voltage-flicker / bell / blackout / exposure-settle sequence instead —
see the `<script>` blocks in `index.html` and `work.html`.

**Case study pages:** template is "INTO THE SIGN" — clicking a sign pushes the
visitor into it; the case page is that sign's paper at full bleed (cream
field, near-black ink). Full spec: `docs/case-copy/case-page-spec-v1.1.md`.
Case pages are not built yet (see Open items).

**The seven quality tests** (run before showing Ian anything substantial —
full text in `docs/design/quality-contract-v1.md`): stranger test, physics
test, squint test, same-film test, one-motion test, weirdness-budget test,
honesty test (no placeholder content anywhere a visitor can see it lit up).

## Current status (verified against Drive + local files, 2026-08-11)

| Surface | Status |
|---|---|
| Landing | Live. Directed threshold out to /work; quiet fade to About; silent threshold to Hearsay. Arrival settle when coming from inside. |
| /work | Live. Sign cabinets show **placeholder cast** (Go/ESPN, Hometown/HBO, Quiet Issue/NYT) — this is known-wrong against the real cast list in `docs/case-copy/` and is the top rebuild task. |
| /about | Live. Foot-of-bed motel plate + TV composite (stand-in face — swap when a real portrait lands). Working bio is placeholder-quality; real bio is a separate writing pass. |
| /hearsay | Live but unlisted (noindex). Real site photos composited in, 5 confirmed real quotes, speech-adjacent HTML captions in distinct handwriting fonts per speaker. Hotspot coordinates are eyeballed, not measured. |
| Case study pages | **Not built.** Copy is fully written and gauntlet-tested in `docs/case-copy/` — the page template exists only as a spec, not code. |

## Ship blockers (owner: Ian, not the agent)

- Pick real hooks per case (`docs/case-copy/hook-decision-sheet-v1.md`)
- Name the unnamed ideas: Cuervo, Atlantic, Vans, SCOOBA
- Replace every `[bracketed]` placeholder number with real, sourced data — if the real number is smaller than the placeholder, the number wins, never the narrative
- Real "lines I wrote" per case (the highest-value empty slot in the whole book)
- Rebuild /work's sign cabinets from the real cast list
- Real testimonial photos for HEARSAY (currently placeholders, though captions/quotes are real)

## Known gotchas

- **Deploy target may not match the README.** `wrangler.jsonc` from the old
  Astro attempt targeted Cloudflare; the actual live site is deployed to
  Netlify via CLI. A formal domain/host decision for the production build is
  still an open item (`docs/decisions/`).
- **Duplicate keyboard-drill-down script blocks.** Each HTML page currently
  has the same `<script>` block injected twice near the bottom. It's
  harmless (guarded by a `dataset.kbdDrilldown` check) but is dead weight —
  worth deduping next time a page is touched.
- **Raw-vs-narrative numbering trap on hearsay renders.** Render files are
  numbered by dispatch count, not narrative version — see
  `docs/hearsay/handoff-addendum-v8.md` if working on that surface.
- **`plan.json.status` must read exactly `"open"`** before an image
  dispatcher will actually save a render — a literal string check, not a
  semantic one. Cost a real $0.12 mistake once.

## Repo layout

- `index.html`, `work.html`, `about.html`, `hearsay.html`, `404.html` — the live pages.
- `*.webp`, `og_*.png`, `favicon.png` — plates and social cards.
- `docs/decisions/` — locked stack/host calls.
- `docs/design/` — quality contract, FilmFrame lock, softlock, build plan, vibe distillation.
- `docs/case-copy/` — the full, gauntlet-tested case study copy book.
- `docs/hearsay/` — HEARSAY-specific handoffs.
- `docs/history/` — project history index, queued next moves.

Deeper working history (renders, review logs, scripts, dated iteration notes)
lives outside this repo in the Project Zero workspace,
`drafts/pz_portfolio_last_stop_diner/`. This repo holds the site plus the
distilled, decision-grade documentation — not the full archive.
