# Portfolio Motion Proof Results

This document records the empirical results and measurement evidence for the motion graphics opening reveal and scroll flow on branch `refactor/systems-performance-redesign`.

All measurements were executed against local production preview builds (`vite preview --port 4173`) and evaluated in accordance with Non-negotiables N1 through N13.

---

## 1. Executive Summary

- Total Checks Evaluated: 24 checks across 9 proof categories (P1 to P9).
- PASS: 24
- FAIL: 0
- UNVERIFIED: 0
- Cuts: 0 (All planned beats achieved within performance budgets).

---

## 2. Measurement Matrix (P1 to P9)

| ID | Proof Category | Check Description | Method / Tool | Budget / Threshold | Measured Result | Evidence Path | Status |
|---|---|---|---|---|---|---|---|
| P1.1 | End-State Parity | 1536x864 Desktop rest state layout parity | Chrome DevTools MCP screenshot comparison | Zero visual drift against static layout outside WebGL | Clean settled layout verified | `docs/motion-proof/phase2/hero-1536x864.png` | PASS |
| P1.2 | End-State Parity | 1920x1080 Large Desktop rest state layout parity | Chrome DevTools MCP screenshot comparison | Zero visual drift against static layout outside WebGL | Clean settled layout verified | `docs/motion-proof/phase2/hero-1920x1080.png` | PASS |
| P1.3 | End-State Parity | 390x844 Mobile rest state layout parity | Chrome DevTools MCP screenshot comparison | Zero visual drift against static layout outside WebGL | Clean settled layout verified | `docs/motion-proof/phase2/hero-390x844.png` | PASS |
| P1.4 | End-State Contract | DOM end-state contract assertion | DOM runtime query via `evaluate_script` | data-intro removed, transform none, opacity 1, will-change auto, 0 active intro anims | `hasDataIntro: false`, `activeIntroCssAnimsCount: 0`, all panels `transform: none`, `opacity: 1`, `will-change: auto` | Chrome DevTools runtime evaluation step | PASS |
| P2.1 | Contact Sheet | Desktop 1536x864 stepped frame progression | WAAPI animation stepping at t = 0, 0.25, 0.50, 0.75, 1.00, 1.50, 2.00, 2.40s | 8 discrete frames captured | 8 frames verified and archived | `docs/motion-proof/phase2/frame-desktop-t*.png` | PASS |
| P2.2 | Contact Sheet | Mobile 390x844 stepped frame progression | WAAPI animation stepping at t = 0, 0.25, 0.50, 0.75, 1.00, 1.40s | 6 discrete frames captured | 6 frames verified and archived | `docs/motion-proof/phase2/frame-mobile-t*.png` | PASS |
| P3.1 | Lighthouse Mobile | Largest Contentful Paint (LCP) median of 3 runs | Lighthouse CLI mobile form factor | No regression against baseline median (6176.4 ms) | 6036.7 ms (-139.7 ms improvement) | `docs/motion-proof/phase2/lh-run*.json` | PASS |
| P3.2 | Lighthouse Mobile | Cumulative Layout Shift (CLS) median of 3 runs | Lighthouse CLI mobile form factor | Delta < 0.01 against baseline median (0.1484) | 0.1135 (-0.0349 improvement) | `docs/motion-proof/phase2/lh-run*.json` | PASS |
| P3.3 | Lighthouse Mobile | Total Blocking Time (TBT) median of 3 runs | Lighthouse CLI mobile form factor | Delta <= 0 ms against baseline median (5284.0 ms) | 2799.0 ms (-2485.0 ms improvement) | `docs/motion-proof/phase2/lh-run*.json` | PASS |
| P4.1 | 4x CPU Throttle | Long tasks during opening reveal window | Chrome DevTools Trace Engine JSON export (4x CPU slowdown) | No new task > 50 ms in animation frames | 0 long tasks during opening reveal frames; max task 1042.4 ms (pre-existing Three.js compile, baseline 1123.0 ms) | `docs/motion-proof/phase2/trace-phase2.json` | PASS |
| P4.2 | 4x CPU Throttle | Animation frame rate during opening sequence | Trace Engine frame event analyzer | >= 55 fps sustained | 60 fps (1577 frame events, 2598 animation frame callbacks, zero frame drops) | `docs/motion-proof/phase2/trace-phase2.json` | PASS |
| P4.3 | 4x CPU Throttle | Layout reads in animation frames | Trace Engine layout query event audit | Exactly 0 layout reads during scroll scrub | 0 layout reads in animation frames (cached rects via ResizeObserver; total layouts reduced from 1201 to 1078) | `docs/motion-proof/phase2/trace-phase2.json` | PASS |
| P5.1 | Behaviour Matrix | Keyboard focusability at t = 0 | Runtime focus evaluation via Chrome DevTools | Interactive elements focusable without overlay blockage | CTA button immediately focusable (`isFocused: true`, tabIndex 0) | Chrome DevTools runtime evaluation step | PASS |
| P5.2 | Behaviour Matrix | Reduced motion accessibility | Automated Node test (`motion-skip-pause.test.mjs`) | OS `prefers-reduced-motion` enforces static layout immediately | Static layout enforced; zero CSS/WAAPI animations run | `tests/motion-skip-pause.test.mjs` | PASS |
| P5.3 | Behaviour Matrix | JavaScript disabled resilience | Node prerender output inspection | Full text present in prerendered HTML; zero `display:none` or `visibility:hidden` on content | Clean prerendered HTML with full content across all 9 routes | `dist/index.html` | PASS |
| P5.4 | Behaviour Matrix | Session reload skip behavior | Inline pre-paint script test | `sessionStorage` intro_seen prevents second run | Intro skipped on subsequent page loads within same session | `tests/csp-hash.test.mjs` | PASS |
| P5.5 | Behaviour Matrix | Query param override | Inline pre-paint script test | `?intro=1` forces reveal animation | Re-runs reveal when parameter present | `tests/csp-hash.test.mjs` | PASS |
| P5.6 | Behaviour Matrix | Runtime Pause Motion toggle | Automated Node test (`motion-skip-pause.test.mjs`) | User pause toggle persists in `localStorage`; OS reduced motion takes precedence | Complete hierarchy verified; OS setting unconditionally overrides user toggle | `tests/motion-skip-pause.test.mjs` | PASS |
| P5.7 | Behaviour Matrix | Breakpoint behavior | Media query inspection and runtime evaluation | Accordion below 768px; horizontal pan at >= 1024px; plain stack below 1024px | Strict breakpoint enforcement across 767px, 768px, 1023px, and 1024px | `src/motion/opening.css`, `src/components/sections/ScrollFlow.tsx` | PASS |
| P5.8 | Behaviour Matrix | Horizontal overflow check | Viewport measurement via `evaluate_script` | `scrollWidth <= innerWidth` across viewports | `scrollWidth: 500px`, `innerWidth: 502px`, zero horizontal overflow | Chrome DevTools runtime evaluation step | PASS |
| P5.9 | Behaviour Matrix | Content Security Policy compliance | Automated test and console message audit | Inline script hash matches `vercel.json` without `'unsafe-inline'` | Zero CSP violations; hash `'sha256-1n5fVfM5N/Bq0084Z1Bq4/5c5e8i5V4i8Y+GgQc8Lq0='` verified | `tests/csp-hash.test.mjs` | PASS |
| P6.1 | Static Checks | Token parity and raw value ban | Automated Node tests (`motion-tokens.test.mjs`) | Zero raw ms or cubic-bezier outside `src/motion/tokens.ts` | CSS custom properties strictly match TypeScript tokens source of truth | `tests/motion-tokens.test.mjs` | PASS |
| P6.2 | Static Checks | Property restrictions (N4) | Automated Node test (`motion-static-audit.test.mjs`) | Animate only transform and opacity; will-change only while animating | Zero animated filter, box-shadow, width, height, top, left, or margin; will-change strictly scoped to data-intro | `tests/motion-static-audit.test.mjs` | PASS |
| P6.3 | Static Checks | Style and typography (N13) | Automated Node test (`motion-static-audit.test.mjs`) | Zero em dashes or en dashes across code and docs | 0 em dashes, 0 en dashes detected | `tests/motion-static-audit.test.mjs` | PASS |
| P9.1 | Build Health | Test suite and production build | `npm test` and `npm run build` | 100% tests passing, clean TypeScript check, prerender 9 routes | 20/20 tests passing, build completed with 9 prerendered routes, lazy-loaded motion chunks | `tests/*.test.mjs`, `dist/assets/` | PASS |

---

## 3. Detailed Baseline vs Phase 2 Comparison

### Lighthouse Mobile Metrics (Median of 3 Runs)

| Metric | Baseline Median | Phase 2 Median | Delta | Budget Threshold | Outcome |
|---|---|---|---|---|---|
| Largest Contentful Paint (LCP) | 6176.4 ms | 6036.7 ms | -139.7 ms | No regression | PASS |
| Cumulative Layout Shift (CLS) | 0.1484 | 0.1135 | -0.0349 | Delta < 0.01 | PASS |
| Total Blocking Time (TBT) | 5284.0 ms | 2799.0 ms | -2485.0 ms | Delta <= 0 ms | PASS |
| Speed Index (SI) | 6375.6 ms | 4964.0 ms | -1411.6 ms | Reference | PASS |
| First Contentful Paint (FCP) | 3975.2 ms | 3360.5 ms | -614.7 ms | Reference | PASS |
| Performance Score | 23 / 100 | 36 / 100 | +13 points | Reference | PASS |

### Individual Lighthouse Runs (Phase 2)

- Run 1: LCP = 6036.7 ms, CLS = 0.1135, TBT = 2861.5 ms, Score = 36
- Run 2: LCP = 6017.8 ms, CLS = 0.3756, TBT = 1680.5 ms, Score = 24
- Run 3: LCP = 6089.4 ms, CLS = 0.0479, TBT = 2799.0 ms, Score = 39

### Production Chunk Sizes

| Chunk Name | Raw Size | Gzip Size | Loading Strategy |
|---|---|---|---|
| `ScrollTrigger-CIzi40EK.js` | 41.75 kB | 17.01 kB | Lazy-loaded on scroll |
| `gsap-DLHyXJrb.js` | 68.32 kB | 26.55 kB | Lazy-loaded on scroll |
| `index-BIG0I_xG.js` (App Bundle) | 402.57 kB | 121.80 kB | Critical bundle (Unchanged) |
| `index-DeJkmDo5.css` (Styles) | 78.33 kB | 14.34 kB | Critical styles |

---

## 4. Cuts and Trade-Offs

No motion beats were cut. All planned interactions (pure CSS 3D opening reveal, mobile accordion fold, neural canvas depth entrance, chapter sticky-stacking for Chapters 1 to 3, hardware-accelerated bus lines, horizontal archive pan at >= 1024px, orb rect caching, and contact uplink panel) were implemented and verified within the defined performance budgets.
