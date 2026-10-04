/**
 * src/motion/skipListener.ts
 * One-shot passive event listener for skipping the opening reveal.
 * Instantly removes data-intro on keydown, pointerdown, or wheel.
 */

export function initSkipListener(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  if (document.documentElement.getAttribute('data-intro') !== 'active') {
    return () => {};
  }

  const handleSkip = () => {
    document.documentElement.removeAttribute('data-intro');
    cleanup();
  };

  const options: AddEventListenerOptions = { passive: true, once: true };

  window.addEventListener('keydown', handleSkip, options);
  window.addEventListener('pointerdown', handleSkip, options);
  window.addEventListener('wheel', handleSkip, options);

  const cleanup = () => {
    window.removeEventListener('keydown', handleSkip);
    window.removeEventListener('pointerdown', handleSkip);
    window.removeEventListener('wheel', handleSkip);
  };

  return cleanup;
}
