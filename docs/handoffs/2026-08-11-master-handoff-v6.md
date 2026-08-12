# Last Stop Diner — Master Handoff v6

> **STATUS: CURRENT SOURCE OF TRUTH.** Dated 2026-08-11. Supersedes `2026-07-14-master-handoff-v5.md` for current state and next actions. Historical documents remain useful for lineage only.

## 1. Scope and evidence basis

This handoff consolidates the checked-in repository at commit `5a53f09`, the July v1.1 copy book, the current HEARSAY addendum, the render archive, and the four source doctrine documents supplied on 2026-08-11.

It distinguishes three states:

- **Implemented:** observable in the checked-in HTML or root runtime assets.
- **Documented:** recorded in project sources but not independently proven by the current implementation.
- **Approved:** explicitly accepted by Ian. Availability in the repository is not approval.

The live host could not be independently verified during the repository audit. Netlify URLs in metadata and older Cloudflare plans are evidence of past or intended infrastructure, not a current production decision.

## 2. Authority

For what exists, inspect the implementation. For what should govern future work, use:

1. This handoff
2. `docs/design/quality-contract-v1.md`
3. Current case-copy README and v1.1 files
4. Current HEARSAY addendum when relevant
5. Current visual rules and surface specs
6. PZ Brain and Project Zero doctrine
7. Older handoffs, plans, chronology, and archives

`AGENTS.md` defines agent procedure. Project-specific law always outranks general doctrine.

## 3. Core project truth

The portfolio is a diner-as-world, not a conventional portfolio skin. The landing is the diner exterior. `/work` is the inside-booth reverse angle. ABOUT is a motel-room surface. HEARSAY is a separate testimonials environment. Case pages are quieter `Into the Sign` documents.

The quality bar is observed rather than rendered, physically mannered rather than atmosphere-stacked, dry in language against a strange world, and immediately understandable to a recruiter. Beautiful but confusing loses. Stylish but physically wrong loses. Clever but unverified loses.

## 4. Current repository implementation

| Surface | Checked-in state | Important limitation |
|---|---|---|
| LANDING | `index.html` + `landing.webp`; three physical hotspots; WORK bell/voltage threshold, quiet ABOUT fade, silent HEARSAY threshold, sound control, arrival settle, LQIP, FilmFrame | Root metadata points to a Netlify URL; current production status is **UNVERIFIED / NOT APPROVED** |
| `/work` | `work.html` + `work.webp`; four live sign faces over measured slots, gold index, hero-by-light, reflections, ballast settle, rare headlights, sound control, directed exit | Implements Beast Games, Go/ESPN, Hometown/HBO, Quiet Issue/NYT; no case-page navigation exists; legacy cast is known-wrong against the July copy book |
| ABOUT | `about.html` + `about.webp`; foot-of-bed motel plate, TV interaction, short bio, sound control, arrival/exit treatment | TV portrait is a stand-in; bio is provisional; reel response says it is still rewinding |
| HEARSAY | `hearsay.html` + `hearsay.webp`; exact-photo plate documented in addendum, five live HTML captions, entrance roll-call, `POINT AT A FRAME`, bolt-hole whisper, ghost interaction, mobile index, `noindex` | Hotspots/caption anchors remain documented as eyeballed; surface remains unlisted; no HEARSAY OG card is wired in HTML |
| 404 | `404.html`; in-world return path | No open issue recorded |
| Case pages | Not present | Copy files exist, but contain unresolved brackets, sources, hooks, credits, and shipped-line inputs |

The five root HTML files contain duplicated keyboard-drill-down script blocks. This is known dead weight, not part of the current documentation task and not authorization to edit code.

## 5. Runtime assets and archive relationship

The root `landing.webp`, `work.webp`, `about.webp`, and `hearsay.webp` are the runtime assets referenced by the HTML. As of this handoff, each is byte-identical to its corresponding copy in `docs/renders/06_Site_WebP_Finals/`.

The rest of `docs/renders/` is evidence and history. A render in that archive does not become a runtime asset or an approved direction merely by existing.

## 6. July 15 `/work` render

`docs/renders/02_Work_Billboards/pz_lastdiner_work_real_v1_v1.png` is **UNAPPROVED / NOT DEPLOYED**.

It postdates the documented July 11 runtime plate and contains Beast Games, Nike SB, Porsche × Star Wars, Virgin Galactic, and Selsun Blue. It proves that a real-cast direction was explored, so `/work` must not restart from zero.

It is not a drop-in replacement. The audit at `docs/design/work-real-cast-audit.md` records material conflicts: 1536×1024 geometry versus the current 1536×863 runtime plate, baked typography, a hero cabinet made dominant by scale as well as light, an occluded sign area, and only five visible cases. Ian must decide whether it is reference-only, a correction base, or rejected.

## 7. Case system and unresolved cast conflict

The July copy book supersedes the legacy `/work` cast. Its stated running order is:

MrBeast × MoneyLion → Star Wars × Porsche → Virgin Galactic → Nike SB → Selsun Blue → Outdoor Voices → Jose Cuervo → Silvercar → car2go → Fox/Alita near the close.

However, the same current documents also say:

- recommended shape: nine cases plus two personality pages;
- pick Atlantic or 1800;
- fold Vans into Channel Craft;
- Jockey remains an optional Tier-1 addition;
- personality candidates include Channel Craft, Citizen Kane, HEARSAY, and Who.

Those statements do not resolve to one final book without an Ian decision. `docs/case-copy/case-manifest.md` preserves the conflict instead of guessing.

No case page can ship until its factual brackets, sources, real copy lines, credits, and required hook decisions are closed. The copy is drafted and reviewed; it is not publication-ready.

## 8. Active locks

### Hard

- LANDING plate remains locked.
- FilmFrame bars never animate or scale; text goes silent during cuts.
- Cuts, not crossfades.
- `/work` is booth-height, head-on, across an ordinary wet street.
- No readable WORK reflection or reflected green letter fragments.
- Hero status is expressed by light, not sign scale. Signs do not grow.
- One ambient-motion source per surface; no decorative loops.
- Practical light only.
- Mobile is index-first.
- Bell belongs to the diner door only.
- HEARSAY captions remain live HTML, never baked.
- Case pages follow `Into the Sign` v1.1 and show the work before the explanation.

### Soft

- Current `/work` base and measured cabinet geometry.
- Sound default ON, pending Ian re-stamp.
- HEARSAY remains unlisted.
- HEARSAY hotspot/caption coordinates remain provisional pending measurement.

## 9. Historical drift risks

- Reintroducing a readable WORK reflection, W/O fragments, or green lettering contamination.
- Reviving a mythic desert highway, diagonal road, or epic billboard world.
- Treating the legacy `/work` cast as approved because it exists in code.
- Treating the July 15 render as approved because it exists in the archive.
- Asking one generation to solve architecture, atmosphere, typography, and UX.
- Scaling a hero sign instead of changing its light.
- Adding loops, ambient beds, coffee steam, moths, extra flicker, or extra motion.
- Reintroducing crossfades or FilmFrame animation.
- Turning case pages into separate art-directed worlds.
- Reverting HEARSAY to placeholders, polaroids, a speaker index, `ASK THE WALL`, or the stale “no page built” state.
- Using old Astro/Cloudflare plans as if they describe the current static repository.
- Calling something verified after reading source without checking rendered pixels.

## 10. Open decisions and blockers

The consolidated ledger is `docs/decisions/open-decisions.md`. Shipping blockers include:

- final hook choices where the hook sheet is open;
- every factual bracket, source, credit, role, date, and real shipped line;
- unnamed ideas and the SCOOBA explanation;
- final book/cast reconciliation;
- July 15 `/work` render disposition;
- Atlantic versus 1800; Jockey; Vans; personality-page selection;
- homepage positioning line;
- ABOUT portrait, bio approval, and resume PDF;
- sound default;
- OG approvals;
- HEARSAY measurement, graduation, spike behavior, and real testimonials;
- production host, deployment path, and domain.

Unknowns remain `IAN DECISION REQUIRED` or `UNVERIFIED / NOT APPROVED`.

## 11. Current next move

This documentation pass authorizes no implementation.

After Ian reviews the consolidation, the next decision is the disposition of the July 15 `/work` render:

1. reference only;
2. authorize surgical correction against the current locks;
3. reject.

Only after that decision should a scoped `/work` implementation plan be prepared. Case 01 remains the next case-page build after the cast and source inputs are ready.

