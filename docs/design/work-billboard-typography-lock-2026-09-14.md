# Work / More Work billboard typography lock — 2026-09-14

Status: LOCKED

This file governs all project-name plates on Work and More Work. It exists to prevent type drift and to keep the secondary line readable after the font direction was selected.

## Locked type direction

Production mapping for Direction B:

- Primary line: Roboto Condensed Bold (700), uppercase.
- Secondary line: Roboto Condensed Medium (500), sentence/title case as the project name requires.
- Alignment: left aligned.
- Ink: near-black on the existing dirty-cream physical plate. No glow, outline, white knockout, drop shadow, or clean UI box.
- The type belongs to the photographed billboard plate and inherits its perspective, grime, exposure, blur, and distance softness.

The earlier generated Direction B study is the visual reference. Roboto Condensed is the production font mapping chosen to reproduce that condensed, blunt, highly legible sign language consistently in code.

## Hierarchy and size rule

At the 1440 master render:

- Primary baseline target: 21 px.
- Primary may fit down only to 18 px for unusually long client / partnership names.
- Secondary baseline: 17 px.
- Secondary may NOT be reduced below 17 px to make copy fit.
- Secondary must remain at least 80% of the primary size.
- Primary weight: 700.
- Secondary weight: 500. Never Regular, Light, or reduced-opacity gray.
- Left padding: 8–10 px from the usable plate edge.
- Two lines only. No third metadata line on Work / More Work boards.
- Keep line spacing tight but distinct. The secondary line must not collide with the primary or the lower plate edge.

## Copy-fit rule

Legibility wins over copy length.

If a secondary line does not fit at the locked 17 px size, SHORTEN THE LABEL COPY. Do not shrink the secondary line.

If a primary line does not fit at 18 px, shorten the display name rather than compressing or tracking it unnaturally.

No auto-condensing, horizontal scaling, negative tracking, or per-board font-family changes.

## Readability gate

A board fails QA if either line cannot be read at rest without hover or zoom.

Every final Work and More Work plate must be inspected at:

- 1440x900
- 1366x768
- 1024x768

The second line is not decorative. It is required project identification.

Specific failure test: if `SCOOBA LOVE / How to evaluate work` is less readable than `THE ATLANTIC / Social voice` at the same apparent board size, the plate fails and must be corrected before lock.

## Environment protection

Typography work may change ONLY the physical ID plate content and its local print treatment. It must not regenerate, relight, re-rain, regrade, sharpen, beautify, or otherwise alter the locked Grok / Gemini environments.

Work 1 source authority remains the locked Grok-derived plate. Work 2 source authority remains the locked Gemini-derived plate. No image-generation pass may be used merely to change billboard typography.

## Enforcement

1. This file is the repo source of truth for billboard type.
2. The plate build script must use the locked font family, weights, minimum sizes, padding, and two-line hierarchy as constants.
3. Build/QA must fail rather than shrink secondary copy below the minimum.
4. Visual QA screenshots at 1440, 1366, and 1024 are required before a plate is called locked.
5. A future design change to this system requires an explicit Ian decision and an update to this file before implementation.
