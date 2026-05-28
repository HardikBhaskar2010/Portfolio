import type { Variants } from 'framer-motion';

/* ─── Easing ─────────────────────────────────────────────────── */
export const spring = [0.22, 1, 0.36, 1] as const;
export const snappy = [0.43, 0.13, 0.23, 0.96] as const;

/* ─── Core Variants ─────────────────────────────────────────── */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: spring } },
};

export const fadeDown: Variants = {
  hidden:  { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: spring } },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: spring } },
};

export const fadeRight: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: spring } },
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: spring } },
};

export const scaleInSlow: Variants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.0, ease: spring } },
};

export const clipReveal: Variants = {
  hidden:  { clipPath: 'inset(100% 0 0 0)', opacity: 1 },
  visible: { clipPath: 'inset(0% 0 0 0)', opacity: 1, transition: { duration: 0.9, ease: spring } },
};

/* ─── Stagger Containers ────────────────────────────────────── */
export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const staggerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0 } },
};

export const staggerSlow: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

/* ─── Page Transitions ──────────────────────────────────────── */
export const pageEnter: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: spring } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.3, ease: snappy } },
};

/* ─── Navbar Mobile Menu ────────────────────────────────────── */
export const mobileMenuContainer: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
};

export const mobileMenuItem: Variants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: spring } },
  exit:    { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

/* ─── Parallax Helper ───────────────────────────────────────── */
export const parallaxVariants = (offset = 60): Variants => ({
  offscreen: { y: offset },
  onscreen:  { y: 0, transition: { type: 'spring', bounce: 0.2, duration: 1.2 } },
});
