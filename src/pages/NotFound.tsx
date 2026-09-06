import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { pageEnter } from '@/lib/motion';
import { Seo } from '@/lib/seo';

export default function NotFound() {
  return (
    <motion.div variants={pageEnter} initial="hidden" animate="visible" exit="exit" className="page-wrapper min-h-screen flex flex-col">
      <Seo
        title="404 — Page Not Found — Hardik Bhaskar"
        description="This page doesn't exist. Head back to Hardik Bhaskar's portfolio."
        path="/404"
        noindex
      />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-6 px-6">
          {/* Large 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-display italic text-heading leading-none select-none"
              style={{ fontSize: 'clamp(120px, 20vw, 240px)' }}
            >
              <span className="text-gradient-cyan">4</span>
              0
              <span className="text-gradient-cyan">4</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="font-heading font-bold text-heading text-2xl">Page not found</h1>
            <p className="font-ui text-body text-sm max-w-[320px] leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 font-ui text-sm text-bg bg-accent px-6 py-3 rounded-full mt-2"
              >
                <ArrowLeft size={14} />
                Back to home
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}
