import React from 'react';

/**
 * Tunable parameters for the progressive bottom-edge blur.
 */
export const BOTTOM_BLUR_CONFIG = {
  // Height of the progressive blur boundary at viewport bottom
  height: 'clamp(120px, 18vh, 200px)',

  // 6 Progressive blur steps with overlapping gradient masks for a smooth continuous ramp
  layers: [
    { blur: 0.5, mask: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%)' },
    { blur: 1,   mask: 'linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 30%)' },
    { blur: 2,   mask: 'linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,1) 48%)' },
    { blur: 4,   mask: 'linear-gradient(to bottom, rgba(0,0,0,0) 42%, rgba(0,0,0,1) 68%)' },
    { blur: 8,   mask: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 85%)' },
    { blur: 16,  mask: 'linear-gradient(to bottom, rgba(0,0,0,0) 75%, rgba(0,0,0,1) 100%)' },
  ],

  // Atmospheric tint matching the site's deep indigo/violet ambient bottom glow
  tintGradient:
    'linear-gradient(to bottom, rgba(7, 7, 12, 0) 0%, rgba(18, 10, 36, 0.3) 45%, rgba(26, 12, 52, 0.65) 75%, rgba(14, 7, 28, 0.94) 100%)',

  // Fallback gradient for non-backdrop-filter browsers
  fallbackGradient:
    'linear-gradient(to bottom, transparent 0%, rgba(14, 7, 28, 0.5) 40%, rgba(7, 7, 12, 0.96) 100%)',
};

export function BottomBlur() {
  return (
    <div
      aria-hidden="true"
      className="fixed bottom-0 left-0 right-0 pointer-events-none select-none z-20 overflow-hidden"
      style={{
        height: BOTTOM_BLUR_CONFIG.height,
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      {/* ── Progressive Layered Backdrop Blurs ── */}
      {BOTTOM_BLUR_CONFIG.layers.map((layer, idx) => (
        <div
          key={idx}
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: `blur(${layer.blur}px)`,
            WebkitBackdropFilter: `blur(${layer.blur}px)`,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
            willChange: 'backdrop-filter',
          }}
        />
      ))}

      {/* ── Atmospheric Deep Violet Gradient Tint ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: BOTTOM_BLUR_CONFIG.tintGradient,
        }}
      />

      {/* ── Fallback for browsers without backdrop-filter support ── */}
      <style>{`
        @supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
          .bottom-blur-fallback {
            display: block !important;
          }
        }
      `}</style>
      <div
        className="bottom-blur-fallback absolute inset-0 pointer-events-none hidden"
        style={{
          background: BOTTOM_BLUR_CONFIG.fallbackGradient,
        }}
      />

      {/* ── Cylindrical Horizon Rim Arc (HUD / Telemetry Curved Edge) ── */}
      <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none overflow-visible">
        <svg
          className="w-full h-8 overflow-visible"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="cyl-horizon-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
              <stop offset="25%" stopColor="#00E5FF" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.38" />
              <stop offset="65%" stopColor="#7C3AED" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cyl-horizon-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
              <stop offset="35%" stopColor="#00E5FF" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.65" />
              <stop offset="65%" stopColor="#7C3AED" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Diffuse glow halo */}
          <path
            d="M 0,18 Q 50,3 100,18"
            fill="none"
            stroke="url(#cyl-horizon-glow)"
            strokeWidth="3.5"
            opacity="0.8"
          />
          {/* Crisp illuminated rim wire */}
          <path
            d="M 0,18 Q 50,3 100,18"
            fill="none"
            stroke="url(#cyl-horizon-line)"
            strokeWidth="1.1"
          />
        </svg>

        {/* Micro-telemetry cylindrical coordinate badge */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#07070C]/90 border border-cyan/25 backdrop-blur-md text-[9px] font-mono text-cyan/80 tracking-widest uppercase shadow-[0_0_12px_rgba(0,229,255,0.15)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan" />
          </span>
          <span>CYLINDER // R-1200</span>
        </div>
      </div>
    </div>
  );
}

export default BottomBlur;
