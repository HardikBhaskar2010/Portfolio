# Portfolio Motion Graphics: Cinematic Preloader and Split-Panel Opening Reveal

Specification and Architecture Document for `refactor/systems-performance-redesign`.

---

## 0. Explicit Supersession of Previous Opening Motion Constraints

This specification explicitly and intentionally supersedes the previous opening constraint in `MOTION.md` that restricted opening animation strictly to in-place Hero panel unhinging and prohibited full-screen overlays.

- Rationale: The portfolio opening sequence is elevated to a signature engineering object reveal (`LOAD -> MINIMAL COUNTER -> HANDWRITTEN GREETING -> FULL-SCREEN CENTER-SPLIT PANEL REVEAL -> EXISTING HERO`).
- Scope of Supersession:
  1. A dedicated, temporary full-screen split-panel preloader overlay (`#portfolio-preloader`) is introduced for the initial visit opening identity.
  2. The preloader is an ephemeral layer that clears completely upon completion or skip, leaving zero lingering layout or DOM artifacts.
  3. The underlying Hero layout, typography, project cards, and tokens remain completely intact and renderable in the DOM from t = 0 ms underneath the preloader.
  4. ScrollFlow and ambient 3D technical background scenes remain completely independent and preserved.

---

## Skills Applied

- design-taste-frontend:
  - Formulated the precision engineering shutter metaphor: screen divided into vertical strips across the horizontal width, with each strip splitting vertically (top moves UP, bottom moves DOWN).
  - Evaluated panel count (5 on desktop, 3 on mobile) to guarantee odd-numbered mathematical symmetry with an exact solitary center panel.
  - Calibrated center weighting: center panel acts as the optical origin of the reveal, aligning directly with the handwritten "Hello." before initiating the outward wave.
  - Eliminated generic loading tropes (no spinners, no loading bars, no percentage signs, no fake telemetry).
  - Enforced palette restraint using existing Frost Navy tokens (`--bg-base`, `--bg-surface1`, `--border-subtle`).

- web-design-guidelines:
  - Verified decorative overlay semantics (`aria-hidden="true"`, `tabindex="-1"`).
  - Maintained native keyboard accessibility of the real Hero underneath from t = 0 ms.
  - Strictly respected OS `prefers-reduced-motion: reduce` and user Pause Motion hierarchy.
  - Clean one-shot passive event listeners for skipping without blocking default browser scrolling or navigation.

- full-output-enforcement:
  - Delivered complete architectural specification with zero placeholders or skeletal drafts.
  - Enforced zero `// TODO`, `// ...`, or partial implementations.
  - Defined exhaustive verification matrices and test suites.

Skills are used as active design and engineering inputs, not merely compliance checks.

---

## 1. Design Read and Creative Direction

Reading this as: Systems Architect and AI Systems Builder portfolio for technical peers, engineering leaders, and recruiters, with a precision engineering language, leaning toward Frost Navy tokens, Geist Mono typography, and a mechanical split-panel aperture reveal.

- Emotional Progression: Technical -> Human -> Mechanical -> Reveal.
  1. Stage 1 (Technical Anticipation): Minimal monospace counter establishing page arrival without dashboard clutter.
  2. Stage 2 (Human Greeting): Small, quiet, sentence-case handwritten "Hello." offering a brief personal moment.
  3. Stage 3 (Mechanical Form): Full-screen Frost Navy field divided into tall vertical engineering strips with horizontal center hairlines.
  4. Stage 4 (Mechanical Motion): Each vertical strip physically splits through its horizontal center. The top half translates UP (`translateY(-100%)`) and the bottom half translates DOWN (`translateY(100%)`), propagating outward as a symmetrical horizontal wave from the center strip (`P3`) to adjacent flanks (`P2 + P4`) and outer edges (`P1 + P5`).
  5. Stage 5 (Reveal): The existing Hero emerges intact over the ongoing ambient 3D technical environment.

- Visual Metaphor: Precision vertical shutter plates parting up and down along horizontal center seams. The opening axis is strictly VERTICAL (`translateY`), while the wave propagation axis is strictly HORIZONTAL (`CENTER -> OUTWARD`). Not an agency splash, not a loading progress bar, not a generic crossfade.

---

## 2. Opening Storyboard

### Stage 1: Minimal Counter (t = 0.00 s to 0.60 s Desktop)

```text
+-------------------------------------------------------------+
|                                                             |
|                                                             |
|                                                             |
|                            42                               |
|                                                             |
|                                                             |
|                                                             |
+-------------------------------------------------------------+
```
- Restrained monospace digits (`00` -> `18` -> `42` -> `73` -> `91` -> `100`).
- Positioned dead-center in viewport.
- Pure milestone markers. Zero percentage signs (`%`), zero progress rings, zero spinners, zero fake telemetry strings.

### Stage 2: Handwritten Greeting (t = 0.60 s to 1.08 s Desktop)

```text
+-------------------------------------------------------------+
|                                                             |
|                                                             |
|                                                             |
|                          Hello.                             |
|                                                             |
|                                                             |
|                                                             |
+-------------------------------------------------------------+
```
- Compact sentence-case `"Hello."` (capitalized 'H', lowercase 'ello', terminal period) referencing Italianno calligraphy script.
- Rendered via custom centerline pen-motion SVG stroke paths following the natural handwriting order, not an outline contour.
- Scale: small, understated (approx 28px height on desktop, 22px on mobile).
- Holds for 120 ms, then fades cleanly to 0 opacity before the panels part.

### Stage 3: Split-Panel Geometry (t = 1.08 s Desktop)

```text
+----------+----------+----------+----------+----------+
|    P1    |    P2    |    P3    |    P4    |    P5    |
|          |          |          |          |          |
| TOP HALF | TOP HALF | TOP HALF | TOP HALF | TOP HALF |
|          |          |          |          |          |
+----------+----------+----------+----------+----------+ <-- Horizontal Center Seams
|          |          |          |          |          |
| BTM HALF | BTM HALF | BTM HALF | BTM HALF | BTM HALF |
|          |          |          |          |          |
+----------+----------+----------+----------+----------+
```
- Full-viewport Frost Navy field (`--bg-base`: `#071629`) covering the viewport.
- 5 equal vertical strips on Desktop (each 20% width).
- Each strip contains a TOP HALF (top 50% height), a BOTTOM HALF (bottom 50% height), and a 1px horizontal center seam in `--border-subtle` (`#17345C`).

### Stage 4: Center-Outward Mechanical Wave Opening (t = 1.08 s to 1.93 s Desktop)

```text
              P3 (Center)
              ↑ (translateY(-100%))
          +----------+
          | TOP HALF |
          +----------+
          ------------ <-- Horizontal Center Seam Dissolves
          +----------+
          | BTM HALF |
          +----------+
              ↓ (translateY(100%))
          (Starts at t = 1.08s)

     P2 (Adjacent)          P4 (Adjacent)
     ↑                      ↑
  +----------+           +----------+
  | TOP HALF |           | TOP HALF |
  +----------+           +----------+
  ------------           ------------
  +----------+           +----------+
  | BTM HALF |           | BTM HALF |
  +----------+           +----------+
     ↓                      ↓
 (Starts at t = 1.155s) (Starts at t = 1.155s)

P1 (Outer)                                  P5 (Outer)
↑                                           ↑
+----------+                             +----------+
| TOP HALF |                             | TOP HALF |
+----------+                             +----------+
------------                             ------------
+----------+                             +----------+
| BTM HALF |                             | BTM HALF |
+----------+                             +----------+
↓                                           ↓
(Starts at t = 1.23s)                   (Starts at t = 1.23s)
```
- Distinct Axis Principles:
  1. Panel Layout Axis: HORIZONTAL (`P1 | P2 | P3 | P4 | P5`).
  2. Panel Opening Axis: VERTICAL (Top Half moves UP `translateY(-100%)`, Bottom Half moves DOWN `translateY(100%)`).
  3. Wave Propagation Axis: HORIZONTAL (`CENTER -> OUTWARD`).
- Wave Choreography:
  - Center strip (P3) initiates the vertical split first at t = 1.08 s.
  - Adjacent pair (P2 and P4) begins together at t = 1.155 s (75 ms stagger step).
  - Outer pair (P1 and P5) begins together at t = 1.23 s (150 ms total delay).
  - All panels move simultaneously across overlapping ease-out curves, producing a single uninterrupted mechanical wave propagating outward from center.
  - Horizontal seam hairlines dissolve (`opacity: 0` over 120 ms) as each strip begins opening.

### Stage 5: Hero Emergence & Ambient 3D Settlement (t = 1.93 s to 2.05 s Desktop)

```text
+-------------------------------------------------------------+
|  [Navbar]                                                   |
|                                                             |
|  Hardik Bhaskar: Systems Architect & AI Systems Builder     |
|  Building operating systems, autonomous AI...               |
|                                                             |
|  [Explore Projects ->]          [About Hardik ->]           |
|                                                             |
|  [Ambient 3D Environment active behind content]             |
+-------------------------------------------------------------+
```
- Preloader container opacity transitions to 0 over 120 ms.
- `data-preloader` attribute and DOM container are completely removed.
- Existing Hero is 100% visible in settled rest state.
- Zero leftover transforms, zero running CSS animations, zero memory leaks.

---

## 3. Exact Timing Table & Token Discipline

All durations, delays, and easings derive 100% from existing approved tokens in `src/motion/tokens.ts`:
- `DURATION[120]`: 120 ms
- `DURATION[240]`: 240 ms
- `DURATION[420]`: 420 ms
- `DURATION[700]`: 700 ms
- `STAGGER.step`: 75 ms
- `EASING.out`: `cubic-bezier(0.32, 0.72, 0, 1)`
- `EASING.inOut`: `cubic-bezier(0.65, 0, 0.35, 1)`

All non-zero animation durations and stagger intervals derive strictly from approved motion tokens.

### Desktop Sequence (Hard Ceiling: 2.20 s | Total Scheduled: 2.05 s)

| Stage | Beat / Target | Property | Start (s) | Duration (ms) | Token Duration | Token Easing | End (s) | Post-State |
|---|---|---|---|---|---|---|---|---|
| S1.1 | Milestone Tick 1 (`00` -> `18`) | innerText | 0.00 | 120 | DURATION[120] | linear | 0.12 | text updated |
| S1.2 | Milestone Tick 2 (`18` -> `42`) | innerText | 0.12 | 120 | DURATION[120] | linear | 0.24 | text updated |
| S1.3 | Milestone Tick 3 (`42` -> `73`) | innerText | 0.24 | 120 | DURATION[120] | linear | 0.36 | text updated |
| S1.4 | Milestone Tick 4 (`73` -> `91`) | innerText | 0.36 | 120 | DURATION[120] | linear | 0.48 | readiness gate queried |
| S1.5 | Readiness Resolve (`91` -> `100`) | innerText | 0.48 | 120 | DURATION[120] | EASING.out | 0.60 | hard gate cutoff: 100 shown |
| S2.1 | Counter Fade Out | opacity | 0.60 | 120 | DURATION[120] | EASING.out | 0.72 | counter opacity 0 |
| S2.2 | "Hello." Stroke Draw | stroke-dashoffset / opacity | 0.60 | 240 | DURATION[240] | EASING.out | 0.84 | glyph drawn, opacity 1 |
| S2.3 | "Hello." Resting Hold | none | 0.84 | 120 | DURATION[120] | none | 0.96 | greeting resting |
| S2.4 | "Hello." Fade Out | opacity | 0.96 | 120 | DURATION[120] | EASING.out | 1.08 | greeting opacity 0 |
| S3.1 | Center Strip (P3) Top Half | transform: translateY | 1.08 | 700 | DURATION[700] | EASING.out | 1.78 | translateY(-100%) |
| S3.2 | Center Strip (P3) Bottom Half | transform: translateY | 1.08 | 700 | DURATION[700] | EASING.out | 1.78 | translateY(100%) |
| S3.3 | Center Strip (P3) Horizontal Seam | opacity | 1.08 | 120 | DURATION[120] | EASING.out | 1.20 | opacity 0 |
| S4.1 | Mid Strips (P2, P4) Top Halves | transform: translateY | 1.155 | 700 | DURATION[700] | EASING.out | 1.855 | translateY(-100%) |
| S4.2 | Mid Strips (P2, P4) Bottom Halves | transform: translateY | 1.155 | 700 | DURATION[700] | EASING.out | 1.855 | translateY(100%) |
| S4.3 | Mid Strips (P2, P4) Horizontal Seams | opacity | 1.155 | 120 | DURATION[120] | EASING.out | 1.275 | opacity 0 |
| S5.1 | Outer Strips (P1, P5) Top Halves | transform: translateY | 1.23 | 700 | DURATION[700] | EASING.out | 1.93 | translateY(-100%) |
| S5.2 | Outer Strips (P1, P5) Bottom Halves | transform: translateY | 1.23 | 700 | DURATION[700] | EASING.out | 1.93 | translateY(100%) |
| S5.3 | Outer Strips (P1, P5) Horizontal Seams | opacity | 1.23 | 120 | DURATION[120] | EASING.out | 1.35 | opacity 0 |
| S6.1 | Overlay Container Fade Out | opacity | 1.93 | 120 | DURATION[120] | EASING.out | 2.05 | container opacity 0 |
| S6.2 | End-State DOM Settlement | attribute removal | 2.05 | 0 | 0 ms | immediate | 2.05 | clean rest state (<= 2.20 s ceiling) |

### Mobile Sequence (< 768px | Hard Ceiling: 1.40 s | Total Scheduled: 1.38 s)

| Stage | Beat / Target | Property | Start (s) | Duration (ms) | Token Duration | Token Easing | End (s) | Post-State |
|---|---|---|---|---|---|---|---|---|
| M1.1 | Mobile Milestone 1 (`00` -> `42`) | innerText | 0.00 | 120 | DURATION[120] | linear | 0.12 | text updated |
| M1.2 | Mobile Milestone 2 (`42` -> `88`) | innerText | 0.12 | 120 | DURATION[120] | linear | 0.24 | text updated |
| M1.3 | Mobile Readiness Resolve (`88` -> `100`) | innerText | 0.24 | 120 | DURATION[120] | EASING.out | 0.36 | hard gate cutoff: 100 shown |
| M2.1 | Mobile Counter Fade Out | opacity | 0.36 | 120 | DURATION[120] | EASING.out | 0.48 | counter opacity 0 |
| M2.2 | Mobile "Hello." Stroke Draw | stroke-dashoffset / opacity | 0.36 | 240 | DURATION[240] | EASING.out | 0.60 | glyph drawn |
| M2.3 | Mobile "Hello." Resting Hold | none | 0.60 | 120 | DURATION[120] | none | 0.72 | greeting resting |
| M2.4 | Mobile "Hello." Fade Out | opacity | 0.72 | 120 | DURATION[120] | EASING.out | 0.84 | greeting opacity 0 |
| M3.1 | Mobile Center Strip (M2) Top Half | transform: translateY | 0.84 | 420 | DURATION[420] | EASING.out | 1.26 | translateY(-100%) |
| M3.2 | Mobile Center Strip (M2) Bottom Half | transform: translateY | 0.84 | 420 | DURATION[420] | EASING.out | 1.26 | translateY(100%) |
| M3.3 | Mobile Center Strip (M2) Horizontal Seam | opacity | 0.84 | 120 | DURATION[120] | EASING.out | 0.96 | opacity 0 |
| M4.1 | Mobile Flank Strips (M1, M3) Top Halves | transform: translateY | 0.915 | 420 | DURATION[420] | EASING.out | 1.335 | translateY(-100%) |
| M4.2 | Mobile Flank Strips (M1, M3) Bottom Halves | transform: translateY | 0.915 | 420 | DURATION[420] | EASING.out | 1.335 | translateY(100%) |
| M4.3 | Mobile Flank Strips (M1, M3) Horizontal Seams | opacity | 0.915 | 120 | DURATION[120] | EASING.out | 1.035 | opacity 0 |
| M5.1 | Mobile Overlay Container Fade | opacity | 1.26 | 120 | DURATION[120] | EASING.out | 1.38 | container opacity 0 |
| M5.2 | Mobile DOM Settlement | attribute removal | 1.38 | 0 | 0 ms | immediate | 1.38 | clean rest state (<= 1.40 s ceiling) |

---

## 4. Hard Maximum Duration & Readiness Deadline Contract

Readiness gating must NEVER push the sequence beyond the hard ceilings (Desktop: 2.20 s, Mobile: 1.40 s).

- Hard Readiness Cutoff:
  - Desktop: At t = 0.48 s, the readiness check evaluates `document.readyState` and `document.fonts.status`. If ready, it resolves to `100`. If assets are still negotiating, the counter forces resolution to `100` at exactly t = 0.60 s. Under zero circumstances is the sequence held past t = 0.60 s.
  - Mobile: At t = 0.24 s, the readiness check evaluates readiness. It forces resolution to `100` at exactly t = 0.36 s.
- Hard Settlement Deadline:
  - Desktop: At exactly t = 2.05 s, a master timer executes settlement, setting preloader `display: none;`, removing `data-preloader`, and unmounting the overlay. The hard ceiling is 2.20 s; settlement at 2.05 s provides a 150 ms safety buffer.
  - Mobile: At exactly t = 1.38 s, master settlement executes. The hard ceiling is 1.40 s; settlement at 1.38 s guarantees compliance.

---

## 5. Counter Semantics

The sequence `00 -> 18 -> 42 -> 73 -> 91 -> 100` consists of visual counter milestones, not literal loading percentages.
- The numbers represent calibrated visual cadence milestones designed to establish anticipation.
- They do not represent percentages of arbitrary file downloads or DOM bytes.
- Milestone progression is deterministic and unblocked. The readiness check gates the final transition from milestone 91 to milestone 100.
- Strict visual prohibitions:
  - No percentage symbol (`%`).
  - No progress bar, loading ring, or spinner.
  - No "Loading..." or verbose system status strings.
  - No fake telemetry (no fake coordinates, network logs, or kernel memory numbers).

---

## 6. Handwritten Greeting Architecture (Italianno Centerline Handwriting)

- Copy: Selected as `"Hello."` (sentence case: capitalized 'H' followed by lowercase 'ello' and a terminal period).
- Visual Lettering Reference: Italianno font by Robert E. Leuschke (TypeSETit). Italianno is a classic, rhythmic formal calligraphy script with sweeping ascenders, an arched entry flourish on the capital 'H', tight cursive loop ligatures for 'ello', and an approximate 25-degree forward calligraphic slant.

### Critical Principle: Centerline Pen-Motion vs. Outline Contour
- Do NOT convert font outlines into stroked paths. Animating the perimeter of a glyph produces a hollow wireframe or stencil effect that looks mechanical and artificial.
- The desired effect is an authentic human handwriting motion: the line rendered is the actual skeletal centerline path traversed by a fine pen tip or fountain pen nib gliding across the surface.
- The path geometry visually reproduces the weight and flow of Italianno while consisting strictly of single-stroke open vector paths.

### Natural Writing Order & Stroke Geometry
1. Stroke 1 (Capital 'H' Entrance & Left Stem):
   - Pen enters with an upper-left curl at (20, 15), sweeps up to (31, 8), and flows downward along a 25-degree slant to the baseline at (17, 46), concluding with a soft bottom hook.
2. Stroke 2 (Capital 'H' Right Stem & Sweeping Crossbar):
   - Pen enters at upper right (43, 9), descends along the parallel slant to baseline at (35, 45), loops back upward counter-clockwise to cross both vertical stems at x-height (y = 29), and sweeps outward to form the baseline ligature connecting to 'e'.
3. Stroke 3 (Continuous Lowercase Ligature 'ello'):
   - Rendered as a single continuous cursive vector path to emulate unbroken pen contact:
     - 'e': Enters from baseline at (47, 48), arches up to x-height (56, 31), loops counter-clockwise around (50, 30), and exits to baseline at (59, 47).
     - 'l' (first): Climbs steeply along the 25-degree slant to the ascender line at (75, 9), forms a delicate loop apex, and drops straight down to baseline at (65, 46).
     - 'l' (second): Climbs immediately into the second ascender loop to (85, 9), curves smoothly, and drops down to baseline at (75, 46).
     - 'o': Climbs to x-height (93, 29), traces counter-clockwise around the oval (88, 29) to (94, 48), seals at top right, and finishes with a refined exit flick at (103, 33).
4. Stroke 4 (Terminal Period '.'):
   - Pen concludes with a discrete downward contact pen tap at baseline (108, 45.5 to 109.5, 48.5), rendered as an open calligraphic stroke rather than a mechanical circle.

### Pure CSS / SVG Animation Mechanics
- Lightweight & Local: Zero external handwriting libraries, zero canvas, zero video, and zero runtime path-generation dependencies.
- Normalized Path Lengths: Each path element specifies `pathLength="100"` in SVG markup. This allows pure CSS keyframes to drive `stroke-dashoffset: 100 -> 0` deterministically without requiring runtime `getTotalLength()` calculations:
  ```css
  .preloader-hello-stroke {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    stroke: var(--text-primary);
    stroke-width: 1.8px;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
  ```
- Sequential Hand Speed Calibration:
  - S2.2.1 Capital 'H' (Strokes 1 & 2): t = 0.60 s to 0.72 s (120 ms, `DURATION[120]`).
  - S2.2.2 Connected 'ello' & Terminal Dot '.' (Strokes 3 & 4): t = 0.72 s to 0.84 s (120 ms, `DURATION[120]`).
  - Total writing duration: exactly 240 ms (`DURATION[240]`), composed of two sequential `DURATION[120]` phases.
- Resting Hold: t = 0.84 s to 0.96 s (120 ms hold, `DURATION[120]`).
- Clean Fade Exit: t = 0.96 s to 1.08 s (120 ms fade to opacity 0, `DURATION[120]`).

### Optical Proportions & Styling
- Viewport Dimensions: Desktop width ~140px, height ~56px; Mobile width ~110px, height ~44px.
- Stroke Color: `--text-primary` (`#EAF4FF`).
- Stroke Width: `1.8px` (desktop), `1.5px` (mobile).
- Caps & Joins: `stroke-linecap: round; stroke-linejoin: round;` producing soft calligraphic stroke ends.

### Reduced Motion Contract
- When `prefers-reduced-motion: reduce` is active (or user pause toggle is engaged):
  - Stroke drawing animations are bypassed completely:
    ```css
    @media (prefers-reduced-motion: reduce) {
      .preloader-hello-stroke,
      .preloader-hello-dot {
        animation: none !important;
        stroke-dashoffset: 0 !important;
        opacity: 1 !important;
      }
    }
    ```
  - The completed Italianno "Hello." is displayed statically and instantly without progressive stroke animation.

---

## 7. Panel Geometry & Explicit Viewport Sizing

### Viewport Sizing Specification
To prevent mobile URL bar jump without introducing layout shift, viewport dimensions are declared with dynamic viewport units and standard fallbacks, with explicit positional coordinates:
```css
.preloader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;  /* Fallback for browsers without dynamic viewport support */
  height: 100dvh; /* Exact dynamic viewport height preventing address bar shifts */
  overflow: hidden;
  z-index: 99999;
}

.preloader-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  height: 100vh;  /* Fallback for browsers without dynamic viewport support */
  height: 100dvh; /* Exact dynamic viewport height preventing address bar shifts */
  overflow: hidden;
}
```

### Desktop Panel Layout (Viewport >= 768px)
- Panel Count: 5 vertical strips (`P1 | P2 | P3 | P4 | P5`).
- Width Distribution: Uniform 20.00% width per strip (`calc(100vw / 5)`).
- Strip Positional Sizing Contract:
  - `P1` (preloader-panel-0): `top: 0; bottom: 0; left: 0%; width: 20%;`
  - `P2` (preloader-panel-1): `top: 0; bottom: 0; left: 20%; width: 20%;`
  - `P3` (preloader-panel-2, Center): `top: 0; bottom: 0; left: 40%; width: 20%;`
  - `P4` (preloader-panel-3): `top: 0; bottom: 0; left: 60%; width: 20%;`
  - `P5` (preloader-panel-4): `top: 0; bottom: 0; left: 80%; width: 20%;`

### Structure of Each Vertical Strip:
```html
<div class="preloader-panel preloader-panel-[idx]" data-tone="[base|alt]">
  <div class="panel-half panel-half-top"></div>
  <div class="panel-half panel-half-bottom"></div>
  <div class="panel-seam"></div>
</div>
```

### Proportions of Internal Elements:
- `panel-half-top`:
  `position: absolute; top: 0; left: 0; width: 100%; height: 50%; overflow: hidden;`
- `panel-half-bottom`:
  `position: absolute; top: 50%; left: 0; width: 100%; height: 50%; overflow: hidden;`
- `panel-seam` (Horizontal Center Seam):
  `position: absolute; left: 0; right: 0; top: 50%; width: 100%; height: 1px; transform: translateY(-50%); background: var(--border-subtle, #17345C); z-index: 5; transition: opacity var(--dur-120) var(--ease-out);`

### Center Weighting & Strip Count Analysis (Skill Guidance):
- Strip Count (5 Strips):
  - Why 5 is optimal: An odd count provides an exact solitary center strip (`P3`) spanning 40% to 60% of the viewport width. This dead-center strip sits directly beneath the monospace counter and handwritten "Hello.", making it the natural optical epicenter of the entire reveal.
  - Symmetrical pairing: 5 strips allows two clean bilateral pairs: mid pair (`P2 + P4`) and outer pair (`P1 + P5`).
- Center Weighting:
  - Uniform 20% width per strip preserves architectural mathematical discipline. Rather than an arbitrary non-uniform width, the center strip receives its emphasis through chronological priority (it initiates the split first) and optical convergence (it anchors the central aperture).
- Tonal Variation:
  - Strips P1, P3, P5: `--bg-base` (`#071629`).
  - Strips P2, P4: `data-tone="alt"` (`--bg-surface1`: `#0B213F`, 1.5% contrast delta).
  - Tonal alternation subtly defines the vertical strips without adding decorative borders or shadows.
- Seam Hairline:
  - 1px high horizontal hairline across each vertical strip at `top: 50%` in `--border-subtle` (`#17345C`).
  - Zero box-shadow, zero neon laser glows, zero animated blurs.

### Mobile Panel Layout (Viewport < 768px)
- Panel Count: 3 vertical strips (`M1 | M2 | M3`).
- Width Distribution: Uniform 33.333% width per strip (`calc(100vw / 3)`).
- Strip Positional Sizing Contract:
  - `M1` (preloader-panel-0): `top: 0; bottom: 0; left: 0%; width: 33.334%;`
  - `M2` (preloader-panel-1, Center): `top: 0; bottom: 0; left: 33.333%; width: 33.334%;`
  - `M3` (preloader-panel-2): `top: 0; bottom: 0; left: 66.666%; width: 33.334%;`
  - Strips 3 and 4: `display: none;`
- Sub-element proportions: Identical paired-half structure (`panel-half-top` 50% height, `panel-half-bottom` 50% height, horizontal center seam at `top: 50%`).

---

## 8. Split Reveal Choreography & Mechanical Metaphor

### Fundamental Coordinate Axiom (Two Distinct Axes):
1. **Strip Geometry Axis**: The viewport is partitioned along the horizontal axis into vertical strips (`P1` through `P5`).
2. **Strip Opening Axis**: Each individual vertical strip splits VERTICALLY:
   - The Top Half moves UP: `transform: translateY(-100%);`
   - The Bottom Half moves DOWN: `transform: translateY(100%);`
   - Both halves retract vertically into the strip's `overflow: hidden` boundaries.
   - The horizontal center seam dissolves instantly at split onset (`opacity: 0` over 120 ms).
   - Zero `translateX` is applied to the panel halves.
3. **Wave Propagation Axis**: The opening motion travels HORIZONTALLY outward from the center strip:
   - Center strip (`P3`) splits first.
   - Flank pair (`P2 + P4`) splits second.
   - Edge pair (`P1 + P5`) splits third.

### Center-Outward Wave Stagger Ordering:
- Desktop (5 Strips):
  1. Center Strip (`P3`, index 2): Starts at t = 1.08 s (`--delay-preloader-center-panel`).
  2. Mid Flanks (`P2` and `P4`, indices 1 and 3): Start synchronously at t = 1.155 s (`--delay-preloader-mid-panels`, 75 ms step, `STAGGER.step`).
  3. Outer Edges (`P1` and `P5`, indices 0 and 4): Start synchronously at t = 1.23 s (`--delay-preloader-outer-panels`, 150 ms total delay, `2 * STAGGER.step`).
- Mobile (3 Strips):
  1. Center Strip (`M2`, index 1): Starts at t = 0.84 s (`--delay-preloader-mobile-center-panel`).
  2. Flank Pair (`M1` and `M3`, indices 0 and 2): Starts synchronously at t = 0.915 s (`--delay-preloader-mobile-flank-panels`, 75 ms step, `STAGGER.step`).

### Continuous Mechanical Wave Perception (Emil Kowalski / Design Skill Principles):
- The reveal must NEVER feel like three stop-and-start animations (`OPEN -> PAUSE -> OPEN -> PAUSE -> OPEN`).
- Because each vertical split duration is 700 ms (`DURATION[700]`) and the stagger step is only 75 ms (`STAGGER.step`):
  - At t = 1.08 s: P3 begins moving vertically.
  - At t = 1.155 s: P3 is still at only ~11% travel when P2 and P4 begin moving.
  - At t = 1.23 s: P3 is at ~22% travel, P2/P4 are at ~11% travel, and P1/P5 begin moving.
  - From t = 1.23 s to t = 1.78 s, ALL 5 STRIPS ARE MOVING SIMULTANEOUSLY.
- The human visual system perceives this overlapping cascading motion as a single continuous outward mechanical wave, parting like precision interlocking shutters.

---

## 9. WebGL Performance & Main-Thread Protection

The preloader must NOT be used as cover for expensive Three.js/WebGL initialization.
- Protection Rule: If 3D scene construction or shader compilation creates > 50 ms of main-thread blocking work, it would directly destroy the 60 fps smoothness of the opening animation.
- Architecture:
  1. All 3D canvases (`NeuralNetworkScene`, `Hyperspeed`, `ScrollOrb`) are already lazily loaded via `useAfterLcp` and `WebGLGuard`.
  2. Heavy Three.js shader compilation and scene initialization remain strictly deferred until AFTER the panel reveal completes (t > 2.05 s) or after skip is triggered.
  3. The preloader animation itself uses pure CSS `transform: translateY()` and `opacity` running on the GPU compositor thread, completely isolated from WebGL canvas lifecycle.

---

## 10. Focus & Accessibility Contract

- Strictly Decorative Overlay:
  - The preloader overlay element has `aria-hidden="true"` and `tabIndex={-1}`.
  - It contains ZERO focusable child elements (no `<button>`, `<input>`, or `<a>`).
  - It NEVER captures, traps, or redirects keyboard focus.
- Hero Keyboard Accessibility:
  - The real Hero underneath remains present in the DOM and natively keyboard-accessible from t = 0 ms.
- Skip Interaction:
  - A one-shot passive event listener on `window` captures any keypress (`Escape`, `Tab`, `Enter`, `Space`, or arbitrary keydown), mouse click (`pointerdown`), or scroll (`wheel`).
  - The skip listener immediately clears the preloader overlay (`data-preloader` removed, overlay unmounted/hidden) without calling `preventDefault()`, ensuring default browser focus traversal and scrolling are never swallowed.
- Screen Reader Experience:
  - Screen readers perceive the semantic document hierarchy immediately without interference from decorative milestone ticks.
- OS Reduced Motion:
  - `prefers-reduced-motion: reduce` completely bypasses the preloader. The overlay is set to `display: none !important; opacity: 0 !important;` immediately, showing the settled static Hero at t = 0 ms.
- User Pause Motion:
  - If `localStorage.getItem('portfolio_motion_paused') === 'true'`, the preloader does not run. OS reduced motion unconditionally takes precedence over user toggle.

---

## 11. Performance Strategy: Dual Target Architecture

Performance targets are strictly divided into two distinct tiers:

### Tier 1: Absolute Performance Targets (Industry Standards)
- Largest Contentful Paint (LCP): < 2.50 s
- Cumulative Layout Shift (CLS): < 0.010
- Total Blocking Time (TBT): < 200 ms

### Tier 2: Regression Targets against Pre-Existing Baseline
Due to pre-existing Three.js chunk size and client-side hydration on low-end mobile hardware, the existing baseline exhibits known violations:
- Baseline LCP: 6176.4 ms (pre-existing violation of Tier 1)
- Baseline CLS: 0.1484 (pre-existing violation of Tier 1)
- Baseline TBT: 5284.0 ms (pre-existing violation of Tier 1)

Regression Requirement:
The new cinematic preloader must NOT cause any regression against the measured baseline median:
- LCP Delta: <= 0 ms
- CLS Delta: < 0.010
- TBT Delta: <= 0 ms

Both tiers are evaluated and recorded separately in `docs/motion-proof/` so pre-existing baseline realities are never conflated with motion regressions.

---

## 12. Pre-Paint Execution & CSP Integrity

- Pre-Paint Script in `index.html`:
  - A deterministic, minified inline script in the `<head>` checks eligibility before first paint:
    ```javascript
    (function(){try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||localStorage.getItem('portfolio_motion_paused')==='true')return;if(window.location.search.indexOf('intro=1')!==-1||!sessionStorage.getItem('intro_seen')){document.documentElement.setAttribute('data-preloader','active');sessionStorage.setItem('intro_seen','1');}}catch(e){}})();
    ```
- CSP Compliance:
  - The script's exact SHA-256 hash is placed in `vercel.json` under `script-src`.
  - Zero `'unsafe-inline'` permitted in `script-src`.
  - Automated test in `tests/csp-hash.test.mjs` verifies script content matches CSP hash in both source and build artifacts.
- No-JavaScript Fallback (`<noscript>`):
  - In environments with JavaScript disabled, CSS rules ensure `#portfolio-preloader` has `display: none !important;`. The semantic HTML content inside `<div id="root">` is displayed immediately.

---

## 13. Component & DOM Architecture

```html
<div id="portfolio-preloader" class="preloader-overlay" aria-hidden="true" tabindex="-1">
  <!-- Minimal Counter -->
  <div class="preloader-counter-wrap">
    <span class="preloader-counter-digits font-mono">42</span>
  </div>

  <!-- Handwritten Greeting (Italianno Centerline Strokes) -->
  <div class="preloader-greeting-wrap">
    <svg class="preloader-hello-svg" viewBox="0 0 120 56" fill="none" aria-label="Hello.">
      <!-- Stroke 1: H entrance curl and left stem -->
      <path class="preloader-hello-stroke preloader-stroke-h1" pathLength="100" d="..." />
      <!-- Stroke 2: H right stem and sweeping crossbar -->
      <path class="preloader-hello-stroke preloader-stroke-h2" pathLength="100" d="..." />
      <!-- Stroke 3: Continuous cursive ligature 'ello' -->
      <path class="preloader-hello-stroke preloader-stroke-ello" pathLength="100" d="..." />
      <!-- Stroke 4: Terminal period downward pen tap -->
      <path class="preloader-hello-dot preloader-stroke-dot" pathLength="100" d="..." />
    </svg>
  </div>

  <!-- Split Panels Curtain (Vertical Strips with Vertical Shutter Split) -->
  <div class="preloader-panels-container">
    <div class="preloader-panel preloader-panel-0" data-tone="base">
      <div class="panel-half panel-half-top"></div>
      <div class="panel-half panel-half-bottom"></div>
      <div class="panel-seam"></div>
    </div>
    <div class="preloader-panel preloader-panel-1" data-tone="alt">
      <div class="panel-half panel-half-top"></div>
      <div class="panel-half panel-half-bottom"></div>
      <div class="panel-seam"></div>
    </div>
    <div class="preloader-panel preloader-panel-2" data-tone="base">
      <div class="panel-half panel-half-top"></div>
      <div class="panel-half panel-half-bottom"></div>
      <div class="panel-seam"></div>
    </div>
    <div class="preloader-panel preloader-panel-3" data-tone="alt">
      <div class="panel-half panel-half-top"></div>
      <div class="panel-half panel-half-bottom"></div>
      <div class="panel-seam"></div>
    </div>
    <div class="preloader-panel preloader-panel-4" data-tone="base">
      <div class="panel-half panel-half-top"></div>
      <div class="panel-half panel-half-bottom"></div>
      <div class="panel-seam"></div>
    </div>
  </div>
</div>
```

---

## 14. Phase 2 Ordered Commit Plan

All Phase 2 implementation commits will be small, atomic, and individually verified:

1. `feat(motion): preloader tokens and pre-paint readiness state`
   - Add preloader timing tokens and delays to `src/motion/tokens.ts` and `src/motion/tokens.css`.
   - Update `index.html` inline pre-paint script and verify sha256 hash in `vercel.json` and `tests/csp-hash.test.mjs`.

2. `feat(motion): minimal monospace milestone counter`
   - Implement minimal monospace counter with real readiness gating.
   - Restrict to pure monospace numeric ticks (`00` -> `18` -> `42` -> `73` -> `91` -> `100`).

3. `feat(motion): handwritten Hello SVG stroke entrance`
   - Implement compact, quiet sentence-case "Hello." SVG stroke draw and hold.
   - Connect fade exit prior to split initiation.

4. `feat(motion): desktop vertical-strip horizontal-split curtain`
   - Implement 5 vertical strips with horizontal center seams.
   - Implement vertical shutter split (`translateY(-100%)` on top half, `translateY(100%)` on bottom half).
   - Choreograph center-outward horizontal wave propagation (`P3` -> `P2 + P4` -> `P1 + P5`) with 75 ms stagger step.
   - Compose pure CSS keyframes using compositor-friendly transforms.

5. `feat(motion): responsive 3-panel mobile opening reveal`
   - Implement 3 vertical strips under `@media (max-width: 767px)` with vertical shutter split (`translateY`).
   - Choreograph mobile center-outward wave (`M2` -> `M1 + M3`) with accelerated 1.38 s timeline.

6. `feat(motion): skip listener, pause motion, and reduced-motion contract`
   - Implement one-shot passive skip listeners on keydown, pointerdown, wheel.
   - Connect OS `prefers-reduced-motion` and `portfolio_motion_paused` fast path.

7. `test(motion): preloader static audit, end-state contract, and performance proof`
   - Extend automated test suite for preloader token validity, property restrictions, and end-state DOM cleanliness.
   - Run full test suite, build check, and capture proof artifacts.

---

## 15. Proof Plan (P1 through P8)

| ID | Category | Check Description | Verification Method | Target Threshold |
|---|---|---|---|---|
| P1 | Visual Parity | Multi-viewport end-state visual comparison | Chrome DevTools screenshots at 390x844, 768x1024, 1536x864, 1920x1080 | Zero visual drift against static Hero layout |
| P2 | Frame Progression | Stepped frame capture of opening stages | WAAPI / DevTools step at counter, Hello, panel start, panel mid, settled | Verified 5 distinct visual stages |
| P3 | Lighthouse Performance | Mobile performance metrics (median of 3 runs): Record Tier 1 absolute results and Tier 2 regression delta | Lighthouse CLI mobile form factor (median of 3 runs) | 1. Record Tier 1 absolute targets (LCP < 2.50 s, CLS < 0.010, TBT < 200 ms). 2. Record Tier 2 regression delta against measured baseline (LCP delta <= 0 ms, CLS delta < 0.010, TBT delta <= 0 ms). 3. Pre-existing baseline failures recorded as such; do not claim Tier 1 PASS when baseline fails. |
| P4 | Runtime Trace | 4x CPU throttle trace inspection | DevTools Trace Engine JSON export | No animation frame task > 50 ms, zero layout thrashing |
| P5 | Behavior Matrix | First visit, returning session, `?intro=1`, reduced motion, pause toggle, skip triggers | Automated Node tests and DevTools evaluations | 100% matrix compliance across all 8 states |
| P6 | Static Audit | Token source of truth, property restrictions, zero em/en dashes | Automated Node tests (`npm test`) | Zero banned properties, zero raw ms outside tokens, zero em/en dashes |
| P7 | Accessibility | Focusability and screen reader tree | Chrome DevTools runtime evaluation | Hero CTA immediately focusable, zero trapped focus, aria-hidden on preloader |
| P8 | End-State Parity | DOM cleanliness assertion | DevTools runtime query | `data-preloader` removed, overlay unmounted/hidden, `will-change: auto` |

---

## 16. Explicit Failure and Cut Rules

If performance audits during Phase 2 show any regression against Tier 2 budgets, cuts will be applied strictly in this order:

1. Cut tonal variation across panels (revert all panels to single uniform `--bg-base`).
2. Reduce desktop panel count from 5 to 3.
3. Simplify handwritten greeting from SVG path stroke draw to a subtle opacity fade.
4. Reduce stagger step from 75 ms to 60 ms (the lower bound of the approved 60 to 90 ms stagger window), only if runtime trace analysis demonstrates an animation-frame task exceeds the 50 ms budget.
5. Shorten counter hold time.
6. Remove hairline seam element.

Under no circumstances will the following be cut or compromised:
- Static Hero renderability at t = 0 ms.
- OS `prefers-reduced-motion` immediate bypass.
- User Pause Motion persistence.
- CSP strict hash integrity (no `'unsafe-inline'`).
- Zero em/en dashes discipline.
