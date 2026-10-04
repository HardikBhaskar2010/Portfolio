/**
 * src/motion/motionPreference.ts
 * Manages motion preference state respecting OS prefers-reduced-motion and
 * user Pause Motion toggle with strict precedence hierarchy (N7).
 */

const STORAGE_KEY = 'portfolio_motion_paused';

export function isOsReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isMotionPaused(): boolean {
  if (typeof window === 'undefined') return false;
  // If OS requests reduced motion, motion is unconditionally disabled
  if (isOsReducedMotion()) return true;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setMotionPaused(paused: boolean): boolean {
  if (typeof window === 'undefined') return false;
  // If OS reduced motion is active, motion stays disabled regardless
  if (isOsReducedMotion()) {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore storage errors in restricted contexts
    }
    window.dispatchEvent(
      new CustomEvent('portfolio:motion-pause-change', { detail: { paused: true } })
    );
    return true;
  }

  try {
    localStorage.setItem(STORAGE_KEY, paused ? 'true' : 'false');
  } catch {
    // Ignore storage errors in restricted contexts
  }

  if (paused) {
    document.documentElement.removeAttribute('data-intro');
    document.documentElement.setAttribute('data-motion-paused', 'true');
  } else {
    document.documentElement.removeAttribute('data-motion-paused');
  }

  window.dispatchEvent(
    new CustomEvent('portfolio:motion-pause-change', { detail: { paused } })
  );
  return paused;
}

export function toggleMotionPaused(): boolean {
  const current = isMotionPaused();
  return setMotionPaused(!current);
}
