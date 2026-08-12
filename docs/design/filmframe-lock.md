# FILMFRAME — LOCKED (2026-07-03, operator-explicit)

The letterbox film frame is a locked, permanent element of the site. Every surface (landing, /work, ABOUT, HEARSAY, case pages) composes inside it.

## What it is
Thin black bars top and bottom, fixed, on every page. The bars carry small Geist Mono film-print metadata:

- Top left: `Ian Luna · Creative Director`
- Top right: `MMX — MMXXVI · Frame 001` (frame number varies per surface)
- Bottom left: scene marker, e.g. `EXT. THE LAST STOP DINER — DUSK` (varies per surface)
- Bottom right: live clock, `T 21:14 UTC`

Contact info and title live here permanently. The scenes stay clean of identity chrome.

## Why it is locked (the four problems it solves)
1. Gives contact info and title a permanent home on every surface without polluting the scenes.
2. Letterboxes the 16:9 plates gracefully at any viewport ratio.
3. Becomes the natural header grammar for case-study pages.
4. It is the world grammar made physical: the bars are the one element that tells a visitor "same film" as they move from diner to motel to wherever.

## THE RULE (operator-locked, non-negotiable)
**The bars never animate, never scale, and the text goes silent during cuts.**

This supersedes the May build's transition choreography. The deployed May version used the View Transitions API to scale the bars 14x during the letterbox close-and-hold, which blew the metadata text up to giant size (bug documented in `deployed_review_2026_05_30.md` item 12). The archived component still carries `view-transition-name: frame-top / frame-bottom` on the bars for that choreography. **When reviving: strip the view-transition-names from the bars.** Cuts happen behind static bars. During any scene cut, the meta text fades out and returns at rest.

## Source of record
- Component: `filmframe/FilmFrame.astro` (this folder). Pulled 2026-07-03 from GitHub `gufuth/new-portfolio` @ main, `src/components/FilmFrame.astro` (sha 95ce859). This version already has the meta-overlay fix applied: text lives in a `.frame-meta-overlay` sibling above the bars, not inside them.
- Original spec: `drafts/sidequest_portfolio_site/design_system_and_throughline_2026_05_27.md` item 1 ("Cinematic letterbox / film frame").
- Bug and fix history: `deployed_review_2026_05_30.md` item 12; `creative_review_5_0_moves_2026_05_30.md` (meta-text-out-of-bars fix, A9 white-flash cut).
- Full repo (Astro site, deployed to new-portfolio.ianr-luna.workers.dev via Cloudflare): github.com/gufuth/new-portfolio. Other components of interest there: GlobalGrain.astro, SignHotspot.astro, Payphone.astro, NeonSign.astro, AmbientAudio.astro.

## Dependencies when reviving
The component expects CSS custom properties from the old design tokens: `--frame-bar-h`, `--color-frame-bar`, `--color-muted`, `--color-cream`, `--font-mono`, `--text-3xs`, `--space-4`. Token source: `drafts/sidequest_portfolio_site/design_tokens_v1.md`. Values may be re-derived for the current warm grade; the structure stands.

## Per-surface scene markers (working set)
- Landing: `EXT. THE LAST STOP DINER — NIGHT`
- /work: `INT. THE LAST STOP DINER — BOOTH — NIGHT`
- ABOUT: `INT. LAST STOP MOTEL — ROOM 3 — NIGHT` (placeholder until ABOUT locks)
- Case pages: `INSERT — [PROJECT NAME]` or frame-number increments (decide at case-surface design)
