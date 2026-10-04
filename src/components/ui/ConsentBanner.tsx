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
          className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[8500] p-4 bg-surface/95 backdrop-blur-xl border border-borderStrong rounded-2xl shadow-2xl text-primary font-sans"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-elevated border border-borderSubtle text-accent flex-shrink-0 mt-0.5">
              <ShieldCheck size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-accent uppercase tracking-wider font-semibold">
                  Privacy Consent
                </span>
                <button
                  onClick={handleDecline}
                  className="text-muted hover:text-primary transition-colors duration-150 p-0.5 rounded active:scale-[0.92]"
                  aria-label="Dismiss and decline analytics"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-xs text-muted mt-1 leading-relaxed">
                Anonymous session telemetry helps optimize 3D WebGL shaders and interface responsiveness.
              </p>

              <div className="flex items-center gap-2 mt-3.5">
                <button
                  onClick={handleAccept}
                  onMouseEnter={playHoverTick}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-buttonPrimaryBg text-buttonPrimaryText font-semibold text-xs hover:brightness-105 active:scale-[0.97] transition-[transform,filter] duration-140 ease-out shadow-sm"
                >
                  Accept
                </button>
                <button
                  onClick={handleDecline}
                  onMouseEnter={playHoverTick}
                  className="px-3 py-1.5 rounded-lg bg-elevated hover:bg-surface text-secondary text-xs font-medium border border-borderStrong active:scale-[0.97] transition-[transform,background-color] duration-140 ease-out"
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
