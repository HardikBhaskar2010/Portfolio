import { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useLenis, getLenis } from '@/lib/lenis';
import { track } from '@/lib/analytics';
import { unlockAudio, playTransitionWhoosh } from '@/lib/audio';
import { GridDistortion } from '@/components/effects/GridDistortion';
import GradientWaves from '@/components/ui/GradientWaves';
import { Navbar } from '@/components/layout/Navbar';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import Home from '@/pages/Home';

// Lazy-load subpages and 3D scenes to split bundle and accelerate initial paint
const ScrollOrb = lazy(() => import('@/components/three/ScrollOrb').then(m => ({ default: m.ScrollOrb })));
const Projects = lazy(() => import('@/pages/Projects'));
const About = lazy(() => import('@/pages/About'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/* ── Custom Cursor (Compositor-accelerated with translate3d, disabled on touch) ── */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch / coarse pointer devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    const ring   = ringRef.current;
    if (!cursor || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let rafId: number;
    const animate = () => {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        ringX = lerp(ringX, mouseX, 0.12);
        ringY = lerp(ringY, mouseY, 0.12);
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}

/* ── Auto-scroll to top on route transitions ───────────────── */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is an anchor hash (e.g. #contact), scroll to that section
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(hash, { duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    }

    // Immediately reset scroll position to top (0, 0)
    window.scrollTo(0, 0);
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    // Secondary reset on next animation frame to ensure newly mounted route component starts at top
    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      getLenis()?.scrollTo(0, { immediate: true });
    });

    return () => cancelAnimationFrame(rafId);
  }, [pathname, hash]);

  return null;
}

/* ── Animated page routes ────────────────────────────────────── */
function AnimatedRoutes() {
  const location = useLocation();

  /* Track page view + play transition whoosh on route change */
  useEffect(() => {
    track.pageView(location.pathname);
    playTransitionWhoosh();
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"               element={<Home />} />
          <Route path="/projects"       element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/project/:slug"  element={<ProjectDetail />} />
          <Route path="/about"          element={<About />} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

/* ── Root App content ───────────────────────────────────────── */
function AppContent() {
  useLenis();

  /* ── Prevent browser from caching scroll position on route transitions ── */
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  /* ── Audio unlock on first touch/click ─────────────────── */
  useEffect(() => {
    window.addEventListener('pointerdown', unlockAudio, { once: true });
  }, []);
  useEffect(() => {
    const fired = new Set<number>();
    const milestones = [25, 50, 75, 100] as const;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const total = document.documentElement.scrollHeight - window.innerHeight;
          if (total > 0) {
            const pct = Math.round((scrolled / total) * 100);
            for (const m of milestones) {
              if (pct >= m && !fired.has(m)) {
                fired.add(m);
                track.scrollDepth(m);
              }
            }
          }
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Backmost Layer: GradientWaves (React Bits) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#FF9FFC"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.0}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.05}
        />
      </div>

      {/* ── Background grid + glow effect (BELOW everything) ── */}
      <GridDistortion />

      <Navbar />           {/* ← always fixed, always visible */}
      <ScrollProgressBar />
      <CustomCursor />
      <Suspense fallback={null}>
        <ScrollOrb />
      </Suspense>

      {/* Auto-scroll to top on route change */}
      <ScrollToTop />

      {/* Page content — animated in/out by AnimatePresence */}
      <div className="relative z-10">
        <AnimatedRoutes />
      </div>

      {/* ── Vercel: Page-view analytics ── */}
      <Analytics />

      {/* ── Vercel: Core Web Vitals (LCP, FID, CLS, TTFB, INP) ── */}
      <SpeedInsights />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
