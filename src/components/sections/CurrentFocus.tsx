import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const items = [
  { text: 'Veronica AI System',      tag: 'LIVE'     },
  { text: 'Portfolio v2.0',          tag: 'BUILDING' },
  { text: 'Three.js Experiments',    tag: 'RESEARCH' },
];

const TAG_STYLES: Record<string, string> = {
  LIVE:     'border-green-500/40 text-green-400/80',
  BUILDING: 'border-cyan/40 text-cyan/80',
  RESEARCH: 'border-white/15 text-white/35',
};

export function CurrentFocus() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVisible(i);
      if (i >= items.length) clearInterval(id);
    }, 480);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Pulsing border glow */}
      <motion.div
        className="absolute -inset-px rounded-xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 0px rgba(0,229,255,0)',
            '0 0 18px rgba(0,229,255,0.12)',
            '0 0 0px rgba(0,229,255,0)',
          ],
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        className="relative bg-surface border border-border rounded-xl px-5 py-4 font-mono text-sm min-w-[290px]"
        style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        {/* Header row */}
        <div className="flex items-center gap-2.5 mb-4">
          <motion.span
            className="inline-block w-2 h-2 rounded-full bg-green-400 flex-shrink-0"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/30">
            Currently Building
          </span>
        </div>

        {/* Items with staggered reveal */}
        <div className="flex flex-col gap-2.5">
          <AnimatePresence>
            {items.slice(0, visible).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-cyan/50 flex-shrink-0">→</span>
                <span className="text-white/75 flex-1 text-[13px]">{item.text}</span>
                <span
                  className={`text-[9px] tracking-widest px-2 py-0.5 rounded-full border flex-shrink-0 ${TAG_STYLES[item.tag] ?? TAG_STYLES.RESEARCH}`}
                >
                  {item.tag}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Blinking cursor line while still loading */}
          {visible < items.length && (
            <motion.div
              className="flex items-center gap-2"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.55, repeat: Infinity }}
            >
              <span className="text-white/20">→</span>
              <span className="w-14 h-px bg-white/15" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
