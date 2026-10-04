/**
 * Hardik Bhaskar Portfolio: Unified Design Tokens (Frost Navy)
 * Contrast-checked WCAG AA & AAA compliant palette.
 * Defined once as single source of truth for UI and Three.js scenes.
 */

export const THEME_TOKENS = {
  // Backgrounds
  bgBase: '#071629',
  bgSurface: '#0D203B',
  bgElevated: '#112A4A',
  blue: '#17345C',

  // Text
  textStrong: '#FFFFFF',
  textPrimary: '#EAF4FF',
  textSecondary: '#9DB7D5',
  textMuted: '#7C94AF',

  // Borders
  borderSubtle: '#17345C', // decorative only
  borderStrong: '#60758E', // outline buttons, inputs (>= 3:1)

  // Accents & Interaction
  accent: '#9DB7D5',
  accentHover: '#EAF4FF',
  focusRing: '#9DB7D5',

  // Controls
  buttonPrimaryBg: '#FFFFFF',
  buttonPrimaryText: '#071629',

  // Status (only non-palette hue, availability dot only)
  statusAvailable: '#6EE7B7',
} as const;

export const themeColors = THEME_TOKENS;
export type ThemeTokens = typeof THEME_TOKENS;
