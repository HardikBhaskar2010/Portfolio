import type { ReactNode } from 'react';
import clsx from 'clsx';

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-block text-[10px] font-ui uppercase tracking-[0.15em] text-tagText bg-tag',
        'px-2.5 py-1 rounded-full border border-border',
        className
      )}
    >
      {children}
    </span>
  );
}
