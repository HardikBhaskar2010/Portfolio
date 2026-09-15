import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Zap, Brain, Layers, Sparkles } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { stagger, fadeUp, scaleIn } from '@/lib/motion';
import { scrollTo } from '@/lib/lenis';
import { track } from '@/lib/analytics';
import { playClick, playHoverTick } from '@/lib/audio';

interface Service {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  price: string;
  timeline: string;
  glassClass: string;
  accentColor: string;
  glowColor: string;
  featured?: boolean;
}

const services: Service[] = [
  {
    icon: <Zap size={20} />,
    title: 'Interactive Web Experiences',
    subtitle: 'Scroll-driven · 3D · Motion',
    description:
      'Animated landing pages, 3D product viewers, and scroll-driven storytelling that makes visitors stop and stare. Built with precision — 60fps, every device.',
    stack: ['Three.js', 'React Three Fiber', 'Framer Motion', 'GSAP'],
    price: 'From $800',
    timeline: '7–14 days',
    glassClass: 'liquid-glass-cyan',
    accentColor: '#00E5FF',
    glowColor: '#00E5FF',
    featured: true,
  },
  {
    icon: <Brain size={20} />,
    title: 'AI-Powered Web Apps',
    subtitle: 'LLMs · Agents · Dashboards',
    description:
      'Custom AI tools, chat interfaces, intelligent dashboards, and API backends. From OpenAI integration to full LangChain agent pipelines.',
    stack: ['FastAPI', 'React', 'LangChain', 'Supabase'],
    price: 'From $1,500',
    timeline: '14–21 days',
    glassClass: 'liquid-glass-violet',
    accentColor: '#C084FC',
    glowColor: '#A855F7',
  },
  {
    icon: <Layers size={20} />,
    title: 'Full-Stack SaaS Products',
    subtitle: 'Auth · DB · Deploy · Scale',
    description:
      'End-to-end product development — from auth and database design to deployment and monitoring. Built to ship fast and scale further.',
    stack: ['React', 'Next.js', 'Supabase', 'TypeScript'],
    price: 'From $3,000',
    timeline: '4–8 weeks',
    glassClass: 'liquid-glass-neutral',
    accentColor: '#F0F0F8',
    glowColor: '#FFFFFF',
  },
];

function LiquidGlassServiceCard({ service }: { service: Service }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      variants={scaleIn}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`${service.glassClass} rounded-2xl p-7 flex flex-col gap-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1.5`}
    >
      {/* ── Dynamic Liquid Refraction Spotlight ── */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, ${service.glowColor}24, transparent 65%)`,
        }}
      />

      {/* ── Luminous Top Specular Reflection Line ── */}
      <div
        className="pointer-events-none absolute top-0 left-6 right-6 h-[1.5px] rounded-full transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${service.accentColor}90 50%, transparent 100%)`,
          opacity: isHovered ? 0.95 : 0.4,
          boxShadow: `0 0 12px ${service.accentColor}60`,
        }}
      />

      {/* Featured badge */}
      {service.featured && (
        <div className="absolute top-5 right-5 z-10">
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm"
            style={{
              color: service.accentColor,
              borderColor: `${service.accentColor}50`,
              background: `linear-gradient(135deg, ${service.accentColor}20 0%, rgba(255,255,255,0.04) 100%)`,
              boxShadow: `0 0 16px ${service.accentColor}25`,
            }}
          >
            <Sparkles size={10} className="animate-pulse" style={{ color: service.accentColor }} />
            Most popular
          </span>
        </div>
      )}

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 z-10"
        style={{
          background: `linear-gradient(135deg, ${service.accentColor}22 0%, rgba(255,255,255,0.03) 100%)`,
          color: service.accentColor,
          border: `1px solid ${service.accentColor}40`,
          boxShadow: `0 8px 24px -6px ${service.accentColor}30, inset 0 1px 1px rgba(255,255,255,0.35)`,
        }}
      >
        {service.icon}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2 flex-1 z-10">
        <p
          className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: service.accentColor }}
        >
          {service.subtitle}
        </p>
        <h3 className="font-display italic text-heading text-2xl leading-tight transition-colors duration-200 group-hover:text-white">
          {service.title}
        </h3>
        <p className="font-ui text-white/75 text-sm leading-relaxed mt-1">
          {service.description}
        </p>
      </div>

      {/* Stack tags as liquid capsules */}
      <div className="flex flex-wrap gap-1.5 z-10">
        {service.stack.map((tag) => (
          <span
            key={tag}
            className="liquid-capsule font-mono text-[10.5px] px-2.5 py-1 rounded-full text-white/85"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Divider with refractive seam */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent z-10" />

      {/* Pricing + CTA */}
      <div className="flex items-center justify-between gap-4 z-10">
        <div className="flex flex-col gap-1">
          <span
            className="font-display italic text-3xl leading-none tracking-tight font-medium"
            style={{
              color: service.accentColor,
              textShadow: `0 0 24px ${service.glowColor}40`,
            }}
          >
            {service.price}
          </span>
          <span className="font-mono text-xs text-white/80 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: service.accentColor,
                boxShadow: `0 0 8px ${service.accentColor}`,
              }}
            />
            {service.timeline}
          </span>
        </div>
        <motion.button
          onClick={() => {
            playClick();
            scrollTo('#contact');
            track.ctaClick('Start a project', `services-${service.title}`);
          }}
          onMouseEnter={playHoverTick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-2 font-ui text-xs uppercase tracking-widest text-white/90 border border-white/20 bg-white/[0.06] hover:bg-white/[0.14] hover:border-white/40 hover:text-white rounded-full px-4 py-2.5 transition-[background-color,border-color,color] duration-140 ease-out shadow-sm group/btn"
        >
          <span>Start a project</span>
          <ArrowRight
            size={12}
            className="transition-transform duration-140 ease-out group-hover/btn:translate-x-0.5"
            style={{ color: service.accentColor }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}

export function Services() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col gap-16"
        >
          {/* Header */}
          <div className="flex flex-col gap-4 max-w-[600px]">
            <motion.div variants={fadeUp}>
              <SectionLabel>Services</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display italic text-heading"
              style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: '0.92' }}
            >
              What I build.
            </motion.h2>
            <motion.p variants={fadeUp} className="font-ui text-body text-base leading-relaxed">
              Three ways to work together — pick the one that fits your project.
            </motion.p>
          </div>

          {/* Service Cards */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {services.map((service) => (
              <LiquidGlassServiceCard key={service.title} service={service} />
            ))}
          </motion.div>

          {/* Bottom note */}
          <motion.p
            variants={fadeUp}
            className="font-ui text-sm text-muted text-center"
          >
            All prices in USD · Exact quotes after discovery call ·{' '}
            <span className="text-cyan">Usually available within 1 week</span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
