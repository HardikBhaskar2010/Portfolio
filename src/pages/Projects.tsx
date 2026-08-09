import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Footer } from '@/components/layout/Footer';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { ContactSection } from '@/components/sections/ContactSection';
import { projects } from '@/data/projects';
import { pageEnter, stagger, fadeUp, scaleIn } from '@/lib/motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Projects() {
  const featuredRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  const { scrollYProgress } = useScroll({
    target: featuredRef,
    offset: ['start end', 'end start'],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const featured = projects.length > 0 ? projects[0] : null;

  return (
    <motion.div variants={pageEnter} initial="hidden" animate="visible" exit="exit" className="page-wrapper">
      <main className="pt-16">
        {/* ── Hero Header ── */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6 mb-16"
            >
              <motion.div variants={fadeUp}>
                <SectionLabel>Portfolio</SectionLabel>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="font-display italic text-heading"
                style={{ fontSize: 'clamp(40px, 7vw, 100px)', lineHeight: '0.9' }}
              >
                Some of my<br />best projects.
              </motion.h1>
              <motion.p variants={fadeUp} className="font-ui text-body text-base max-w-[460px] leading-relaxed">
                A curated selection of web experiences, AI systems, and interactive products built over the last 3 years.
              </motion.p>
            </motion.div>

            {/* Featured Project — Full Width */}
            {featured && (
              <motion.div
                ref={featuredRef}
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                className="relative rounded-2xl overflow-hidden border border-border bg-surface group cursor-pointer"
              >
                <Link to={`/projects/${featured.slug}`}>
                  {/* Tag */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="font-ui text-[10px] uppercase tracking-widest text-bg bg-cyan px-3 py-1.5 rounded-full">
                      Latest project
                    </span>
                  </div>

                  {/* Hero Image with parallax */}
                  <div className="aspect-[16/7] overflow-hidden parallax-container">
                    <motion.img
                      src={featured.image}
                      alt={featured.title}
                      style={{ y: heroImageY, scale: 1.08 }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                  </div>

                  {/* Footer info */}
                  <div className="p-8 flex items-end justify-between">
                    <div className="flex flex-col gap-2">
                      <Tag>{featured.category}</Tag>
                      <h2 className="font-display italic text-heading text-3xl md:text-5xl">{featured.title}</h2>
                      <p className="font-ui text-body text-sm max-w-[400px]">{featured.description}</p>
                    </div>
                    <div className="hidden md:flex w-12 h-12 rounded-full border border-border items-center justify-center text-heading group-hover:bg-accent group-hover:border-accent group-hover:text-bg transition-all duration-300">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* All Projects Grid */}
        <section ref={ref} className="pb-24 border-t border-border">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-16">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="mb-12"
            >
              <motion.div variants={fadeUp}>
                <SectionLabel>All work</SectionLabel>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-display italic text-heading mt-4"
                style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: '0.92' }}
              >
                Every project.
              </motion.h2>
            </motion.div>
          </div>
          <FeaturedWork limit={6} showViewAll={false} />
        </section>

        <ContactSection />
      </main>
      <Footer />
    </motion.div>
  );
}
