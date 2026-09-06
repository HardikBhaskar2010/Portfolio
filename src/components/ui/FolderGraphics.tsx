import React from 'react';

/**
 * 3D Iridescent Chrome Arrow (Signature Emil Kowalski / Card Folder Graphic)
 */
export function ChromeArrow3D({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} fill="none">
      <defs>
        {/* Main iridescent metallic gradient */}
        <linearGradient id="chrome-grad-1" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="25%" stopColor="#E879F9" />
          <stop offset="50%" stopColor="#67E8F9" />
          <stop offset="75%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Highlight sheen */}
        <linearGradient id="chrome-highlight" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="30%" stopColor="#E0E7FF" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#C084FC" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
        </linearGradient>

        {/* Specular rim */}
        <linearGradient id="chrome-rim" x1="120" y1="40" x2="60" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#818CF8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
        </linearGradient>

        <filter id="chrome-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#A855F7" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#chrome-glow)">
        {/* 3D Arrow Extrusion / Under-shadow */}
        <path
          d="M 42 118 L 84 76 L 80 62 L 118 42 L 112 80 L 98 76 L 56 118 Z"
          fill="#3B0764"
          opacity="0.6"
        />

        {/* Main Ribbon Arrow Body */}
        <path
          d="M 38 116 C 44 92 62 74 86 66 L 78 52 L 124 36 L 108 82 L 94 74 C 76 82 62 96 52 122 Z"
          fill="url(#chrome-grad-1)"
        />

        {/* Iridescent Bevel Facet 1 */}
        <path
          d="M 38 116 C 44 92 62 74 86 66 L 94 74 C 76 82 62 96 52 122 Z"
          fill="url(#chrome-highlight)"
          opacity="0.75"
        />

        {/* Arrowhead Bevel Facet 2 */}
        <path
          d="M 86 66 L 78 52 L 124 36 L 102 58 Z"
          fill="url(#chrome-rim)"
          opacity="0.9"
        />

        {/* Arrowhead Lower Bevel Facet 3 */}
        <path
          d="M 124 36 L 108 82 L 94 74 L 102 58 Z"
          fill="url(#chrome-highlight)"
          opacity="0.6"
        />

        {/* Glowing Specular Streak */}
        <path
          d="M 46 110 C 52 90 68 76 88 68"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}

/**
 * 3D Google Cloud Gen AI Nexus (Faceted Isometric Chrome Prism)
 */
export function GoogleCloud3D({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} fill="none">
      <defs>
        <linearGradient id="gc-grad-blue" x1="30" y1="30" x2="130" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#4285F4" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        <linearGradient id="gc-grad-amber" x1="30" y1="30" x2="130" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBC05" />
          <stop offset="100%" stopColor="#EA4335" />
        </linearGradient>
        <linearGradient id="gc-grad-emerald" x1="30" y1="30" x2="130" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34A853" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="gc-specular" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8" />
        </linearGradient>
        <filter id="gc-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#00E5FF" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#gc-glow)">
        {/* Isometric 3D Hexagonal Prism */}
        {/* Top Face */}
        <path d="M 80 32 L 118 54 L 80 76 L 42 54 Z" fill="url(#gc-specular)" opacity="0.95" />
        
        {/* Right Face */}
        <path d="M 80 76 L 118 54 L 118 102 L 80 124 Z" fill="url(#gc-grad-blue)" />

        {/* Left Face */}
        <path d="M 42 54 L 80 76 L 80 124 L 42 102 Z" fill="url(#gc-grad-amber)" />

        {/* Center Floating Core Star / Neural Nexus */}
        <circle cx="80" cy="78" r="14" fill="#FFFFFF" opacity="0.9" />
        <circle cx="80" cy="78" r="8" fill="#00E5FF" />

        {/* Orbital Ring with Nodes */}
        <ellipse cx="80" cy="78" rx="46" ry="20" stroke="url(#gc-grad-emerald)" strokeWidth="3" strokeDasharray="6 4" fill="none" transform="rotate(-15 80 78)" />
        <circle cx="44" cy="68" r="4" fill="#34A853" />
        <circle cx="116" cy="88" r="4" fill="#4285F4" />
      </g>
    </svg>
  );
}

/**
 * 3D Anthropic Claude Sculpted Spark / Intelligence Prism
 */
export function ClaudeSpark3D({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} fill="none">
      <defs>
        <linearGradient id="claude-grad-warm" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="30%" stopColor="#FB923C" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#7C2D12" />
        </linearGradient>
        <linearGradient id="claude-highlight" x1="40" y1="20" x2="120" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0.8" />
        </linearGradient>
        <filter id="claude-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#F59E0B" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#claude-glow)">
        {/* 8-Pointed 3D Sculpted Star / Claude Cognition Burst */}
        {/* Top Needle */}
        <path d="M 80 20 L 88 66 L 80 78 L 72 66 Z" fill="url(#claude-highlight)" />
        {/* Bottom Needle */}
        <path d="M 80 140 L 72 94 L 80 82 L 88 94 Z" fill="url(#claude-grad-warm)" />
        {/* Left Needle */}
        <path d="M 20 80 L 66 72 L 78 80 L 66 88 Z" fill="url(#claude-highlight)" />
        {/* Right Needle */}
        <path d="M 140 80 L 94 88 L 82 80 L 94 72 Z" fill="url(#claude-grad-warm)" />

        {/* Diagonal Bevels */}
        <path d="M 38 38 L 70 70 L 80 80 L 70 80 Z" fill="#FBBF24" opacity="0.8" />
        <path d="M 122 38 L 80 80 L 90 70 L 90 80 Z" fill="url(#claude-highlight)" opacity="0.9" />
        <path d="M 122 122 L 80 80 L 90 90 L 80 90 Z" fill="#B45309" opacity="0.75" />
        <path d="M 38 122 L 80 80 L 70 90 L 80 90 Z" fill="#78350F" opacity="0.75" />

        {/* Central Brilliant Specular Gem */}
        <circle cx="80" cy="80" r="10" fill="#FFFFFF" />
        <circle cx="80" cy="80" r="5" fill="#F59E0B" />
      </g>
    </svg>
  );
}

/**
 * 3D be10x AI Speed Chevrons / Accelerator
 */
export function Be10xAccelerator3D({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} fill="none">
      <defs>
        <linearGradient id="be10x-grad" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="35%" stopColor="#34D399" />
          <stop offset="70%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>
        <linearGradient id="be10x-specular" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#6EE7B7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
        </linearGradient>
        <filter id="be10x-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#10B981" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#be10x-glow)">
        {/* Double 3D Accelerator Chevrons */}
        {/* Upper Chevron */}
        <path
          d="M 40 76 L 80 44 L 120 76 L 106 88 L 80 66 L 54 88 Z"
          fill="url(#be10x-specular)"
        />
        <path
          d="M 54 88 L 80 66 L 106 88 L 106 94 L 80 72 L 54 94 Z"
          fill="#064E3B"
          opacity="0.8"
        />

        {/* Lower Chevron */}
        <path
          d="M 40 106 L 80 74 L 120 106 L 106 118 L 80 96 L 54 118 Z"
          fill="url(#be10x-grad)"
        />

        {/* Lightning Bolt Core / Power Core */}
        <path
          d="M 82 24 L 72 62 L 86 62 L 76 98 L 94 56 L 80 56 Z"
          fill="#FFFFFF"
          opacity="0.95"
          filter="drop-shadow(0 0 8px #34D399)"
        />
      </g>
    </svg>
  );
}

/**
 * 3D MYBharat National Innovation Torch & Crest
 */
export function MYBharatTorch3D({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} fill="none">
      <defs>
        <linearGradient id="bharat-grad-saffron" x1="40" y1="20" x2="120" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFEDD5" />
          <stop offset="40%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="bharat-grad-emerald" x1="40" y1="80" x2="120" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <filter id="bharat-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#F97316" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#bharat-glow)">
        {/* 3D Flame of Innovation */}
        {/* Outer Flame (Saffron) */}
        <path
          d="M 80 22 C 96 46 114 68 108 94 C 104 112 88 118 80 118 C 72 118 56 112 52 94 C 46 68 64 46 80 22 Z"
          fill="url(#bharat-grad-saffron)"
        />

        {/* Inner Flame (White / Golden core) */}
        <path
          d="M 80 44 C 90 60 98 74 94 92 C 92 102 84 108 80 108 C 76 108 68 102 66 92 C 62 74 70 60 80 44 Z"
          fill="#FFFFFF"
          opacity="0.9"
        />

        {/* Base Pedestal / Chakra Base */}
        <ellipse cx="80" cy="120" rx="36" ry="12" fill="url(#bharat-grad-emerald)" />
        <ellipse cx="80" cy="116" rx="28" ry="8" fill="#065F46" />

        {/* Golden Central Spark */}
        <circle cx="80" cy="82" r="7" fill="#F59E0B" />
        <circle cx="80" cy="82" r="3" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

/**
 * 3D Executive Portfolio Dossier Ring / Singularity
 */
export function DossierSingularity3D({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} fill="none">
      <defs>
        <linearGradient id="dossier-grad" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E0E7FF" />
          <stop offset="30%" stopColor="#A855F7" />
          <stop offset="70%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <filter id="dossier-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#00E5FF" floodOpacity="0.5" />
        </filter>
      </defs>

      <g filter="url(#dossier-glow)">
        {/* Double Gyroscopic Singularity Rings */}
        <ellipse cx="80" cy="80" rx="54" ry="24" stroke="url(#dossier-grad)" strokeWidth="4" transform="rotate(-30 80 80)" fill="none" />
        <ellipse cx="80" cy="80" rx="54" ry="24" stroke="url(#dossier-grad)" strokeWidth="4" transform="rotate(35 80 80)" fill="none" opacity="0.8" />
        
        {/* Central Core */}
        <circle cx="80" cy="80" r="18" fill="#05050A" stroke="#00E5FF" strokeWidth="2" />
        <circle cx="80" cy="80" r="10" fill="#00E5FF" opacity="0.9" />
        <circle cx="80" cy="80" r="4" fill="#FFFFFF" />
      </g>
    </svg>
  );
}
