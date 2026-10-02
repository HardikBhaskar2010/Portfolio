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
    </div>
  );
}

export default BottomBlur;
