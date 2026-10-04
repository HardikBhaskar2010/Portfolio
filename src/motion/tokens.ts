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

export const MOTION_TOKENS = {
  durations: DURATION,
  exitDurations: EXIT_DURATION,
  easings: EASING,
  easingsCss: EASING_CSS,
  stagger: STAGGER,
  overshoot: OVERSHOOT,
} as const;
