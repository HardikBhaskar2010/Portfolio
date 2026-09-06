import { useRef, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowUp, Mail, Phone, Sparkles } from 'lucide-react';
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
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    // Check user data saving & motion preferences
    const connection = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    const isSaveData = connection?.saveData === true;
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Target ultra-slow cosmic rotation speed (0.15x for grand cosmic drift)
    const targetRate = isReduced ? 0.08 : 0.15;

    const setSpeed = () => {
      if (videoRef.current) {
        videoRef.current.playbackRate = targetRate;
      }
    };

    // Performance Optimization 1: Lazy load video element ONLY when footer approaches viewport
    // Saves 7.3MB initial bandwidth on page load for faster LCP & zero initial network contention
    const footerEl = footerRef.current;
    if (!footerEl) return;

    let isIntersecting = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;

        if (entry.isIntersecting) {
          if (!isSaveData) {
            setShouldLoadVideo(true);
          }
          if (videoRef.current) {
            setSpeed();
            videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
          }
        } else {
          // Performance Optimization 2: 0% GPU/CPU decode when offscreen
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            setIsVideoPlaying(false);
          }
        }
      },
      { rootMargin: '350px 0px', threshold: 0.01 }
    );

    observer.observe(footerEl);

    // Performance Optimization 3: Pause video when browser tab is hidden/backgrounded
    const handleVisibilityChange = () => {
      if (!videoRef.current) return;
      if (document.hidden) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else if (isIntersecting) {
        setSpeed();
        videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Ensure playback rate stays locked to slow-motion (0.15x) on loops and resumes
  const handlePlaybackSetup = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    e.currentTarget.playbackRate = isReduced ? 0.08 : 0.15;
  };

  return (
    <HighlightPoint id="footer-singularity" color="#FF7700" label="SINGULARITY // ANCHOR">
      <footer
        ref={footerRef}
        className="relative overflow-hidden border-t border-white/10 mt-0 bg-[#05050A]"
      >
        {/* ── Background ASCII Black Hole Cinematic Loop (Hardware Composited) ── */}
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none"
          style={{ willChange: 'transform', transform: 'translateZ(0)', contain: 'paint' }}
        >
          {shouldLoadVideo ? (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              disablePictureInPicture
              disableRemotePlayback
              onLoadedMetadata={handlePlaybackSetup}
              onPlay={handlePlaybackSetup}
              onTimeUpdate={(e) => {
                // Safeguard against browser resetting playbackRate on loop
                if (e.currentTarget.playbackRate > 0.2) {
                  handlePlaybackSetup(e);
                }
              }}
              className={`h-full w-full object-cover object-center mix-blend-screen filter contrast-125 saturate-125 transition-opacity duration-1000 ${
                isVideoPlaying ? 'opacity-35' : 'opacity-0'
              }`}
            >
              <source src="/videos/blackhole-ascii.mp4" type="video/mp4" />
            </video>
          ) : (
            // Lightweight cosmic ambient aura before video streams in (0 KB network overhead)
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,140,0,0.08)_0%,_rgba(0,229,255,0.03)_40%,_transparent_75%)]" />
          )}

          {/* Contrast scrim & edge fades to keep typography 100% visible and merge smoothly into space */}
          <div className="absolute inset-0 bg-[#05050A]/35 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#05050A] via-[#05050A]/70 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#05050A] via-[#05050A]/70 to-transparent pointer-events-none" />
        </div>

        {/* ── Top row: Content Grid with High-Contrast Glassmorphic Shield Cards ── */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ── Col 1: Brand & Bio (5 cols) ── */}
            <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-5 p-6 md:p-7 rounded-2xl bg-[#07070C]/90 backdrop-blur-xl border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.85)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 flex-shrink-0 bg-black/40">
                  <img
                    src="/images/logo.webp"
                    alt="Hardik Bhaskar logo"
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-display italic text-2xl lg:text-3xl text-white font-semibold tracking-tight">
                  Hardik<span className="text-[#00E5FF]">.</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full ml-auto">
                  <Sparkles size={11} className="text-amber-300 animate-spin-slow" />
                  <span>ASCII SINGULARITY</span>
                </span>
              </div>

              <p className="font-ui text-sm text-slate-100 leading-relaxed font-normal">
                Building cinematic web experiences, AI systems & futuristic interactive products. Focused on deep performance engineering and high-craft design.
              </p>

              <div className="flex items-center gap-2.5 flex-wrap pt-2 border-t border-white/10">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-ui text-xs text-slate-200 hover:text-white bg-white/[0.08] hover:bg-[#00E5FF]/20 border border-white/15 hover:border-[#00E5FF]/50 px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap font-medium"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Col 2: Navigation (3 cols) ── */}
            <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-3.5 p-6 md:p-7 rounded-2xl bg-[#07070C]/90 backdrop-blur-xl border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.85)]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#00E5FF] font-semibold flex items-center gap-2">
                Navigation
              </span>
              <div className="flex flex-col gap-2 pt-1">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className="font-ui text-sm font-medium text-slate-200 hover:text-[#00E5FF] transition-colors duration-200 py-0.5 w-fit hover:translate-x-1 transition-transform"
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* ── Col 3: Direct Uplink / Contact (4 cols) ── */}
            <div className="md:col-span-3 lg:col-span-4 flex flex-col gap-3.5 p-6 md:p-7 rounded-2xl bg-[#07070C]/90 backdrop-blur-xl border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.85)]">
              <span className="font-mono text-xs uppercase tracking-widest text-[#00E5FF] font-semibold flex items-center gap-2">
                Direct Contact
              </span>
              <div className="flex flex-col gap-2.5 pt-1">
                <a
                  href="mailto:hardik.bhaskar2010@gmail.com"
                  className="flex items-center gap-2.5 font-ui text-sm font-medium text-slate-200 hover:text-[#00E5FF] transition-colors duration-200 truncate"
                >
                  <Mail size={15} className="flex-shrink-0 text-[#00E5FF]" />
                  <span className="truncate">hardik.bhaskar2010@gmail.com</span>
                </a>
                <a
                  href="tel:+919599891970"
                  className="flex items-center gap-2.5 font-ui text-sm font-medium text-slate-200 hover:text-[#00E5FF] transition-colors duration-200"
                >
                  <Phone size={15} className="flex-shrink-0 text-[#00E5FF]" />
                  <span>+91 9599891970</span>
                </a>
              </div>
              <div className="mt-2 pt-3 border-t border-white/10 flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="font-mono text-[11px] text-emerald-300 tracking-wider font-medium">
                  Available for contracts
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="relative z-10 border-t border-white/10 bg-[#05050A]/90 backdrop-blur-md">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-ui text-xs text-slate-300 font-medium tracking-wide">
              © 2025 Hardik Bhaskar — Luna Kitsune. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 font-ui text-xs text-slate-200 hover:text-[#00E5FF] font-medium transition-colors duration-200 group"
            >
              <span>Back to top</span>
              <ArrowUp
                size={13}
                className="text-[#00E5FF] group-hover:-translate-y-0.5 transition-transform duration-200"
              />
            </button>
          </div>
        </div>
      </footer>
    </HighlightPoint>
  );
}
