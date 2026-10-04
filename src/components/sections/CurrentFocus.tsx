import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const items = [
  { text: 'KAGE Browser (Rust / CEF)', tag: 'BUILDING' },
  { text: 'Vectoris Desktop (Rust)',   tag: 'BUILDING' },
  { text: 'Veronica AI Multi-Agent',   tag: 'LIVE' },
  { text: 'MahinaOS Kernel (C++)',     tag: 'RESEARCH' },
];

const TAG_STYLES: Record<string, string> = {
  LIVE:     'border-[var(--status-available)]/50 text-[var(--status-available)]',
  BUILDING: 'border-[var(--accent)]/50 text-[var(--accent)]',
  RESEARCH: 'border-[var(--border-strong)] text-[var(--text-muted)]',
};

export function CurrentFocus() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVisible(i);
      if (i >= items.length) clearInterval(id);
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative inline-block w-full max-w-[370px]">
      {/* Pulsing border glow */}
      <motion.div
        className="absolute -inset-px rounded-xl pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 0px rgba(157,183,213,0)',
            '0 0 18px rgba(157,183,213,0.12)',
            '0 0 0px rgba(157,183,213,0)',
          ],
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div
        className="relative bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-5 py-4 font-mono text-sm min-w-[290px]"
        style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        {/* Header row */}
        <div className="flex items-center gap-2.5 mb-4">
          <motion.span
            className="inline-block w-2 h-2 rounded-full bg-[var(--status-available)] flex-shrink-0"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
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
                <span className="text-[var(--accent)] flex-shrink-0">→</span>
                <span className="text-[var(--text-primary)] flex-1 text-[13px]">{item.text}</span>
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
              <span className="text-[var(--text-muted)]">→</span>
              <span className="w-14 h-px bg-[var(--border-strong)]" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
