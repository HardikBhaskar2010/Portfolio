import { motion } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { MarqueeBanner } from '@/components/sections/MarqueeBanner';
import { ScrollFlow } from '@/components/sections/ScrollFlow';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { ContactSection } from '@/components/sections/ContactSection';
import { HighlightPoint } from '@/components/ui/HighlightPoint';
import { pageEnter } from '@/lib/motion';
import { Seo, buildPersonJsonLd, buildWebsiteJsonLd, buildFaqJsonLd } from '@/lib/seo';
import { faqs } from '@/data/faqs';

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
        title="Hardik Bhaskar | Systems Architect & AI Systems Builder"
        description="Official portfolio of Hardik Bhaskar: Systems Architect & AI Systems Builder focused on operating systems, autonomous AI, intelligent software systems, and engineering."
        path="/"
        jsonLd={[buildPersonJsonLd(), buildWebsiteJsonLd(), buildFaqJsonLd(faqs)]}
      />
      <main>
        {/* ── Hero: Opening reveal with LCP priority ── */}
        <HighlightPoint id="core-origin" color="#9DB7D5" label="CORE // ORIGIN">
          <Hero />
        </HighlightPoint>

        {/* ── Tech stack marquee ── */}
        <MarqueeBanner />

        {/* ── Systems Architecture Scroll Flow (Chapters 1 to 3 sticky stack) ── */}
        <ScrollFlow />

        {/* ── Appendix: Testimonials & FAQ ── */}
        <HighlightPoint id="testimonials" color="#8B5CF6" label="FEEDBACK // VERIFIED">
          <Testimonials />
        </HighlightPoint>

        <HighlightPoint id="faq" color="#06B6D4" label="QUERY // KNOWLEDGE">
          <FAQ />
        </HighlightPoint>

        {/* ── Contact Channel ── */}
        <HighlightPoint id="contact" color="#10B981" label="UPLINK // TRANSMIT">
          <ContactSection />
        </HighlightPoint>
      </main>

      <Footer />
    </motion.div>
  );
}
