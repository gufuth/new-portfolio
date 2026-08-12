# new-portfolio — Last Stop Diner

Ian Luna's portfolio. A diner at night you walk around inside — every page is
one locked cinematic scene. Noir, Wenders/Deakins/Müller grade, dry deadpan
copy against a haunted world.

**Live:** https://last-stop-diner.netlify.app

> Working on this with an AI agent? Read `CLAUDE.md` first — locked design
> decisions, current status, and known gotchas, so you don't re-decide
> settled calls or drift off the design.

## Stack

Plain HTML/CSS/vanilla JS. No framework, no build step — each page is
self-contained. (An earlier Astro/React/Tailwind rebuild attempt is archived
at [`new-portfolio-archive-astro-attempt`](https://github.com/gufuth/new-portfolio-archive-astro-attempt);
it was abandoned in favor of this hand-built version.)

## Local dev

```
python _serve.py
```
then open `http://127.0.0.1:8791/index.html` (see Project Zero workspace for the dev script).

## Deploy

`netlify deploy` from this directory. Site ID and deploy history live in
Project Zero, not this repo.

## Status

_Last verified 2026-08-11._

| Surface | Status |
|---|---|
| Landing | Live, locked |
| /work | Live — sign cabinets show placeholder case names, real cast list not yet wired in |
| /about | Live — bio copy and TV portrait are placeholders |
| /hearsay | Live, unlisted — real quotes, placeholder photos |
| Case study pages | Not built — copy is fully written in `docs/case-copy/` |

## Docs

- `docs/decisions/` — locked stack/host decisions
- `docs/design/` — quality contract, FilmFrame lock, build plan, vibe distillation
- `docs/case-copy/` — the full case-study copy book (gauntlet-tested)
- `docs/hearsay/` — HEARSAY surface handoffs
- `docs/history/` — project history, queued next moves

Deeper working history (renders, review logs, scripts) lives in the Project
Zero workspace (`drafts/pz_portfolio_last_stop_diner/`), not this repo.
