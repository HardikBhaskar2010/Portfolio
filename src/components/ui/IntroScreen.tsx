import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

function scrambleText(target: string, progress: number): string {
  return target
    .split('')
    .map((char, i) => {
      if (char === ' ') return ' ';
      const revealThreshold = (i / target.length) * 0.8;
      if (progress > revealThreshold + 0.1) return char;
      if (progress > revealThreshold) {
        return LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }
      return LETTERS[Math.floor(Math.random() * LETTERS.length)];
    })
    .join('');
}

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [progress, setProgress]     = useState(0);
  const [displayNum, setDisplayNum] = useState(0);
  const [nameText, setNameText]     = useState('');
  const [phase, setPhase]           = useState<'logo' | 'loading' | 'done'>('logo');
  const TARGET_NAME = 'HARDIK BHASKAR';

  /* Phase 1: Logo fade-in (0–600ms) */
  /* Phase 2: Loading bar + name scramble (600–2200ms) */
  /* Phase 3: Slide out */

  useEffect(() => {
    const logoTimer = setTimeout(() => setPhase('loading'), 600);
    return () => clearTimeout(logoTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;

    const duration = 1600; // ms for 0→100
    const fps      = 60;
    const steps    = (duration / 1000) * fps;
    let   frame    = 0;

    const interval = setInterval(() => {
      frame++;
      const p = Math.min(frame / steps, 1);
      // Ease-out progress
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      setDisplayNum(Math.round(eased * 100));
      setNameText(scrambleText(TARGET_NAME, eased));

      if (p >= 1) {
        clearInterval(interval);
        setNameText(TARGET_NAME); // lock in final
        setTimeout(() => setPhase('done'), 300);
        setTimeout(onComplete, 800);
      }
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[99999] bg-bg flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background glow */}
          <motion.div
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.08) 0%, transparent 70%)',
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border shadow-lg shadow-cyan/10">
              <img
                src="/images/logo.webp"
                alt="Hardik Bhaskar logo"
                width={64}
                height={64}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Name scramble */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'loading' ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
          >
            <p className="font-mono text-xl md:text-2xl text-heading tracking-[0.25em] text-center min-w-[280px]">
              {nameText || '\u00A0'}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'loading' ? 0.5 : 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="font-ui text-[10px] uppercase tracking-[0.3em] text-muted mb-16"
          >
            Full Stack Developer & AI Builder
          </motion.p>

          {/* Progress bar */}
          <div className="relative w-48 md:w-64">
            {/* Track */}
            <div className="h-px bg-border w-full" />
            {/* Fill */}
            <motion.div
              className="absolute top-0 left-0 h-px"
              style={{
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, rgba(0,229,255,0.6), rgba(124,58,237,0.8))',
                boxShadow: '0 0 8px rgba(0,229,255,0.5)',
              }}
            />
            {/* Glow dot */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-cyan"
              style={{
                left: `${progress * 100}%`,
                boxShadow: '0 0 6px 2px rgba(0,229,255,0.8)',
              }}
            />
          </div>

          {/* Counter */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'loading' ? 1 : 0 }}
            className="font-mono text-xs text-muted mt-4 tracking-widest"
          >
            {String(displayNum).padStart(3, '0')}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
