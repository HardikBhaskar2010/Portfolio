import { useEffect, useRef, lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useLenis, getLenis } from '@/lib/lenis';
import { track } from '@/lib/analytics';
import { unlockAudio, playTransitionWhoosh } from '@/lib/audio';
import { GridDistortion } from '@/components/effects/GridDistortion';
import { useAfterLcp } from '@/lib/useAfterLcp';

// Lazy-load 3D scenes and subpages to keep initial JS bundle small and accelerate initial paint
const Hyperspeed = lazy(() => import('@/components/ui/Hyperspeed'));
const ScrollOrb = lazy(() => import('@/components/three/ScrollOrb').then(m => ({ default: m.ScrollOrb })));
const Projects = lazy(() => import('@/pages/Projects'));
const About = lazy(() => import('@/pages/About'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const hyperspeedOptions = {
  onSpeedUp: () => {},
  onSlowDown: () => {},
  distortion: 'turbulentDistortion',
  length: 420,
  roadWidth: 15,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.35,
  totalSideLightSticks: 32,
  lightPairsPerRoadWay: 65,
  shoulderLinesWidthPercentage: 0.06,
  brokenLinesWidthPercentage: 0.12,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.15, 0.6] as [number, number],
  lightStickHeight: [1.4, 2.0] as [number, number],
  movingAwaySpeed: [70, 95] as [number, number],
  movingCloserSpeed: [-130, -175] as [number, number],
  carLightsLength: [420 * 0.05, 420 * 0.32] as [number, number],
  carLightsRadius: [0.08, 0.22] as [number, number],
  carWidthPercentage: [0.3, 0.5] as [number, number],
  carShiftX: [-0.8, 0.8] as [number, number],
  carFloorSeparation: [0, 5] as [number, number],
  cameraY: 4.8,
  bloomIntensity: 2.4,
  colors: {
    roadColor: 0x071629,
    islandColor: 0x0d203b,
    background: 0x071629,
    shoulderLines: 0x9db7d5,
    brokenLines: 0xffffff,
    leftCars: [0x17345c, 0x112a4a, 0x60758e],
    rightCars: [0x9db7d5, 0xeaf4ff, 0x60758e],
    sticks: 0x9db7d5
  }
};
import { Navbar } from '@/components/layout/Navbar';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { Preloader } from '@/components/ui/Preloader';
import { ConsentBanner } from '@/components/ui/ConsentBanner';
import Home from '@/pages/Home';

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
    // If there is an anchor hash (e.g. #contact, #about-contributions), scroll to that section
    if (hash) {
      const scrollToHash = () => {
        const el = document.querySelector(hash);
        if (el) {
          const lenis = getLenis();
          if (lenis) {
            lenis.scrollTo(hash, { duration: 1.2, offset: -80 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
          return true;
        }
        return false;
      };

      if (scrollToHash()) return;

      // Retry shortly in case target route chunk is still mounting
      const timer = setTimeout(scrollToHash, 250);
      return () => clearTimeout(timer);
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

/* ── Legacy redirect helper (/project/:slug -> /projects/:slug) ── */
function LegacyProjectRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={slug ? `/projects/${slug}` : '/projects'} replace />;
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
          <Route path="/project/:slug"  element={<LegacyProjectRedirect />} />
          <Route path="/project"        element={<Navigate to="/projects" replace />} />
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
  const is3DReady = useAfterLcp(1000);
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('nointro') === 'true') return false;
    if (params.get('intro') === '1') return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try {
      if (localStorage.getItem('portfolio_motion_paused') === 'true') return false;
      const seen = sessionStorage.getItem('intro_seen');
      if (seen === 'true' || seen === '1') return false;
    } catch {
      // Storage access blocked or restricted
    }
    return true;
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('intro_seen', '1');
    } catch {
      // Ignore storage error
    }
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-preloader');
      document.documentElement.removeAttribute('data-intro');
    }
  };

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
      {showIntro && <Preloader onComplete={handleIntroComplete} />}
      <ConsentBanner />

      {/* ── Backmost Layer: Hyperspeed (React Bits) ── */}
      {is3DReady && (
        <div className="fixed inset-0 z-0 overflow-hidden select-none">
          <Suspense fallback={null}>
            <Hyperspeed effectOptions={hyperspeedOptions} />
          </Suspense>
        </div>
      )}

      {/* ── Background grid + glow effect (BELOW everything) ── */}
      <GridDistortion />

      <Navbar />           {/* ← always fixed, always visible */}
      <ScrollProgressBar />
      <CustomCursor />
      {is3DReady && (
        <Suspense fallback={null}>
          <ScrollOrb />
        </Suspense>
      )}

      {/* Auto-scroll to top on route change */}
      <ScrollToTop />

      {/* Page content: animated in/out by AnimatePresence */}
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
