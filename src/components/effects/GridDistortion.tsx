import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, motion } from 'framer-motion';

export function GridDistortion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mouseX = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  );
  const mouseY = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  );

  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  /* ── Track mouse ──────────────────────────────────── */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  /* ── Canvas ripple on click ────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Ripple = { x: number; y: number; r: number; alpha: number };
    const ripples: Ripple[] = [];

    const onClick = (e: MouseEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.18 });
    };
    window.addEventListener('click', onClick);

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,229,255,${rip.alpha})`;
        ctx.lineWidth   = 1.2;
        ctx.stroke();
        rip.r     += 4;
        rip.alpha -= 0.004;
        if (rip.alpha <= 0) ripples.splice(i, 1);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* SVG dot-grid with feTurbulence displacement */}
      <div className="fixed inset-0 -z-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="grid-distort">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.0035"
                numOctaves="2"
                seed="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="5"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <pattern id="dot-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.055)" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#dot-grid)"
            filter="url(#grid-distort)"
          />
        </svg>
      </div>

      {/* Canvas ripple layer */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 pointer-events-none opacity-70"
      />

      {/* Outer diffuse glow blob */}
      <motion.div
        className="fixed pointer-events-none -z-10 rounded-full"
        style={{
          width: 440,
          height: 440,
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          background:
            'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Inner tight glow */}
      <motion.div
        className="fixed pointer-events-none -z-10 rounded-full"
        style={{
          width: 90,
          height: 90,
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 70%)',
        }}
      />
    </>
  );
}
