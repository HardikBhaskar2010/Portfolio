import { NavLink } from 'react-router-dom';
import { ArrowUp, ExternalLink, Mail, Phone } from 'lucide-react';
import { scrollToTop } from '@/lib/lenis';

const links = [
  { label: 'Home',     to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About',    to: '/about' },
];

const socials = [
  { label: 'Twitter / X', href: 'https://x.com/kitsune_luna05' },
  { label: 'LinkedIn',    href: 'https://www.linkedin.com/in/luna-kitsune-8a107a3bb/' },
  { label: 'GitHub',      href: 'https://github.com/HardikBhaskar2010/' },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-0">
      {/* Top row */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-border flex-shrink-0">
                <img
                  src="/images/logo.webp"
                  alt="Hardik Bhaskar logo"
                  width={36}
                  height={36}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display italic text-2xl text-heading">
                Hardik<span className="text-cyan">.</span>
              </span>
            </div>
            <p className="font-ui text-sm text-muted max-w-[280px] leading-relaxed">
              Building cinematic web experiences, AI systems & futuristic interactive products.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-ui text-xs text-muted hover:text-heading transition-colors duration-200 link-underline whitespace-nowrap"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-2">
            <span className="font-ui text-[10px] uppercase tracking-widest text-tagText mb-2">Navigation</span>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="font-ui text-sm text-muted hover:text-heading transition-colors duration-200 link-underline w-fit"
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <span className="font-ui text-[10px] uppercase tracking-widest text-tagText mb-2">Contact</span>
            <a
              href="mailto:hardik.bhaskar2010@gmail.com"
              className="flex items-center gap-2 font-ui text-sm text-muted hover:text-heading transition-colors duration-200 truncate max-w-[240px]"
            >
              <Mail size={12} className="flex-shrink-0" />
              hardik.bhaskar2010@gmail.com
            </a>
            <a
              href="tel:+919599891970"
              className="flex items-center gap-2 font-ui text-sm text-muted hover:text-heading transition-colors duration-200"
            >
              <Phone size={12} className="flex-shrink-0" />
              +91 9599891970
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-ui text-xs text-muted">
            © 2025 Hardik Bhaskar — Luna Kitsune. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 font-ui text-xs text-muted hover:text-heading transition-colors duration-200 group"
          >
            <span>Go to top</span>
            <ArrowUp
              size={12}
              className="group-hover:-translate-y-0.5 transition-transform duration-200"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
