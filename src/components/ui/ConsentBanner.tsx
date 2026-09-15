import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';
import { consentManager } from '@/lib/analytics';
import { playClick, playHoverTick } from '@/lib/audio';

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check initial consent status on client mount
    if (consentManager.getStatus() === 'unset') {
      // Delay display slightly to avoid interrupting initial intro / visual sequence
      const timer = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Keyboard accessibility: Escape dismisses banner
  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playClick();
        consentManager.setConsent(false);
        setVisible(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  const handleAccept = () => {
    playClick();
    consentManager.setConsent(true);
    setVisible(false);
  };

  const handleDecline = () => {
    playClick();
    consentManager.setConsent(false);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="region"
          aria-label="Analytics and privacy consent"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.96 }}
          transition={{
            type: 'spring',
            duration: 0.35,
            bounce: 0,
          }}
          className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[8500] p-4 bg-[#0a0a14]/95 backdrop-blur-xl border border-white/15 border-t-cyan/40 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.85),0_0_24px_rgba(0,229,255,0.06)] text-white font-ui"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan/10 border border-cyan/20 text-cyan flex-shrink-0 mt-0.5 shadow-[0_0_12px_rgba(0,229,255,0.12)]">
              <ShieldCheck size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-cyan uppercase tracking-wider font-semibold">
                  Privacy // Telemetry
                </span>
                <button
                  onClick={handleDecline}
                  className="text-white/40 hover:text-white transition-colors duration-150 p-0.5 rounded active:scale-[0.92]"
                  aria-label="Dismiss and decline analytics"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                Anonymous session telemetry helps optimize 3D WebGL shaders and interface responsiveness.
              </p>

              <div className="flex items-center gap-2 mt-3.5">
                <button
                  onClick={handleAccept}
                  onMouseEnter={playHoverTick}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-cyan text-black font-semibold text-xs hover:brightness-110 active:scale-[0.97] transition-[transform,filter] duration-140 ease-out shadow-sm"
                >
                  Accept
                </button>
                <button
                  onClick={handleDecline}
                  onMouseEnter={playHoverTick}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium border border-white/10 active:scale-[0.97] transition-[transform,background-color] duration-140 ease-out"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
