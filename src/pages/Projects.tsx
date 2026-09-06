import { motion } from 'framer-motion';
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
import { ExpandedProjectCards } from '@/components/ui/ExpandedProjectCards';

export default function Projects() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

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

            {/* Expanded Cards Showcase (Scrolltide style) */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="w-full"
            >
              <ExpandedProjectCards projects={projects} />
            </motion.div>
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
