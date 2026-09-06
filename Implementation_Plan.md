Executive Summary

Your index.html metadata is actually solid — real Person/WebSite/ProfilePage JSON-LD, full OG/Twitter cards, decent keywords. The problem is everything after that: it's a pure client-rendered SPA with zero per-route head management, so /about, /projects, and all 5 project pages (Vectoris, Veronica AI, AEGIS, MahinaOS, STEM Idea Adventure) serve the exact same title/description/canonical as the homepage. Google effectively sees 6 duplicate pages instead of 6 distinct, keyword-rich ones — that's the single biggest thing suppressing your project-specific rankings.

Major Problems
No per-route metadata — no react-helmet-async, no document.title calls anywhere. All routes share one <head>.
4 separate <h1> tags on the homepage hero (one per word of "Designing intelligent digital experiences.") — and none of them contain "Hardik Bhaskar." Your name only appears in image alt text on the hero, not visible crawlable copy.
No robots.txt, no sitemap.xml anywhere in public/.
Domain mismatch: index.html's canonical/OG/JSON-LD all point to lunakitsune.vercel.app, but your own README's "Live Demo" badge links to hardikbhaskar.dev. If that's your real domain, you're currently telling search engines the wrong one.
Soft 404s: invalid project slugs render a "Project not found" UI but still serve HTTP 200 with the homepage's indexable metadata.
Duplicate routes: /projects/:slug and /project/:slug both render identical content — no canonicalization between them.
Biggest Opportunities
Per-route <Seo> component (P0) — highest leverage, lowest risk.
Fix the H1 structure + get "Hardik Bhaskar" into visible hero text (P0, trivial markup change).
robots.txt + generated sitemap.xml (P0, ~1 hour of work).
Lazy-load the always-on Three.js ScrollOrb in App.tsx — it currently loads on every route even though Hero.tsx/AboutPreview.tsx correctly lazy-load their own 3D scenes (P1).
WebP conversion + width/height on the 9.7MB of PNGs (P1, CLS/LCP win).
Keyword / Entity Strategy

Primary: "Hardik Bhaskar." Secondary: developer/AI engineer/full-stack/portfolio variants — all already present in existing meta keywords, just need to also live in per-page titles now. Project-name long-tails (e.g. "Hardik Bhaskar Vectoris," "Hardik Bhaskar Veronica AI") become viable for the first time once project pages get unique titles/descriptions/JSON-LD.

Implementation Roadmap

P0: per-route Seo component, H1 fix, robots.txt/sitemap.xml, resolve domain mismatch.
P1: prerendering for non-JS crawlers/social unfurlers, lazy-load ScrollOrb, image optimization + dimensions, redirect /project/:slug → /projects/:slug.
P2/P3: font-weight audit, per-project OG images, markdown-renderer code splitting.

Manual Steps (outside the repo)
Confirm the real production domain (hardikbhaskar.dev vs lunakitsune.vercel.app) — Antigravity needs this before touching canonical URLs.
Submit the new sitemap to Google Search Console + Bing Webmaster Tools once deployed.
Nothing in this codebase can fix backlinks/off-page authority — that's on you (GitHub profile README linking back, LinkedIn, etc., which you already do).
Risks / Limitations

SEO can't manufacture credibility signals you don't have — backlinks, third-party mentions, and domain age matter and aren't code changes. Prerendering (P1) is the one item with real effort; everything else in P0/P1 is low-risk, mechanical.