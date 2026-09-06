import { useRef, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { CountUp } from '@/components/ui/CountUp';
import { getToolIcon } from '@/components/ui/ToolIcon';
import { fadeUp, stagger, scaleIn, spring } from '@/lib/motion';
import { tools } from '@/data/tools';
import { WebGLGuard } from '@/components/three/WebGLGuard';

const FloatingGeomCanvas = lazy(() =>
  import('@/components/three/FloatingGeoms').then(m => ({ default: m.FloatingGeomCanvas }))
);

export function AboutPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  /* Parallax: avatar image moves slower than scroll */
  const avatarY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const avatarScale = useTransform(scrollYProgress, [0, 1], [0.95, 1.02]);

  const stats = [
    { value: 3,    suffix: '+', label: 'Years experience' },
    { value: 20,   suffix: '+', label: 'Projects shipped' },
    { value: 10,   suffix: '+', label: 'Happy clients' },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 lg:py-32 border-t border-border overflow-hidden"
    >
      <div
        ref={inViewRef}
        className="max-w-[1200px] mx-auto px-6 md:px-12"
      >
        {/* ── Header ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mb-16"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionLabel>About me</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display italic text-heading"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: '0.92' }}
          >
            Who you'll be<br />working with.
          </motion.h2>
        </motion.div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">

          {/* Left Column — 3/5 */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1"
          >
            {/* Bio Card */}
            <motion.div
              variants={scaleIn}
              className="bg-surface border border-border rounded-2xl p-8 md:p-10"
            >
              <p className="font-ui text-body text-base leading-[1.8]">
                I'm a systems developer and AI builder focused on building robust low-level architectures,
                autonomous intelligence platforms, and high-performance desktop and web applications.
              </p>
              <p className="font-ui text-body text-base leading-[1.8] mt-4">
                My work spans <strong className="text-heading font-semibold">Rust</strong> native desktop platforms (Vectoris),
                bare-metal <strong className="text-heading font-semibold">C / C++</strong> operating system kernels (MahinaOS),
                <strong className="text-heading font-semibold">Python</strong> multi-agent intelligence (AEGIS & Veronica AI),
                and modern full-stack web engineering with <strong className="text-heading font-semibold">TypeScript</strong> and React 19.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-6 font-ui text-sm text-heading link-underline group"
              >
                Full story & architecture
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={stagger}
              className="grid grid-cols-3 gap-3"
            >
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  variants={scaleIn}
                  className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-2"
                >
                  <CountUp
                    to={s.value}
                    suffix={s.suffix}
                    className="font-display italic text-3xl md:text-5xl text-heading"
                  />
                  <span className="font-ui text-[9px] md:text-[10px] uppercase tracking-widest text-tagText">
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
            {/* Languages & Development Tools */}
            <motion.div
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
            >
              {['Languages & Systems', 'Development'].map((category) => (
                <motion.div
                  key={category}
                  variants={scaleIn}
                  className="bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col"
                >
                  <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-tagText mb-6">{category}</span>
                  <div className="flex flex-col gap-5">
                    {tools[category].slice(0, 3).map((tool) => (
                      <div key={tool.name} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center flex-shrink-0">
                          {getToolIcon(tool.name)}
                        </div>
                        <div>
                          <p className="font-ui text-sm md:text-base text-heading font-medium">{tool.name}</p>
                          <p className="font-ui text-[10px] md:text-xs text-muted mt-0.5">{tool.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Collaboration Tools (Full Width) */}
            <motion.div
              variants={scaleIn}
              className="bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col flex-1 justify-center"
            >
              <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-tagText mb-6 md:mb-8">Collaboration</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {tools['Collaboration'].slice(0, 3).map((tool) => (
                  <div key={tool.name} className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-bg border border-border flex items-center justify-center flex-shrink-0">
                      {getToolIcon(tool.name, 28)}
                    </div>
                    <div>
                      <p className="font-ui text-base md:text-lg text-heading font-medium">{tool.name}</p>
                      <p className="font-ui text-xs text-muted mt-1 max-w-[120px] leading-tight">{tool.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column — 2/5 */}
          <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6 order-1 lg:order-2">
            {/* Avatar Card with parallax */}
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="parallax-container h-56 md:h-72">
                <motion.img
                  src="/images/avatar.png"
                  alt="Hardik Bhaskar"
                  width={400}
                  height={288}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                  style={{ y: avatarY, scale: avatarScale }}
                />
              </div>
              <div className="p-6">
                <p className="font-heading font-bold text-heading text-lg">Hardik Bhaskar</p>
                <p className="font-ui text-xs text-cyan uppercase tracking-widest mt-1">
                  Interactive Web Developer · AI Systems Builder
                </p>
                <p className="font-ui text-[10px] text-muted mt-1">
                  Based in India · Works globally
                </p>
                <p className="font-ui text-sm text-body mt-3 leading-relaxed">
                  Building immersive web experiences, AI systems, and futuristic digital products.
                </p>
              </div>
            </div>

            {/* 3D Bento Cell — floating icosahedron */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="glass-cyan rounded-2xl overflow-hidden relative"
              style={{ height: 180 }}
            >
              <WebGLGuard fallback={<div className="w-full h-full flex items-center justify-center"><span className="font-ui text-xs text-tagText">Three.js</span></div>}>
                <Suspense fallback={null}>
                  <FloatingGeomCanvas type="icosahedron" color="#00E5FF" speed={0.8} size={0.9} />
                </Suspense>
              </WebGLGuard>
              <div className="absolute bottom-3 left-4">
                <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-cyan/60">Three.js · R3F</span>
              </div>
            </motion.div>

            {/* Role Card — premium skills first */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-3"
            >
              <span className="font-ui text-[10px] uppercase tracking-widest text-tagText">What I do</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {['Rust Systems', 'C / C++', 'Python AI Agents', 'TypeScript', 'Tauri v2', 'x86_64 Bare-Metal', 'Three.js / WebGL', 'React 19'].map(t => (
                  <span
                    key={t}
                    className="font-ui text-xs text-tagText bg-tag px-3 py-1.5 rounded-full border border-border"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                <span className="font-ui text-xs text-cyan">Available for new projects</span>
              </div>
            </motion.div>

            {/* AI & Systems Tools */}
            {['AI & Systems'].map((category) => (
              <motion.div
                key={category}
                variants={scaleIn}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="bg-surface border border-border rounded-2xl p-6 flex flex-col"
              >
                <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-tagText mb-4">{category}</span>
                <div className="flex flex-col gap-4">
                  {tools[category].slice(0, 3).map((tool) => (
                    <div key={tool.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center flex-shrink-0">
                        {getToolIcon(tool.name)}
                      </div>
                      <div>
                        <p className="font-ui text-sm text-heading font-medium">{tool.name}</p>
                        <p className="font-ui text-[10px] text-muted mt-0.5">{tool.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
