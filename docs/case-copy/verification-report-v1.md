# Verification Report v1 — case study rewrites + Who page

> MIRRORED 2026-07-11 from Google Doc "Verification Report v1 (anti-AI gate + Whetstone + VK)"
> https://docs.google.com/document/d/1xyFvBEMJ1ZfUJbBo3XaJ_-6OUB8ApTAod4YsvVZ5ApU/edit
> Gate evidence for case_study_rewrites_v1.1.md + who_page_rewrite_v1.md. The per-case VK table
> and the six open items below are the ship-gates for the copy book.

**Date:** 2026-07-06 · **Artifacts tested:** Case Study Rewrites, Who Page Rewrite **Gauntlet:** six-layer anti-AI gate · Whetstone v2 (standard, copy domain, 3 runs) · taxonomy gate · VK Creative pre-check · grammar/logic/prose audit via cross-vendor critics

## 1. Anti-AI gate (six layers)

| Layer | Method | Result |
| :-- | :-- | :-- |
| 1. Vocabulary floor | code grep, banned list + negation-pairs + pivots | **CLEAN** on both files |
| 2. Structural-tell scan | manual pattern audit | Clean on negation-pairs, staccato strings, "The result?" pivots. One deliberate triad kept ("high-stakes, irreverent, zero banker energy": members concrete, non-interchangeable). Finding: **the Takeaway aphorisms were the machine-scented element**; the four flagged by multiple judges were rewritten (see §5) |
| 3. Cross-vendor adversarial (Gemini 2.5 Flash, cut-and-sharpen contract) | off-bucket | Real catches accepted: "raised a kid who became an American icon" (clunk, fixed), aphorism-closers (fixed), Cuervo parenthetical on Who page (fixed). **Rejected with cause:** its advice to delete the template labels (the labels ARE the scannable case anatomy recruiters screen for) and to cut "Brass tacks" and the RUMORS list (those are the site's signature deadpan, the register target, not a bug) |
| 4. Zero-context cold read (GPT-4o-mini) | off-bucket, bare text + 3 questions | Tell-it-back: PASSED on both files. Read-twice flags fixed: the Virgin Galactic goal sentence (split), "Confidence as a design principle" (verb added). AI-scented flags overlapped with Layer 3 on the aphorisms (fixed) |
| 5. Read-aloud pass | manual, sentence by sentence | Fixes applied: "wasn't showing up on shelf" → "wasn't making it to the shelf"; VG goal sentence split; Chinatown sentence rebuilt. "Me." fragment on Who page kept: earned beat, not a trip |
| 6. Strip-audit on shipped artifact | code grep on the on-disk files post-edit | **CLEAN** |

**Verdict: PASS post-fix**, with the caveat that layers 3–4 should re-run once real numbers and real "lines I wrote" replace the brackets, because those insertions are new copy.

## 2. Whetstone v2 (standard tier, copy domain, cross-vendor panel: claude-opus-4.6, gemini-3.1-pro-preview, kimi-k2.6, gpt-5)

**Run 1 — rewrites doc (4 × P1):**

1. **Named-idea spec violated by Cuervo, Atlantic, Vans (+SCOOBA):** the spec mandates a named idea; four cases carry [NAME IT] brackets. *Disposition: assigned to Ian: these are facts only you have. Nothing ships with a bracket.*
2. **Stale-view risk on live-site maintenance notes:** the swap-in notes prescribe edits against a cached read of the site. *Disposition: accepted: re-verify each page against the live site before executing any fix.*
3. **Audience mixing (portfolio copy + operator instructions in one artifact).** *Disposition: accepted for v2 packaging: when brackets are filled, a clean site-ready version gets split from this working doc.*
4. **VK gate declared but not run.** *Disposition: closed: the gate has now run (this report), and the process note in the rewrites doc was updated to cite actual results.*

**Run 2 — rewrites doc (1 × P1):** 5. **Placeholder calibration:** bracketed numbers carry no calibration basis; a placeholder 5x off reality trains you to anchor on it. *Disposition: accepted: calibrate each real number against a named source or use a range with a floor. If the real number is smaller than the placeholder, the number wins, never the narrative.*

**Run 3 — Who page (1 × P2):** 6. **AI-workflow paragraph risks reading as hygiene, not differentiator, without concrete proof.** *Disposition: accepted: concrete-outcome placeholder inserted; fill it with a real one.*

## 3. Taxonomy gate

- **Stage 1 (deterministic scan): PASSED clean** on the rewrites doc: zero category-inventory lines, zero tripwire vocabulary.
- **Stage 2 (LLM swap panel): the gate script returned INCOMPLETE** (its judge integration failed to parse the dispatcher's wrapped output: an infra bug, flagged for a fix). Per the gate's fail-closed law, "taxonomy gate: passed" is NOT logged.
- **Compensating control:** a manual swap panel ran on all 14 hook/positioning lines. Most of the judge's FAILs applied a buyer-benefit standard that misfits narrative hooks; its two convergent legitimate catches (the car2go and Vans takeaway aphorisms were swappable into anyone's book) were rewritten to lines only this work could produce.

## 4. VK Creative pre-check (Clarity / Specificity / Differentiation / Emotional Resonance, hostile, 4.5 bar)

| Case | C | S | D | ER | Verdict |
| :-- | :-: | :-: | :-: | :-: | :-- |
| 1 MrBeast | 4.7 | 4.6* | 4.7 | 4.5 | **PASS*** |
| 2 Virgin Galactic | 4.6 | 4.5* | 4.5 | 4.6 | **PASS*** (post-fix) |
| 3 Nike SB | 4.6 | 4.8 | 4.7 | 4.7 | **PASS** (post-fix) |
| 4 Outdoor Voices | 4.7 | 4.6 | 4.5 | 4.4 | **FLAG** (ER 4.4 advisory: one warmer human beat would close it) |
| 5 Cuervo | 4.6 | 3.8 | 4.4 | 4.3 | **HOLD** (idea unnamed) |
| 6 The Atlantic | 4.5 | 3.9 | 4.3 | 4.3 | **HOLD** (idea unnamed) |
| 7 1800 | 4.5 | 4.4 | 4.5 | 4.5 | **FLAG** (S 4.4 pending the $50M sourcing decision) |
| 8 Silvercar | 4.6 | 4.5 | 4.5 | 4.6 | **PASS** |
| 9 car2go | 4.7 | 4.5* | 4.8 | 4.6 | **PASS*** (post-fix) |
| 10 SCOOBA | 4.5 | 3.7 | 4.4 | 4.4 | **HOLD** (the system is still unexplained) |
| 11 Vans | 4.4 | 3.5 | 4.2 | 4.2 | **HOLD** (mostly brackets; build or fold) |
| 12 Channel Craft | 4.6 | 4.3 | 4.6 | 4.5 | **PASS** as format spec |
| 13 Homepage lines | 4.7 | 4.5 | 4.7 | 4.6 | **PASS** (option 3 strongest) |
| Who page | 4.6 | 4.5* | 4.7 | 4.6 | **PASS*** (post-fix; AI-outcome bracket open) |

\* = conditional on brackets replaced with real, sourced data. The four HOLDs are input-starved, not craft failures.

## 5. Fixes applied this pass (already in the docs)

1. Nike: "raised a kid who became an American icon" → "raised the kid who'd one day cause a sneaker riot."
2. 1800: verbless fragment → "We treated confidence as a design principle." Hook: "wasn't making it to the shelf."
3. Virgin Galactic: goal sentence split → "No reschedules, no reshoots, no second take."
4. car2go takeaway → "We didn't interrupt date night. We got invited."
5. Vans takeaway → "Write for the next kid, not the last one. The last one already owns four pairs."
6. Who page: Cuervo parenthetical fixed; motivational-generic closer cut; concrete-outcome placeholder added to the AI paragraph.
7. Rewrites process note updated to cite run results instead of promising future gates.

## 6. Open items (owner: Ian) — nothing ships until these close

1. Name the idea: Cuervo, Atlantic, Vans, SCOOBA (and explain what SCOOBA stands for).
2. Replace every bracketed number with real, sourced data, calibrated against a named benchmark or expressed as a range. If the real number is smaller than the placeholder, the number wins.
3. Supply the real "lines I wrote" per case: the highest-value empty slot in the whole book.
4. Re-verify each live-site fix against the current site before executing.
5. Re-run the cross-vendor pass, cold read, and a fresh Whetstone on the final bracket-free versions before publishing.
