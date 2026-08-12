# PZ PORTFOLIO / LAST STOP DINER — MASTER HANDOFF v5 (the full record)
Written 2026-07-11, end of the July 10–11 session block. Supersedes v4 (same day, compact) and v3 (2026-07-04). Both stay on disk. This is the definitive catch-up: state, files, locks, learnings, and the honest ledger. Operator: Ian Luna (ianr.luna@gmail.com). Workspace: C:\Users\ianrl\Desktop\PROJECT ZERO (R16).

═══════════════════════════════════════════
## 0. HOW TO USE THIS DOCUMENT
═══════════════════════════════════════════
Fresh session read order: (1) this file; (2) QUALITY_CONTRACT_v1.md — the BINDING contract: law hierarchy (LOCKS > kill lists > BUILD_PLAN > taste), the seven tests, session rituals, generation rules; (3) case_copy/README_CASE_COPY.md; (4) if touching HEARSAY: hearsay_testimonials/HANDOFF.md + HANDOFF_ADDENDUM_v8.md; (5) deep lineage only: PROJECT_HISTORY_INDEX.md → MASTER_HANDOFF_v3.md. Then walk the live site before touching anything. Do not generate images by default. State back what's locked and what today's target is.

═══════════════════════════════════════════
## 1. THE WORLD (vibe, one paragraph — from site_vibe_distillation_v1.md)
═══════════════════════════════════════════
A 35mm film you can walk around inside. Always night, always quiet, one locked camera per scene. Light comes from fixtures, signs, and a TV; nothing glows for decoration. Words are dry, the world is haunted; comedy and melancholy from the same deadpan. Nothing performs for the camera — the visitor discovers, the site never demonstrates. Restraint is the luxury. The letterbox bars are the projector; the browser tab is part of the film. Premium = physical manners, not more atmosphere.

═══════════════════════════════════════════
## 2. CURRENT STATE
═══════════════════════════════════════════
**DEPLOYED:** https://last-stop-diner.netlify.app (site id 7b4083c6-3e6a-4e85-81bf-1368f14a6afa, deploy 6a521ab3, 2026-07-11, verified page-by-page). Four walkable surfaces:

- **LANDING** (landing_live.html → index.html): locked exterior plate; three sign hotspots (WORK: voltage flicker + worn-brass double-strike bell + cut + arrival settle; ABOUT: quiet fade; HEARSAY: silent pink-black 420ms threshold through the pink door). Arrival FROM any interior settles the exposure (sessionStorage 'lsd_from' gate — refresh/deep-link gets no beat). LQIP blur-up boot. SOUND · ON/OFF toggle.
- **/WORK** (work_live_v2.html → work.html): soft-locked base, live faces on measured cabinet footprints, gold-leaf index + CLICK A SIGN, hero-as-light with street reflections following, ballast settle, rare passing headlights (25–45s first, then 60–120s jittered; hidden-tab + reduced-motion guarded), NEW quieter single-strike exit bell. **KNOWN-WRONG CONTENT: signs/index say Go/ESPN, Hometown/HBO, Quiet Issue/NYT — contradicted by the canonical cast list (see §3). Rebuild = next build task, operator said yes 2026-07-11.**
- **ABOUT** (about_live.html → about.html): foot-of-bed motel plate + TV composite (stand-in face; swap when real portrait lands → rerun _composite_tv.py), TV static whisper + gated CRT thunk, working bio ("The room is paid through Thursday" = keeper + register benchmark), NEW lamp warm-up arrival settle + directed exit fades.
- **HEARSAY** (hearsay_live.html → hearsay.html): prototype, deliberately UNLISTED (noindex, no OG, reachable only through the door). Full detail in §4.
- Chrome: favicon (lightbox mark), per-page OG cards (og_landing/work/about.png; hearsay none by design), meta descriptions, html lang, tab-blur title "( the diner is still open )" everywhere, in-world 404 ("( there's nothing out here )" ← THE DINER), :active press dips.

**ROLLBACK:** every page touched 2026-07-11 has a `.pre_overnight_20260711` sibling; previous deploy zip = last_stop_diner_site_predeploy_20260711.zip; hearsay plate pre-dodge = hearsay_wall_v10_treated_predodge.png. Dispatcher fixes: `.bak_20260711` per file.

**DEV LANES:** local preview = run _serve.py (host python) → http://127.0.0.1:8791/<page>?v=N (Chrome caches hard — always cache-bust). Build = _build_site.py (plates→webp, pages renamed, favicon/og/404 copied, zip refreshed). Deploy = netlify-deploy-services-updater (MCP) returns an npx command → run INSIDE site/ via agent_bridge_exec.py (see §7 quirks).

═══════════════════════════════════════════
## 3. THE COPY BOOK (case_copy/ — mirrored from Drive 2026-07-11)
═══════════════════════════════════════════
Canonical July 6–7 copy, gauntlet-tested (six-layer anti-AI gate, Whetstone ×3, VK pre-check — evidence in case_copy/verification_report_v1.md). Google Docs in Drive folder 1J3Qw_NAXjcTWFt69OEGPz9WxazVL9k9n remain the editing surface; re-mirror after edits. Supersedes the May book (sidequest_portfolio_site/case_studies_v1.md, lineage only).

Files: case_study_rewrites_v1.1.md (11 cases + Channel Craft + homepage positioning lines + keep-as-is notes) · new_case_studies_v1.1.md (Star Wars×Porsche "Designer Alliance", Fox/Alita, Selsun Blue "Dan Driff" + running order + hook register rule) · case_page_spec_v1.1.md (INTO THE SIGN: 12-section scroll order, two typefaces, one accent, THE COPY section — NEWER than BUILD_PLAN_v2 C1 where they differ) · who_page_rewrite_v1.md · hook_decision_sheet_v1.md (**OPEN — Ian picks per case**) · zc_additions_ranking_v1.md (decision record + asset mines + defensibility protocol) · verification_report_v1.md (+ per-case VK table; 4 HOLDs are input-starved, not craft failures).

**CAST LIST (settles C0):** MrBeast×MoneyLion → Star Wars×Porsche → Virgin Galactic (Unity 22) → Nike SB (Pigeon/Panda) → Selsun Blue → Outdoor Voices → Cuervo → Silvercar → car2go → Fox/Alita near close. Personality: Channel Craft, Citizen Kane, HEARSAY, Who. Recommended: 9 cases + 2 personality; fold Vans into Channel Craft; Atlantic OR 1800.

**SHIP BLOCKERS (owner: Ian):** hook picks · every [bracketed] number → real sourced data (smaller real number wins, always) · real "Lines I wrote" per case (highest-value empty slot in the book) · name the idea on Cuervo/Atlantic/Vans/SCOOBA (+ what SCOOBA stands for) · re-run gates on final bracket-free copy.

═══════════════════════════════════════════
## 4. HEARSAY (deep state)
═══════════════════════════════════════════
Wall of fame, framed (operator override of the concepts doc's payphone recommendation — full 16-candidate record in hearsay_concepts_v1.md). Plate = hearsay_wall_v10_treated.png: the FIVE EXACT site photos composited full-bleed (mats retired), mixed b&w/warm doctrine, pink glow instead of RSAY letters (operator call), dried rose, payphone bolt holes with sun-fade ghost patch, ghost photo, ticket spike + matchbook + pencil + water ring. Page: speech-adjacent captions in five Google-Font hands beside each speaker (pockets of feathered shadow, never cards), entrance roll-call, POINT AT A FRAME standing line (/work register), bolt-holes whisper ("the payphone took the messages. it's gone."), ghost-photo faded-duplicate-caption egg, mobile index-first fallback, aria throughout. Photo sources: hearsay_testimonials/references/exact_photo_sources.md. Numbering trap: concept_renders raw vN ≠ narrative vN — map in HANDOFF_ADDENDUM_v8.md. OPEN: measured (not eyeballed) hotspot/caption coordinates; ticket-spike click-to-cycle (operator hasn't called); Vidal cracked-glass mostly under his photo now (overlay pass if wanted); graduation from unlisted status; note case_study_rewrites §14: add 2–3 REAL testimonials above the five jokes when ready.

═══════════════════════════════════════════
## 5. LOCKS
═══════════════════════════════════════════
**HARD (never relitigated silently — if a change needs one, STOP and ask):** landing plate · FilmFrame bars never animate/scale, text silent during cuts (FILMFRAME_LOCK.md) · case pages = INTO THE SIGN per case_copy spec v1.1 · mobile = index-first · hero = light, never scale · ABOUT = foot-of-bed, TV plays on click · bell belongs to the front door only · cuts not crossfades (View Transitions API considered + REJECTED 2026-07-11: default crossfades fight the cut grammar; VT scar history with the bars) · one ambient motion per surface, nothing loops · practical light only · HEARSAY captions = live HTML, never baked.

**SOFT (current-best, revisit with cause):** /work base plate (work_signs_v4_softlock_16x9.png, SOFTLOCK.md) · sound default ON (canon: "the bell asks permission by existing once" — two reviewers argued OFF; awaiting operator re-stamp) · HEARSAY unlisted-behind-the-door until operator graduates it · ComfyUI --lowvram launch (canonical for THIS 12GB card; revisit at hardware change) · VRAM gate 8.5GB + whetstone/openai effort=low (env-tunable: PZ_MIN_FREE_VRAM_GB, PZ_WHETSTONE_EFFORT, PZ_OPENAI_EFFORT) · hearsay hotspot/caption coordinates (eyeballed pending measuring pass).

**DECLINED WITH REASONS (do not re-propose without new evidence):** bar-nav text menu ("why be obvious?") · resume link on landing (goes to ABOUT exits + case footers when PDF exists) · speaker-index on HEARSAY (the wall is discovered, not catalogued — Whetstone P1) · instruction text beyond one quiet line per surface ("ASK THE WALL" died as hollow cleverness; literal wins) · FROM THE SCRIPT screenplay-formatting of Ian's lines (costume + authorship not defensible → THE COPY) · whole-room dip on selection · custom cursor (undecided-lean-native) · coffee steam, neon flicker loops, moths, ambient loop beds, hover sounds (detail_pass named cuts).

═══════════════════════════════════════════
## 6. FILE MAP (where everything lives)
═══════════════════════════════════════════
**Corridor root (drafts/pz_portfolio_last_stop_diner/):** live pages landing_live.html / work_live_v2.html / about_live.html / hearsay_live.html (+ .pre_overnight_20260711 backups) · 404.html · favicon.png, og_*.png · plates: landing_locked_exterior*(grainmatched).png, work_signs_v4_*(softlock_16x9).png, about_footofbed_*(v2_tv_composite).png, hearsay_wall_v*_treated.png (v10 = current) · build/deploy: _build_site.py, site/, last_stop_diner_site*.zip, _ov_deploy.py · dev: _serve.py (:8791) · treatment: _treat_film.py (standard), _treat_film_heavy.py (hearsay) · docs: MASTER_HANDOFF_v3/v4/v5, QUALITY_CONTRACT_v1, PROJECT_HISTORY_INDEX, BUILD_PLAN_v2, FILMFRAME_LOCK, SOFTLOCK, detail_pass_v1 (the 10/10 list + named cuts), site_vibe_distillation_v1, overnight_premium_plan_v1 + adjudication, OVERNIGHT_RUN_2026-07-11 · working scripts/logs (_ov_*, _render_*, _gpu/_comfy/_flux diagnostics) — messy on purpose, referenced by older docs, navigate by date.
**case_copy/** — §3. **hearsay_testimonials/** — §4 (own HANDOFF + addendum, renders/, prompts/, scripts/, logs/ incl. whetstone review, references/ incl. exact photos + Gemini mockup descriptions). **concept_renders/** — raw gpt-image outputs (numbering trap!). **visual_pipeline/** — local renders (maint_fast_test_v1.png = the pipeline-revival proof). **candidates/, filmframe/ (FilmFrame.astro + archived ambient audio), early_version_context/ (May 15 explorations)** — archives.
**Sibling corridors:** sidequest_portfolio_site/ (May–June push: design_system_and_throughline, design_tokens_v1, copy_strategy_and_verdict, hearsay_decision, adversarial reviews, case_studies_v1 [superseded]) · sidequest_dispatcher_maintenance/ (diagnosis, fix scripts, test evidence, final adjudication) · sidequest_vk_design_auditor/ (ready-to-fire creation prompt for the VK-Design taste auditor).
**Infra files:** .claude/whetstone/v2/ (whetstone.py, orclient.py, host runner; state/runs/<id>/ for reports) · .claude/commands/dispatch_*.py (+.bak_20260711) · C:\Users\ianrl\ComfyUI\launch_lowvram.bat (canonical launch) · .claude/mem/*_spend.log.
**Drive:** copy book folder 1J3Qw_NAXjcTWFt69OEGPz9WxazVL9k9n · handoff folder 1qi0_UMqQYY1cDgTTXfIlCjA0QYbrQvpX · Beast Games sources 10Kx1Lnkg2PF9Qlj4RaY1mivLRbqlohP4 + 1A-n6Ti9rHJpOKKuwizv2V4AVqAoXd9VZ · May renders 1UsGmPFGQuayG2bBHu1erAwERr72O34GY.
**Deployed:** last-stop-diner.netlify.app · **Live production site:** ianrluna.com (Squarespace — source of the exact testimonial photos + Site Copy Extraction baseline).

═══════════════════════════════════════════
## 7. WHAT WE LEARNED (scars, keep them)
═══════════════════════════════════════════
1. **Fix toward truer, not safer.** v3–v5 of the hearsay wall each solved the stated complaint and drained personality, because nothing was re-checked against the original reference — only against the last complaint. Every fix gets the second test: does it still look like it has a history?
2. **The placeholder was hiding the main ingredient.** "Photos come later" deferred exactly what made the wall land (casting: the barber, the Subway guy, real Vidal). When a placeholder is load-bearing, cast it.
3. **Legibility is real estate, not fonts.** No typeface fixes a 250px mat. The site's own pattern (plate = world, copy = its own surface) was the answer all along — and speech belongs NEXT TO the speaker.
4. **Invitation = demonstration.** "Something missing" was the absence of a handshake: load with the first caption already speaking + one literal line in the house corner (POINT AT A FRAME). Never clever instructions; /work's CLICK A SIGN is literal for a reason.
5. **Use the plate's own vocabulary for emphasis.** The invisible bolt holes became visible via a sun-fade ghost patch — the grammar the paneling already used — not by brightening pixels.
6. **Read the WHOLE file before patching; probe after.** The duplicate HOME_TITLE const parse-killed the entire landing script silently (page degraded to static). typeof-probes + console reads after every HTML surgery. Also: hidden tabs starve rAF — timeout fallbacks now standard.
7. **desktop-commander launches python DETACHED** (instant rc 0, empty stdout, "document in pipeline" on redirects). Verify by file side-effects only; NEVER re-fire on instant exit (it double-billed a render once). npx via PowerShell is broken; deploy through agent_bridge_exec.py. 8.3 short paths are disabled on this volume.
8. **Reasoning models bill thinking against output budgets.** The whole dispatcher plague (whetstone hangs/truncations, empty-but-billed GPT drafts) was one disease: no effort control. effort=low + bigger budgets + truncation-refire fixed it; quality held (spot-checked, A/B pending). Watch for the CLI-flag-with-unchanged-default anti-pattern — defaults must flip in code.
9. **Measure VRAM, don't guess.** The "flux2 timeout" was Ollama holding 4–5GB + the qwen encoder oversubscribing 12GB. Preflight gates + ollama unload + stall-interrupts + --lowvram = first completed render since June. Interrupts don't reach mid-node wedges; a service restart procedure is on file.
10. **Adjudicate reviewers against the diffs.** Panels see summaries, not code — three "P1s" in the final maintenance review were false premises. Adopt what survives contact with the artifact; overrule with the reason on the record. (Canon precedent: the copy gauntlet rejected Gemini's advice to delete the labels and the RUMORS list — register ≠ bug.)
11. **The MCP whetstone poller serves stale views** — DONE can exist while it says running. Read the run dir. Poller cache fix = top infra follow-up.
12. **Whetstone domain-misroutes were why design reviews came back empty** — "copy tier" gripped nothing on UX surfaces. Fixed (web/UX signals), but check the report header says the right domain.
13. **Present files as cards; embed assets in preview HTML** (the app opens copies away from siblings — the black-plate mystery). Keep corridor versions file-referenced for the real build.
14. **plan.json.status must be exactly "open"** before image dispatchers save (the $0.12 lesson). Renders land in the ACTIVE corridor — move them.

═══════════════════════════════════════════
## 8. THE HONEST LEDGER — right / wrong / made right
═══════════════════════════════════════════
**Got right (keep doing):** deadpan register discipline across every surface and doc · verification-before-presenting caught every real bug this week (parse-kill, rAF starvation, caption clipping, mat slivers, phantom hole) · the lore layer (payphone scar, ghost caption, "( the diner is still open )") — world-building through subtraction and memory · honest metric tagging in the copy book (real vs bracket) · reviewer gauntlets with adjudication records · backups before every edit · the overnight run shipped 20+ improvements with zero locks broken.
**Got wrong (documented, don't repeat):** mats-designed-for-captions premise (two full renders before the legibility math was done) · legible "...RSAY" letters (fixed to glow) · safe-fix death spiral v3→v5 · duplicate HOME_TITLE parse-kill · shipped rev1 caption zone that clipped at wide viewports and covered a face · 9.0 VRAM gate guess (measured to 8.5 tunable) · treated whetstone's empty review as pure tool-mismatch when domain-misroute was half the story · one duplicated $0.06 render from re-firing a "failed" detached launch · presented an un-openable HTML preview (fixed by embedding).
**Wrong then made right (the system working):** speaker-index instinct → killed by Whetstone P1 → became POINT AT A FRAME + entrance beat · "ASK THE WALL" → literal line · FROM THE SCRIPT → THE COPY (operator + spec v1.1) · fusion/ensemble/whetstone/flux2 all broken → all fixed and live-tested green the same night · the wall itself: kitsch → sterile → alive, with every step's reasoning on file.

═══════════════════════════════════════════
## 9. OPEN ITEMS BY OWNER
═══════════════════════════════════════════
**Ian (blocks shipping):** §3 ship blockers · sound default re-stamp · OG crop approvals · hearsay graduation + spike-cycle call · real portrait for the TV + bio re-stamp · real testimonials (2–3) for HEARSAY · resume PDF · Jockey add decision (Tier-1 #4) · Atlantic-vs-1800 pick.
**Next build session:** rebuild /work signs + index from the cast list (operator already said yes) · CASE 01 (MrBeast) from spec v1.1 + rewrites → template → book · hearsay measuring pass · wire case footers (NEXT SIGN chain + counter's-open email).
**Pre-ship (Phase F):** cross-browser matrix (Safari/Firefox), Lighthouse/perf budget (F2 is load-bearing: "very, very important"), full a11y audit, Astro production port (strip view-transition-names per lock), domain decision.
**Infra (separate corridors):** whetstone MCP poller cache fix · critic-quality A/B for effort=low · ensemble peer retry/backoff · pz_house_style LoRA × 4B compat check · fire the VK Design auditor corridor (prompt ready in sidequest_vk_design_auditor/).

═══════════════════════════════════════════
## 10. SPEND THIS BLOCK (Jul 10–11)
═══════════════════════════════════════════
Image gen: 3 × $0.06 gpt-image-2 (wall v8 ×2 incl. one duplicate-fire mistake, v9) — logged in .claude/mem/image_gen_spend.log. Dispatch/research/reviews: ≈ $0.45 total across fusion/perplexity/ensemble/whetstone (each logged to its spend log). Local renders: electricity. Netlify: existing plan. Nothing unmetered.

*The one-sentence thesis stands: this site reaches 10/10 not by adding atmosphere but by making its three or four moving things behave with perfect physical manners — and now the copy book, the world, and the tools that police them are all in one place.*
