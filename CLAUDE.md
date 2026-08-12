# CLAUDE.md — context for AI agents working in this repo

> **STATUS: CURRENT COMPATIBILITY GUIDE.** `AGENTS.md` and `docs/handoffs/2026-08-11-master-handoff-v6.md` are authoritative. If this file conflicts with either, they win.

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

Repository metadata points to **https://last-stop-diner.netlify.app**. Current production host/domain approval is `IAN DECISION REQUIRED`.

## Locked decisions — do not re-litigate

**Stack:** plain HTML/CSS/vanilla JS. No framework, no build step. Each page is
self-contained (styles and scripts inline). No `site/` output, build script, or
verified deployment configuration is checked in. Deployment is `IAN DECISION REQUIRED`.

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

## Current status (verified against checked-in files, 2026-08-11; live host unverified)

| Surface | Status |
|---|---|
| Landing | Implemented. Directed threshold out to /work; quiet fade to About; silent threshold to Hearsay. Arrival settle when coming from inside. |
| /work | Implemented. Sign cabinets show the legacy Go/ESPN, Hometown/HBO, Quiet Issue/NYT cast. A July 15 real-cast render exists but is **UNAPPROVED / NOT DEPLOYED**; audit it before planning changes. |
| /about | Implemented. Foot-of-bed motel plate + TV composite; face is a stand-in and bio is provisional. |
| /hearsay | Implemented but unlisted (`noindex`). Exact site photos are composited into the plate; five live HTML captions use distinct handwriting fonts. Hotspot coordinates are documented as eyeballed, not measured. |
| Case study pages | **Not built.** Drafts and a page spec exist, but brackets, sources, hooks, credits, and real shipped lines remain open. |

## Ship blockers (owner: Ian, not the agent)

- Pick real hooks per case (`docs/case-copy/hook-decision-sheet-v1.md`)
- Name the unnamed ideas: Cuervo, Atlantic, Vans, SCOOBA
- Replace every `[bracketed]` placeholder number with real, sourced data — if the real number is smaller than the placeholder, the number wins, never the narrative
- Real "lines I wrote" per case (the highest-value empty slot in the whole book)
- Reconcile the final case manifest and book size
- Decide whether the July 15 `/work` render is reference-only, a surgical correction base, or rejected
- Complete factual metadata, credits, source citations, and the final verification gates

## Known gotchas

- **Deployment is unresolved.** Historical documents prescribe Cloudflare;
  root metadata points to Netlify; no deployment configuration is checked in.
  Treat the host, domain, deploy command, and rollback lane as `IAN DECISION REQUIRED`.
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

- `index.html`, `work.html`, `about.html`, `hearsay.html`, `404.html` — the checked-in runtime pages.
- `*.webp`, `og_*.png`, `favicon.png` — plates and social cards.
- `docs/decisions/` — current open decisions and status-labeled historical stack/host records.
- `docs/handoffs/2026-08-11-master-handoff-v6.md` — current source of truth.
- `docs/doctrine/` — faithful source transcriptions, subordinate to project law.
- `docs/runbooks/` — verified local-development procedure and deployment stop conditions.
- `docs/design/` — quality contract, FilmFrame lock, softlock, build plan, vibe distillation.
- `docs/case-copy/` — the full, gauntlet-tested case study copy book.
- `docs/hearsay/` — HEARSAY-specific handoffs.
- `docs/history/` — project history index, queued next moves.
- `docs/renders/` — organized render archive, runtime-asset copies, and verification screenshots.

Additional review logs, scripts, and dated iteration notes may live outside
this repo in the Project Zero workspace, `drafts/pz_portfolio_last_stop_diner/`.
This repo holds the site, the organized render archive, and distilled,
decision-grade documentation — not necessarily every working artifact.
