/**
 * Motion System Design Tokens
 * Source of truth for durations, easings, exits, and staggers.
 * No raw millisecond or cubic-bezier values may exist outside this file.
 */

export const DURATION = {
  120: 120,
  240: 240,
  420: 420,
  700: 700,
  1100: 1100,
} as const;

export type DurationKey = keyof typeof DURATION;

export const EXIT_DURATION = {
  84: 84,   // 120 * 0.7
  168: 168, // 240 * 0.7
  294: 294, // 420 * 0.7
  490: 490, // 700 * 0.7
  770: 770, // 1100 * 0.7
} as const;

export type ExitDurationKey = keyof typeof EXIT_DURATION;

export const EASING = {
  out: [0.32, 0.72, 0, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
} as const;

export const EASING_CSS = {
  out: 'cubic-bezier(0.32, 0.72, 0, 1)',
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
} as const;

export const STAGGER = {
  step: 75, // 75 ms step, sits inside 60 to 90 ms budget window
} as const;

export const OVERSHOOT = {
  maxPercent: 4, // 4% maximum overshoot
} as const;

export const DELAY = {
  0: 0,
  200: 200,
  300: 300,
  400: 400,
  500: 500,
  550: 550,
  700: 700,
  800: 800,
  850: 850,
  940: 940,
  1020: 1020,
  1040: 1040,
  1090: 1090,
  1120: 1120,
  1300: 1300,
  1400: 1400,
  1520: 1520,
  1620: 1620,
  1670: 1670,
  1700: 1700,
  1950: 1950,
  2200: 2200,
} as const;

export const OPENING_DELAY = {
  crease: DELAY[0],
  headlinePanel: DELAY[300],
  avatarPanel: DELAY[700],
  focusPanel: DELAY[800],
  previewPanel: DELAY[850],
  headlineCta: DELAY[1120],
  scene3d: DELAY[1300],
  scrollOrb: DELAY[1400],
  avatarContent: DELAY[1520],
  focusContent: DELAY[1620],
  previewContent: DELAY[1670],
  badges: DELAY[1700],
  lightSweep: DELAY[1950],
  settle: DELAY[2200],
  // Mobile opening delays
  mobileCrease: DELAY[0],
  mobileHeadline: DELAY[200],
  mobileAvatar: DELAY[400],
  mobileFocus: DELAY[500],
  mobilePreview: DELAY[550],
  mobileAvatarContent: DELAY[940],
  mobileHeadlineCta: DELAY[1020],
  mobileFocusContent: DELAY[1040],
  mobilePreviewContent: DELAY[1090],
  mobileSettle: DELAY[1400],
} as const;

export const MOTION_TOKENS = {
  durations: DURATION,
  exitDurations: EXIT_DURATION,
  easings: EASING,
  easingsCss: EASING_CSS,
  stagger: STAGGER,
  overshoot: OVERSHOOT,
  delays: DELAY,
  openingDelays: OPENING_DELAY,
} as const;
