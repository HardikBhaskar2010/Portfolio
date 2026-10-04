import { useState, useEffect, useRef } from 'react';
import { DURATION, PRELOADER_DELAY } from '@/motion/tokens';
import { isOsReducedMotion, isMotionPaused } from '@/motion/motionPreference';
import '@/motion/preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

function checkPageReadiness(): boolean {
  if (typeof document === 'undefined') return true;
  const domReady = document.readyState === 'complete' || document.readyState === 'interactive';
  const fontsReady = typeof document.fonts !== 'undefined' ? document.fonts.status === 'loaded' : true;
  return domReady && fontsReady;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [digits, setDigits] = useState('00');
  const [counterVisible, setCounterVisible] = useState(true);
  const completedRef = useRef(false);

  useEffect(() => {
    // Immediate bypass for reduced motion or user paused motion
    if (isOsReducedMotion() || isMotionPaused()) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
      return;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const timers: number[] = [];

    if (isMobile) {
      // Mobile milestone ticks (00 -> 42 -> 88 -> 100)
      timers.push(
        window.setTimeout(() => setDigits('42'), PRELOADER_DELAY.mobileMilestone2),
        window.setTimeout(() => {
          checkPageReadiness();
          setDigits('88');
        }, PRELOADER_DELAY.mobileResolve),
        window.setTimeout(() => setDigits('100'), PRELOADER_DELAY.mobileHelloDraw),
        window.setTimeout(() => setCounterVisible(false), PRELOADER_DELAY.mobileHelloDraw + DURATION[120]),
        window.setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, PRELOADER_DELAY.mobileSettle)
      );
    } else {
      // Desktop milestone ticks (00 -> 18 -> 42 -> 73 -> 91 -> 100)
      timers.push(
        window.setTimeout(() => setDigits('18'), PRELOADER_DELAY.milestone2),
        window.setTimeout(() => setDigits('42'), PRELOADER_DELAY.milestone3),
        window.setTimeout(() => setDigits('73'), PRELOADER_DELAY.milestone4),
        window.setTimeout(() => {
          checkPageReadiness();
          setDigits('91');
        }, PRELOADER_DELAY.resolve),
        window.setTimeout(() => setDigits('100'), PRELOADER_DELAY.helloStart),
        window.setTimeout(() => setCounterVisible(false), PRELOADER_DELAY.helloStart + DURATION[120]),
        window.setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, PRELOADER_DELAY.settle)
      );
    }

    return () => {
      timers.forEach(t => window.clearTimeout(t));
    };
  }, [onComplete]);

  return (
    <div
      id="portfolio-preloader"
      className="preloader-overlay"
      aria-hidden="true"
      tabIndex={-1}
    >
      <div
        className="preloader-counter-wrap"
        data-visible={counterVisible ? 'true' : 'false'}
      >
        <span className="preloader-counter-digits font-mono">{digits}</span>
      </div>
    </div>
  );
}
