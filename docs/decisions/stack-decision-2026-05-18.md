# Bleeding-edge stack decision — Last Stop Diner Portfolio

> **STATUS: SUPERSEDED / HISTORICAL.** The current repository is plain HTML/CSS/vanilla JS with no checked-in Astro, Tailwind, MDX, package manifest, Cloudflare config, workers, or dynamic OG system. Do not install tools or rebuild the stack from this document.

**Date:** 2026-05-18
**Scope:** MCPs to install, AI image tools, runtime augmentations, observability. Beyond the framework + host decision in `host_decision_2026_05_18.md`.

---

## TL;DR

| Layer | Choice | Status |
|---|---|---|
| Framework | Astro + Tailwind + MDX | Phase 1 |
| Host | Cloudflare Pages | Phase 1 |
| Repo | GitHub | Phase 1 |
| Cloudflare control | **Cloudflare MCP** | Install before Phase 1 |
| Component iteration | **Magic Patterns MCP** | Install at Phase 2 |
| Image generation | Veo / Nano Banana / FLUX Kontext Pro | Ian-driven, no MCP |
| Image-edit fallback | fal.ai or Replicate API | Optional, add at Phase 2 if needed |
| Dynamic OG images | **workers-og** (Cloudflare-native, Satori-based) | Phase 8 |
| Forms | Formspree free tier OR Cloudflare Worker | Phase 2 |
| Analytics | Cloudflare Web Analytics (free) → Plausible (later) | Phase 8 |
| CMS (optional) | Sanity MCP | Phase 10+ |
| Astro docs lookup | Astro Docs MCP | Nice to have |

---

## The MCP layer

### MUST INSTALL before Phase 1

#### 1. Cloudflare MCP (cloudflare/mcp)
The piece I was missing. Cloudflare has shipped an official MCP that covers their entire API: Workers, KV, R2, D1, Pages, DNS, Firewall, Load Balancers, Stream, Images, AI Gateway, Vectorize, Access, Gateway, and more. Authenticated via OAuth.

Uses the "Code Mode" pattern: the model writes JS against a typed OpenAPI representation rather than loading per-endpoint tools, which keeps context footprint small across 2,500+ endpoints.

For this project, this means I can:
- Create the Pages project programmatically
- Update DNS records during cutover
- Deploy Worker for OG image generation
- Deploy Worker for forms (if we go that route)
- Manage R2 buckets if we ever host originals separately
- Inspect deploy logs and rollback in chat

**Install:** via mcp-registry search, or directly from `cloudflare/mcp` (the official server). Takes ~2 min including OAuth.

### SHOULD INSTALL at Phase 2 (component build)

#### 2. Magic Patterns MCP (mcp.magicpatterns.com/mcp)
AI component iteration tool. Generates UI from prompt or screenshot, can ingest your design system, exports production-ready Tailwind/React/Vue.

For this project: A/B different versions of NeonSign, BillboardCard, Receipt, MenuItem, Payphone. Particularly useful when we want 3 variants of the same component to pick from.

You mentioned wanting this earlier. Confirmed worth it.

### NICE TO HAVE

#### 3. Astro Docs MCP (kapa.ai-based)
Up-to-date index of Astro documentation. Saves me round-trips during build when I need a quick reference. Low cost to install, marginal benefit.

#### 4. Figma MCP (mcp.figma.com/mcp)
Only relevant if you decide to formalize a design system in Figma. Right now all design lives in image renders, so skip until / unless that changes.

### SKIP

- **Sanity MCP** — only matters at Phase 10+ if you want a writable CMS
- **Vercel MCP** — not using Vercel
- **Netlify MCP** — already connected but no longer used for this project
- **Webflow MCP** — not using Webflow
- **Adobe / Canva MCPs** — heavyweight, not aligned with the in-code workflow

---

## The image generation layer

You drive image generation, I integrate. No MCPs needed for the image side since the gen tools are conversational on your end and I just consume the outputs. But here's the current bleeding-edge landscape so you can pick the right tool per shot:

### For new scene generation
- **Veo (Google)** — what you've been using. Best for cinematic motion, atmosphere, character continuity. Slow, expensive per render. Keep for hero scenes.
- **Nano Banana / Gemini 2.5 Flash Image** — Google's image-only model. State-of-the-art character consistency, micro-detail retention, prop execution, prompt adherence. Beats FLUX on realism per current head-to-head benchmarks. Good fit for the cinematic register we're in.

### For edits, style transfer, billboard variants
- **FLUX Kontext Pro** — best-in-class for professional portfolio work: background replacement, object-level editing, style transfer. Used in Photoshop 2026 via the third-party AI plugin path. Great for taking one billboard scene and generating 12 variants (one per case study) with consistent lighting / typography / framing.
- **fal.ai / Replicate** — model aggregators that give you API access to FLUX, SDXL, custom LoRAs, ControlNet, and upscalers. If we want to script image variants from the build (e.g., generate 12 billboards from a template), one of these gives us programmatic access.

### Recommendation for our build

- **Phase 2-7 (hero / scene assets):** Veo + Nano Banana on your end, deliver to me as static PNGs. I optimize via Astro's image pipeline at build time.
- **Phase 4 (billboards per case study):** Consider running FLUX Kontext Pro from your end on the one billboard template, generating 12 brand-customized variants. Faster and more consistent than 12 separate Veo renders.
- **Phase X (programmatic):** If we want to script variant generation later, wire fal.ai API key. Not urgent.

---

## The runtime augmentation layer

These run at the edge on Cloudflare, no MCP needed, just code we deploy as part of the build.

### Dynamic OG images via workers-og
Every case study should generate its own social-share image automatically (brand name, headline result, in the noir palette). Two options:

- **@vercel/og** — the standard but has WASM bundling issues on Cloudflare Workers per Cloudflare's own docs.
- **workers-og** (kvnang/workers-og) — Cloudflare-native, Satori-based, same API surface as @vercel/og without the WASM problem. **Use this.**

Generate one OG image per case study at request time. Cached at the Cloudflare edge. Looks like a movie poster: brand name in your display serif, headline metric in big type, noir gradient. Shared links on LinkedIn / Slack / iMessage become unmissable.

### Forms via Cloudflare Worker (or Formspree)
- **Formspree free tier (50 submissions/mo):** zero-code, fastest path
- **Cloudflare Worker (single file):** sends form to your email via a transactional email API (Resend, Postmark). More control, free-tier-friendly. Slightly more code to wire.

Recommend Formspree for v1. If you ever outgrow 50/mo or want branded transactional emails, swap to the Worker.

### Workers AI (Phase 10+ stretch)
Cloudflare's free Workers AI tier could power an embedded "talk to Ian" agent on the site that answers questions about your work, pulls from PZ memory, recommends case studies based on the visitor's role. Stretch goal, not for v1. Naming it so we don't forget.

---

## The observability layer

### Analytics
Three options, pick one (default: start with #1, upgrade to #2 if you want better data):

1. **Cloudflare Web Analytics (free):** zero config, ships with your DNS setup. Caveats: 30-day data retention, samples 10% of page loads. Fine for "is anyone visiting" but bad for year-over-year tracking. Best v1 default.
2. **Plausible ($9/mo):** 3-year retention, lightest payload (~2kb), real numbers not samples, GDPR-clean. Best paid choice for a serious portfolio.
3. **Umami (free, self-hostable):** open source, full data, requires hosting it on a Cloudflare Worker or similar. Free if you want zero ongoing cost and don't mind the setup.

Recommend Cloudflare Web Analytics for v1 launch. Reassess at month 3 based on whether the data is enough.

### Performance budget
- **Lighthouse CI in GitHub Actions:** runs on every PR, fails the build if perf score drops below threshold. Catches regressions before they ship. Free.

### Visual regression
- **Chromatic / Percy:** overkill for a portfolio. Skip.

---

## Install order

### Before Phase 1 (next session)
1. Cloudflare MCP — required to drive deploys
2. (You) GitHub account if needed
3. (You) Cloudflare account if needed

### At Phase 2
4. Magic Patterns MCP — for component iteration

### At Phase 8 (polish)
5. workers-og — for dynamic OG images
6. Cloudflare Web Analytics — DNS-level toggle
7. Lighthouse CI in GitHub Actions

### Phase 10+ (optional stretches)
8. Sanity MCP — if you want editable CMS
9. Workers AI — if you want an embedded site agent
10. Plausible — if Cloudflare Web Analytics isn't enough

---

## Sources

- [Cloudflare's official MCP servers (Cloudflare Agents docs)](https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/)
- [Cloudflare MCP repo (cloudflare/mcp on GitHub)](https://github.com/cloudflare/mcp)
- [Cloudflare Code Mode MCP Server (InfoQ, 2026)](https://www.infoq.com/news/2026/04/cloudflare-code-mode-mcp-server/)
- [vercel/og on Cloudflare Pages (docs)](https://developers.cloudflare.com/pages/functions/plugins/vercel-og/)
- [workers-og repo (kvnang)](https://github.com/kvnang/workers-og)
- [Magic Patterns Figma plugin](https://www.figma.com/community/plugin/1304255855834420274/magic-patterns)
- [Top Figma Make alternatives (Magic Patterns blog)](https://www.magicpatterns.com/blog/figma-make-alternatives)
- [Nano Banana vs FLUX Kontext Pro head-to-head](https://fluxproweb.com/blog/detail/Nano-Banana-AI-vs-Flux-Kontext-Pro-Direct-Comparison-of-Two-Leading-AI-Models-c0bd4c3e4c45/)
- [API Image Generation 2026 guide (Nano Banana, Imagen, FLUX, GPT)](https://medium.com/@davidlfliang/guide-api-image-generation-2026-nano-banana-imagen-flux-gpt-image-0bff59e9d163)
- [Cloudflare Web Analytics vs Plausible](https://plausible.io/vs-cloudflare-web-analytics)
- [Privacy-first analytics comparison (Nuxt Scripts)](https://scripts.nuxt.com/learn/privacy-first-analytics-compared)
