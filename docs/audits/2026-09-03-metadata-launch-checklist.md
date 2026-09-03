# Last Stop — Metadata, Accessibility & Launch Checklist

**Date:** 2026-09-03

## Root metadata corrections

Before production cutover:
- Landing canonical → `https://www.ianrluna.com/`
- Landing OG image → production-domain `og_landing.png`
- About canonical → `https://www.ianrluna.com/about/`
- About OG image → production-domain `og_about.png`
- WORK / MORE WORK canonical already use intended production-domain paths; verify after deploy
- HEARSAY remains `noindex` until the current apparition implementation replaces the superseded wall
- remove stale `last-stop-diner.netlify.app` social-card URLs from root pages

## Case metadata

Current case titles/descriptions are acceptable baseline, but every case currently shares generic `og_work.png`.

Create case-specific cards:
- `og_nike.png`
- `og_virgin.png`
- `og_porsche.png`
- `og_selsun.png`
- `og_moneylion.png`
- `og_alita.png`
- `og_cuervo.png`
- `og_outdoor-voices.png`
- `og_atlantic.png`

Each card should use authentic campaign imagery with native palette, project/client name and Ian Luna identifier. Do not turn OG cards into a second Last Stop art-direction layer.

## Sitemap / robots

Production sitemap should include:
- `/`
- `/work/`
- `/work/more/`
- all nine `/work/<slug>/` cases
- `/about/`
- `/hearsay/` only after current implementation is approved/indexable

Staging must remain non-indexable until production cutover.

## Accessibility launch gate

- Sound defaults OFF and requires user opt-in
- visible focus on every interactive element
- no focus obscured by fixed FilmFrame bars
- minimum 24×24 targets; target 44×44 for primary controls
- keyboard path reaches all primary destinations
- custom `role=button` interactions support Enter/Space or are replaced with native buttons
- no hover-only identification
- reduced-motion removes nonessential transitions
- 200% zoom retains navigation/content
- mobile rail can scroll without hiding current page state

## Performance launch gate

- localize critical remote media
- add width/height or stable aspect reservation to all production images
- convert GIF hero motion to poster still where motion is not essential
- lazy-load noncritical case media
- preload only the current-page LCP image
- immutable/long-cache hashed or stable production assets after final lock
- verify LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at p75 when field data exists

## Analytics / behavior

Instrument only useful hiring-flow events:
- WORK project open
- MORE WORK navigation
- case Previous/Next
- contact click
- resume/reel click if those assets exist

Do not track decorative hover states.

Useful questions after launch:
- Which case gets opened first most often?
- How many visitors reach a second case?
- Does MORE WORK get discovered?
- Which cases produce contact/resume clicks?
- Are mobile users dropping before a case opens?

## Cutover checklist

1. Staging pixel QA passes.
2. ABOUT and current HEARSAY are truthful/current.
3. Production media localized.
4. Metadata/OG/sitemap complete.
5. Accessibility keyboard/reduced-motion pass complete.
6. Performance pass complete.
7. Old Squarespace URL redirect map confirmed.
8. DNS/custom domain attached to chosen Netlify project.
9. HTTPS ready.
10. Smoke test all primary routes and Back behavior.
11. Crawl production once for 404s/canonical errors.
12. Only then remove staging noindex / enable production indexing.
