import { motion } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { MarqueeBanner } from '@/components/sections/MarqueeBanner';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { Services } from '@/components/sections/Services';
import { ContactSection } from '@/components/sections/ContactSection';
import { SystemLabel } from '@/components/effects/SystemLabel';
import { HighlightPoint } from '@/components/ui/HighlightPoint';
import { pageEnter } from '@/lib/motion';
import { Seo, buildPersonJsonLd, buildWebsiteJsonLd } from '@/lib/seo';

export default function Home() {
  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="page-wrapper"
    >
      <Seo
        title="Hardik Bhaskar — Interactive Web & 3D Developer"
        description="Scroll-driven 3D web experiences, AI-powered apps & full-stack products. React · Three.js · TypeScript. Available for freelance contracts."
        path="/"
        jsonLd={[buildPersonJsonLd(), buildWebsiteJsonLd()]}
      />
      <main>
        {/* ── Hero — no SystemLabel, has its own cinematic entrance ── */}
        <Hero />

        {/* ── Tech stack marquee ── */}
        <MarqueeBanner />

        {/* ── SYSTEM_01: About preview ── */}
        <SystemLabel id="SYSTEM_01" index="01" total="05">
          <HighlightPoint id="about-section">
            <AboutPreview />
          </HighlightPoint>
        </SystemLabel>

        {/* ── PROJECT_ARCHIVE: Featured work ── */}
        <SystemLabel id="PROJECT_ARCHIVE" index="02" total="05">
          <HighlightPoint id="featured-work">
            <FeaturedWork limit={4} showViewAll />
          </HighlightPoint>
        </SystemLabel>

        {/* ── SERVICES: What I Build ── */}
        <SystemLabel id="SERVICES" index="03" total="06">
          <HighlightPoint id="services">
            <Services />
          </HighlightPoint>
        </SystemLabel>

        {/* ── NEURAL_FEEDBACK: Testimonials ── */}
        <SystemLabel id="NEURAL_FEEDBACK" index="04" total="06">
          <HighlightPoint id="testimonials">
            <Testimonials />
          </HighlightPoint>
        </SystemLabel>

        {/* ── QUERY_ENGINE: FAQ ── */}
        <SystemLabel id="QUERY_ENGINE" index="05" total="06">
          <HighlightPoint id="faq">
            <FAQ />
          </HighlightPoint>
        </SystemLabel>

        {/* ── OPEN_CHANNEL: Contact ── */}
        <SystemLabel id="OPEN_CHANNEL" index="06" total="06">
          <HighlightPoint id="contact">
            <ContactSection />
          </HighlightPoint>
        </SystemLabel>
      </main>

      <Footer />
    </motion.div>
  );
}
