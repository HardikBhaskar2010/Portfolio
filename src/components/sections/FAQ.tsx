import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, ArrowRight } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { faqs } from '@/data/faqs';
import { stagger, fadeUp, scaleIn, spring } from '@/lib/motion';
import { scrollTo } from '@/lib/lenis';
import { track } from '@/lib/analytics';
import { playClick, playHoverTick } from '@/lib/audio';

export function FAQ() {
  const tabs = Object.keys(faqs);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  const handleTabChange = (tab: string) => {
    playClick();
    setActiveTab(tab);
    setOpenIndex(null);
  };

  const handleToggleAccordion = (index: number) => {
    playClick();
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
        >
          {/* Left — Label + Heading */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <motion.div variants={fadeUp}>
              <SectionLabel>Common questions</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display italic text-heading"
              style={{ fontSize: 'clamp(32px, 4.5vw, 64px)', lineHeight: '0.92' }}
            >
              Everything<br />you need<br />to know.
            </motion.h2>
            <motion.p variants={fadeUp} className="font-ui text-body text-sm leading-relaxed max-w-[340px]">
              Questions about working together, the design process, tools, and collaboration. 
              If your question isn't here, just reach out.
            </motion.p>

            {/* Direct action CTA replacing the awkward floating '?' box */}
            <motion.div variants={fadeUp} className="pt-2">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  playClick();
                  scrollTo('#contact');
                  track.ctaClick('Ask a question directly', 'faq-section');
                }}
                onMouseEnter={playHoverTick}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.09] hover:border-cyan/40 text-xs font-ui font-medium text-white/90 hover:text-white transition-all duration-200 active:scale-[0.97] group shadow-sm backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_#00E5FF] animate-pulse" />
                <span>Have a specific question? Ask directly</span>
                <ArrowRight size={13} className="text-cyan transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>

          {/* Right — Tabs + Accordion */}
          <motion.div variants={scaleIn} className="flex flex-col gap-6">
            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-full w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  onMouseEnter={playHoverTick}
                  className="relative px-4 py-2 rounded-full font-ui text-xs uppercase tracking-widest transition-colors duration-200"
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-pill"
                      className="absolute inset-0 bg-accent rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className={`relative z-10 ${activeTab === tab ? 'text-bg' : 'text-muted'}`}>
                    {tab}
                  </span>
                </button>
              ))}
            </div>

            {/* Accordion */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: spring }}
                className="flex flex-col"
              >
                {faqs[activeTab].map((item, i) => (
                  <AccordionItem
                    key={i}
                    question={item.q}
                    answer={item.a}
                    isOpen={openIndex === i}
                    onToggle={() => handleToggleAccordion(i)}
                    isLast={i === faqs[activeTab].length - 1}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}

function AccordionItem({ question, answer, isOpen, onToggle, isLast }: AccordionItemProps) {
  return (
    <div className={`border-t border-border transition-colors duration-200 ${isOpen ? 'border-cyan/30' : ''} ${isLast ? 'border-b' : ''}`}>
      <button
        onClick={onToggle}
        onMouseEnter={playHoverTick}
        className="w-full flex items-center justify-between py-5 text-left group active:scale-[0.995] transition-transform duration-100"
      >
        <span className={`font-ui text-sm leading-snug transition-colors duration-200 pr-6 ${isOpen ? 'text-heading font-medium' : 'text-body group-hover:text-heading'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: spring }}
          className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${
            isOpen
              ? 'border-cyan/40 text-cyan bg-cyan/10 shadow-[0_0_12px_rgba(0,229,255,0.15)]'
              : 'border-border text-muted group-hover:border-heading/30'
          }`}
        >
          <Plus size={12} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: spring }}
            className="overflow-hidden"
          >
            <p className="font-ui text-sm text-body leading-[1.8] pb-6">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
