import { lazy, Suspense, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { CurrentFocus } from '@/components/sections/CurrentFocus';
import { scrollTo } from '@/lib/lenis';
import { projects } from '@/data/projects';
import { track } from '@/lib/analytics';
import { playHoverTick, playClick } from '@/lib/audio';
import { WebGLGuard } from '@/components/three/WebGLGuard';
import { useAfterLcp } from '@/lib/useAfterLcp';
import { OPENING_DELAY } from '@/motion/tokens';
import { initSkipListener } from '@/motion/skipListener';

// Lazy-load the heavy Canvas: zero impact on initial paint
const NeuralNetworkScene = lazy(() =>
  import('@/components/three/NeuralNetworkScene').then(m => ({ default: m.NeuralNetworkScene }))
);

const headlineLines = ['Systems Architect', 'AI Systems Builder'];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const is3DReady = useAfterLcp(800);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const cleanupSkip = initSkipListener();
    if (document.documentElement.getAttribute('data-intro') === 'active') {
      const isMobile = window.innerWidth < 768;
      const settleDelay = isMobile ? OPENING_DELAY.mobileSettle : OPENING_DELAY.settle;
      const timer = window.setTimeout(() => {
        document.documentElement.removeAttribute('data-intro');
      }, settleDelay);
      return () => {
        cleanupSkip();
        window.clearTimeout(timer);
      };
    }
    return cleanupSkip;
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const cardY   = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center pt-20 pb-24 md:pb-16 overflow-hidden bg-base hero-viewport"
    >
      {/* ── 3D Neural Network Background (Deferred until after LCP paints) ───── */}
      {is3DReady && (
        <WebGLGuard fallback={<div className="absolute inset-0 -z-10" />}>
          <Suspense fallback={null}>
            <div className="motion-3d-layer" data-motion-layer="3d">
              <NeuralNetworkScene />
            </div>
          </Suspense>
        </WebGLGuard>
      )}

      {/* ── Glass-dark overlay: keeps text readable over 3D ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'linear-gradient(to right, rgba(7,22,41,0.90) 45%, rgba(7,22,41,0.35) 100%)',
        }}
      />

      {/* ── Subtle engineering grid ───── */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* ── Vignette edges ──────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(7,22,41,0.65) 100%)' }}
      />

      {/* ── Crease hairline and light sweep (Ephemeral animation layers, hidden when not data-intro) ── */}
      <div
        className="motion-crease pointer-events-none"
        data-motion-crease="main"
        aria-hidden="true"
      />
      <div
        className="motion-sweep pointer-events-none"
        data-motion-sweep="main"
        aria-hidden="true"
      />

      {/* ── Two-column layout ────────────────────────────────── */}
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 w-full" style={{ zIndex: 2 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-120px)] hero-grid">

          {/* ── LEFT: Text column ── */}
          <motion.div style={{ y: textY, opacity }} className="flex flex-col gap-0 hero-col-left">

            {/* Headline Panel: unfolds along Y-axis hinge. Text inside is opacity: 1 from t=0 for LCP */}
            <div className="motion-panel motion-panel-headline" data-motion-panel="headline">
              <div className="motion-shading" data-motion-shading="headline" aria-hidden="true" />

              <div className="mb-6 pt-4">
                <h1 className="font-heading font-extrabold text-[var(--text-strong)] leading-[1.02] tracking-tight block text-4xl sm:text-6xl lg:text-7xl">
                  <span className="sr-only">
                    Hardik Bhaskar: Systems Architect &amp; AI Systems Builder
                  </span>
                  {headlineLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
              </div>

              {/* Subtext: LCP candidate element, renderable from t=0 */}
              <p className="font-ui text-[var(--text-secondary)] text-base sm:text-lg leading-[1.75] max-w-[500px] mb-8">
                I build AI systems and the low-level software under them: Rust and C++ runtimes, operating systems, local-first agents.
              </p>
            </div>

            {/* Secondary content: CTA and Currently Building (lands 120ms post-settle of headline panel) */}
            <div className="motion-content-secondary" data-motion-content="headline-secondary">
              {/* Single primary button to /projects */}
              <div className="flex items-center gap-4 mb-8">
                <Link
                  to="/projects"
                  onClick={() => {
                    playClick();
                    track.ctaClick('View projects', 'hero');
                  }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    onMouseEnter={playHoverTick}
                    icon={<ArrowRight size={16} />}
                  >
                    View projects
                  </Button>
                </Link>
              </div>

              {/* Currently Building card */}
              <div className="pt-2 motion-panel motion-panel-focus" data-motion-panel="focus">
                <div className="motion-shading" data-motion-shading="focus" aria-hidden="true" />
                <div className="motion-content" data-motion-content="focus">
                  <CurrentFocus />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Visual column ── */}
          <motion.div
            style={{ y: cardY }}
            className="hidden lg:flex flex-col gap-4 items-end hero-col-right"
          >
            {/* Avatar card panel: unfolds along Y-axis hinge */}
            <div className="motion-panel motion-panel-avatar w-full max-w-[340px]" data-motion-panel="avatar">
              <div className="motion-shading" data-motion-shading="avatar" aria-hidden="true" />
              <div className="motion-content" data-motion-content="avatar">
                <div
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-2xl"
                  style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(157,183,213,0.06)' }}
                >
                  {/* Profile image */}
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src="/images/avatar.webp"
                      alt="Hardik Bhaskar: Systems Architect &amp; AI Systems Builder"
                      title="Hardik Bhaskar: Systems Architect &amp; AI Systems Builder"
                      width={340}
                      height={256}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent" />
                  </div>
                  <div className="p-5 flex flex-col gap-1">
                    <p className="font-heading font-bold text-[var(--text-strong)] text-base">Hardik Bhaskar</p>
                    <p className="font-ui text-xs text-[var(--accent)]">Systems Architect · AI Systems Builder</p>
                    <p className="font-ui text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                      Building operating systems, autonomous AI &amp; intelligent systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project preview cards panel: flips down along X-axis hinge */}
            <div className="motion-panel motion-panel-preview w-full max-w-[340px]" data-motion-panel="preview">
              <div className="motion-shading" data-motion-shading="preview" aria-hidden="true" />
              <div className="motion-content" data-motion-content="preview">
                <div className="flex gap-3 w-full">
                  {projects.slice(0, 2).map((p) => (
                    <Link
                      key={p.id}
                      to={`/projects/${p.slug}`}
                      className="flex-1 block focus:outline-none"
                    >
                      <div
                        className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-xl overflow-hidden group cursor-pointer transition-colors duration-300 shadow-sm hover:shadow-lg"
                      >
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={p.image}
                            alt={`${p.title}: ${p.subtitle || 'Systems Architecture'} by Hardik Bhaskar`}
                            title={`${p.title}: Hardik Bhaskar`}
                            width={160}
                            height={90}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (p.fallbackImage && !target.src.endsWith(p.fallbackImage)) {
                                target.src = p.fallbackImage;
                              } else {
                                target.src = '/images/project-placeholder.webp';
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                            <span className="text-[10px] font-ui text-[var(--accent)] font-medium flex items-center gap-1">
                              View Project →
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="font-ui text-[9px] uppercase tracking-widest text-[var(--accent)] mb-0.5">{p.category}</p>
                          <p className="font-heading font-medium text-sm text-[var(--text-strong)] leading-tight group-hover:text-[var(--accent-hover)] transition-colors">{p.title}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating tech badges */}
            <div className="flex flex-wrap gap-2 w-full max-w-[340px] justify-end motion-content" data-motion-content="tech-badges">
              {['Rust', 'C++', 'Operating Systems', 'Autonomous AI', 'TypeScript', 'Three.js'].map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[10px] text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-2.5 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        onClick={() => scrollTo('#marquee')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
        style={{ zIndex: 2 }}
      >
        <span className="font-ui text-[9px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Scroll</span>
        <ArrowDown size={13} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
      </div>
    </section>
  );
}
