/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs:  '480px',
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        /* ── Frost Navy Token Architecture (WCAG AA & AAA compliant) ── */
        'bg-base':        'var(--bg-base)',        // #071629
        'bg-surface':     'var(--bg-surface)',     // #0D203B
        'bg-elevated':    'var(--bg-elevated)',    // #112A4A
        blue:             'var(--blue)',           // #17345C

        'text-strong':    'var(--text-strong)',    // #FFFFFF
        'text-primary':   'var(--text-primary)',   // #EAF4FF
        'text-secondary': 'var(--text-secondary)', // #9DB7D5
        'text-muted':     'var(--text-muted)',     // #7C94AF

        'border-subtle':  'var(--border-subtle)',  // #17345C (decorative only)
        'border-strong':  'var(--border-strong)',  // #60758E (outline controls, >= 3:1)

        accent:           'var(--accent)',         // #9DB7D5
        'accent-hover':   'var(--accent-hover)',   // #EAF4FF
        'focus-ring':     'var(--focus-ring)',     // #9DB7D5

        'button-primary-bg':   'var(--button-primary-bg)',   // #FFFFFF
        'button-primary-text': 'var(--button-primary-text)', // #071629

        'status-available': 'var(--status-available)', // #6EE7B7

        /* ── Backward-compatible Aliases mapped to Frost Navy tokens ── */
        bg:          'var(--bg-base)',
        carbon:      'var(--bg-surface)',
        carbon2:     'var(--bg-elevated)',
        carbon3:     'var(--bg-elevated)',
        surface:     'var(--bg-surface)',
        surface2:    'var(--bg-elevated)',
        border:      'var(--border-subtle)',
        border2:     'var(--border-strong)',
        muted:       'var(--text-muted)',
        body:        'var(--text-secondary)',
        heading:     'var(--text-strong)',
        tag:         'var(--bg-surface)',
        tagText:     'var(--text-secondary)',

        /* Retired color aliases mapped safely to Frost Navy tokens */
        cyan:        'var(--accent)',
        'cyan-dim':  'var(--border-strong)',
        violet:      'var(--blue)',
        'violet-dim':'var(--blue)',
        rose:        'var(--accent)',
        amber:       'var(--accent)',

        /* Glow tokens */
        glow:        'rgba(157,183,213,0.08)',
        'glow-v':    'rgba(23,52,92,0.18)',
      },
      fontFamily: {
        sans:    ['Geist', 'system-ui', 'sans-serif'],
        display: ['Geist', 'system-ui', 'sans-serif'],
        heading: ['Geist', 'system-ui', 'sans-serif'],
        ui:      ['Geist', 'system-ui', 'sans-serif'],
        mono:    ['"Geist Mono"', 'monospace'],
      },
      backgroundImage: {
        'carbon-fiber':
          'repeating-linear-gradient(45deg,rgba(255,255,255,0.008) 0px,rgba(255,255,255,0.008) 1px,transparent 1px,transparent 50%),repeating-linear-gradient(-45deg,rgba(255,255,255,0.008) 0px,rgba(255,255,255,0.008) 1px,transparent 1px,transparent 50%)',
        'iridescent':
          'linear-gradient(135deg,rgba(157,183,213,0.5),rgba(23,52,92,0.5),rgba(234,244,255,0.4))',
        'glow-radial':
          'radial-gradient(ellipse at center,rgba(157,183,213,0.08) 0%,transparent 65%)',
        'carbon-radial':
          'radial-gradient(ellipse at top,#112A4A 0%,#071629 60%)',
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
        'glow-cyan':     '0 0 30px rgba(157,183,213,0.15), 0 0 80px rgba(157,183,213,0.05)',
        'glow-violet':   '0 0 30px rgba(23,52,92,0.25), 0 0 80px rgba(23,52,92,0.08)',
        'glow-cyan-sm':  '0 0 12px rgba(157,183,213,0.25)',
        'card':          '0 1px 0 rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.4)',
        'inner-light':   'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
};
