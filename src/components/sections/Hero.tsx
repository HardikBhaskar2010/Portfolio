import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { scrollTo } from '@/lib/lenis';
import { spring } from '@/lib/motion';
import { projects } from '@/data/projects';

const tagline = ['Designing', 'intelligent', 'digital', 'experiences.'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const lineVariants = {
  hidden:  { opacity: 0, y: 70, skewY: 5 },
  visible: { opacity: 1, y: 0, skewY: 0, transition: { duration: 0.85, ease: spring } },
};

const fadeUpDelay = (delay: number) => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: spring, delay } },
});

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const cardY   = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const blob1Y  = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const blob2Y  = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 overflow-hidden"
    >
      {/* ── Background effects ──────────────────────── */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Cyan blob — centre-right */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            y: blob1Y,
            position: 'absolute', top: '15%', right: '5%',
            width: '560px', height: '560px', borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(0,229,255,0.22) 0%, transparent 65%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Violet blob — bottom-left */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.14, 0.22, 0.14] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          style={{
            y: blob2Y,
            position: 'absolute', bottom: '10%', left: '0%',
            width: '480px', height: '480px', borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 65%)',
            filter: 'blur(70px)',
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Vignette edges */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #080808 100%)' }} />
      </div>

      {/* ── Two-column layout ───────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-120px)]">

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
                    style={{ fontSize: 'clamp(48px, 7.5vw, 112px)' }}
                  >
                    {word}
                    {i === tagline.length - 1 && (
                      <motion.span
                        className="inline-block ml-1"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{
                          background: 'linear-gradient(135deg, #00E5FF, #7C3AED)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        _
                      </motion.span>
                    )}
                  </motion.h1>
                </div>
              ))}
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeUpDelay(0.75)}
              initial="hidden"
              animate="visible"
              className="font-ui text-body text-base leading-[1.85] max-w-[420px] mb-8"
            >
              I build cinematic web experiences, AI-powered systems, and futuristic interactive products focused on performance, storytelling, and innovation.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUpDelay(0.9)}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-start gap-3 mb-16"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollTo('#contact')}
                icon={<ArrowRight size={14} />}
              >
                Let's work together
              </Button>
              <Link to="/projects">
                <Button variant="ghost" size="lg">View case studies</Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUpDelay(1.05)}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border"
            >
              {[
                { value: '3+',  label: 'Years exp.' },
                { value: '20+', label: 'Projects' },
                { value: '10+', label: 'Clients' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span className="font-display italic text-4xl md:text-5xl text-heading leading-none">{s.value}</span>
                  <span className="font-ui text-[10px] text-muted uppercase tracking-widest">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Visual column ── */}
          <motion.div
            style={{ y: cardY }}
            className="hidden lg:flex flex-col gap-4 items-end"
          >
            {/* Avatar card */}
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
                <p className="font-ui text-xs text-cyan">Full Stack Dev & AI Builder</p>
                <p className="font-ui text-xs text-muted mt-1 leading-relaxed">
                  Building cinematic web experiences & intelligent systems.
                </p>
              </div>
            </motion.div>

            {/* Project preview cards — two small ones */}
            <div className="flex gap-3 w-full max-w-[340px]">
              {projects.slice(0, 2).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.7 + i * 0.15, ease: spring }}
                  className="flex-1 bg-surface border border-border rounded-xl overflow-hidden group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-ui text-[9px] uppercase tracking-widest text-cyan mb-0.5">{p.category}</p>
                    <p className="font-display italic text-sm text-heading leading-tight">{p.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating tech badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-wrap gap-2 w-full max-w-[340px] justify-end"
            >
              {['React', 'TypeScript', 'Three.js', 'Framer Motion', 'AI Systems'].map((tech, i) => (
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
