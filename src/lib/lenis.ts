import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import { useMotionValue } from 'framer-motion';

/* ─── Singleton Lenis instance ──────────────────────────────── */
let lenisInstance: Lenis | null = null;

export function getLenis() { return lenisInstance; }

/* ─── Scroll store — read in R3F useFrame without React state ── */
export const scrollStore = {
  progress: 0,
  velocity: 0,
  scroll: 0,
};

/* ─── Main Lenis hook — call once at App root ───────────────── */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.8,
    });
    lenisInstance = lenis;

    // Populate scrollStore so R3F scenes can read progress in useFrame
    lenis.on('scroll', ({ progress, velocity, scroll }: { progress: number; velocity: number; scroll: number }) => {
      scrollStore.progress = progress;
      scrollStore.velocity = velocity;
      scrollStore.scroll   = scroll;
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

/* ─── Scroll-Progress MotionValue ───────────────────────────── */
export function useLenisScrollProgress() {
  const progress = useMotionValue(0);

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    const unsub = lenis.on('scroll', ({ progress: p }: { progress: number }) => {
      progress.set(p);
    });
    return () => unsub();
  }, [progress]);

  return progress;
}

/* ─── Parallax via raw scroll offset ───────────────────────── */
export function useParallaxValue(speed = 0.3) {
  const value = useMotionValue(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      value.set(scrollY * speed);
      lastScrollY.current = scrollY;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed, value]);

  return value;
}

/* ─── Scroll-to utility ─────────────────────────────────────── */
export function scrollTo(target: string | HTMLElement, offset = 0) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.6 });
  } else {
    const el = typeof target === 'string'
      ? document.querySelector(target)
      : target;
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}

export function scrollToTop() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.6 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
