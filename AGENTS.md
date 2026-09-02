# Last Stop Diner — agent operating instructions

> **STATUS: CURRENT / BINDING FOR AGENT WORK.** Last updated 2026-09-02. Read this file before changing anything in this repository.

## Scope

This repository contains Ian Luna's Last Stop Diner portfolio: a diner-as-world whose physical surfaces reveal the work. It is not a conventional portfolio with diner styling.

These instructions govern how agents acquire context, resolve conflicts, preserve locks, and verify work. They do not authorize invention of missing content.

## Two kinds of truth

- **What currently exists:** the checked-in implementation is authoritative. Inspect `index.html`, `work.html`, `more-work.html`, `about.html`, `hearsay.html`, `404.html`, `cases/`, and the root runtime assets before describing the current site.
- **What should govern future work:** use the decision hierarchy below. Existing code can be known-wrong without becoming creative law.

Never use an old plan to claim that something exists in code. Never use existing code to silently overturn a documented lock.

## Required read order

1. `AGENTS.md`
2. `docs/handoffs/2026-09-02-master-handoff-v7.md`
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

1. Explicit current Ian decision
2. `docs/handoffs/2026-09-02-master-handoff-v7.md`
3. `docs/design/quality-contract-v1.md`
4. Current case-copy README and v1.1 files
5. Current HEARSAY addendum when HEARSAY is involved
6. Current visual rules and current surface-specific specs
7. PZ Brain and Project Zero doctrine
8. Chronology, old handoffs, old plans, and archives as historical evidence only

Project-specific law outranks general doctrine. Doctrine is a diagnostic and reference system, not permission to impose unrelated styling, command-deck language, noir treatment, or a new site concept.

## Current repository state

- The implementation is plain HTML and CSS with legacy vanilla JavaScript on the older surfaces.
- LANDING, WORK, MORE WORK, ABOUT, HEARSAY, 404, and nine direct case pages now exist.
- WORK contains five cases: Nike SB, Virgin Galactic, Porsche × Lucasfilm, Selsun Blue, MoneyLion × Beast Games.
- MORE WORK contains four: TE Connectivity × Alita, Jose Cuervo, Outdoor Voices, The Atlantic.
- Case pages are under `cases/` and use the shared recruiter-first editorial system in `case-system.css`.
- Mobile WORK / MORE WORK is index-first.
- The current billboard/case imagery is explicitly good-enough working art, not a final image lock. Assets must remain easy to replace.
- LANDING, ABOUT, and HEARSAY were not rebuilt during the 2026-09-02 WORK/case implementation.
- A separate Netlify staging project exists, but a successful new deploy has not yet been verified. Do not call the new build live until Netlify reports a ready deploy.

## Core world and surface locks

- One coherent physical world. LANDING is the exterior; WORK / MORE WORK are interior diner views; ABOUT and HEARSAY retain their locked/project-specific directions; case pages are the quiet evidence mode.
- Specific before polished. Physical logic beats attractive impossibility.
- FilmFrame bars never animate or scale. Their text goes silent during cuts.
- Cuts, not crossfades.
- Signs do not grow.
- One ambient-motion source per surface. Interaction feedback is separate. Nothing loops decoratively.
- Practical light only.
- Mobile is index-first.
- No readable WORK reflection: no W, O, fragments, or reflected green typography. Only faint non-letter contamination is allowed where the current direction calls for it.
- WORK remains a booth-height view across an ordinary street, not a mythic highway or billboard field.
- HEARSAY captions remain live HTML and are never baked into the plate.
- Case pages show work before explanation and stay recruiter-readable. Do not turn them into nine themed rooms or microsites.
- **Palette firewall:** Last Stop can frame the work. It does not recolor the work.
- The bell belongs to the diner door only.

## Content and evidence rules

- Do not invent facts, hooks, credits, figures, shipped lines, dates, sources, approvals, roles, slugs, or client details.
- Mark unresolved material in working documents as `IAN DECISION REQUIRED` or `UNVERIFIED / NOT APPROVED`; do not expose those placeholders to visitors.
- Bracketed case-copy material cannot ship.
- Real numbers can be smaller than draft placeholders. The evidence wins.
- “Lines I wrote” must be real shipped lines supplied or verified by Ian.
- Do not call an artifact approved, deployed, live, current, or verified unless the evidence supports that exact claim.

## Working protocol

Before acting:

1. Read the required files.
2. Inspect the relevant implementation and assets.
3. State the requested surface, active locks, known unknowns, and exact intended change when useful.
4. Use the smallest interpretation of the request. Surgical correction before rebuild unless Ian has explicitly authorized broader implementation.
5. Do not generate images by default.

During work:

- Audit, do not admire.
- Measure, do not eyeball.
- Preserve project history.
- Make one correction before adding a system.
- Do not edit unrelated files in a dirty worktree.
- Keep project artwork independent from environment plates so later image swaps remain cheap.

For implementation changes, verification should include rendered pixels at relevant viewport sizes, cache-busted reloads, console inspection, keyboard/focus behavior, reduced-motion behavior, and a diff proving the intended file scope. If the execution environment prevents rendered-pixel verification, state that limitation explicitly and do not silently mark the visual QA complete.

## Stop conditions

Stop and ask Ian when:

- a required factual input, approval, credit, metric, or domain-cutover decision is missing and cannot safely be omitted;
- two current sources conflict and the hierarchy does not resolve them;
- a proposed change would replace a locked LANDING / ABOUT / HEARSAY surface rather than surgically integrate with it;
- a public production/domain change has not been explicitly authorized;
- a generated plate would replace a locked or soft-locked surface without explicit authorization.

Do **not** stop merely because a billboard image is not perfect. Ian explicitly decided on 2026-09-02 that good, authentic, replaceable imagery is sufficient to continue building; final art upgrades happen later.

## Current next move

The architecture is built. Do not restart concepting or reopen the nine-case cast.

Current sequence: **deploy staging → rendered-pixel audit → surgical layout/registration fixes → final asset/metadata pass → production cutover.**
