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
  const [greetingVisible, setGreetingVisible] = useState(false);
  const [greetingWriting, setGreetingWriting] = useState(false);
  const [greetingFading, setGreetingFading] = useState(false);
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
        window.setTimeout(() => {
          setDigits('100');
          setCounterVisible(false);
          setGreetingVisible(true);
          setGreetingWriting(true);
        }, PRELOADER_DELAY.mobileHelloDraw),
        window.setTimeout(() => {
          setGreetingFading(true);
        }, PRELOADER_DELAY.mobileHelloFade),
        window.setTimeout(() => {
          setGreetingVisible(false);
        }, PRELOADER_DELAY.mobileCenterPanel),
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
        window.setTimeout(() => {
          setDigits('100');
          setCounterVisible(false);
          setGreetingVisible(true);
          setGreetingWriting(true);
        }, PRELOADER_DELAY.helloStart),
        window.setTimeout(() => {
          setGreetingFading(true);
        }, PRELOADER_DELAY.helloFade),
        window.setTimeout(() => {
          setGreetingVisible(false);
        }, PRELOADER_DELAY.centerPanel),
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
      {/* Minimal Counter */}
      <div
        className="preloader-counter-wrap"
        data-visible={counterVisible ? 'true' : 'false'}
      >
        <span className="preloader-counter-digits font-mono">{digits}</span>
      </div>

      {/* Handwritten Greeting (Italianno Centerline Handwriting) */}
      <div
        className="preloader-greeting-wrap"
        data-visible={greetingVisible ? 'true' : 'false'}
        data-writing={greetingWriting ? 'true' : 'false'}
        data-state={greetingFading ? 'fading' : 'visible'}
      >
        <svg
          className="preloader-hello-svg"
          viewBox="0 0 120 56"
          fill="none"
          aria-label="Hello."
        >
          {/* Stroke 1: H entrance curl and left stem */}
          <path
            className="preloader-hello-stroke preloader-stroke-h1"
            pathLength="100"
            d="M 20 15 C 23 9 28 7 31 8 C 33 9 32 13 30 18 C 26 27 20 40 17 46 C 15 49 12 50 10 47 C 9 44 11 41 14 41"
          />
          {/* Stroke 2: H right stem and sweeping crossbar */}
          <path
            className="preloader-hello-stroke preloader-stroke-h2"
            pathLength="100"
            d="M 43 9 C 43 14 39 28 35 45 C 34 49 31 50 29 48 C 26 44 26 36 29 29 C 32 23 37 25 40 31 C 42 35 44 43 47 48"
          />
          {/* Stroke 3: Continuous cursive ligature 'ello' */}
          <path
            className="preloader-hello-stroke preloader-stroke-ello"
            pathLength="100"
            d="M 47 48 C 50 47 54 39 56 31 C 57 26 53 26 50 30 C 47 35 49 44 53 47 C 56 49 59 47 62 42 C 65 37 71 18 75 9 C 77 5 74 6 71 11 C 67 20 63 38 65 46 C 66 49 69 49 72 44 C 75 39 81 18 85 9 C 87 5 84 6 81 11 C 77 20 73 38 75 46 C 76 49 79 49 83 45 C 87 40 91 33 93 29 C 94 26 91 26 88 29 C 84 34 83 42 86 46 C 89 49 94 48 97 43 C 99 39 100 34 103 33"
          />
          {/* Stroke 4: Terminal period contact pen tap */}
          <path
            className="preloader-hello-dot preloader-stroke-dot"
            pathLength="100"
            d="M 108 45.5 C 108.5 46.5 109 47.5 109.5 48.5"
          />
        </svg>
      </div>
    </div>
  );
}
