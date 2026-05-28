import { forwardRef } from 'react';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type Variant = 'primary' | 'ghost' | 'outline' | 'cyan';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:      Variant;
  size?:         Size;
  icon?:         ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-accent text-bg font-medium hover:bg-white/90 shadow-lg shadow-white/10',
  ghost:   'border border-border text-heading hover:border-heading/40 hover:bg-white/[0.03]',
  outline: 'border border-heading/20 text-heading hover:border-cyan hover:text-cyan',
  cyan:    'bg-cyan/10 text-cyan border border-cyan/20 hover:bg-cyan/20',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-full',
  md: 'px-6 py-3 text-sm rounded-full',
  lg: 'px-8 py-4 text-base rounded-full',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, iconPosition = 'right', className, children, ...rest }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        'inline-flex items-center gap-2 font-ui transition-all duration-200 tracking-wide',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...(rest as object)}
    >
      {icon && iconPosition === 'left'  && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </motion.button>
  )
);

Button.displayName = 'Button';
