# Last Stop Diner — agent operating instructions

> **STATUS: CURRENT / BINDING FOR AGENT WORK.** Last updated 2026-08-11. Read this file before changing anything in this repository.

## Scope

This repository contains Ian Luna's Last Stop Diner portfolio: a diner-as-world whose physical surfaces reveal the work. It is not a conventional portfolio with diner styling.

These instructions govern how agents acquire context, resolve conflicts, preserve locks, and verify work. They do not authorize implementation, image generation, deployment, or invention of missing content.

## Two kinds of truth

- **What currently exists:** the checked-in implementation is authoritative. Inspect `index.html`, `work.html`, `about.html`, `hearsay.html`, `404.html`, and the root runtime assets before describing the current site.
- **What should govern future work:** use the decision hierarchy below. Existing code can be known-wrong without becoming creative law.

Never use an old plan to claim that something exists in code. Never use existing code to silently overturn a documented lock.

## Required read order

1. `AGENTS.md`
2. `docs/handoffs/2026-08-11-master-handoff-v6.md`
3. `docs/design/quality-contract-v1.md`
4. `docs/case-copy/README.md`
5. Current v1.1 case-copy files relevant to the task
6. `docs/design/visual-rules-and-drift-guardrails.md`
7. If touching HEARSAY: `docs/hearsay/handoff-addendum-v8.md`, then `docs/hearsay/handoff.md` for history
8. If creative diagnosis is needed: `docs/doctrine/README.md` and the four doctrine transcriptions
9. Historical and superseded documents only when lineage or rejected directions matter

Then inspect the actual implementation and the exact assets relevant to the requested surface.

## Decision hierarchy

When documents disagree, higher wins:

1. `docs/handoffs/2026-08-11-master-handoff-v6.md`
2. `docs/design/quality-contract-v1.md`
3. Current case-copy README and v1.1 case files
4. Current HEARSAY addendum when HEARSAY is involved
5. Current visual rules and current surface-specific specs
6. PZ Brain and Project Zero doctrine
7. Chronology, old handoffs, old plans, and archives as historical evidence only

Project-specific law outranks general doctrine. Doctrine is a diagnostic and reference system, not permission to impose unrelated styling, command-deck language, noir treatment, or a new site concept.

## Current repository state

- The implementation is plain HTML, CSS, and vanilla JavaScript with no checked-in build system.
- LANDING, `/work`, ABOUT, HEARSAY, and the in-world 404 exist as root HTML files.
- Case pages do not exist.
- `/work` still implements Beast Games plus the legacy Go/ESPN, Hometown/HBO, and Quiet Issue/New York Times cast.
- The July 15 real-cast render exists at `docs/renders/02_Work_Billboards/pz_lastdiner_work_real_v1_v1.png`. It is **UNAPPROVED / NOT DEPLOYED**.
- HEARSAY uses `hearsay.webp`, live HTML captions, exact-photo compositing documented in the current addendum, and `noindex`. It remains unlisted.
- ABOUT uses a stand-in TV portrait and provisional copy.
- Root runtime WebP files are byte-identical to their copies in `docs/renders/06_Site_WebP_Finals/` as of 2026-08-11.
- The production host, deployment command, and domain cutover are **IAN DECISION REQUIRED**. Do not infer approval from old Cloudflare plans or Netlify URLs embedded in metadata.

## Core world and surface locks

- One coherent physical world. LANDING is the exterior; `/work` is the inside-booth reverse angle; ABOUT is a motel-room surface; HEARSAY is the diner back wall; case pages use the quieter `Into the Sign` system.
- Specific before polished. Physical logic beats attractive impossibility.
- FilmFrame bars never animate or scale. Their text goes silent during cuts.
- Cuts, not crossfades.
- Hero status is expressed by light, not sign scale.
- Signs do not grow.
- One ambient-motion source per surface. Interaction feedback is separate. Nothing loops decoratively.
- Practical light only.
- Mobile is index-first.
- No readable WORK reflection: no W, O, fragments, or reflected green typography. Only faint non-letter contamination is allowed where the current direction calls for it.
- `/work` remains a head-on, booth-height view across an ordinary wet street. No mythic highway, desert, billboard field, or diagonal-road revival.
- HEARSAY captions remain live HTML and are never baked into the plate.
- Case pages follow `docs/case-copy/case-page-spec-v1.1.md`: work before explanation, two typefaces, one accent with one job, one consistent scroll order, real assets, real numbers, and no invented per-case costume.
- The bell belongs to the diner door only.

## Content and evidence rules

- Do not invent facts, hooks, credits, figures, shipped lines, dates, sources, approvals, roles, slugs, or client details.
- Mark unknowns exactly as `IAN DECISION REQUIRED` or `UNVERIFIED / NOT APPROVED`.
- Bracketed case-copy material is placeholder material and cannot ship.
- Real numbers can be smaller than draft placeholders. The evidence wins.
- “Lines I wrote” must be real shipped lines supplied or verified by Ian.
- Do not call an artifact approved, deployed, live, current, or verified unless the evidence supports that exact claim.
- The current case cast remains unresolved where `docs/case-copy/case-manifest.md` identifies conflicts. Do not silently choose a book.

## Working protocol

Before acting:

1. Read the required files.
2. Inspect the relevant implementation and assets.
3. State the requested surface, active locks, known unknowns, and exact intended change.
4. Use the smallest interpretation of the request. Review before rewrite; surgical correction before rebuild.
5. Do not generate images by default.

During work:

- Audit, do not admire.
- Measure, do not eyeball.
- Preserve named backups and project history.
- Make one correction before adding a system.
- If a task would touch a hard lock, stop, name the lock, explain why, and ask Ian.
- Do not edit unrelated files in a dirty worktree.

For implementation changes, verification must include rendered pixels at relevant viewport sizes, cache-busted reloads, console inspection, keyboard/focus behavior, reduced-motion behavior, and a diff proving the intended file scope. Source inspection alone is not visual verification.

## Stop conditions

Stop and ask Ian when:

- a required factual input, approval, hook, credit, metric, shipped line, asset, domain, or host decision is missing;
- two current sources conflict and the hierarchy does not resolve them;
- a proposed change touches a hard lock;
- the July 15 `/work` render would be treated as approved or production-ready;
- a deployment, external write, public listing, or production change has not been explicitly authorized;
- a generated plate or other irreversible direction would replace a locked or soft-locked surface.

## Current next decision

After this documentation consolidation is reviewed, Ian should decide the disposition of the July 15 `/work` render: use only as reference, authorize surgical correction, or reject it. No `/work` implementation should begin before that decision.

