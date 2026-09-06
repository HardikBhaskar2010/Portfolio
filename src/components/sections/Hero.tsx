import { lazy, Suspense, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { CurrentFocus } from '@/components/sections/CurrentFocus';
import { scrollTo } from '@/lib/lenis';
import { spring } from '@/lib/motion';
import { projects } from '@/data/projects';
import { track } from '@/lib/analytics';
import { playHoverTick, playClick, playSynthPulse } from '@/lib/audio';
import { WebGLGuard } from '@/components/three/WebGLGuard';

// Lazy-load the heavy Canvas — zero impact on initial paint
const NeuralNetworkScene = lazy(() =>
  import('@/components/three/NeuralNetworkScene').then(m => ({ default: m.NeuralNetworkScene }))
);

const tagline = ['Designing', 'intelligent', 'digital', 'experiences.'];

/* Each word: slides up from below the clip + deblurs */
const lineVariants = {
  hidden:  { opacity: 0, y: 70, filter: 'blur(12px)', skewY: 3 },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', skewY: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUpDelay = (delay: number) => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: spring, delay } },
});

const stats = [
  { value: '3+',  label: 'Years exp.' },
  { value: '20+', label: 'Projects' },
  { value: '10+', label: 'Clients' },
  { value: '3',   label: 'AI Systems shipped' },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="relative min-h-screen flex flex-col justify-center pt-20 pb-24 md:pb-16 overflow-hidden"
    >
      {/* ── 3D Neural Network Background ───────────────────── */}
      <WebGLGuard fallback={<div className="absolute inset-0 -z-10" />}>
        <Suspense fallback={null}>
          <NeuralNetworkScene />
        </Suspense>
      </WebGLGuard>

      {/* ── Glass-dark overlay — keeps text readable over 3D ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'linear-gradient(to right, rgba(5,5,10,0.88) 50%, rgba(5,5,10,0.35) 100%)',
        }}
      />

      {/* ── Subtle grid (kept, complements the particles) ───── */}
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
        style={{ zIndex: 1, background: 'radial-gradient(ellipse at center, transparent 40%, #080808 100%)' }}
      />

      {/* ── Two-column layout ────────────────────────────────── */}
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 w-full" style={{ zIndex: 2 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-120px)]">

          {/* ── LEFT: Text column ── */}
          <motion.div style={{ y: textY, opacity }} className="flex flex-col gap-0">

            {/* Badge */}
            <motion.div variants={fadeUpDelay(0)} initial="hidden" animate="visible" className="mb-8">
              <span className="inline-flex items-center gap-2 font-ui text-[10px] uppercase tracking-[0.22em] text-tagText bg-tag px-3.5 py-2 rounded-full border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                Available for work
                <ArrowRight size={9} className="text-cyan" />
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              {tagline.map((word, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.h1
                    variants={lineVariants}
                    className="font-display italic text-heading leading-[0.87] tracking-tight block"
                    style={{ fontSize: 'clamp(38px, 9vw, 112px)' }}
                  >
                    {word}
                    {i === tagline.length - 1 && (
                      <motion.span
                        className="inline-block w-[3px] h-[0.75em] bg-cyan align-middle ml-2"
                        animate={{ opacity: [1, 0, 1, 0, 1, 0, 0] }}
                        transition={{ duration: 2, times: [0,0.2,0.4,0.6,0.8,0.9,1], delay: tagline.length * 0.1 + 0.8 }}
                      />
                    )}
                  </motion.h1>
                </div>
              ))}
            </motion.div>

            {/* Subtitle — updated copy per upgrade plan */}
            <motion.p
              variants={fadeUpDelay(0.75)}
              initial="hidden"
              animate="visible"
              className="font-ui text-body text-base leading-[1.85] max-w-[440px] mb-8"
            >
              I build low-level systems in <span className="text-heading font-medium">Rust</span> & <span className="text-heading font-medium">C++</span>,
              bare-metal operating systems, autonomous AI agents, and cinematic 3D web applications.{' '}
              <span className="text-cyan">Available for systems engineering and AI product contracts.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUpDelay(0.9)}
              initial="hidden"
              animate="visible"
              className="flex flex-col xs:flex-row items-stretch xs:items-start gap-3 mb-10 md:mb-16"
            >
              <Button
                variant="primary"
                size="lg"
                onMouseEnter={playHoverTick}
                onClick={() => { playClick(); scrollTo('#contact'); track.ctaClick("Let's work together", 'hero'); }}
                icon={<ArrowRight size={14} />}
                className="w-full xs:w-auto justify-center"
              >
                Let's work together
              </Button>
              <Link to="/projects" className="w-full xs:w-auto" onClick={() => { playClick(); track.ctaClick('View case studies', 'hero'); }}>
                <Button onMouseEnter={playHoverTick} variant="ghost" size="lg" className="w-full justify-center">View case studies</Button>
              </Link>
            </motion.div>

            {/* Stats — 4-column with "3 AI Systems Shipped" */}
            <motion.div
              variants={fadeUpDelay(1.05)}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-4 gap-3 md:gap-4 pt-6 md:pt-8 pb-6 border-t border-border"
            >
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1.5">
                  <span className="font-display italic text-2xl md:text-4xl text-heading leading-none">{s.value}</span>
                  <span className="font-ui text-[9px] text-muted uppercase tracking-widest leading-tight">{s.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Currently Building card — generous spacing to prevent overlap */}
            <motion.div
              variants={fadeUpDelay(1.2)}
              initial="hidden"
              animate="visible"
              className="pt-4 md:pt-6"
            >
              <CurrentFocus />
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Visual column ── */}
          <motion.div
            style={{ y: cardY }}
            className="hidden lg:flex flex-col gap-4 items-end"
          >
            {/* Avatar card — updated title */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease: spring }}
              className="w-full max-w-[340px] bg-surface border border-border rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 0 60px rgba(0,229,255,0.08), 0 0 120px rgba(124,58,237,0.05)' }}
            >
              {/* Profile image */}
              <div className="h-64 overflow-hidden relative">
                <img
                  src="/images/avatar.png"
                  alt="Hardik Bhaskar"
                  width={340}
                  height={256}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <span className="flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-widest text-cyan bg-bg/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-cyan/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                    Open to work
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-1">
                <p className="font-heading font-bold text-heading text-base">Hardik Bhaskar</p>
                <p className="font-ui text-xs text-cyan">Interactive Web Developer · AI Systems Builder</p>
                <p className="font-ui text-xs text-muted mt-1 leading-relaxed">
                  Building 3D web experiences & intelligent systems.
                </p>
              </div>
            </motion.div>

            {/* Project preview cards */}
            <div className="flex gap-3 w-full max-w-[340px]">
              {projects.slice(0, 2).map((p, i) => (
                <Link
                  key={p.id}
                  to={`/project/${p.slug}`}
                  className="flex-1 block focus:outline-none"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.7 + i * 0.15, ease: spring }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={playSynthPulse}
                    className="bg-surface border border-border hover:border-cyan/40 rounded-xl overflow-hidden group cursor-pointer transition-colors duration-300 shadow-sm hover:shadow-lg hover:shadow-cyan/5"
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={p.image}
                        alt={p.title}
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
                            target.src = '/images/project-placeholder.png';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                        <span className="text-[10px] font-ui text-cyan font-medium flex items-center gap-1">
                          View Project →
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-ui text-[9px] uppercase tracking-widest text-cyan mb-0.5">{p.category}</p>
                      <p className="font-display italic text-sm text-heading leading-tight group-hover:text-cyan transition-colors">{p.title}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Floating tech badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-wrap gap-2 w-full max-w-[340px] justify-end"
            >
              {['Three.js', 'React', 'TypeScript', 'Framer Motion', 'AI Systems'].map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.07, ease: spring }}
                  className="font-mono text-[10px] text-muted bg-tag border border-border px-2.5 py-1 rounded-full"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        onClick={() => scrollTo('#marquee')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
        style={{ zIndex: 2 }}
      >
        <span className="font-ui text-[9px] uppercase tracking-[0.22em] text-tagText">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={13} className="text-muted group-hover:text-cyan transition-colors" />
        </motion.div>
      </motion.div>
    </section>
  );
}
