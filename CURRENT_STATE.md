# CURRENT STATE — read this first

Updated 2026-09-24. This file outranks every older handoff in `docs/`. When it disagrees with them, it wins; when Ian says something newer, he wins.

## Where the truth lives

| What | Where |
|---|---|
| Creative decisions, locked images, visual law | Google Drive: **IAN LUNA PORTFOLIO — LAST STOP — MASTER** (folder `1tWBaTK6PCnODins9PLMhoYcOV6-c0TPn`). Start at `00 START HERE`. |
| Page-by-page authority map | Drive doc `01 — VISUAL AUTHORITIES + PAGE STATUS INDEX` (`1CijB3XLjTfLsdZGb4GlFbgt0qrXnDim-XlN5LVG1Bnw`) |
| Working code | This repo, branch **`integration`** |
| Live mock site | https://last-stop-diner-staging.netlify.app (Netlify site `last-stop-diner-staging`) |
| Review routes (not public pages) | `/review/` on the mock site |

## Branch rules

- **`integration` is the one working line.** All new work lands here. The mock site deploys from it.
- **`main` is untouched** until Ian approves the integrated site. Do not merge side branches into `main` one by one.
- Side branches are frozen history. Each has an `archive/<name>` tag. Do not build on them.

| Old branch | Status |
|---|---|
| `about-iteration-lab-20260908-contd` | **Merged into integration.** About routes A/B/C/hybrid live under `/review/about/`. |
| `hearsay-elite-corrective` | **Hearsay files merged into integration.** `/hearsay/` is now the apparition version with the real source photos. Its older case/work files were NOT taken (main's were newer). |
| `work/cinematic-case-master-scooba-20260908` | **Not merged, on purpose.** Its Sept 11 Work plates are the pass the Sept 14 note says drifted into AI-looking treatment. Work stays on the Sept 14 locked visuals. |
| `launch/work-case-hardening`, `quality/sep03-council-pass`, `build/last-stop-full-system` | Superseded. Every file they touch is newer on main. One lost idea worth re-adding: a persistent CONTACT link on every case page (from `quality/sep03-council-pass`). |
| `hearsay-apparition-final-2026-09-07`, `work/work-more-case-finish-20260908`, `work/billboard-physical-rollout-qa-20260908`, `fix/work-plate-clean-20260906`, `build/work-more-work-v1`, `docs/consolidation-v6`, `recover/source-truth-20260913` | Already fully contained in main. |

## Page status (code vs. Drive)

| Page | Drive status | In code on `integration` |
|---|---|---|
| Landing | LOCKED | Matches. Do not redesign. |
| Work 1 | Composition locked | Sept 14 locked plate. Billboard type still being matched to one real font (Oswald first candidate). |
| Work 2 / More Work | Soft-locked, corrections open | Sept 14 plate. Still open: SCOOBA board narrower (12.95% vs ~14.1–14.6%, `work-system.css:66`), right-side motel clue still kept (`work-system.css:30`). Fix in the plate, not by stretching HTML. |
| About | Soft lock; A27 / A27d3 / A27e are the current design lane | Public `/about/` is still the older Room 3 page. A/B/C/hybrid code routes are at `/review/about/`. A27 is image-only so far, not built. |
| Hearsay | Soft lock (apparitions) | Apparition version with real photos is live at `/hearsay/`, still `noindex`. |
| Case studies | Unlocked. Candidate family 31/33/34/35 + 27 alternate (Drive) | Code still uses the archived V3 "modern evidence" styling on Cuervo and Porsche (`case-master-v3.css`). Do not treat it as the direction. |

## Open decisions for Ian

1. Stella Artois or Jose Cuervo on Work 2 (the Drive authority image shows Stella; the case list says Cuervo).
2. Silvercar by Audi: in or out (named as a stress test on Sept 19, not in the 10 cases).
3. Title wording: "creative director and copywriter" (About) vs. "creative director of copy" (case candidates).
4. About window: are readable diner letters (WOR / IAN LU) allowed?
5. Hearsay: newer keeper lines (Attorney, Bartender, ...) have no photos; photo + quote must stay together.
6. "Paid through Thursday" or "Tuesday".
7. Production domain (still undecided).

## Deploying

Every push to `integration` should update the mock site. The GitHub workflow `deploy-staging.yml` does this once a `NETLIFY_AUTH_TOKEN` secret exists in the repo; until then the agent deploys by hand after each push. The workflow skips quietly without the secret.
