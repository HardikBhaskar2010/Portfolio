import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { CountUp } from '@/components/ui/CountUp';
import { fadeUp, stagger, scaleIn, spring } from '@/lib/motion';
import { tools } from '@/data/tools';

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
      className="py-24 md:py-32 lg:py-40 border-t border-border overflow-hidden"
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left Column — 3/5 */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="lg:col-span-3 flex flex-col gap-6"
          >
            {/* Bio Card */}
            <motion.div
              variants={scaleIn}
              className="bg-surface border border-border rounded-2xl p-8 md:p-10"
            >
              <p className="font-ui text-body text-base leading-[1.8]">
                I'm a developer and AI builder focused on crafting premium digital experiences
                that combine cinematic visuals, intelligent systems, and modern frontend engineering.
                My work blends design, animation, performance, and storytelling into products that
                feel alive and interactive.
              </p>
              <p className="font-ui text-body text-base leading-[1.8] mt-4">
                I specialize in React, TypeScript, Three.js, Framer Motion, and AI-integrated systems.
                From futuristic landing pages to experimental AI architectures, I enjoy building
                projects that push beyond traditional web experiences.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-6 font-ui text-sm text-heading link-underline group"
              >
                Full story
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={stagger}
              className="grid grid-cols-3 gap-4"
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
                    className="font-display italic text-5xl text-heading"
                  />
                  <span className="font-ui text-[10px] uppercase tracking-widest text-tagText">
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column — 2/5 */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Avatar Card with parallax */}
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="parallax-container h-56 md:h-72">
                <motion.img
                  src="/images/avatar.png"
                  alt="Hardik Bhaskar"
                  className="w-full h-full object-cover object-top"
                  style={{ y: avatarY, scale: avatarScale }}
                />
              </div>
              <div className="p-6">
                <p className="font-heading font-bold text-heading text-lg">Hardik Bhaskar</p>
                <p className="font-ui text-xs text-cyan uppercase tracking-widest mt-1">
                  Full Stack Developer & AI Systems Builder
                </p>
                <p className="font-ui text-sm text-body mt-3 leading-relaxed">
                  Building immersive web experiences, AI systems, and futuristic digital products.
                </p>
              </div>
            </div>

            {/* Role Card */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-3"
            >
              <span className="font-ui text-[10px] uppercase tracking-widest text-tagText">What I do</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {['React / Next.js', 'Framer Motion', 'Three.js', 'AI Systems', 'TypeScript', 'Supabase'].map(t => (
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
          </div>
        </div>

        {/* ── Tools Grid ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {Object.entries(tools).map(([category, items]) => (
            <motion.div
              key={category}
              variants={scaleIn}
              className="bg-surface border border-border rounded-2xl p-5"
            >
              <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-tagText">{category}</span>
              <div className="mt-4 flex flex-col gap-3">
                {items.slice(0, 3).map((tool) => (
                  <div key={tool.name} className="flex items-center gap-2.5">
                    <span className="text-lg">{tool.icon}</span>
                    <div>
                      <p className="font-ui text-sm text-heading font-medium">{tool.name}</p>
                      <p className="font-ui text-[10px] text-muted">{tool.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
