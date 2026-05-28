import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, type ReactNode } from 'react';

interface SystemLabelProps {
  id: string;       // e.g. "SYSTEM_01"
  index: string;    // e.g. "01"
  total: string;    // e.g. "06"
  children: ReactNode;
  className?: string;
}

function useTypewriter(text: string, speed = 42, trigger = false) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!trigger) return;
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [trigger, text, speed]);
  return displayed;
}

export function SystemLabel({ id, index, total, children, className }: SystemLabelProps) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const label  = useTypewriter(id, 42, inView);
  const typing = label.length < id.length;

  return (
    <section ref={ref} className={`relative ${className ?? ''}`}>

      {/* ── Scanning top border — sweeps left → right on scroll in ── */}
      <motion.div
        className="absolute top-0 left-0 h-px"
        style={{ background: 'linear-gradient(90deg, rgba(0,229,255,0.6), rgba(124,58,237,0.4), transparent)' }}
        initial={{ width: '0%' }}
        animate={inView ? { width: '100%' } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      />

      {/* ── Module label row ── */}
      <motion.div
        className="flex items-center justify-between px-6 md:px-12 pt-5 pb-0"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.25 }}
      >
        {/* Left: typewriter id */}
        <span className="font-mono text-[10px] tracking-[0.28em] text-white/25 uppercase">
          {label}
          {typing && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.45, repeat: Infinity }}
              className="ml-0.5"
            >
              _
            </motion.span>
          )}
        </span>

        {/* Right: index counter */}
        <span className="font-mono text-[9px] text-white/15 tracking-widest">
          [ {index} / {total} ]
        </span>
      </motion.div>

      {/* ── Section content ── */}
      <div>{children}</div>
    </section>
  );
}
