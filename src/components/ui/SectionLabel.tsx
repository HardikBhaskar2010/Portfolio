import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SectionLabelProps {
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

export function SectionLabel({ children, dot = true, className }: SectionLabelProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        'inline-flex items-center gap-2 font-ui text-[10px] uppercase tracking-[0.2em] text-tagText',
        'bg-tag px-3 py-1.5 rounded-full border border-border',
        className
      )}
    >
      {dot && (
        <span className="w-1 h-1 rounded-full bg-cyan animate-pulse" />
      )}
      {children}
    </motion.span>
  );
}
