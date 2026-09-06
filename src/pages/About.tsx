import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Footer } from '@/components/layout/Footer';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { ContactSection } from '@/components/sections/ContactSection';
import { services, experience, tools } from '@/data/tools';
import { pageEnter, stagger, fadeUp, fadeLeft, fadeRight, scaleIn } from '@/lib/motion';

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <motion.div variants={pageEnter} initial="hidden" animate="visible" exit="exit" className="page-wrapper">
      <main className="pt-16">

        {/* ── Hero ── */}
        <section ref={heroRef} className="py-24 md:py-32 border-b border-border">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-6 mb-16">
              <motion.div variants={fadeUp}><SectionLabel>About me</SectionLabel></motion.div>
              <motion.h1
                variants={fadeUp}
                className="font-display italic text-heading"
                style={{ fontSize: 'clamp(40px, 7vw, 100px)', lineHeight: '0.9' }}
              >
                Get to know<br />me better.
              </motion.h1>
            </motion.div>

            {/* Who I Am — 2-col */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Portrait with parallax */}
              <motion.div variants={scaleIn} initial="hidden" animate="visible" className="relative rounded-2xl overflow-hidden">
                <div className="aspect-[3/4] md:aspect-[4/5] parallax-container">
                  <motion.img
                    src="/images/avatar.png"
                    alt="Hardik Bhaskar"
                    style={{ y: imageY, scale: imageScale }}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-transparent" />
                </div>
                {/* Floating label */}
                <div className="absolute bottom-5 left-5 glass rounded-xl px-4 py-3">
                  <p className="font-heading font-bold text-heading text-sm">Hardik Bhaskar</p>
                  <p className="font-ui text-xs text-cyan mt-0.5">Luna Kitsune</p>
                </div>
              </motion.div>

              {/* Bio */}
              <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-6">
                <motion.h2 variants={fadeUp} className="font-display italic text-heading text-3xl md:text-4xl">
                  Systems Architect, Low-Level Engineer<br />& AI Systems Builder.
                </motion.h2>
                <motion.p variants={fadeUp} className="font-ui text-body text-base leading-[1.9]">
                  I'm a systems developer and AI builder focused on building robust low-level architectures,
                  autonomous intelligence systems, and high-performance user interfaces. My work bridges bare-metal
                  operating systems, native desktop binaries, and cinematic web experiences.
                </motion.p>
                <motion.p variants={fadeUp} className="font-ui text-body text-base leading-[1.9]">
                  I engineer native desktop platforms with <strong className="text-heading font-semibold">Rust</strong> and Tauri v2 (Vectoris),
                  bare-metal x86_64 operating system kernels in <strong className="text-heading font-semibold">C / C++</strong> and Assembly (MahinaOS),
                  autonomous multi-agent decision intelligence platforms in <strong className="text-heading font-semibold">Python</strong> and Google ADK 2.0 (AEGIS & Veronica AI),
                  and modern interactive applications with <strong className="text-heading font-semibold">TypeScript</strong>, React 19, and Three.js.
                </motion.p>
                <motion.p variants={fadeUp} className="font-ui text-body text-base leading-[1.9]">
                  Whether writing bare-metal memory managers, zero-cost abstractions in Rust, or cinematic scroll-driven
                  3D web animations, I build software where deep performance engineering meets exquisite design craft.
                </motion.p>
                <motion.div variants={fadeUp} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                  <span className="font-ui text-sm text-cyan">Available for systems engineering and AI product contracts</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Experience Timeline ── */}
        <section className="py-24 md:py-32 border-b border-border">
          <div ref={inViewRef} className="max-w-[1200px] mx-auto px-6 md:px-12">
            <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                <motion.div variants={fadeUp}><SectionLabel>Career</SectionLabel></motion.div>
                <motion.h2 variants={fadeUp} className="font-display italic text-heading" style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: '0.92' }}>
                  Experience.
                </motion.h2>
              </div>

              <div className="relative flex flex-col gap-0">
                {/* Timeline left line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

                {experience.map((exp, i) => (
                  <motion.div
                    key={i}
                    variants={fadeLeft}
                    className="relative pl-8 pb-12 last:pb-0"
                  >
                    {/* Dot */}
                    <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-cyan border-2 border-bg -translate-x-[3px]" />

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-heading font-bold text-heading text-lg">{exp.role}</h3>
                        <p className="font-ui text-sm text-cyan">{exp.company}</p>
                      </div>
                      <span className="font-mono text-xs text-muted bg-tag border border-border px-3 py-1 rounded-full">
                        {exp.period}
                      </span>
                    </div>
                    <p className="font-ui text-sm text-body leading-relaxed max-w-[520px]">
                      {exp.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Services ── */}
        <ServicesSection />

        {/* ── Tools ── */}
        <ToolsSection />

        <Testimonials />
        <FAQ />
        <ContactSection />
      </main>
      <Footer />
    </motion.div>
  );
}

function ServicesSection() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  return (
    <section ref={ref} className="py-24 md:py-32 border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <motion.div variants={fadeUp}><SectionLabel>What I offer</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="font-display italic text-heading" style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: '0.92' }}>
              Services.
            </motion.h2>
          </div>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-surface border border-border rounded-2xl p-7 flex flex-col gap-4 group"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{service.icon}</span>
                  <Tag>{service.category}</Tag>
                </div>
                <h3 className="font-display italic text-xl text-heading group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="font-ui text-sm text-body leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ToolsSection() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  return (
    <section ref={ref} className="py-24 md:py-32 border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <motion.div variants={fadeUp}><SectionLabel>Tech stack</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="font-display italic text-heading" style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: '0.92' }}>
              What tools<br />do I use?
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(tools).map(([category, items]) => (
              <motion.div key={category} variants={scaleIn} className="bg-surface border border-border rounded-2xl p-8">
                <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-tagText">{category}</span>
                <div className="mt-6 flex flex-col gap-4">
                  {items.map((tool) => (
                    <div key={tool.name} className="flex items-center gap-4">
                      <span className="text-2xl w-8">{tool.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-heading font-semibold text-sm text-heading">{tool.name}</p>
                        </div>
                        <p className="font-ui text-xs text-muted">{tool.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
