# Last Stop — Quality Council + Adversarial Audit — 2026-09-03

Status: ACTIVE AUDIT. This document records the 10/10 gate and the corrections made during the September 3 autonomous quality pass.

## The council

This is a simulated multi-lens review, not a claim that outside people were consulted.

1. **Auteur art director** — authorship, specificity, Swap Test resistance, restraint.
2. **Cinematographer** — darkness, practical-light logic, composition, depth, same-film continuity.
3. **Interaction/product designer** — discoverability, hierarchy, retrieval speed, behavior.
4. **Recruiter / creative director** — role clarity, idea clarity, strongest work first, evidence, skim value.
5. **Accessibility / performance engineer** — keyboard, focus, targets, reduced motion, resilience, loading.
6. **Whetstone critic** — kill gimmicks, filler, fake proof, repeated motifs, and anything more memorable than the work.

## 10/10 gate

A surface does not earn 10 because it is attractive. It must survive all six lenses.

- Authorship / Swap Test resistance
- Same-film visual continuity
- Project recognition within ~3 seconds on WORK
- Named-project retrieval within ~10 seconds
- Role + problem + idea + strongest evidence inside the first case-study scan
- Real work before decorative system
- Evidence integrity: no filler presented as proof
- Whole-card / whole-billboard semantic links
- Keyboard-visible focus and usable target sizes
- Reduced-motion path
- Native campaign palette preserved
- Replaceable media architecture
- No prerequisite theatre, fake controls, or dead-end interactions
- No rejected historical surface treated as current merely because it exists in code
- Production media controlled locally before final domain cutover

## Adversarial review of the audit plan

Failure modes considered before changes:

- **Grading our own homework.** Countermeasure: every score requires observable code, asset, or documented decision evidence.
- **Confusing clean source with visual quality.** Countermeasure: rendered-pixel QA remains a separate gate and cannot be marked complete until a normal browser can inspect staging.
- **Generic best-practice drift.** Countermeasure: Last Stop project law wins over generic portfolio convention whenever usability is not harmed.
- **Infinite art hunting.** Countermeasure: current imagery only needs to be good and authentic; final art remains swappable.
- **Template inflation.** Countermeasure: case pages may vary in evidence density. A weak `Proof` section is worse than no `Proof` section.
- **Theme propagation.** Countermeasure: case pages remain evidence-first and do not inherit diner scenography beyond framing DNA.

## Findings before correction

### P0 / credibility

- Nike used an `under 10 minutes` sellout claim that the current audit could not independently verify. Public sources do verify that Nike SNKRS and multiple release channels sold out.
- Selsun, Cuervo, Outdoor Voices, and Alita included items under `Proof` that were partly descriptions of the work rather than outcome evidence.
- Virgin's hook establishes a five-million-viewer goal but the page failed to close the loop. Virgin Galactic reported total Unity 22 viewership in excess of 19 million across livestream and linear viewing.

### P0 / surface truth

- ABOUT exposes an interactive TV control whose only result is that the reel is `still rewinding`. This violates function-before-fiction and the no-fake-control rule.
- HEARSAY in the repository is the older picture-frame implementation. Ian later rejected picture frames and locked the newer nearly-roomless apparition direction. Therefore the checked-in HEARSAY is not eligible to pass final visual QA.

### P1 / accessibility and interaction

- Case-page global-nav and previous/next links need explicit 44px target treatment rather than relying on small type or pseudo-element expansion.
- Case media containing animated GIFs needs a reduced-motion fallback before production.

### P1 / production resilience

- Several billboard and case assets are still third-party hotlinks. This is acceptable for working art, not final domain cutover.
- Project-specific OG imagery is not yet implemented; most cases share `og_work.png`.

## Governing corrections

1. Remove or rewrite unverifiable/filler proof rather than decorate it.
2. Resolve Virgin with the public 19M+ viewership result.
3. Use shipped copy as evidence on Outdoor Voices instead of generic proof language.
4. Remove the ABOUT fake TV affordance until a real reel exists; add a direct contact path.
5. Increase actual case navigation target boxes.
6. Add source/provenance microcopy for hard proof where available.
7. Leave HEARSAY explicitly failing rather than silently blessing the rejected implementation.
8. Do not block architecture on final image perfection.

## Remaining non-autonomous / rendered gates

- Deploy current `main` to Netlify staging or equivalent normal browser surface.
- Inspect LANDING → WORK → case → BACK at desktop and mobile sizes.
- Replace checked-in HEARSAY with the current apparition direction using the actual approved photographs/assets.
- Measure live billboard registration against rendered pixels.
- Localize third-party campaign media and run final performance audit.
- Final domain cutover only after those gates pass.
