# CURRENT STATE — read this first

Updated 2026-09-24. This file outranks every older handoff in `docs/`. When it disagrees with them, it wins; when Ian says something newer, he wins.

## Where the truth lives

| What | Where |
|---|---|
| Creative decisions, locked images, visual law | Google Drive: **IAN LUNA PORTFOLIO — LAST STOP — MASTER** (folder `1tWBaTK6PCnODins9PLMhoYcOV6-c0TPn`). Start at `00 START HERE`. |
| Page-by-page authority map | Drive doc `01 — VISUAL AUTHORITIES + PAGE STATUS INDEX` (`1CijB3XLjTfLsdZGb4GlFbgt0qrXnDim-XlN5LVG1Bnw`) |
| Working code | This repo, branch **`integration`** |
| Live mock site | https://last-stop-diner-staging.netlify.app (live, noindex). Once a NETLIFY_AUTH_TOKEN secret exists, pushes to `integration` also publish a free preview at https://integration--last-stop-diner-staging.netlify.app |
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
| `launch/work-case-hardening`, `quality/sep03-council-pass`, `build/last-stop-full-system` | Superseded. Every file they touch is newer on main. (Their CONTACT idea is already covered by the shared runtime.) |
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

## Plan of record

Launch plan (15 steps): Drive/Artifact https://claude.ai/artifact/E6WnRjDoFy8d3wCs7i2WiC ; source `PROJECT ZERO/drafts/pz_portfolio_last_stop_diner/brief_to_plan.md`; machine version `.../brief_to_plan_runs/20260924_212820/execution_manifest.json`.

Built 2026-09-24: INDEX / All work page at `/work/all/` (step 2); INDEX link in Work 1 + More Work rails (placement provisional per Sept 15); integration now deploys as a free alias preview, main as production (step 1).

## Launch check (step 13)

`python scripts/launch_check.py` (or `--base-url <preview>` / `--lighthouse`) tests every public route at 1440/1024/430/390 + reduced motion and writes `reports/launch_check_*.md`. Baseline 2026-09-24: FAIL only on placeholder proof text (Porsche, Cuervo) and the old `/work/porsche-proof-preview/` route, which should be removed from `_redirects` before launch. No console errors, overflow, or small targets.

## Built for review 2026-09-24

- `/review/type/` billboard typeface test (step 7).
- `/review/cases/porsche-cream.html` and `porsche-dark.html` case layout test on real content (step 4).
- Drive: `01 CURRENT SOURCE OF TRUTH / 02 — PROOF REGISTER` and `03 — RIGHTS REGISTER` (steps 5 and 6).

## Known small bugs

- Hearsay bottom bar shows "SOUND OFF" twice (page label + shared runtime control).
- (Corrected 2026-09-24: case pages DO have CONTACT; the shared runtime adds it on load. Earlier note was a static-grep miss.)

## Open decisions for Ian

1. Stella Artois or Jose Cuervo on Work 2 (the Drive authority image shows Stella; the case list says Cuervo).
2. Silvercar by Audi: in or out (named as a stress test on Sept 19, not in the 10 cases).
3. Title wording: "creative director and copywriter" (About) vs. "creative director of copy" (case candidates).
4. About window: are readable diner letters (WOR / IAN LU) allowed?
5. Hearsay: newer keeper lines (Attorney, Bartender, ...) have no photos; photo + quote must stay together.
6. "Paid through Thursday" or "Tuesday".
7. Production domain (still undecided).

## Deploying

**Live 2026-09-25:** Netlify upgraded to Pro. Mock site https://last-stop-diner-staging.netlify.app is published from `integration` (manual publishes by the agent; each costs 15 credits of 3,000/month). It sends noindex + Disallow so search engines skip it. Auto-publish on push still needs a NETLIFY_AUTH_TOKEN secret in GitHub.

Every push to `integration` should update the mock site. The GitHub workflow `deploy-staging.yml` does this once a `NETLIFY_AUTH_TOKEN` secret exists in the repo; until then the agent deploys by hand after each push. The workflow skips quietly without the secret.
