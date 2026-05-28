/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Carbonic palette ── */
        bg:        '#05050A',
        carbon:    '#07070D',
        carbon2:   '#0A0A12',
        carbon3:   '#0E0E18',
        surface:   '#111118',
        surface2:  '#161622',
        border:    '#1E1E2E',
        border2:   '#252535',
        muted:     '#52526A',
        body:      '#8888A8',
        heading:   '#F0F0F8',
        accent:    '#FFFFFF',
        tag:       '#12121C',
        tagText:   '#666688',

        /* ── Neon accents ── */
        cyan:      '#00E5FF',
        'cyan-dim': '#00B8CC',
        violet:    '#7C3AED',
        'violet-dim': '#5B21B6',
        rose:      '#FB7185',
        amber:     '#FBBF24',

        /* ── Glow tokens ── */
        glow:      'rgba(0,229,255,0.08)',
        'glow-v':  'rgba(124,58,237,0.08)',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        heading: ['Syne', 'sans-serif'],
        ui:      ['"Space Grotesk"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'carbon-fiber':
          'repeating-linear-gradient(45deg,rgba(255,255,255,0.012) 0px,rgba(255,255,255,0.012) 1px,transparent 1px,transparent 50%),repeating-linear-gradient(-45deg,rgba(255,255,255,0.012) 0px,rgba(255,255,255,0.012) 1px,transparent 1px,transparent 50%)',
        'iridescent':
          'linear-gradient(135deg,rgba(0,229,255,0.5),rgba(124,58,237,0.5),rgba(251,113,133,0.4))',
        'glow-radial':
          'radial-gradient(ellipse at center,rgba(0,229,255,0.08) 0%,transparent 65%)',
        'carbon-radial':
          'radial-gradient(ellipse at top,#0E0E18 0%,#05050A 60%)',
      },
      animation: {
        'marquee':       'marquee 50s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'float-slow':    'float 9s ease-in-out infinite',
        'spin-slow':     'spin 20s linear infinite',
        'pulse-slow':    'pulse 4s ease-in-out infinite',
        'shimmer':       'shimmer 2.5s linear infinite',
        'border-rotate': 'borderRotate 4s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        borderRotate: {
          '0%':   { '--angle': '0deg' },
          '100%': { '--angle': '360deg' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
        expo:   'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backdropBlur: {
        xs: '4px',
        '4xl': '60px',
      },
      boxShadow: {
        'glass':         '0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass-lg':      '0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glow-cyan':     '0 0 30px rgba(0,229,255,0.15), 0 0 80px rgba(0,229,255,0.05)',
        'glow-violet':   '0 0 30px rgba(124,58,237,0.2), 0 0 80px rgba(124,58,237,0.06)',
        'glow-cyan-sm':  '0 0 12px rgba(0,229,255,0.25)',
        'card':          '0 1px 0 rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.4)',
        'inner-light':   'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
};
