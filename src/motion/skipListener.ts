/**
 * src/motion/skipListener.ts
 * One-shot passive event listener for skipping the opening reveal.
 * Instantly removes data-preloader and data-intro on keydown, pointerdown, or wheel.
 */

export function initSkipListener(onSkip?: () => void): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const isPreloaderActive = document.documentElement.getAttribute('data-preloader') === 'active';
  const isIntroActive = document.documentElement.getAttribute('data-intro') === 'active';

  if (!isPreloaderActive && !isIntroActive) {
    return () => {};
  }

  // 250 ms arming grace window prevents residual address bar clicks, Enter key,
  // or trackpad momentum from prematurely skipping the intro at t = 0
  let armed = false;
  const armTimer = window.setTimeout(() => {
    armed = true;
  }, 250);

  const handleSkip = () => {
    if (!armed) return;
    document.documentElement.removeAttribute('data-preloader');
    document.documentElement.removeAttribute('data-intro');
    if (onSkip) {
      onSkip();
    }
    cleanup();
  };

  const options: AddEventListenerOptions = { passive: true, once: true };

  window.addEventListener('keydown', handleSkip, options);
  window.addEventListener('pointerdown', handleSkip, options);
  window.addEventListener('wheel', handleSkip, options);

  const cleanup = () => {
    window.clearTimeout(armTimer);
    window.removeEventListener('keydown', handleSkip);
    window.removeEventListener('pointerdown', handleSkip);
    window.removeEventListener('wheel', handleSkip);
  };

  return cleanup;
}

