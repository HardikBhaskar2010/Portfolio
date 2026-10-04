import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowUp, Mail } from 'lucide-react';
import { scrollToTop } from '@/lib/lenis';
import { HighlightPoint } from '@/components/ui/HighlightPoint';
import { BlackHoleASCII } from '@/components/ui/BlackHoleASCII';

const links = [
  { label: 'Home',     to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About',    to: '/about' },
];

const socials = [
  { label: 'GitHub',      href: 'https://github.com/HardikBhaskar2010/' },
  { label: 'LinkedIn',    href: 'https://www.linkedin.com/in/hardik-bhaskar-8a107a3bb/' },
  { label: 'Twitter / X', href: 'https://x.com/kitsune_luna05' },
  { label: 'Instagram',   href: 'https://www.instagram.com/lunakitsune.dev/' },
  { label: 'Reddit',      href: 'https://www.reddit.com/user/According_Still9291/' },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  return (
    <HighlightPoint id="footer-singularity" color="#9DB7D5" label="SINGULARITY : ANCHOR">
      <footer
        ref={footerRef}
        className="relative overflow-hidden border-t border-border mt-0 bg-base"
      >
        {/* ── Background Interactive ASCII Black Hole Singularity Simulation ── */}
        <div className="absolute inset-0 z-0 overflow-hidden select-none bg-[#071629]">
          <BlackHoleASCII defaultMode="amber" />
        </div>

        {/* ── Top row: Original Footer Layout ── */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 py-16">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12">
            
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-border flex-shrink-0 bg-black/40">
                  <img
                    src="/images/logo.webp"
                    alt="Hardik Bhaskar: Systems Architect &amp; AI Systems Builder Logo"
                    title="Hardik Bhaskar: Systems Architect"
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-display italic text-2xl text-heading">
                  Hardik<span className="text-accent">.</span>
                </span>
              </div>
              <p className="font-ui text-sm text-slate-200 max-w-[280px] leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Building operating systems, autonomous AI, and intelligent software systems.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-ui text-xs text-slate-200 hover:text-white transition-colors duration-200 link-underline whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-2">
              <span className="font-ui text-[10px] uppercase tracking-widest text-[#9DB7D5] font-semibold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Navigation
              </span>
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className="font-ui text-sm text-slate-200 hover:text-[#9DB7D5] transition-colors duration-200 link-underline w-fit drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                >
                  {l.label}
                </NavLink>
              ))}
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-2">
              <span className="font-ui text-[10px] uppercase tracking-widest text-[#9DB7D5] font-semibold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Contact
              </span>
              <a
                href="mailto:hardik.bhaskar2010@gmail.com"
                className="flex items-center gap-2 font-ui text-sm text-slate-200 hover:text-[#9DB7D5] transition-colors duration-200 truncate max-w-[240px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              >
                <Mail size={12} className="flex-shrink-0 text-[#9DB7D5]" />
                hardik.bhaskar2010@gmail.com
              </a>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 border-t border-border/80 bg-[#071629]/70 backdrop-blur-sm">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-ui text-xs text-slate-400">
              &copy; {new Date().getFullYear()} Hardik Bhaskar. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 font-ui text-xs text-slate-300 hover:text-[#9DB7D5] transition-colors duration-200 group"
            >
              <span>Go to top</span>
              <ArrowUp
                size={12}
                className="text-[#9DB7D5] group-hover:-translate-y-0.5 transition-transform duration-200"
              />
            </button>
          </div>
        </div>
      </footer>
    </HighlightPoint>
  );
}
