import React, { useRef, useEffect } from 'react';
import { getLenis } from '@/lib/lenis';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CYLINDRICAL SCROLL CONFIGURATION (TUNABLE CONSTANTS)
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const CYLINDRICAL_CONFIG = {
  perspective: 1200,      // 3D perspective distance in px
  maxRotation: -16,       // Maximum tilt angle in degrees (negative = bottom rolls away into depth)
  maxDepth: -65,          // Maximum depth translation in px (negative = into screen)
  scale: 0.96,            // Foreshortening scale factor at peak curvature
  brightness: 0.85,       // Shading falloff multiplier at peak curvature
  curveThreshold: 0.38,   // Viewport bottom fraction where curvature begins (e.g. 0.38 = bottom 38%)
};

/**
 * Hook for Lenis / RAF-based cylindrical scroll calculation.
 * Used for browsers without native CSS animation-timeline: view() support (Safari/Firefox).
 */
export function useCylindricalElement(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    // If the browser natively supports CSS scroll-driven animations, let the GPU compositor handle it
    const supportsScrollTimeline =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline', 'view()');

    if (supportsScrollTimeline) return;

    // Respect reduced motion preferences
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const element = ref.current;
    if (!element) return;

    let rafId: number;

    const updateTransform = () => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const vh = window.innerHeight;

      // Calculate how deep the element is within the bottom curve threshold
      // When rect.top is at (1 - curveThreshold) * vh, progress = 0
      // When rect.top is at vh, progress = 1
      const thresholdY = vh * (1 - CYLINDRICAL_CONFIG.curveThreshold);
      const span = vh - thresholdY;

      let progress = 0;
      if (rect.top > thresholdY) {
        progress = Math.min(1.2, Math.max(0, (rect.top - thresholdY) / span));
      }

      if (progress > 0) {
        // Physical cylindrical power curve
        const curve = Math.pow(Math.min(1, progress), 1.25);
        const rx = curve * CYLINDRICAL_CONFIG.maxRotation;
        const tz = curve * CYLINDRICAL_CONFIG.maxDepth;
        const s = 1.0 - curve * (1.0 - CYLINDRICAL_CONFIG.scale);
        const b = 1.0 - curve * (1.0 - CYLINDRICAL_CONFIG.brightness);

        element.style.setProperty('--cyl-rx', `${rx.toFixed(2)}deg`);
        element.style.setProperty('--cyl-tz', `${tz.toFixed(2)}px`);
        element.style.setProperty('--cyl-scale', `${s.toFixed(3)}`);
        element.style.setProperty('--cyl-bright', `${b.toFixed(3)}`);
      } else {
        element.style.setProperty('--cyl-rx', '0deg');
        element.style.setProperty('--cyl-tz', '0px');
        element.style.setProperty('--cyl-scale', '1');
        element.style.setProperty('--cyl-bright', '1');
      }
    };

    // Listen to Lenis scroll and native scroll
    const lenis = getLenis();
    let unsubLenis: (() => void) | undefined;
    if (lenis) {
      unsubLenis = lenis.on('scroll', () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateTransform);
      });
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateTransform);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial check
    updateTransform();

    return () => {
      cancelAnimationFrame(rafId);
      if (unsubLenis) unsubLenis();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
}

interface CylindricalItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'aside';
}

/**
 * CylindricalItem: Wraps cards, sections, or list items.
 * As the item scrolls into the bottom of the viewport, it curves backwards
 * along a cylindrical drum into 3D perspective depth, then flattens out
 * as it enters the reading zone.
 */
export function CylindricalItem({
  children,
  className = '',
  as: Component = 'div',
  ...rest
}: CylindricalItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  useCylindricalElement(itemRef);

  const Tag = Component as 'div';

  return (
    <Tag
      ref={itemRef}
      className={`cylindrical-roll ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default CylindricalItem;
