import { motion } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { MarqueeBanner } from '@/components/sections/MarqueeBanner';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { ContactSection } from '@/components/sections/ContactSection';
import { SystemLabel } from '@/components/effects/SystemLabel';
import { pageEnter } from '@/lib/motion';

export default function Home() {
  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="page-wrapper"
    >
      <main>
        {/* ── Hero — no SystemLabel, has its own cinematic entrance ── */}
        <Hero />

        {/* ── Tech stack marquee ── */}
        <MarqueeBanner />

        {/* ── SYSTEM_01: About preview ── */}
        <SystemLabel id="SYSTEM_01" index="01" total="05">
          <AboutPreview />
        </SystemLabel>

        {/* ── PROJECT_ARCHIVE: Featured work ── */}
        <SystemLabel id="PROJECT_ARCHIVE" index="02" total="05">
          <FeaturedWork limit={4} showViewAll />
        </SystemLabel>

        {/* ── NEURAL_FEEDBACK: Testimonials ── */}
        <SystemLabel id="NEURAL_FEEDBACK" index="03" total="05">
          <Testimonials />
        </SystemLabel>

        {/* ── QUERY_ENGINE: FAQ ── */}
        <SystemLabel id="QUERY_ENGINE" index="04" total="05">
          <FAQ />
        </SystemLabel>

        {/* ── OPEN_CHANNEL: Contact ── */}
        <SystemLabel id="OPEN_CHANNEL" index="05" total="05">
          <ContactSection />
        </SystemLabel>
      </main>

      <Footer />
    </motion.div>
  );
}
