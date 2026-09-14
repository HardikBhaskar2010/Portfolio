import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTransitionWhoosh, playHoverTick } from '@/lib/audio';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$*!%&<>';
const TARGET_NAME = 'HARDIK BHASKAR';

interface IntroScreenProps {
  onComplete: () => void;
}

interface StageInfo {
  threshold: number;
  code: string;
  title: string;
  detail: string;
}

const BOOT_STAGES: StageInfo[] = [
  { threshold: 0,  code: '01', title: 'KERNEL BOOT',          detail: 'Mounting Systems Architecture v2.6' },
  { threshold: 24, code: '02', title: 'NEURAL RUNTIME',       detail: 'Initializing Autonomous Agent Network' },
  { threshold: 52, code: '03', title: 'GRAPH SCHEMAS',        detail: 'Calibrating Cognitive Decision Matrix' },
  { threshold: 76, code: '04', title: '3D SPATIAL COGNITION',  detail: 'Synthesizing WebGL Shaders & Physics' },
  { threshold: 92, code: '05', title: 'VERIFICATION MATRIX',  detail: 'Checking Acceptance & Performance' },
  { threshold: 100, code: '06', title: 'SYSTEM ONLINE',        detail: 'Hardik Bhaskar Portfolio Loaded' },
];

function scrambleText(target: string, progress: number): string {
  return target
    .split('')
    .map((char, i) => {
      if (char === ' ') return ' ';
      const revealThreshold = (i / target.length) * 0.75;
      if (progress > revealThreshold + 0.12) return char;
      if (progress > revealThreshold) {
        return LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }
      return LETTERS[Math.floor(Math.random() * LETTERS.length)];
    })
    .join('');
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [progress, setProgress]       = useState(0);
  const [displayNum, setDisplayNum]   = useState(0);
  const [nameText, setNameText]       = useState('');
  const [phase, setPhase]             = useState<'loading' | 'exiting' | 'done'>('loading');
  const [activeStage, setActiveStage] = useState<StageInfo>(BOOT_STAGES[0]);
  const hasFinishedRef                = useRef(false);

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const triggerExit = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setProgress(1);
    setDisplayNum(100);
    setNameText(TARGET_NAME);
    setActiveStage(BOOT_STAGES[BOOT_STAGES.length - 1]);

    // Play subtle whoosh exit audio
    playTransitionWhoosh();

    // Trigger Split-Open Shutter + Content Fade Out
    setPhase('exiting');
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 750);
  }, [onComplete]);

  // Keyboard shortcut listener (ESC, Enter, Space to skip instantly)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerExit]);

  // Main animation ticker
  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(triggerExit, 400);
      return () => clearTimeout(timer);
    }

    const duration = 1500; // ms to count from 0 to 100%
    const startTime = performance.now();
    let lastTickMilestone = 0;

    let rafId: number;

    const frame = (now: number) => {
      if (hasFinishedRef.current) return;

      const elapsed = now - startTime;
      const rawPct = Math.min(elapsed / duration, 1);

      // Smooth custom ease-out: 1 - (1 - t)^3.5
      const eased = 1 - Math.pow(1 - rawPct, 3.5);
      const currentNum = Math.min(Math.round(eased * 100), 100);

      setProgress(eased);
      setDisplayNum(currentNum);
      setNameText(scrambleText(TARGET_NAME, eased));

      // Audio micro-ticks at quarters
      const milestone = Math.floor(currentNum / 25) * 25;
      if (milestone > lastTickMilestone && milestone < 100) {
        lastTickMilestone = milestone;
        playHoverTick();
      }

      // Update current stage
      for (let i = BOOT_STAGES.length - 1; i >= 0; i--) {
        if (currentNum >= BOOT_STAGES[i].threshold) {
          setActiveStage(BOOT_STAGES[i]);
          break;
        }
      }

      if (rawPct < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        setNameText(TARGET_NAME);
        setTimeout(triggerExit, 250);
      }
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [prefersReducedMotion, triggerExit]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <div
          key="intro-screen-wrapper"
          className="fixed inset-0 z-[99999] pointer-events-auto overflow-hidden select-none cursor-default"
          role="progressbar"
          aria-valuenow={displayNum}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Initializing Hardik Bhaskar Portfolio"
          aria-live="polite"
        >
          {/* ── TOP HALF SHUTTER (Splits and slides UP on exit) ── */}
          <motion.div
            initial={{ y: 0 }}
            animate={{
              y: phase === 'exiting' ? (prefersReducedMotion ? 0 : '-100%') : 0,
              opacity: phase === 'exiting' && prefersReducedMotion ? 0 : 1,
            }}
            transition={{
              duration: prefersReducedMotion ? 0.25 : 0.72,
              ease: [0.77, 0, 0.175, 1],
            }}
            className="absolute top-0 left-0 right-0 h-[50vh] bg-[#05050A] border-b border-cyan/25 overflow-hidden z-10 will-change-transform"
          >
            {/* Top ambient radial glow */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none opacity-20"
              style={{
                background: 'radial-gradient(circle, rgba(0,229,255,0.2) 0%, rgba(124,58,237,0.12) 40%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
            {/* Top dot-grid */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </motion.div>

          {/* ── BOTTOM HALF SHUTTER (Splits and slides DOWN on exit) ── */}
          <motion.div
            initial={{ y: 0 }}
            animate={{
              y: phase === 'exiting' ? (prefersReducedMotion ? 0 : '100%') : 0,
              opacity: phase === 'exiting' && prefersReducedMotion ? 0 : 1,
            }}
            transition={{
              duration: prefersReducedMotion ? 0.25 : 0.72,
              ease: [0.77, 0, 0.175, 1],
            }}
            className="absolute bottom-0 left-0 right-0 h-[50vh] bg-[#05050A] border-t border-cyan/25 overflow-hidden z-10 will-change-transform"
          >
            {/* Bottom ambient radial glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none opacity-20"
              style={{
                background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(0,229,255,0.12) 40%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
            {/* Bottom dot-grid */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </motion.div>

          {/* ── CENTRAL SPLIT SEAM LASER (Glows & expands horizontally as shutters part) ── */}
          <motion.div
            initial={{ scaleX: 0.2, opacity: 0 }}
            animate={{
              scaleX: phase === 'exiting' ? 1.5 : (progress >= 0.85 ? 1 : 0.4),
              opacity: phase === 'exiting' ? [0.9, 1, 0] : (progress >= 0.8 ? 0.6 : 0),
            }}
            transition={{ duration: phase === 'exiting' ? 0.45 : 0.3, ease: 'easeOut' }}
            className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan to-transparent z-30 shadow-[0_0_15px_#00E5FF,0_0_35px_rgba(124,58,237,0.9)] pointer-events-none"
          />

          {/* ── FOREGROUND CONTENT LAYER (Fades out quickly upon split exit) ── */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: phase === 'exiting' ? 0 : 1,
              scale: phase === 'exiting' ? (prefersReducedMotion ? 1 : 0.96) : 1,
            }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 text-white pointer-events-auto"
          >
            {/* ── Top Header Bar / Telemetry HUD ── */}
            <div className="flex items-center justify-between font-mono text-[11px] text-muted tracking-wider uppercase">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
                </span>
                <span className="text-body font-semibold">SYS.BOOT // v2.6.0</span>
                <span className="hidden sm:inline text-muted/60">· ARCH: ARM64/WASM</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted/80">
                  <span>BUFFER: 100%</span>
                  <span>·</span>
                  <span>STATUS: NOMINAL</span>
                </div>
                <button
                  type="button"
                  onClick={triggerExit}
                  className="group flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-cyan/40 text-muted hover:text-cyan transition-all duration-200 text-[10px] font-mono"
                  aria-label="Skip introduction"
                >
                  <span>SKIP</span>
                  <span className="text-[9px] text-muted/60 group-hover:text-cyan/80">[ESC]</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </button>
              </div>
            </div>

            {/* ── Center Stage: Orbit Ring, Avatar & Scramble Name ── */}
            <div className="flex flex-col items-center justify-center my-auto">
              {/* Concentric Rotating Orbit Rings around Avatar */}
              <div className="relative mb-8 flex items-center justify-center">
                {/* Outer dashed spinning ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-28 h-28 md:w-32 md:h-32 rounded-full border border-cyan/20 border-dashed pointer-events-none"
                />

                {/* Inner counter-rotating ring with radar dot */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-24 h-24 md:w-28 md:h-28 rounded-full border border-violet/30 pointer-events-none"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_#00E5FF]" />
                </motion.div>

                {/* Logo badge with neon aura */}
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-cyan/40 shadow-[0_0_24px_rgba(0,229,255,0.2)] bg-surface2/80 p-0.5"
                >
                  <img
                    src="/images/logo.webp"
                    alt="Hardik Bhaskar — Systems Architect &amp; AI Systems Builder Logo"
                    title="Hardik Bhaskar"
                    width={80}
                    height={80}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </motion.div>
              </div>

              {/* Scramble Name Typography */}
              <div className="text-center mb-2">
                <h1 className="font-mono text-2xl md:text-4xl lg:text-5xl font-bold tracking-[0.2em] md:tracking-[0.25em] text-heading min-w-[280px] md:min-w-[440px] drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                  {nameText || TARGET_NAME}
                </h1>
              </div>

              {/* Professional Sub-title Badge */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex items-center gap-2 mb-10"
              >
                <div className="h-px w-6 bg-cyan/40" />
                <p className="font-ui text-[11px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.35em] text-cyan font-medium">
                  Systems Architect &amp; AI Systems Builder
                </p>
                <div className="h-px w-6 bg-violet/40" />
              </motion.div>

              {/* ── THE HERO COUNTER DISPLAY ── */}
              <div className="flex flex-col items-center w-full max-w-md px-4">
                {/* Massive Tabular Percentage Numerals */}
                <div className="flex items-baseline justify-center gap-1 mb-4">
                  <span className="font-mono text-5xl md:text-7xl font-extrabold tracking-tighter text-white tabular-nums drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                    {String(displayNum).padStart(3, '0')}
                  </span>
                  <span className="font-mono text-xl md:text-2xl font-semibold text-cyan drop-shadow-[0_0_10px_#00E5FF]">
                    %
                  </span>
                </div>

                {/* High-Tech Dual-Layer Progress Bar */}
                <div className="relative w-full h-2.5 rounded-full bg-surface2/90 border border-white/10 p-0.5 overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
                  {/* Milestone ticks */}
                  <div className="absolute inset-0 flex justify-between px-1 pointer-events-none z-10">
                    <div className="w-px h-full bg-white/10" />
                    <div className="w-px h-full bg-white/10" />
                    <div className="w-px h-full bg-white/10" />
                  </div>

                  {/* Animated Gradient Fill */}
                  <motion.div
                    className="h-full rounded-full relative"
                    style={{
                      width: `${progress * 100}%`,
                      background: 'linear-gradient(90deg, #00E5FF 0%, #7C3AED 50%, #00E5FF 100%)',
                      backgroundSize: '200% 100%',
                      boxShadow: '0 0 14px rgba(0, 229, 255, 0.7)',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '200% 0%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />

                  {/* Glowing beacon tip */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"
                    style={{
                      left: `calc(${progress * 100}% - 4px)`,
                      boxShadow: '0 0 10px 2px #00E5FF, 0 0 20px 4px rgba(124,58,237,0.8)',
                    }}
                  />
                </div>

                {/* Dynamic Status / Stage Diagnostics */}
                <div className="w-full flex items-center justify-between mt-3 font-mono text-[11px] text-body">
                  <span className="flex items-center gap-1.5 text-cyan">
                    <span className="text-muted/60">[{activeStage.code}]</span>
                    <span className="font-semibold tracking-wider">{activeStage.title}</span>
                  </span>
                  <span className="text-muted text-[10px] hidden sm:inline truncate max-w-[200px]">
                    {activeStage.detail}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Bottom HUD Footer ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/5 font-mono text-[10px] text-muted tracking-wider">
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <span className="text-body/80">LATITUDE: 28.6139° N</span>
                <span>·</span>
                <span className="text-body/80">LONGITUDE: 77.2090° E</span>
                <span className="hidden md:inline">·</span>
                <span className="hidden md:inline text-body/80">NEW DELHI, INDIA</span>
              </div>

              <div className="flex items-center gap-2 text-muted/70">
                <span>PRESS</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-cyan text-[9px]">ESC</kbd>
                <span>OR CLICK TO SKIP</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
