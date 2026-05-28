import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { faqs } from '@/data/faqs';
import { stagger, fadeUp, scaleIn, spring } from '@/lib/motion';

export function FAQ() {
  const tabs = Object.keys(faqs);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

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

            {/* Decorative element */}
            <motion.div
              variants={fadeUp}
              className="mt-4 w-16 h-16 rounded-2xl border border-border bg-surface flex items-center justify-center"
            >
              <span className="font-display italic text-2xl text-cyan">?</span>
            </motion.div>
          </div>

          {/* Right — Tabs + Accordion */}
          <motion.div variants={scaleIn} className="flex flex-col gap-6">
            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-full w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setOpenIndex(null); }}
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
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
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
    <div className={`border-t border-border ${isLast ? 'border-b' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className={`font-ui text-sm leading-snug transition-colors duration-200 pr-6 ${isOpen ? 'text-heading' : 'text-body group-hover:text-heading'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: spring }}
          className="flex-shrink-0 w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted group-hover:border-heading/30 transition-colors"
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
