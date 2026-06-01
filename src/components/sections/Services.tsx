import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Zap, Brain, Layers } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { stagger, fadeUp, scaleIn } from '@/lib/motion';
import { scrollTo } from '@/lib/lenis';
import { track } from '@/lib/analytics';

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
    glassClass: 'glass-cyan',
    accentColor: '#00E5FF',
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
    glassClass: 'glass-violet',
    accentColor: '#7C3AED',
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
    glassClass: 'glass-medium',
    accentColor: '#F0F0F8',
  },
];

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
              <motion.div
                key={service.title}
                variants={scaleIn}
                className={`${service.glassClass} rounded-2xl p-7 flex flex-col gap-6 relative overflow-hidden group transition-transform duration-300 hover:-translate-y-1`}
              >
                {/* Featured badge */}
                {service.featured && (
                  <div className="absolute top-5 right-5">
                    <span
                      className="font-ui text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border"
                      style={{ color: service.accentColor, borderColor: `${service.accentColor}40`, background: `${service.accentColor}10` }}
                    >
                      Most popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${service.accentColor}15`, color: service.accentColor, border: `1px solid ${service.accentColor}30` }}
                >
                  {service.icon}
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2 flex-1">
                  <p
                    className="font-ui text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: service.accentColor }}
                  >
                    {service.subtitle}
                  </p>
                  <h3 className="font-display italic text-heading text-xl leading-tight">
                    {service.title}
                  </h3>
                  <p className="font-ui text-body text-sm leading-relaxed mt-1">
                    {service.description}
                  </p>
                </div>

                {/* Stack tags */}
                <div className="flex flex-wrap gap-1.5">
                  {service.stack.map(tag => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-border text-tagText bg-tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Pricing + CTA */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="font-display italic text-2xl leading-none"
                      style={{ color: service.accentColor }}
                    >
                      {service.price}
                    </span>
                    <span className="font-ui text-[10px] text-muted uppercase tracking-widest">
                      {service.timeline}
                    </span>
                  </div>
                  <motion.button
                    onClick={() => { scrollTo('#contact'); track.ctaClick('Start a project', `services-${service.title}`); }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 font-ui text-xs uppercase tracking-widest text-heading border border-border rounded-full px-4 py-2 hover:border-heading/40 transition-colors"
                  >
                    Start a project
                    <ArrowRight size={11} />
                  </motion.button>
                </div>
              </motion.div>
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
