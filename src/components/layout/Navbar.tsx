import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.49.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);
import clsx from 'clsx';
import { mobileMenuContainer, mobileMenuItem } from '@/lib/motion';
import { scrollTo, getLenis } from '@/lib/lenis';
import { track } from '@/lib/analytics';
import { playHoverTick, playClick } from '@/lib/audio';

const navLinks = [
  { label: 'Home',     to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About',    to: '/about' },
];

/* ── Hook: real scroll position via Lenis OR window fallback ── */
function useRealScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    /* Try Lenis first (its scroll event fires with the virtual position) */
    const tryLenis = () => {
      const lenis = getLenis();
      if (lenis) {
        const handler = ({ scroll }: { scroll: number }) => setScrollY(scroll);
        lenis.on('scroll', handler);
        return () => lenis.off('scroll', handler);
      }
    };

    /* Lenis might not be ready yet — retry once mounted */
    let cleanup = tryLenis();
    if (!cleanup) {
      /* Fallback to native window scroll while waiting for Lenis */
      const native = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', native, { passive: true });
      native();

      /* Check for Lenis after 300ms (it initialises async) */
      const timer = setTimeout(() => {
        const lenisSub = tryLenis();
        if (lenisSub) {
          window.removeEventListener('scroll', native);
          cleanup = lenisSub;
        }
      }, 300);

      return () => {
        window.removeEventListener('scroll', native);
        clearTimeout(timer);
        cleanup?.();
      };
    }

    return cleanup;
  }, []);

  return scrollY;
}

export function Navbar() {
  const scrollY     = useRealScrollY();
  const [menuOpen, setMenuOpen] = useState(false);
  const location                 = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location]);

  /* ── Convergence thresholds ── */
  const COMPACT_START = 80;
  const COMPACT_FULL  = 200;
  const t = Math.max(0, Math.min(1,
    (scrollY - COMPACT_START) / (COMPACT_FULL - COMPACT_START)
  ));
  const isCompact = scrollY >= COMPACT_START;

  /* ── Responsive inset: smaller on mobile ─────────────── */
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const maxInset = isMobile ? 4 : 10;  // % side inset at full compact

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          NAVBAR  — outer nav is ALWAYS fixed via className
      ══════════════════════════════════════════════════════ */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[9000] pointer-events-none"
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {/*
          Inner pill — this is the only element that moves/shrinks.
          pointer-events-auto re-enables interaction on just this element.
        */}
        <div
          className="pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] relative"
          style={{
            margin:       `${t * 14}px ${t * maxInset}% 0`,
            borderRadius: `${t * 999}px`,
            background:   isCompact
              ? `rgba(5,5,10,${0.55 + t * 0.35})`
              : 'transparent',
            backdropFilter:       isCompact ? `blur(${18 + t * 22}px) saturate(180%)` : 'none',
            WebkitBackdropFilter: isCompact ? `blur(${18 + t * 22}px) saturate(180%)` : 'none',
            boxShadow:    isCompact
              ? `0 8px 40px rgba(0,0,0,${0.25 + t * 0.4}), 0 0 0 1px rgba(255,255,255,${0.04 + t * 0.05}), 0 0 28px rgba(0,229,255,${t * 0.08})`
              : 'none',
            borderBottom: !isCompact
              ? '1px solid rgba(255,255,255,0.04)'
              : 'none',
          }}
        >
          {/* Iridescent top highlight line */}
          <div
            className="absolute top-0 left-[12%] right-[12%] h-px pointer-events-none rounded-full transition-opacity duration-500"
            style={{
              background: 'linear-gradient(90deg,transparent,rgba(0,229,255,0.7),rgba(124,58,237,0.6),transparent)',
              opacity: t * 0.9,
            }}
          />

          {/* Row */}
          <div
            className="relative flex items-center justify-between transition-all duration-500"
            style={{
              height:  `${64 - t * 16}px`,
              padding: `0 ${isCompact ? Math.max(12, 48 - t * 40) : isMobile ? 16 : 48}px`,
            }}
          >

            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div
                className="rounded-full overflow-hidden border border-white/10 group-hover:border-cyan/40 transition-all duration-300"
                style={{ width: `${32 - t * 6}px`, height: `${32 - t * 6}px` }}
              >
                <img
                  src="/images/logo.png"
                  alt="Hardik Bhaskar logo"
                  width={32}
                  height={32}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="font-ui font-medium text-sm text-heading tracking-wide overflow-hidden whitespace-nowrap transition-all duration-500"
                style={{
                  maxWidth: `${(1 - t) * 130}px`,
                  opacity:  Math.max(0, 1 - t * 2.2),
                }}
              >
                Hardik<span className="text-cyan">.</span>
              </span>
            </NavLink>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center transition-all duration-500"
              style={{ gap: `${32 - t * 10}px` }}
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onMouseEnter={playHoverTick}
                  onClick={() => track.navClick(link.label)}
                  className={({ isActive }) =>
                    clsx(
                      'font-ui tracking-wide transition-colors duration-200 link-underline whitespace-nowrap',
                      isActive ? 'text-heading' : 'text-muted hover:text-heading',
                      isCompact ? 'text-xs' : 'text-sm'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* GitHub icon link — separate, left of Let's Talk */}
              <motion.a
                href="https://github.com/HardikBhaskar2010/"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => track.socialClick('GitHub', 'navbar')}
                className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-muted hover:text-heading hover:border-white/30 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
                aria-label="GitHub profile"
              >
                <GithubIcon size={15} />
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollTo('#contact')}
                className="hidden md:inline-flex items-center gap-1.5 font-ui uppercase tracking-widest text-bg bg-accent rounded-full hover:bg-white/90 transition-all duration-300 whitespace-nowrap"
                style={{
                  fontSize: `${11 - t}px`,
                  padding:  `${7 - t * 1.5}px ${16 - t * 4}px`,
                }}
              >
                <span
                  className="rounded-full bg-bg animate-pulse"
                  style={{ width: `${6 - t}px`, height: `${6 - t}px` }}
                />
                {t < 0.5 ? "Let's Talk" : 'Talk'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden flex items-center justify-center rounded-full border border-white/10 text-heading"
                style={{
                  width:                `${36 - t * 4}px`,
                  height:               `${36 - t * 4}px`,
                  background:           'rgba(255,255,255,0.04)',
                  backdropFilter:       'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={menuOpen ? 'x' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{    rotate: 90,  opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {menuOpen ? <X size={14} /> : <Menu size={14} />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════
          MOBILE FULL-SCREEN MENU
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[8999] flex flex-col justify-center px-8 md:hidden"
            style={{
              background:           'rgba(5,5,10,0.97)',
              backdropFilter:       'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
            }}
          >
            <div className="absolute top-1/4 -left-32 w-72 h-72 rounded-full bg-cyan/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-72 h-72 rounded-full bg-violet/5 blur-3xl pointer-events-none" />

            <motion.div
              variants={mobileMenuContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative flex flex-col gap-1"
            >
              {navLinks.map((link) => (
                <motion.div key={link.to} variants={mobileMenuItem}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      clsx(
                        'block font-display italic leading-tight tracking-tight transition-colors duration-200 hover:text-heading',
                        isActive ? 'text-heading' : 'text-muted',
                      )
                    }
                    style={{ fontSize: 'clamp(42px, 11vw, 68px)' }}
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div variants={mobileMenuItem} className="mt-8">
                <button
                  onClick={() => { scrollTo('#contact'); setMenuOpen(false); }}
                  className="inline-flex items-center gap-2 font-ui text-sm uppercase tracking-widest text-bg bg-accent px-6 py-3 rounded-full"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-bg animate-pulse" />
                  Let's Talk
                </button>
              </motion.div>

              <motion.div variants={mobileMenuItem} className="mt-8 flex gap-6">
                {[
                  { label: 'Twitter',  href: 'https://x.com/kitsune_luna05' },
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/luna-kitsune-8a107a3bb/' },
                  { label: 'GitHub',   href: 'https://github.com/HardikBhaskar2010/' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    onClick={() => track.socialClick(s.label, 'mobile-menu')}
                    className="font-ui text-xs uppercase tracking-widest text-muted hover:text-heading transition-colors link-underline"
                  >
                    {s.label}
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
