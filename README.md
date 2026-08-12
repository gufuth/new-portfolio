# new-portfolio — Last Stop Diner

> **STATUS: CURRENT REPOSITORY OVERVIEW.** For binding agent procedure and current authority, read `AGENTS.md` and `docs/handoffs/2026-08-11-master-handoff-v6.md`.

Ian Luna's portfolio. A diner at night you walk around inside — every page is
one locked cinematic scene. Noir, Wenders/Deakins/Müller grade, dry deadpan
copy against a haunted world.

**Repository metadata target:** https://last-stop-diner.netlify.app

**Current production host/domain approval:** `IAN DECISION REQUIRED`

> Working on this with an AI agent? Read `AGENTS.md` first — locked design
> decisions, current status, and known gotchas, so you don't re-decide
> settled calls or drift off the design.

## Stack

Plain HTML/CSS/vanilla JS. No framework, no build step — each page is
self-contained. (An earlier Astro/React/Tailwind rebuild attempt is archived
at [`new-portfolio-archive-astro-attempt`](https://github.com/gufuth/new-portfolio-archive-astro-attempt);
it was abandoned in favor of this hand-built version.)

## Local dev

```
python -m http.server 8791 --bind 127.0.0.1
```
then open `http://127.0.0.1:8791/index.html?v=YYYYMMDDHHMM`.

## Deploy

No deployment configuration or verified production command is checked in.
Do not deploy until Ian resolves the host, domain, and deployment lane. See
`docs/runbooks/development-and-deploy.md`.

## Status

_Repository implementation inspected 2026-08-11. Live host not independently verified._

| Surface | Status |
|---|---|
| Landing | Implemented; plate is locked |
| /work | Implemented — sign cabinets show the legacy Go/ESPN, Hometown/HBO, and Quiet Issue/NYT cast; July 15 real-cast render is **UNAPPROVED / NOT DEPLOYED** |
| /about | Implemented — bio is provisional and TV portrait is a stand-in |
| /hearsay | Implemented, unlisted — exact-photo plate and live HTML captions; measurement pass remains open |
| Case study pages | Not built — drafts exist in `docs/case-copy/`, but factual brackets, sources, hooks, credits, and real lines remain open |

## Docs

- `docs/decisions/` — current open decisions plus status-labeled historical stack/host records
- `docs/design/` — quality contract, FilmFrame lock, build plan, vibe distillation
- `docs/case-copy/` — the full case-study copy book (gauntlet-tested)
- `docs/hearsay/` — HEARSAY surface handoffs
- `docs/history/` — project history, queued next moves
- `docs/renders/` — organized render archive, runtime-asset copies, and verification screenshots
- `docs/doctrine/` — faithful PZ/Project Zero source transcriptions, subordinate to project law
- `docs/runbooks/` — verified local-development procedure and deployment stop conditions
- `docs/handoffs/2026-08-11-master-handoff-v6.md` — current source of truth

Additional working history, review logs, and scripts may exist in the Project
Zero workspace (`drafts/pz_portfolio_last_stop_diner/`) and are not guaranteed
to be present here.
