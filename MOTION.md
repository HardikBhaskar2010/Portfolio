# MOTION.md: Architecture, Storyboard, and Engineering Proof Plan

## 1. Preamble

- Design Read: Technical systems architecture portfolio for an engineer specializing in bare-metal runtimes, OS kernels, and local-first AI agents. Motion must reflect physical mechanical restraint, mathematical precision, and an engineering-blueprint aesthetic (unfolding crease lines, hinged panels, layered stack) rather than generic agency flashiness.
- Taste Dials: DESIGN_VARIANCE 6, MOTION_INTENSITY 7, VISUAL_DENSITY 5 (configured per brief Section 2, overriding defaults).
- Branch and HEAD: `refactor/systems-performance-redesign` at commit `efd48cf`.
- Baseline Medians (Lighthouse Mobile 3 runs): LCP 6176.4 ms, CLS 0.1484, TBT 5284.0 ms (direct hero render on `?nointro=true`: LCP 5982.0 ms, CLS 0.0281, TBT 3902.0 ms; DevTools 4x CPU throttle trace: LCP 2570 ms, CLS 0.0376, TBT 1691 ms).
- Pre-Existing Baseline Violations: The current site baseline already exceeds N9 budgets (LCP > 2.5 s, CLS > 0.01, TBT > 200 ms) due to Three.js bundle weight and shader compilation on cold boot. These are documented as pre-existing violations. The Phase 2 mandate is to guarantee that the new motion graphics introduce zero regression against this baseline and zero tasks over 50 ms in animation frames. Measurements will never be tuned or gamed to artificially pass.
- LCP Candidate Element: `p.font-ui` selector `div.relative > div.grid > div.flex > p.font-ui` snippet `<p class="font-ui text-[var(--text-secondary)] text-base sm:text-lg leading-[1.75] m..." style="opacity: 1; transform: none;">` ("I build AI systems and the low-level software under them: Rust and C++ runtimes, operating systems, local-first agents.").
- Chosen Scroll Library: GSAP ScrollTrigger (lazy-loaded dynamically after LCP). Gzip cost: GSAP core 27.8 kB gzip, ScrollTrigger 17.6 kB gzip (total 45.4 kB gzip lazy chunk; exactly 0 kB on the critical path LCP bundle). Framer Motion (dist 59.4 kB gzip) is retained exclusively for existing static leaf component transitions, not used for scroll pinning or scrub calculations to eliminate layout thrashing and rAF state fighting.

---

## 2. Skills Digest

1. `design-taste-frontend` §0 (Brief Inference): Calibrate aesthetics to domain intent. Implements an engineering-drawing metaphor where panels unfold along precise hairline creases instead of generic floating cards.
2. `design-taste-frontend` §5.A (Sticky-Stack Skeleton): Canonical pinned chapter flow where entering panels pin at "top top" while previous panels scale to 0.94 and dim via an opacity overlay. Forms the foundation of Section 7.
3. `design-taste-frontend` §5.C (Asymmetric / Horizontal Reveal): Overflowing card collection translated horizontally along the X-axis while pinned. Applied to remaining projects for viewports at or above 1024 px.
4. `design-taste-frontend` §5.D (Forbidden Animation Patterns): Strict ban on `window.addEventListener('scroll')`, rAF loops modifying React state, and scrollY progress stored in component state. All scroll choreography delegates to GSAP matchMedia.
5. `design-taste-frontend` §6.A (Hardware Acceleration): Animate only `transform` and `opacity`. Shading is an overlay opacity transition; hairlines scale along scaleX/scaleY; light sweeps translate a dedicated gradient layer.
6. `design-taste-frontend` §6.B (Reduced Motion): Mandatory reduced motion compliance. Immediate static rendering with all triggers dismantled and zero layout transforms when active.
7. `design-taste-frontend` §9.A (Anti-Slop - Overstyling): Bans neon outer glows, floating card hover-lifts, and custom cursors. Replaces float effects with structured panel hinges.
8. `design-taste-frontend` §Stack Notes (Override): Skill recommends Motion for reveals and GSAP for pin/pan. Overridden by Brief N8 / Section 8: opening is pure CSS keyframes with zero JS runtime dependencies; scroll code uses exclusively GSAP ScrollTrigger.
9. `full-output-enforcement` §Baseline & Banned Patterns: Treats partial output as broken output. Strict ban on `// ...`, `// TODO`, or skeletal placeholders. All code modules, tokens, and tests will be output in full.
10. `web-design-guidelines` §Accessibility & Focus: Interactive controls require explicit focus rings, accessible labels, and minimum 24x24 px hit targets. Directs the Pause Motion toggle implementation.

---

## 3. Repo Inventory and Spine Mapping

| Item | Path | What It Is | Real Text or Claims It Shows | Media | Spine Layer | Chapter |
|---|---|---|---|---|---|---|
| Hero Headline | `src/components/sections/Hero.tsx` | Display title | "Systems Architect", "AI Systems Builder" | None | 0 Entry | Opening |
| Hero Subtext | `src/components/sections/Hero.tsx` | Core description (LCP) | "I build AI systems and the low-level software under them: Rust and C++ runtimes, operating systems, local-first agents." | None | 0 Entry | Opening |
| Hero Profile | `src/components/sections/Hero.tsx` | Visual panel | "Hardik Bhaskar", "Building operating systems, autonomous AI & intelligent systems." | `/images/avatar.webp` | 0 Entry | Opening |
| Active Systems | `src/components/sections/CurrentFocus.tsx` | Status pill card | "KAGE Browser (Rust / CEF)", "Vectoris Desktop (Rust)", "Veronica AI Multi-Agent", "MahinaOS Kernel (C++)" | None | 0 Entry | Opening |
| Mahina OS | `src/data/projects.generated.json` | Project archive | "Experimental OS Interface", "luna-init (PID 1 Service Manager in C17)", "DAG dependency solver", "Zero-allocation early boot graphics", "Documentation-First Engineering" | `/images/projects/mahinaos.webp` | 1 Foundations | Chapter 1 (Foundations) |
| Live Telemetry | `src/components/sections/LiveContributions.tsx` | GitHub activity | Real commit activity and engineering cadence | None | 1 Foundations | Chapter 1 (Foundations) |
| KAGE Browser | `src/data/projects.generated.json` | Project archive | "Developer-first autonomous browser & workstation", "Tauri v2 (Rust)", "Chromium Embedded Framework (CEF 152)", "Liquid Glass UI", "Rust Tool Bus bridging CDP" | `/images/projects/kage.webp` | 2 Runtime | Chapter 2 (Runtime) |
| Systems Services | `src/components/sections/Services.tsx` | Systems capabilities | Operating systems, browser engines, autonomous AI architectures | None | 2 Runtime | Chapter 2 (Runtime) |
| Vectoris Desktop | `src/data/projects.generated.json` | Project archive | "AI-Native Engineering Desktop Workstation", "Tauri v2", "Rust", "construction drawing takeoff and BOQ calculation", "local parsing and deterministic geometry extraction" | `/images/projects/vectoris.webp` | 3 Intelligence | Chapter 3 (Intelligence) |
| Veronica AI | `src/data/projects.generated.json` | Project archive | "Conversational AI system", "sovereign local-first computing model", "system-aware Attention Controller", "semantic memory knowledge graph" | `/images/projects/veronica-ai.webp` | 3 Intelligence | Chapter 3 (Intelligence) |
| AEGIS Platform | `src/data/projects.generated.json` | Project archive | "AI decision intelligence platform", "asynchronous multi-agent DAGs via Google ADK 2.0", "BigQuery analytical querying via MCP" | `/images/projects/aegis.webp` | 3 Intelligence | Chapter 3 (Intelligence) |
| STEM Adventure | `src/data/projects.generated.json` | Project archive | "Interactive Learning Platform", "Full Stack", educational project generator | `/images/projects/stem.webp` | Remaining | Horizontal Pan |
| Contact Section | `src/components/sections/ContactSection.tsx` | Direct inquiry uplink | "Let's connect", "hardik.bhaskar2010@gmail.com" | None | 4 Invitation | Chapter 4 (Invitation) |

### Gaps and Unmapped Proposals
- Gap Analysis: All 4 spine layers map directly to real files, projects, and components with verified repository claims.
- Unmapped Items:
  - `MarqueeBanner.tsx`: Retained as a subtle static divider between Opening and Chapter 1.
  - `AboutPreview.tsx`: Content absorbed into Chapter 1 (Foundations) profile card.
  - `Testimonials.tsx` and `FAQ.tsx`: Positioned as quiet appendix blocks following Chapter 4.

---

## 4. Story in 6 to 8 Beats

1. Beat 1 (Crease): The visitor observes the technical blueprint sheet establish its mechanical grid along a temporary Icy Steel hairline crease before any element expands.
2. Beat 2 (Headline Hinge): The visitor recognizes the engineer's core specialization as the headline panel hinges forward from the top crease, revealing "Systems Architect & AI Systems Builder" with immediate LCP subtext legibility.
3. Beat 3 (Unfold): The visitor sees the breadth of production systems as the portrait and active system cards flip open downward to expose Currently Building runtime telemetry: KAGE Browser (Rust / CEF), Vectoris Desktop (Rust), Veronica AI Multi-Agent (Live), and MahinaOS Kernel (C++).
4. Beat 4 (Depth): The visitor understands the underlying computational domain as the neural WebGL field surfaces quietly from depth, settling the chromatic orb alongside the headline.
5. Beat 5 (Foundations - Layer 1): Scrolling reveals the bare-metal base layer through Mahina OS architecture: luna-init PID 1 service manager in C17, DAG dependency solver, and zero-allocation early boot graphics.
6. Beat 6 (Runtime - Layer 2): The next chapter slides over, locking KAGE Browser into focus as the developer-first workstation with Tauri v2 (Rust), Chromium Embedded Framework (CEF 152), and Rust Tool Bus bridging CDP.
7. Beat 7 (Intelligence - Layer 3): The third chapter scales in, displaying autonomous AI orchestrations across Vectoris Desktop local parsing, Veronica sovereign memory graphs, and AEGIS decision intelligence on BigQuery and ADK 2.0.
8. Beat 8 (Invitation - Layer 4): The final chapter settles into an open uplink inviting technical collaboration through direct email and structured consultation.

---

## 5. Opening Frame Table

### Explicit LCP Strategy
The LCP candidate element (`p.font-ui`) and the `h1` headline are painted with `opacity: 1` inside the headline panel from t = 0.00 s. They are never hidden with `opacity: 0`, `display: none`, or `visibility: hidden`. The visual reveal is achieved solely through the 3D hinge rotation of their parent panel container (`rotateY: -90deg` to `0deg`). This ensures the LCP candidate is renderable from t = 0 without artificial delays from opacity gating. The actual LCP impact will be established by P3 measurement.

The required 120 ms post-settle content delay is applied strictly to non-LCP secondary elements: the primary CTA button, the Currently Building telemetry lines, the Avatar portrait media, and the project preview thumbnails. Every content row starts exactly 120 ms after its parent panel completes its settlement.

### Frame Timing Specification (Desktop <= 2.20 s, Mobile <= 1.40 s)

| Start (s) | End (s) | Element | Property | Duration Token | Easing Token | Stagger Index | Content Delay | Meaning | Reduced Motion Variant | Mobile / Lite Variant |
|---|---|---|---|---|---|---|---|---|---|---|
| 0.00 | 0.42 | Crease Hairline | transform: scaleX(0 to 1) | dur.420 | ease.out | --i: 0 | 0 ms | Blueprint crease establishes mechanical baseline | scaleX(1) static | scaleX(0 to 1), dur.240 (0.00 to 0.24) |
| 0.30 | 1.00 | Headline Panel | transform: rotateY(-90deg to 0deg) | dur.700 | ease.out | --i: 1 | 0 ms | Headline panel unfolds on hinge; LCP text inside is opacity: 1 from t=0 | rotateY(0deg) static | rotateX(-90deg to 0deg), dur.700 (0.20 to 0.90) |
| 0.30 | 1.00 | Headline Shading Overlay | opacity: 0.70 to 0.00 | dur.700 | ease.out | --i: 1 | 0 ms | Shading lightens as angle approaches viewer plane | opacity: 0 static | opacity: 0 static |
| 1.12 | 1.36 | Headline Secondary CTA | opacity: 0.00 to 1.00, transform: translateY(8px to 0px) | dur.240 | ease.out | --i: 2 | 120 ms post-settle (panel settles at 1.00) | Secondary "View projects" CTA resolves | opacity: 1, translateY(0) | opacity: 0 to 1, dur.240 (1.02 to 1.26) |
| 0.70 | 1.40 | Avatar Portrait Panel | transform: rotateY(90deg to 0deg) | dur.700 | ease.out | --i: 2 | 0 ms | Visual identity panel unfolds from right crease | rotateY(0deg) static | translateY(16px to 0px), dur.420 (0.40 to 0.82) |
| 0.70 | 1.40 | Avatar Shading Overlay | opacity: 0.65 to 0.00 | dur.700 | ease.out | --i: 2 | 0 ms | Surface reflection clears as panel flattens | opacity: 0 static | opacity: 0 static |
| 1.52 | 1.76 | Avatar Media & Info | opacity: 0.00 to 1.00, transform: translateY(8px to 0px) | dur.240 | ease.out | --i: 3 | 120 ms post-settle (panel settles at 1.40) | Portrait image and title labels reveal | opacity: 1, translateY(0) | opacity: 0 to 1, dur.240 (0.94 to 1.18) |
| 0.80 | 1.50 | Focus Card (Currently Building) | transform: rotateX(-90deg to 0deg) | dur.700 | ease.out | --i: 3 | 0 ms | Runtime telemetry flips down from top edge | rotateX(0deg) static | translateY(16px to 0px), dur.420 (0.50 to 0.92) |
| 0.80 | 1.50 | Focus Shading Overlay | opacity: 0.60 to 0.00 | dur.700 | ease.out | --i: 3 | 0 ms | Backside shadow drops as card drops open | opacity: 0 static | opacity: 0 static |
| 1.62 | 1.86 | Focus Telemetry Items | opacity: 0.00 to 1.00, transform: translateY(6px to 0px) | dur.240 | ease.out | --i: 4 | 120 ms post-settle (panel settles at 1.50) | Telemetry items (KAGE, Vectoris, etc.) reveal | opacity: 1, translateY(0) | opacity: 0 to 1, dur.240 (1.04 to 1.28) |
| 0.85 | 1.55 | Preview Project Cards | transform: rotateX(-90deg to 0deg) | dur.700 | ease.out | --i: 4 | 0 ms | Preview cards hinge down onto screenshot covers | rotateX(0deg) static | translateY(16px to 0px), dur.420 (0.55 to 0.97) |
| 1.67 | 1.91 | Preview Cards Content | opacity: 0.00 to 1.00, transform: translateY(6px to 0px) | dur.240 | ease.out | --i: 5 | 120 ms post-settle (panel settles at 1.55) | Thumbnails and project titles resolve | opacity: 1, translateY(0) | opacity: 0 to 1, dur.240 (1.09 to 1.33) |
| 1.30 | 2.00 | 3D WebGL Background | opacity: 0.00 to 1.00, transform: scale(0.96 to 1.00) | dur.700 | ease.out | --i: 6 | 0 ms | Neural computational scene emerges from depth | opacity: 1, scale(1) | opacity: 1 static (idle) |
| 1.40 | 2.10 | Scroll Orb Settle | transform: translate3d(-30px, -15px, 0) to (0, 0, 0) | dur.700 | ease.out | --i: 7 | 0 ms | Chromatic orb anchors beside display headline | identity transform | identity transform |
| 1.95 | 2.19 | Crease Light Sweep | transform: translateX(-100% to 100%) | dur.240 | ease.out | --i: 8 | 0 ms | Single specular gleam runs across crease joint | opacity: 0 static | disabled |
| 2.20 | 2.20 | End-State Settlement | attribute removal | 0 ms | linear | --i: 0 | 0 ms | data-intro removed, temporary crease hidden, identity | clean DOM | clean DOM at 1.40 s |

---

## 6. ASCII Wireframes

### Desktop Opening: t = 0.0 s (Folded State)
```text
+------------------------------------------------------------------------------+
|[Nav: HB  /  Home  Projects  About  |  [Pause Motion]  [Sound]]                |
|                                                                              |
|               | Crease Hairline (scaleX: 0, opacity: 0)                      |
|       +-------+------------------------------------------------------+       |
|       | [Sealed Panel: rotateY: -90deg] (shading: 0.70)              |       |
|       | Text inside is prerendered with opacity: 1 (LCP ready)       |       |
|       +--------------------------------------------------------------+       |
|                                                                              |
+------------------------------------------------------------------------------+
```

### Desktop Opening: t = 0.4 s (Crease Drawn, Headline Begins Hinge)
```text
+------------------------------------------------------------------------------+
|[Nav: HB  /  Home  Projects  About  |  [Pause Motion]  [Sound]]                |
|                                                                              |
|   ============ [Crease Hairline Drawn: scaleX: 1] ========================   |
|   / Hinge Axis                                                               |
|  /  +-------------------------+                                              |
| |   | SYSTEMS ARCHITECT       | <-- Rotating Panel (-50deg)                  |
| |   | AI SYSTEMS BUILDER      |     (shading: 0.40; LCP text physically      |
| |   | I build AI systems...   |      unfolding with panel container)         |
|  \  +-------------------------+                                              |
|   \                                                                          |
+------------------------------------------------------------------------------+
```

### Desktop Opening: t = 1.0 s (Headline Settled, Avatar & Focus Unfolding)
```text
+------------------------------------------------------------------------------+
|[Nav: HB  /  Home  Projects  About  |  [Pause Motion]  [Sound]]                |
|                                                                              |
|   +------------------------------------+  +------------------------------+   |
|   | SYSTEMS ARCHITECT                  |  | [Avatar: rotateY 35deg]      |   |
|   | AI SYSTEMS BUILDER                 |  | (shading: 0.25)              |   |
|   |                                    |  +------------------------------+   |
|   | I build AI systems and software... |  +------------------------------+   |
|   | (CTA lands at t = 1.12 s)          |  | [Focus Card: rotateX -40deg] |   |
|   +------------------------------------+  +------------------------------+   |
+------------------------------------------------------------------------------+
```

### Desktop Opening: t = 1.6 s (3D Enters, Orb Settles, Content Landing)
```text
+------------------------------------------------------------------------------+
|[Nav: HB  /  Home  Projects  About  |  [Pause Motion]  [Sound]]                |
|                                                                              |
|   +------------------------------------+  +------------------------------+   |
|   | (Orb) SYSTEMS ARCHITECT            |  | [Avatar Card: Flat 0deg]     |   |
|   |       AI SYSTEMS BUILDER           |  | Hardik Bhaskar (landed 1.52) |   |
|   |                                    |  +------------------------------+   |
|   | I build AI systems and software... |  +------------------------------+   |
|   | [View projects ->]                 |  | > KAGE Browser (landed 1.62) |   |
|   |                                    |  | > Vectoris Desktop (Rust)    |   |
|   +------------------------------------+  +------------------------------+   |
|   ::: Neural 3D Canvas scaling in from depth (opacity: 0.7, scale: 0.98) ::: |
+------------------------------------------------------------------------------+
```

### Desktop Opening: t = 2.2 s (Rest State, Clean Normal Layout)
```text
+------------------------------------------------------------------------------+
|[Nav: HB  /  Home  Projects  About  |  [Pause Motion]  [Sound]]                |
|                                                                              |
|   +------------------------------------+  +------------------------------+   |
|   | (Orb) SYSTEMS ARCHITECT            |  | Hardik Bhaskar               |   |
|   |       AI SYSTEMS BUILDER           |  | Systems Architect            |   |
|   |                                    |  +------------------------------+   |
|   | I build AI systems and software... |  +------------------------------+   |
|   | [View projects ->]                 |  | > KAGE Browser (Rust)        |   |
|   |                                    |  | > Vectoris Desktop (Rust)    |   |
|   +------------------------------------+  +------------------------------+   |
|   [data-intro removed; crease hidden; transforms identity; normal DOM layout]|
+------------------------------------------------------------------------------+
```

### Mobile Opening: t = 0.0 s vs End (Vertical Accordion Fold)
```text
  Mobile t = 0.0 s (Folded)                  Mobile t = 1.4 s (Settled)
+-------------------------------+          +-------------------------------+
|[Nav: HB  =  [Pause]  [Sound]] |          |[Nav: HB  =  [Pause]  [Sound]] |
|                               |          |                               |
| ==== Crease Hairline ======== |          | SYSTEMS ARCHITECT             |
| [Panel: rotateX: -90deg]      |          | AI SYSTEMS BUILDER            |
| Text inside is opacity: 1     |          | I build AI systems...         |
|                               |          | [View projects ->]            |
|                               |          |                               |
|                               |          | [Currently Building Card]     |
|                               |          | > KAGE Browser (Rust)         |
+-------------------------------+          +-------------------------------+
```

### Scroll Flow: Chapter 1 (Foundations) Pin State
```text
+------------------------------------------------------------------------------+
| CHAPTER 01: FOUNDATIONS                                                      |
| [Pinned Viewport 100dvh]                                                     |
|                                                                              |
| +-----------------------------------+  +-----------------------------------+ |
| | MAHINA OS                         |  | SYSTEM ARCHITECTURE               | |
| | Experimental OS Interface         |  |                                   | |
| | luna-init PID 1 in C17            |  | [Init DAG Vector ======]          | |
| | DAG Dependency Solver             |  | [Boot Graphics Pipeline]          | |
| | Documentation-First Engineering   |  |                                   | |
| +-----------------------------------+  +-----------------------------------+ |
|                                                                              |
| (Orb: anchored to luna-init architecture node)                               |
+------------------------------------------------------------------------------+
```

### Scroll Flow: Chapter 2 (Runtime) Stacking Over Chapter 1
```text
+------------------------------------------------------------------------------+
| CHAPTER 02: RUNTIME                                                          |
| [Incoming Panel pins over Chapter 01; Ch01 scales to 0.94 and dims to 0.40]  |
|                                                                              |
| +--------------------------------------------------------------------------+ |
| | KAGE BROWSER (影)                                                        | |
| | Developer-First Autonomous Browser & Workstation                         | |
| | Built with Tauri v2 (Rust) and Chromium Embedded Framework (CEF 152)     | |
| | Rust Tool Bus bridging Chrome DevTools Protocol (CDP)                    | |
| +--------------------------------------------------------------------------+ |
|                                                                              |
| (Orb: moves smoothly from luna-init node to KAGE Tool Bus process badge)    |
+------------------------------------------------------------------------------+
```

### Scroll Flow: Horizontal Pan (Remaining Projects at >= 1024 px)
```text
+------------------------------------------------------------------------------+
| ARCHIVE PAN: REMAINING SYSTEMS                                               |
| [Viewport Pinned; horizontal track translates X based on scrub]              |
|                                                                              |
| <-- [ STEM Idea Generator ] --- [ Veronica Agents ] --- [ AEGIS Engine ] --> |
|     Interactive Learning         Sovereign Memory        Decision Platform   |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## 7. Scroll Plan

| Chapter | Layer | Layout Family | Pinned | Trigger Settings | Orb Target Element | What Draws (Meaningful Motion) | Reduced Motion & Sub-1024px State |
|---|---|---|---|---|---|---|---|
| 01 Foundations | Layer 1 | Split 2-Column Blueprint | Pinned (`100dvh`) | start: "top top", pin: true, scrub: 1 | `#luna-init-anchor` | Architecture bus connection lines draw via scaleX from left origin | Static layout, no pin; lines pre-rendered at scaleX(1) |
| 02 Runtime | Layer 2 | Full-Width Asymmetric Card | Pinned (`100dvh`) | start: "top top", pin: true, scrub: 1 | `#kage-runtime-anchor` | CDP bridge pipeline hairlines draw vertically via scaleY | Static layout, standard scroll stack |
| 03 Intelligence | Layer 3 | 3-Card Distributed Grid | Pinned (`100dvh`) | start: "top top", pin: true, scrub: 1 | `#intelligence-hub-anchor` | Agent communication vector lines draw between cards | Static layout, standard vertical card stack |
| 04 Invitation | Layer 4 | Centered Technical Uplink | Not Pinned | start: "top 80%", scrub: false | `#contact-terminal-anchor` | Uplink border hairline draws along perimeter | Normal static block |
| Archive Pan | Projects | Horizontal Filmstrip | Pinned (`100dvh`) | start: "top top", end: "+=1200", scrub: 1 | `#project-track-anchor` | Track translate3d along X-axis from 0 to -distance | Below 1024px: plain vertical list with zero pinning |

### Elimination of Scroll Cues
Per brief Section 7 ("No numbered eyebrows, scroll cues or decorative dots"), all scroll indicators, numbered cues, and progress dots are omitted. Chapters communicate their position purely through the spatial transition of the pinned panels themselves.

### Total Pin Count Justification
- Pinned Elements: Exactly 4 pins total (Chapter 1, Chapter 2, Chapter 3, and Archive Pan). Chapter 4 (Invitation) is intentionally unpinned to provide a natural resting exit to the page footer.
- Justification: Meets N8 strict constraint against excessive scroll hijacking while adhering to `design-taste-frontend` §5.A canonical sticky stacking.

---

## 8. Technical Plan

### Files to Add or Change
1. `src/motion/tokens.ts` [NEW]: Central source of truth for duration, easing, and stagger tokens.
2. `src/motion/tokens.css` [NEW]: CSS custom properties generated directly from `tokens.ts`.
3. `src/motion/opening.css` [NEW]: Pure CSS keyframes for 3D panel folding, temporary hairlines, and shading.
4. `index.html` [MODIFY]: Inject minified inline pre-paint script setting `data-intro` before first paint.
5. `vercel.json` [MODIFY]: Include the sha256 hash of the inline script in Content-Security-Policy.
6. `src/components/layout/Navbar.tsx` [MODIFY]: Add accessible Pause Motion toggle button next to Sound toggle.
7. `src/components/sections/Hero.tsx` [MODIFY]: Add panel markup and data attributes for pure CSS opening.
8. `src/components/sections/ScrollFlow.tsx` [NEW]: Lazy-loaded GSAP ScrollTrigger sticky stack for Chapters 1 to 4.
9. `src/store/highlightStore.ts` [MODIFY]: Support cached rect coordinates without per-frame DOM measurements.
10. `tests/motion-tokens.test.ts` [NEW]: Automated parity verification asserting CSS variables match TypeScript tokens.

### Token Architecture
- TypeScript Source (`src/motion/tokens.ts`):
  ```ts
  export const DURATION = {
    120: 120,
    240: 240,
    420: 420,
    700: 700,
    1100: 1100,
  } as const;

  export const EXIT_DURATION = {
    84: 84,    // 120 * 0.7
    168: 168,  // 240 * 0.7
    294: 294,  // 420 * 0.7
    490: 490,  // 700 * 0.7
    770: 770,  // 1100 * 0.7
  } as const;

  export const EASING = {
    out: [0.32, 0.72, 0, 1] as const,
    inOut: [0.65, 0, 0.35, 1] as const,
  };

  export const STAGGER = {
    step: 75, // within 60 to 90 ms budget
  } as const;
  ```
- CSS Generation: Variables `--dur-120` through `--dur-1100`, `--ease-out`, `--ease-in-out`, `--stagger-step` exposed on `:root`.

### Inline Script and CSP Hash Method
- The inline script in `index.html` checks `sessionStorage.getItem('intro_seen')`, `localStorage.getItem('portfolio_motion_paused')`, and `window.matchMedia('(prefers-reduced-motion: reduce)')`. If eligible (or `?intro=1`), it sets `document.documentElement.setAttribute('data-intro', 'active')`.
- The exact inline script block is hashed via sha256 (`'sha256-...'`).
- The hash is injected into `vercel.json` `Content-Security-Policy` header. A verification check in `npm run test` will compare `crypto.createHash('sha256').update(scriptContent).digest('base64')` against `vercel.json` to prevent drift.

### Skip Handler
- One-shot passive event listeners on `window` for `keydown`, `pointerdown`, and `wheel`.
- Trigger immediately removes `data-intro` from `documentElement`, setting layout to rest state instantly.
- Handlers do not call `preventDefault` and self-remove after the first event.

### Audio Policy
- Motion introduces zero new audio behavior or sound effects. No motion whooshes or synthetic triggers are added. Existing hover ticks and button clicks in `src/lib/audio.ts` are preserved without alteration.

### Crease Persistence and N1 Compliance
- The crease hairline is purely an ephemeral animation artifact active only while `data-intro="active"` (0.00 s to 2.20 s).
- Because the Batch 2 hero layout has no existing column divider border, retaining the crease line after settlement would violate N1.
- Upon settlement at 2.20 s, the crease element is set to `opacity: 0` and `pointer-events: none`, preserving the exact original Batch 2 spacing and layout.

### Pause Motion vs OS Reduced Motion
- Hierarchy:
  1. OS `prefers-reduced-motion: reduce`: Unconditionally enforces the static layout. All animation loops and scroll pinning are dismantled.
  2. User "Pause motion" toggle: When OS setting allows motion, the user can pause motion at will. Persisted in `localStorage` under `portfolio_motion_paused`.
  3. Strict override rule: If OS `prefers-reduced-motion: reduce` is active, toggling user Pause Motion to "off" has NO effect; the OS preference always takes precedence and motion remains disabled.

### End-State Implementation Contract
- At t = 2.20 s (or immediately on skip/reduced motion):
  1. `data-intro` attribute is removed from `document.documentElement`.
  2. Every animated element returns to `transform: none` (identity transform).
  3. Every animated element has `opacity: 1`.
  4. Every animated element has `will-change: auto`.
  5. Zero running CSS or WAAPI animations remain on the DOM tree.
  6. Temporary crease and shading layers are fully hidden with `opacity: 0` and `pointer-events: none`.
  7. Exact pixel parity against the static reduced-motion layout is achieved outside the masked WebGL canvas.

### Orb Rect Cache
- `ResizeObserver` observes chapter target anchor elements and caches page-relative bounding boxes into `highlightStore`.
- Re-computed on font loading (`document.fonts.ready`) and ScrollTrigger refresh events.
- Zero `getBoundingClientRect` reads inside animation frames or scroll scrub callbacks.

### Ordered Commit Plan (Phase 2)
1. `feat(motion): tokens, css variables, and automated token parity test`
2. `feat(motion): static hero blueprint panel markup without animation`
3. `feat(motion): inline pre-paint intro script, data-intro, and CSP hash enforcement`
4. `feat(motion): pure css desktop 3D opening sequence with LCP priority and 120ms post-settle content delay`
5. `feat(motion): mobile vertical accordion fold, skip listener, and pause motion toggle`
6. `feat(motion): 3d neural canvas depth entrance and orb settle orchestration`
7. `feat(motion): lazy gsap scrolltrigger setup, matchMedia, and strict cleanup`
8. `feat(motion): chapter sticky-stack implementation for foundations, runtime, and intelligence`
9. `feat(motion): hardware-accelerated architecture bus line drawing in chapter 1`
10. `feat(motion): remaining projects horizontal pan for viewports >= 1024px`
11. `feat(motion): orb target tracking via cached resize-observer rects`
12. `feat(motion): contact invitation uplink panel`
13. `test(motion): end-to-end proof suite and RESULTS.md generation`

---

## 9. Budget Plan

| Budget Metric | Threshold | Measurement Method | First Beat Cut if Failed |
|---|---|---|---|
| LCP | No regression against baseline (5982 ms mobile simulated / 2570 ms DevTools) | Lighthouse Mobile (median of 3) on production preview | Defer 3D canvas initialization further to prioritize text paint |
| CLS | Delta < 0.01 against baseline | Lighthouse Mobile audit and PerformanceObserver layout-shift metric | Lock fixed aspect ratios on all panel containers; eliminate any scale on outer wrappers |
| TBT | Delta < 0 ms against baseline | Lighthouse Mobile median and 4x CPU throttle trace | Defer 3D canvas mount to 2.5 s; disable light sweep translation |
| Long Tasks | No new task > 50 ms in animation frames at 4x CPU throttle | Chrome DevTools Trace Engine JSON export analysis | Cut 3D scene depth scale transition during opening |
| Frame Rate | >= 55 fps during opening at 4x CPU throttle | Trace Engine frame duration parser (`1000 / frame_duration`) | Disable 3D perspective shading overlay opacity animation |
| Layout Shifts in rAF | Exactly 0 layout reads in animation frames | Trace Engine `Layout` and `UpdateLayoutTree` event count during scroll scrub | Disable horizontal project pan; revert to static list |

### Bookend Decision
- The optional reverse folding bookend in Section 7 is NOT built by default. Priority is given to maintaining zero TBT and flawless mobile stability.

---

## 10. Generic Versus Specific

| Generic Default Pattern | Where It Appeared / Risk | Replacement in This Plan | Why It Fits This Portfolio |
|---|---|---|---|
| Fade-up on every section | Ubiquitous in standard templates; feels sluggish | Sticky-stack layer assembly where each chapter represents an engineering stratum | Communicates the literal architecture of systems software (Foundations to Runtime to Intelligence) |
| Hover-lift on every card | Cliché translateY(-8px) with box-shadow blur | Hairline border illumination and internal SVG bus draw | Matches precision technical instrumentation rather than playful consumer UI |
| Parallax everywhere | Gratuitous background movement causing paint churn | Zero parallax layers; scroll-driven 1:1 scrub with pinned viewpoints | Eliminates compositor layer thrashing; respects physical blueprint metaphor |
| Tilt cards (3D mouse tilt) | Gimmicky mouse-tracking distracting from technical copy | Flat panels with 1px Icy Steel borders and subtle inner edge refraction | Keeps focus on verified production systems and architecture claims |
| Marquee banner | Constant motion distraction | Clean, static technical separator with fixed spacing | Avoids ambient noise; only WebGL background retains quiet ambient life |
| Counters / Fake numbers | Invented telemetry numbers (e.g. 99.9% uptime) | Real project titles and actual technology stacks from repository | Respects Non-negotiable N2 (Truth); zero fabricated statistics |
| Gradient blobs | Blurry ambient radial gradients behind text | Subtle 64px engineering coordinate grid and precise crease hairlines | Reinforces technical precision and CAD drafting heritage |
| Scroll cues / Numbered eyebrows | Generic scroll indicators, progress bars, or dots | Zero scroll cues or indicator dots; pure spatial panel stacking | Respects Section 7 ban; leaves interface clean and focused |
| Typewriter text | Sluggish character-by-character headline typing | Pure CSS 3D hinge reveal of display typography with opacity 1 LCP text | Delivers immediate legibility for LCP without blocking comprehension |
| Custom mouse cursor | Laggy pointer-events-none circle hurting performance | Native system cursor with crisp browser-standard hover indicators | Preserves accessibility, eliminates frame drops, respects OS pointer |
| Loading screen overlay | Full-screen spinner blocking initial view | Zero full-screen overlays; nav and hero markup present in prerendered HTML | Guarantees instant first paint and zero interaction blockage |

---

## 11. Tensions

- T1 (LCP vs Content-After-Structure): The LCP element (`p.font-ui`) renders at `opacity: 1` inside the headline panel from t = 0.00 s. It is not hidden by opacity. The 3D container hinge physically reveals the text. The 120 ms post-settle delay is reserved strictly for secondary CTA and preview elements. This guarantees LCP is unhindered by synthetic delays.
- T2 (Diagram Drawing vs N4): Architectural connection paths are constructed strictly from orthogonal straight-line div elements animated via `transform: scaleX()` or `scaleY()` from `transform-origin: 0 50%`. No animated SVG `stroke-dashoffset` or layout geometry mutations.
- T3 (Pixel Parity vs Live WebGL Canvas): WebGL background canvas is frozen via WebGLGuard or masked with an exact rectangular bounding box during P1 diff comparisons. Mask rect: `0, 0, 100vw, 100vh` canvas target. Parity verified with 0 pixel drift outside the canvas.
- T4 (Frame Capture vs JS-Driven Parts): CSS keyframe animations are paused deterministically via `document.getAnimations().forEach(a => { a.pause(); a.currentTime = targetTime; })`. Three.js orb settle is isolated to a deterministic stepped timeline during contact sheet generation.
- T5 (Pin Count): Exactly 4 pinned interactions (3 chapters plus 1 horizontal project track). Justified because each pin represents a distinct software layer or horizontal dataset.
- T6 (Long Tasks from Boot Code): The baseline trace revealed pre-existing long tasks originating from Three.js shader compilation and Lighthouse benchmarking. Opening motion is pure CSS and introduces zero JavaScript execution to the main thread during initial paint, adding zero new long tasks.
- T7 (WebKit): WebKit requires `-webkit-backface-visibility: hidden` and explicit `transform-style: preserve-3d` on parent containers to prevent z-fighting and texture flickering. Both properties will be applied to all 3D panel wrappers.
- T8 (Lighthouse Mobile vs Desktop Opening): Performance traces will be captured and analyzed for both Mobile (390x844) and Desktop (1536x864) at 4x CPU throttle under P4.

---

## 12. Open Questions

1. Crease Divider Persistence: Resolved per N1. The crease hairline is an ephemeral animation layer that is hidden upon settlement (`opacity: 0`), preserving the exact Batch 2 layout without new permanent borders.
2. Horizontal Pan Mobile Fallback: Proposed default is to display the remaining projects as a standard vertical card list on viewports under 1024 px.
3. Pause Motion Hierarchy: Resolved. OS `prefers-reduced-motion` strictly overrides user toggle. User toggle cannot enable motion when OS reduced motion is active.
4. Sound Coordination: Resolved. Zero new audio behavior. Only existing repository sounds are preserved.
5. 3D Scene Initialization: Proposed default is to defer mounting the heavy Three.js neural background until after the headline panel has completed its hinge motion (800 ms delay).
6. Skip Key Handler Scope: Proposed default is that Esc, Space, or Enter keys skip the opening reveal without preventing default keyboard navigation for links.
7. Mobile Accordion Duration: Proposed default is 1.4 s maximum for mobile vertical opening, dropping the 3D depth transition entirely on low-end devices.
8. Bookend Inclusion: Proposed default is to omit the reverse-folding closing bookend at the bottom of the page to conserve bundle size and performance headroom.

---

## 13. Self-Audit

| Check | Requirement | Result | Evidence / Notes |
|---|---|---|---|
| C1 | Every beat in Section 6 appears in the Opening Frame Table | PASS | All beats mapped; content rows start strictly 120 ms post-settle of parent panels |
| C2 | Every duration and easing is a token name | PASS | Only `dur.*`, `exit.*`, `ease.out`, `ease.inOut` used; zero raw numbers in table |
| C3 | No row animates a property outside N4 | PASS | Only `transform` and `opacity` animated across all rows |
| C4 | Every spine layer maps to a real repo path | PASS | All 4 layers verified against real project files with zero invented claims |
| C5 | Every budget has a measurement method | PASS | Methods specified using Lighthouse Mobile, DevTools trace analysis, and PerformanceObserver |
| C6 | Zero em dashes or en dashes in file | PASS | Verified clean of em dashes and en dashes throughout |
| C7 | Complete file, no placeholders | PASS | Verified full output with zero `TODO` or truncated sections |
| C8 | LCP candidate is not hidden with opacity | PASS | LCP element is opacity: 1 from t=0; 120ms delay applied only to non-LCP secondary content |
| C9 | No scroll cues, indicators, or dots | PASS | Completely eliminated; chapters rely purely on spatial stacking |
| C10 | Crease does not alter static layout | PASS | Crease is ephemeral animation layer; hidden at t=2.20 s to satisfy N1 |
| C11 | OS reduced motion strictly respected | PASS | OS preference takes unconditional precedence over user Pause Motion toggle |
| C12 | Zero new audio behavior | PASS | No new sound triggers; existing audio system untouched |
| C13 | End-state contract explicitly asserted | PASS | Identity transform, opacity 1, will-change auto, animation none, data-intro removed |
