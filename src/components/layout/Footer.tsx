import { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowUp, Mail, Phone } from 'lucide-react';
import { scrollToTop } from '@/lib/lenis';
import { HighlightPoint } from '@/components/ui/HighlightPoint';

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
  const footerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetRate = isReduced ? 0.08 : 0.15;

    const setSpeed = () => {
      if (videoRef.current) {
        videoRef.current.playbackRate = targetRate;
      }
    };

    setSpeed();

    const footerEl = footerRef.current;
    if (!footerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting) {
          setSpeed();
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );

    observer.observe(footerEl);

    const handleVisibilityChange = () => {
      if (!videoRef.current) return;
      if (document.hidden) {
        videoRef.current.pause();
      } else {
        setSpeed();
        videoRef.current.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handlePlaybackSetup = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    e.currentTarget.playbackRate = isReduced ? 0.08 : 0.15;
  };

  return (
    <HighlightPoint id="footer-singularity" color="#FF7700" label="SINGULARITY // ANCHOR">
      <footer
        ref={footerRef}
        className="relative overflow-hidden border-t border-border mt-0 bg-[#05050A]"
      >
        {/* ── Background ASCII Black Hole Cinematic Video Loop ── */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handlePlaybackSetup}
            onPlay={handlePlaybackSetup}
            onTimeUpdate={(e) => {
              if (e.currentTarget.playbackRate > 0.2) {
                handlePlaybackSetup(e);
              }
            }}
            className="w-full h-full object-cover object-center opacity-70 md:opacity-80 filter contrast-125 saturate-125 transition-opacity duration-700"
          >
            <source src="/videos/blackhole-ascii.mp4" type="video/mp4" />
          </video>

          {/* Edge fades and readability scrim keeping text ultra-crisp while showcasing ASCII animation */}
          <div className="absolute inset-0 bg-[#05050A]/40 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#05050A] via-[#05050A]/70 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#05050A] via-[#05050A]/70 to-transparent pointer-events-none" />
        </div>

        {/* ── Top row: Original Footer Layout ── */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 py-16">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
            
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-border flex-shrink-0 bg-black/40">
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
              <p className="font-ui text-sm text-slate-200 max-w-[280px] leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Building cinematic web experiences, AI systems &amp; futuristic interactive products.
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
              <span className="font-ui text-[10px] uppercase tracking-widest text-[#00E5FF] font-semibold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Navigation
              </span>
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className="font-ui text-sm text-slate-200 hover:text-[#00E5FF] transition-colors duration-200 link-underline w-fit drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                >
                  {l.label}
                </NavLink>
              ))}
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-2">
              <span className="font-ui text-[10px] uppercase tracking-widest text-[#00E5FF] font-semibold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Contact
              </span>
              <a
                href="mailto:hardik.bhaskar2010@gmail.com"
                className="flex items-center gap-2 font-ui text-sm text-slate-200 hover:text-[#00E5FF] transition-colors duration-200 truncate max-w-[240px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              >
                <Mail size={12} className="flex-shrink-0 text-[#00E5FF]" />
                hardik.bhaskar2010@gmail.com
              </a>
              <a
                href="tel:+919599891970"
                className="flex items-center gap-2 font-ui text-sm text-slate-200 hover:text-[#00E5FF] transition-colors duration-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              >
                <Phone size={12} className="flex-shrink-0 text-[#00E5FF]" />
                +91 9599891970
              </a>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 border-t border-border/80 bg-[#05050A]/70 backdrop-blur-sm">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-ui text-xs text-slate-400">
              &copy; 2025 Hardik Bhaskar &mdash; Luna Kitsune. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 font-ui text-xs text-slate-300 hover:text-[#00E5FF] transition-colors duration-200 group"
            >
              <span>Go to top</span>
              <ArrowUp
                size={12}
                className="text-[#00E5FF] group-hover:-translate-y-0.5 transition-transform duration-200"
              />
            </button>
          </div>
        </div>
      </footer>
    </HighlightPoint>
  );
}
