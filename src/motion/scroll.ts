/**
 * src/motion/scroll.ts
 * Lazy loader and lifecycle manager for GSAP and ScrollTrigger.
 * Features gsap.matchMedia, React StrictMode safe cleanup,
 * and runtime Pause Motion reversion (N7 & N8).
 */

import { isMotionPaused, isOsReducedMotion } from './motionPreference.ts';

let cachedGsap: typeof import('gsap').gsap | null = null;
let cachedScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;

export async function getGsap() {
  if (!cachedGsap || !cachedScrollTrigger) {
    const [gsapMod, stMod] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    const gsapInstance = gsapMod.gsap || gsapMod.default;
    const stInstance = stMod.ScrollTrigger;
    gsapInstance.registerPlugin(stInstance);
    cachedGsap = gsapInstance;
    cachedScrollTrigger = stInstance;
  }
  return { gsap: cachedGsap, ScrollTrigger: cachedScrollTrigger };
}

export interface ScrollContextPayload {
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}

export type ScrollSetupFn = (payload: ScrollContextPayload) => (() => void) | void;

/**
 * Initializes a responsive matchMedia ScrollTrigger context.
 * Strictly adheres to N7 by reverting all pinning and tweens under
 * reduced motion or runtime pause motion.
 */
export async function initScrollTriggerContext(setup: ScrollSetupFn): Promise<() => void> {
  if (typeof window === 'undefined') {
    return () => {};
  }

  if (isMotionPaused() || isOsReducedMotion()) {
    return () => {};
  }

  const { gsap, ScrollTrigger } = await getGsap();
  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: '(min-width: 1024px)',
      isTablet: '(min-width: 768px) and (max-width: 1023px)',
      isMobile: '(max-width: 767px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop = false, isTablet = false, isMobile = false, reduceMotion = false } =
        context.conditions || {};

      if (reduceMotion || isMotionPaused()) {
        return;
      }

      return setup({
        gsap,
        ScrollTrigger,
        isDesktop: Boolean(isDesktop),
        isTablet: Boolean(isTablet),
        isMobile: Boolean(isMobile),
      });
    }
  );

  const handlePauseChange = (e: Event) => {
    const custom = e as CustomEvent<{ paused: boolean }>;
    if (custom.detail?.paused) {
      mm.revert();
    } else {
      ScrollTrigger.refresh();
    }
  };

  window.addEventListener('portfolio:motion-pause-change', handlePauseChange);

  return () => {
    window.removeEventListener('portfolio:motion-pause-change', handlePauseChange);
    mm.revert();
  };
}
