import { motion } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { MarqueeBanner } from '@/components/sections/MarqueeBanner';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { ContactSection } from '@/components/sections/ContactSection';
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
        <Hero />
        <MarqueeBanner />
        <AboutPreview />
        <FeaturedWork limit={4} showViewAll />
        <Testimonials />
        <FAQ />
        <ContactSection />
      </main>
      <Footer />
    </motion.div>
  );
}
