import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { ContactSection } from '@/components/sections/ContactSection';
import { LiveContributions } from '@/components/sections/LiveContributions';
import { CredentialsVault } from '@/components/sections/CredentialsVault';
import { services, experience, tools } from '@/data/tools';
import { faqs } from '@/data/faqs';
import { pageEnter, stagger, fadeUp, fadeLeft, fadeRight, scaleIn } from '@/lib/motion';
import { Seo, buildPersonJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from '@/lib/seo';
import { HighlightPoint } from '@/components/ui/HighlightPoint';
import { getToolIcon } from '@/components/ui/ToolIcon';
import { Video, Bot, Sparkles, Box, Zap, Compass } from 'lucide-react';

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
      <Seo
        title="About Hardik Bhaskar — Systems Architect & AI Systems Builder"
        description="Systems developer and AI builder focused on robust low-level architectures, autonomous intelligence systems, and high-performance user interfaces — from bare-metal OS kernels to cinematic 3D web experiences."
        path="/about"
        jsonLd={[
          buildPersonJsonLd(),
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
          buildFaqJsonLd(faqs),
        ]}
      />
      <main className="pt-16">

        {/* ── Hero ── */}
        <HighlightPoint id="about-hero" color="#00E5FF" label="PERSONA // LUNA KITSUNE">
          <section ref={heroRef} className="py-24 md:py-32 border-b border-border">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
              <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-6 mb-16">
                <motion.div variants={fadeUp}><SectionLabel>About me</SectionLabel></motion.div>
                <motion.h1
                  variants={fadeUp}
                  className="font-display italic text-heading"
                  style={{ fontSize: 'clamp(40px, 7vw, 100px)', lineHeight: '0.9' }}
                >
                  <span className="sr-only">About Hardik Bhaskar — Systems Architect &amp; AI Systems Builder</span>
                  <span aria-hidden="true">
                    Get to know<br />me better.
                  </span>
                </motion.h1>
              </motion.div>

              {/* Who I Am — 2-col */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Portrait with parallax */}
                <motion.div variants={scaleIn} initial="hidden" animate="visible" className="relative rounded-2xl overflow-hidden">
                  <div className="aspect-[3/4] md:aspect-[4/5] parallax-container">
                    <motion.img
                      src="/images/avatar.webp"
                      alt="Hardik Bhaskar"
                      width={500}
                      height={625}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
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
                    I engineer native desktop platforms with <strong className="text-heading font-semibold">Rust</strong> and Tauri v2 (<Link to="/projects/vectoris" className="text-cyan underline underline-offset-4 hover:text-cyan/80 transition-colors">Vectoris</Link>),
                    bare-metal x86_64 operating system kernels in <strong className="text-heading font-semibold">C / C++</strong> and Assembly (<Link to="/projects/mahinaos" className="text-cyan underline underline-offset-4 hover:text-cyan/80 transition-colors">MahinaOS</Link>),
                    autonomous multi-agent decision intelligence platforms in <strong className="text-heading font-semibold">Python</strong> and Google ADK 2.0 (<Link to="/projects/aegis-decision-intelligence-platform" className="text-cyan underline underline-offset-4 hover:text-cyan/80 transition-colors">AEGIS</Link> &amp; <Link to="/projects/veronica-ai" className="text-cyan underline underline-offset-4 hover:text-cyan/80 transition-colors">Veronica AI</Link>),
                    and modern interactive applications with <strong className="text-heading font-semibold">TypeScript</strong>, React 19, and Three.js.
                  </motion.p>
                  <motion.p variants={fadeUp} className="font-ui text-body text-base leading-[1.9]">
                    Whether writing bare-metal memory managers, zero-cost abstractions in Rust, or cinematic scroll-driven
                    3D web animations, I build software where deep performance engineering meets exquisite design craft.
                  </motion.p>
                  <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                      <span className="font-ui text-sm text-cyan">Available for systems engineering and AI product contracts</span>
                    </div>
                    <a
                      href="/docs/Hardik_Bhaskar_Portfolio.pdf"
                      download
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
                    >
                      <span>Download Portfolio Dossier (PDF) ↓</span>
                    </a>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>
        </HighlightPoint>

        {/* ── Experience Timeline ── */}
        <HighlightPoint id="about-experience" color="#F59E0B" label="TIMELINE // 2024–2026">
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
        </HighlightPoint>

        {/* ── Live Contributions & Activity ── */}
        <HighlightPoint id="about-contributions" color="#00E5FF" label="UPLINK // LIVE CONTRIBUTIONS">
          <LiveContributions />
        </HighlightPoint>

        {/* ── Verified Credentials & Card Folders ── */}
        <HighlightPoint id="about-credentials" color="#10B981" label="ARCHIVES // CARD FOLDERS">
          <CredentialsVault />
        </HighlightPoint>

        {/* ── Services ── */}
        <HighlightPoint id="about-services" color="#8B5CF6" label="CAPABILITIES // ARCHITECTURE">
          <ServicesSection />
        </HighlightPoint>

        {/* ── Tools ── */}
        <HighlightPoint id="about-tools" color="#00E5FF" label="ARSENAL // REACT & NODE">
          <ToolsSection />
        </HighlightPoint>

        <HighlightPoint id="about-testimonials" color="#E11D48" label="FEEDBACK // VERIFIED">
          <Testimonials />
        </HighlightPoint>

        <HighlightPoint id="about-faq" color="#06B6D4" label="QUERY // FAQ">
          <FAQ />
        </HighlightPoint>

        <HighlightPoint id="about-contact" color="#10B981" label="UPLINK // CONNECT">
          <ContactSection />
        </HighlightPoint>
      </main>
      <Footer />
    </motion.div>
  );
}

function getServiceIcon(category: string) {
  switch (category) {
    case 'FRONTEND':
      return <Video size={22} className="text-cyan group-hover:scale-110 transition-transform duration-300" />;
    case 'AI SYSTEMS':
      return <Bot size={22} className="text-violet-400 group-hover:scale-110 transition-transform duration-300" />;
    case 'UI/UX':
      return <Sparkles size={22} className="text-emerald-400 group-hover:scale-110 transition-transform duration-300" />;
    case '3D WEB':
      return <Box size={22} className="text-cyan group-hover:scale-110 transition-transform duration-300" />;
    case 'PERFORMANCE':
      return <Zap size={22} className="text-amber-400 group-hover:scale-110 transition-transform duration-300" />;
    case 'BRANDING':
      return <Compass size={22} className="text-fuchsia-400 group-hover:scale-110 transition-transform duration-300" />;
    default:
      return <Sparkles size={22} className="text-cyan group-hover:scale-110 transition-transform duration-300" />;
  }
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
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-11 h-11 rounded-xl bg-surface/80 border border-border flex items-center justify-center shadow-sm"
                  >
                    {getServiceIcon(service.category)}
                  </motion.div>
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
                    <div key={tool.name} className="flex items-center gap-4 group/item">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 6 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center flex-shrink-0 group-hover/item:border-cyan/40 transition-colors"
                      >
                        {getToolIcon(tool.name, 20)}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-heading font-semibold text-sm text-heading group-hover/item:text-cyan transition-colors">{tool.name}</p>
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
