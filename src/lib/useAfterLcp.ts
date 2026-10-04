import { useState, useEffect } from 'react';

/**
 * Defers non-critical resources (e.g. 3D WebGL scenes, heavy background tasks)
 * until after the Largest Contentful Paint (LCP) has settled and the browser is idle.
 */
export function useAfterLcp(delayMs: number = 800): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(
          () => setReady(true),
          { timeout: Math.max(delayMs, 1500) }
        );
      } else {
        timeoutId = setTimeout(() => setReady(true), delayMs);
      }
    };

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
    }

    return () => {
      window.removeEventListener('load', schedule);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delayMs]);

  return ready;
}
