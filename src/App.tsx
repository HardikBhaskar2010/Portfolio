import { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useLenis } from '@/lib/lenis';
import { track } from '@/lib/analytics';
import { unlockAudio, playTransitionWhoosh } from '@/lib/audio';
import { GridDistortion } from '@/components/effects/GridDistortion';
import { Navbar } from '@/components/layout/Navbar';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import Home from '@/pages/Home';

// Lazy-load subpages and 3D scenes to split bundle and accelerate initial paint
const ScrollOrb = lazy(() => import('@/components/three/ScrollOrb').then(m => ({ default: m.ScrollOrb })));
const Projects = lazy(() => import('@/pages/Projects'));
const About = lazy(() => import('@/pages/About'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/* ── Custom Cursor (Compositor-accelerated with translate3d) ── */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
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

  /* ── Audio unlock on first touch/click ─────────────────── */
  useEffect(() => {
    window.addEventListener('pointerdown', unlockAudio, { once: true });
  }, []);
  useEffect(() => {
    const fired = new Set<number>();
    const milestones = [25, 50, 75, 100] as const;

    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = Math.round((scrolled / total) * 100);

      for (const m of milestones) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          track.scrollDepth(m);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Background grid + glow effect (BELOW everything) ── */}
      <GridDistortion />

      <Navbar />           {/* ← always fixed, always visible */}
      <ScrollProgressBar />
      <CustomCursor />
      <Suspense fallback={null}>
        <ScrollOrb />
      </Suspense>

      {/* Page content — animated in/out by AnimatePresence */}
      <AnimatedRoutes />

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
