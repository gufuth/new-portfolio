# Host decision — Cloudflare Pages

**Date:** 2026-05-18
**Decision:** Cloudflare Pages, not Netlify, not Vercel.

## How we got here

Earlier in the project I recommended Netlify because the Netlify MCP was already connected to my session and it would have given me direct deploy control. Ian pushed back and asked for real research. Verdict flipped.

## The three options compared

### Vercel Hobby — eliminated
- 100GB bandwidth/mo
- **Hobby plan is non-commercial only.** A hire-me portfolio is commercial use by their definition ("any deployment used for financial gain of anyone involved"). Using Hobby for this would put us in violation of TOS.
- Vercel Pro starts at $20/mo. Not justifiable when free options exist.
- Out.

### Netlify Free — second choice
- 100GB bandwidth/mo HARD CAP
- Site goes OFFLINE when exceeded until first of next month
- ~25K to 50K page views before offline for image-heavy pages
- Built-in forms (nice)
- MCP connected (convenient for me)
- Solid Astro support

### Cloudflare Pages Free — chosen
- UNLIMITED bandwidth
- 500 builds/mo
- Best edge network (300+ PoPs globally, <50ms anywhere)
- Astro first-class framework preset
- No MCP connected (we deploy via GitHub push + auto-build)
- No built-in forms (use Formspree free tier, 50/mo, or a Cloudflare Worker)
- No built-in image optimization on free tier, but Astro generates static AVIF at build time so this gap doesn't matter for our case

## Why Cloudflare wins for this specific project

1. **The noir aesthetic is image-heavy.** Page weights will be 2-4MB even after AVIF. Netlify's 100GB cap = ~25-50K page views before offline. A successful LinkedIn post, a TechCrunch mention, or a recruiter sharing internally could blow that cap and take the site offline at the exact moment Ian is being considered for a role. Catastrophic failure mode.
2. **Cloudflare's free bandwidth is real, not a marketing trick.** Their business model treats bandwidth as loss-leading infrastructure. Site traffic makes their network more valuable to enterprise customers.
3. **Edge performance is genuinely best-in-class.** Every location under 50ms. For a cinematic noir aesthetic where first paint matters to the mood, this is a feature.
4. **Bonus: Cloudflare nameservers give us free WAF + DDoS protection.** Not nothing for a public portfolio.

## What we give up by not using Netlify

1. **The Netlify MCP convenience.** I can't drive deploys via MCP. Instead, GitHub push triggers Cloudflare auto-build. ~5 extra minutes of Phase 1 setup, zero friction after.
2. **Built-in forms.** Solved by Formspree (10 minutes to wire) or a one-file Cloudflare Worker.
3. **Branch preview UX.** Both have it; Netlify's is slightly nicer. Not a deal-breaker.

## Build plan implications

Phase 1 changes:
- ~~Netlify project create via MCP~~ → GitHub repo create via GitHub MCP, then connect to Cloudflare Pages via web UI (one-time, ~5 min)
- All other phases unchanged
- Phase 9 (launch): DNS cutover from Squarespace to Cloudflare nameservers (slightly more setup than pointing one A record, gives us their WAF for free)

## Open question

Should we install the Cloudflare MCP from the registry? It would let me drive Cloudflare from the chat directly. Not blocking, but worth doing before Phase 1 if Ian wants tighter feedback loops on deploys.

## Sources reviewed

- [Vercel vs Netlify vs Cloudflare Pages 2026 — Deep Comparison](https://dev.to/lazydev_oh/vercel-vs-netlify-vs-cloudflare-pages-2026-deep-comparison-with-real-numbers-8pl)
- [Cloudflare Pages Pricing & Bandwidth Limits 2026 (DevToolReviews)](https://www.devtoolreviews.com/reviews/cloudflare-pages-pricing-bandwidth-limits-2026)
- [Vercel Hobby Plan (official docs)](https://vercel.com/docs/plans/hobby)
- [Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines)
- [Netlify Free Tier 2026: Limits & Changes](https://agentdeals.dev/vendor/netlify)
- [Cloudflare Pages official docs](https://developers.cloudflare.com/pages/platform/limits/)
