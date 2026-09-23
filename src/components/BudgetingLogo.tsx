import React from 'react';

/**
 * BudgetingLogo
 * Renders the word "BUDGETING" where each letter is an individual geometric faceted SVG.
 * Colors follow the financial theme:
 * 1. B -> Entradas (Azul-ardósia #3b6790)
 * 2. U -> Saídas (Coral #e06a55)
 * 3. D -> A Pagar (Ocre #d99b26)
 * 4. G -> Caixinhas (Esmeralda #10b981)
 * 5. E -> Entradas (Azul-ardósia #3b6790)
 * 6. T -> Saídas (Coral #e06a55)
 * 7. I -> A Pagar (Ocre #d99b26) com ponto circular superior
 * 8. N -> Caixinhas (Esmeralda #10b981)
 * 9. G -> Dividido em 4 cores do calendário (Azul, Coral, Ocre, Esmeralda)
 * 
 * Styled with geometric facets, radial cuts, grooves and tactile depth matching the reference design.
 */

// Shared seam stroke between facets for the geometric cut aesthetic
const CUT_STROKE = 'rgba(0, 0, 0, 0.28)';
const CUT_STROKE_LIGHT = 'rgba(255, 255, 255, 0.25)';

export const LetterB: React.FC = () => (
  <svg
    viewBox="0 0 54 60"
    className="h-7 sm:h-8 md:h-9 w-auto select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="b-grad-1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#5b8bb8" />
        <stop offset="100%" stopColor="#3b6790" />
      </linearGradient>
      <linearGradient id="b-grad-2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7baedc" />
        <stop offset="100%" stopColor="#4f7ea8" />
      </linearGradient>
      <linearGradient id="b-grad-3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3b6790" />
        <stop offset="100%" stopColor="#25486a" />
      </linearGradient>
      <linearGradient id="b-grad-4" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2b5074" />
        <stop offset="100%" stopColor="#18324a" />
      </linearGradient>
      <linearGradient id="b-cal-accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <filter id="shadow-letter" x="-10%" y="-10%" width="125%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.25" />
      </filter>
    </defs>

    <g filter="url(#shadow-letter)">
      {/* Outer base shape / facets */}
      {/* Top Left Facet */}
      <path
        d="M 6 4 L 26 4 L 26 28 L 6 28 Z"
        fill="url(#b-grad-2)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Top-Right Rounded Radial Lobe */}
      <path
        d="M 26 4 C 39 4 48 11 48 20 C 48 28 40 30 26 30 L 26 4 Z"
        fill="url(#b-grad-1)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Middle Calendar Slice Accent (toque esmeralda das caixinhas) */}
      <path
        d="M 26 26 L 46 26 L 40 33 L 26 31 Z"
        fill="url(#b-cal-accent)"
        stroke={CUT_STROKE}
        strokeWidth="0.6"
        opacity="0.9"
      />
      {/* Bottom-Left Spine Facet */}
      <path
        d="M 6 28 L 26 28 L 26 56 L 6 56 Z"
        fill="url(#b-grad-3)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Bottom-Right Rounded Radial Lobe */}
      <path
        d="M 26 30 C 42 30 50 37 50 44 C 50 52 41 56 26 56 L 26 30 Z"
        fill="url(#b-grad-4)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Radial slice cut lines across the lobes (like pie chart) */}
      <path d="M 26 17 L 48 10" stroke={CUT_STROKE_LIGHT} strokeWidth="1" strokeDasharray="3 2" />
      <path d="M 26 43 L 50 48" stroke={CUT_STROKE_LIGHT} strokeWidth="1" strokeDasharray="3 2" />

      {/* Holes / Counters of B */}
      {/* Top Counter */}
      <path
        d="M 17 12 L 27 12 C 32 12 36 14 36 19 C 36 23 32 24 27 24 L 17 24 Z"
        fill="#ffffff"
        className="dark:fill-zinc-950"
        stroke={CUT_STROKE}
        strokeWidth="1"
      />
      {/* Bottom Counter */}
      <path
        d="M 17 35 L 28 35 C 33 35 38 37 38 43 C 38 48 33 49 28 49 L 17 49 Z"
        fill="#ffffff"
        className="dark:fill-zinc-950"
        stroke={CUT_STROKE}
        strokeWidth="1"
      />
      {/* Subtle highlight sheen */}
      <path d="M 8 6 L 24 6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  </svg>
);

export const LetterU: React.FC = () => (
  <svg
    viewBox="0 0 54 60"
    className="h-7 sm:h-8 md:h-9 w-auto select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="u-band-1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f5aba0" />
        <stop offset="100%" stopColor="#eb8573" />
      </linearGradient>
      <linearGradient id="u-band-2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#eb8573" />
        <stop offset="100%" stopColor="#e06a55" />
      </linearGradient>
      <linearGradient id="u-band-3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e06a55" />
        <stop offset="100%" stopColor="#b84733" />
      </linearGradient>
      <linearGradient id="u-band-4" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b84733" />
        <stop offset="100%" stopColor="#872d1d" />
      </linearGradient>
    </defs>

    <g filter="url(#shadow-letter)">
      {/* Horizontal curved strata bands matching reference image */}
      {/* Band 1 - Top level */}
      <path
        d="M 6 4 L 18 4 L 18 16 L 6 16 Z M 36 4 L 48 4 L 48 16 L 36 16 Z"
        fill="url(#u-band-1)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Band 2 - Middle upper */}
      <path
        d="M 6 16 L 18 16 L 18 28 L 6 28 Z M 36 16 L 48 16 L 48 28 L 36 28 Z"
        fill="url(#u-band-2)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Band 3 - Middle transition with curves */}
      <path
        d="M 6 28 L 18 28 L 18 38 C 18 40 19 42 21 42 L 33 42 C 35 42 36 40 36 38 L 36 28 L 48 28 L 48 38 C 48 46 42 49 35 50 L 19 50 C 12 49 6 46 6 38 Z"
        fill="url(#u-band-3)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Band 4 - Deep curved bottom base */}
      <path
        d="M 6 38 C 6 48 15 56 27 56 C 39 56 48 48 48 38 L 48 46 C 48 54 39 58 27 58 C 15 58 6 54 6 46 Z"
        fill="url(#u-band-4)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Central vertical divider line like reference */}
      <line x1="27" y1="42" x2="27" y2="56" stroke={CUT_STROKE} strokeWidth="1" />
      {/* Top highlight caps */}
      <path d="M 7 5 L 17 5 M 37 5 L 47 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export const LetterD: React.FC = () => (
  <svg
    viewBox="0 0 54 60"
    className="h-7 sm:h-8 md:h-9 w-auto select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="d-spine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f6cb6e" />
        <stop offset="100%" stopColor="#d99b26" />
      </linearGradient>
      <linearGradient id="d-arc-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ebae3b" />
        <stop offset="100%" stopColor="#f6cb6e" />
      </linearGradient>
      <linearGradient id="d-arc-mid" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#d99b26" />
        <stop offset="100%" stopColor="#a67214" />
      </linearGradient>
      <linearGradient id="d-arc-bot" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a67214" />
        <stop offset="100%" stopColor="#7a5209" />
      </linearGradient>
    </defs>

    <g filter="url(#shadow-letter)">
      {/* Left straight vertical spine */}
      <path
        d="M 6 4 L 20 4 L 20 56 L 6 56 Z"
        fill="url(#d-spine)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Right radial sliced semicircle bowl */}
      {/* Top Sector */}
      <path
        d="M 20 4 C 36 4 48 14 48 25 L 20 30 Z"
        fill="url(#d-arc-top)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Middle Sector */}
      <path
        d="M 48 25 C 50 28 50 32 48 35 L 20 30 Z"
        fill="url(#d-arc-mid)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Bottom Sector */}
      <path
        d="M 48 35 C 48 46 36 56 20 56 L 20 30 Z"
        fill="url(#d-arc-bot)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Radial slice cut lines */}
      <line x1="20" y1="30" x2="44" y2="16" stroke={CUT_STROKE_LIGHT} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="20" y1="30" x2="44" y2="44" stroke={CUT_STROKE_LIGHT} strokeWidth="1" strokeDasharray="3 2" />

      {/* Counter Hole */}
      <path
        d="M 18 16 L 25 16 C 33 16 38 22 38 30 C 38 38 33 44 25 44 L 18 44 Z"
        fill="#ffffff"
        className="dark:fill-zinc-950"
        stroke={CUT_STROKE}
        strokeWidth="1"
      />

      {/* Top highlight */}
      <path d="M 7 5 L 19 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export const LetterG1: React.FC = () => (
  <svg
    viewBox="0 0 54 60"
    className="h-7 sm:h-8 md:h-9 w-auto select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="g1-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
      <linearGradient id="g1-mid" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="g1-bot" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="g1-bar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>

    <g filter="url(#shadow-letter)">
      {/* 1. Top-Right Arm Terminal (Open throat of G) */}
      <path
        d="M 27 5 C 34 5 40 8 43 14 L 35 20 C 33 17 30 16 27 16 Z"
        fill="url(#g1-top)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* 2. Top-Left Arc */}
      <path
        d="M 27 5 C 16 5 7 15 7 30 L 18 30 C 18 21 21 16 27 16 Z"
        fill="url(#g1-top)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* 3. Bottom-Left Arc */}
      <path
        d="M 7 30 C 7 45 16 55 27 55 L 27 44 C 21 44 18 39 18 30 Z"
        fill="url(#g1-mid)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* 4. Bottom-Right Curve */}
      <path
        d="M 27 55 C 37 55 45 49 48 42 L 48 37 L 36 37 C 36 41 32 44 27 44 Z"
        fill="url(#g1-bot)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* 5. Inward Horizontal Crossbar & Vertical Spur (Distinct G Feature) */}
      <path
        d="M 48 26 L 48 38 L 25 38 L 25 26 Z"
        fill="url(#g1-bar)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Decorative Spur Vertical Cut & Diagonal Groove */}
      <line x1="36" y1="26" x2="36" y2="38" stroke={CUT_STROKE} strokeWidth="0.8" />
      <line x1="12" y1="18" x2="22" y2="10" stroke={CUT_STROKE_LIGHT} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="12" y1="42" x2="22" y2="50" stroke={CUT_STROKE_LIGHT} strokeWidth="1" strokeDasharray="3 2" />

      {/* Top highlight arc */}
      <path d="M 12 10 C 16 7 21 5 27 5 C 33 5 38 7 42 12" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export const LetterE: React.FC = () => (
  <svg
    viewBox="0 0 50 60"
    className="h-7 sm:h-8 md:h-9 w-auto select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="e-spine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7baedc" />
        <stop offset="100%" stopColor="#3b6790" />
      </linearGradient>
      <linearGradient id="e-top" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7baedc" />
        <stop offset="100%" stopColor="#5b8bb8" />
      </linearGradient>
      <linearGradient id="e-mid" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#4f7ea8" />
        <stop offset="100%" stopColor="#25486a" />
      </linearGradient>
      <linearGradient id="e-bot" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#3b6790" />
        <stop offset="100%" stopColor="#18324a" />
      </linearGradient>
    </defs>

    <g filter="url(#shadow-letter)">
      {/* Spine with diagonal faceted cuts */}
      <path
        d="M 6 4 L 18 4 L 18 24 L 6 30 Z"
        fill="url(#e-spine)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      <path
        d="M 6 30 L 18 24 L 18 56 L 6 56 Z"
        fill="url(#e-bot)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Top Bar with diagonal facet */}
      <path
        d="M 18 4 L 46 4 L 40 16 L 18 16 Z"
        fill="url(#e-top)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Mid Bar */}
      <path
        d="M 18 24 L 38 24 L 34 36 L 18 36 Z"
        fill="url(#e-mid)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Bottom Bar */}
      <path
        d="M 18 44 L 42 44 L 46 56 L 18 56 Z"
        fill="url(#e-bot)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Diagonal geometric facet cuts */}
      <line x1="6" y1="4" x2="40" y2="16" stroke={CUT_STROKE_LIGHT} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="18" y1="44" x2="46" y2="56" stroke={CUT_STROKE_LIGHT} strokeWidth="1" strokeDasharray="3 2" />

      {/* Highlights */}
      <path d="M 7 5 L 44 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export const LetterT: React.FC = () => (
  <svg
    viewBox="0 0 54 60"
    className="h-7 sm:h-8 md:h-9 w-auto select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="t-top-left" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f5aba0" />
        <stop offset="100%" stopColor="#e06a55" />
      </linearGradient>
      <linearGradient id="t-top-right" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#e06a55" />
        <stop offset="100%" stopColor="#b84733" />
      </linearGradient>
      <linearGradient id="t-stem-left" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#eb8573" />
        <stop offset="100%" stopColor="#e06a55" />
      </linearGradient>
      <linearGradient id="t-stem-right" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b84733" />
        <stop offset="100%" stopColor="#872d1d" />
      </linearGradient>
    </defs>

    <g filter="url(#shadow-letter)">
      {/* Top Bar Left Half */}
      <path
        d="M 4 4 L 27 4 L 27 16 L 4 16 Z"
        fill="url(#t-top-left)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Top Bar Right Half */}
      <path
        d="M 27 4 L 50 4 L 50 16 L 27 16 Z"
        fill="url(#t-top-right)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Center Vertical Stem Left Half */}
      <path
        d="M 21 16 L 27 16 L 27 56 L 21 56 Z"
        fill="url(#t-stem-left)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      {/* Center Vertical Stem Right Half */}
      <path
        d="M 27 16 L 33 16 L 33 56 L 27 56 Z"
        fill="url(#t-stem-right)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Pill-shaped bevel detail in middle of stem like reference image */}
      <rect
        x="24.5"
        y="24"
        width="5"
        height="18"
        rx="2.5"
        fill="rgba(255, 255, 255, 0.22)"
        stroke={CUT_STROKE}
        strokeWidth="0.5"
      />

      {/* Top highlight bar */}
      <path d="M 5 5 L 49 5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export const LetterI: React.FC = () => (
  <svg
    viewBox="0 0 32 60"
    className="h-7 sm:h-8 md:h-9 w-auto select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="i-dot-top" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f6cb6e" />
        <stop offset="100%" stopColor="#ebae3b" />
      </linearGradient>
      <linearGradient id="i-dot-bot" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d99b26" />
        <stop offset="100%" stopColor="#a67214" />
      </linearGradient>
      <linearGradient id="i-bar-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ebae3b" />
        <stop offset="100%" stopColor="#d99b26" />
      </linearGradient>
      <linearGradient id="i-bar-bot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d99b26" />
        <stop offset="100%" stopColor="#7a5209" />
      </linearGradient>
    </defs>

    <g filter="url(#shadow-letter)">
      {/* Top Circular Dot (dividido como os círculos do calendário!) */}
      <path
        d="M 8 11 A 8 8 0 0 1 24 11 Z"
        fill="url(#i-dot-top)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      <path
        d="M 8 11 A 8 8 0 0 0 24 11 Z"
        fill="url(#i-dot-bot)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      <circle cx="16" cy="11" r="7.5" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />

      {/* Bottom Segmented Vertical Bar */}
      <rect
        x="9"
        y="22"
        width="14"
        height="16"
        fill="url(#i-bar-top)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />
      <rect
        x="9"
        y="38"
        width="14"
        height="18"
        fill="url(#i-bar-bot)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Highlights */}
      <path d="M 10 23 L 22 23" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
    </g>
  </svg>
);

export const LetterN: React.FC = () => (
  <svg
    viewBox="0 0 54 60"
    className="h-7 sm:h-8 md:h-9 w-auto select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="n-left" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="n-diag" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="n-right" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>

    <g filter="url(#shadow-letter)">
      {/* Left Vertical Pillar */}
      <path
        d="M 6 4 L 18 4 L 18 56 L 6 56 Z"
        fill="url(#n-left)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Diagonal Stroke */}
      <path
        d="M 18 4 L 36 38 L 36 56 L 18 20 Z"
        fill="url(#n-diag)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Right Vertical Pillar */}
      <path
        d="M 36 4 L 48 4 L 48 56 L 36 56 Z"
        fill="url(#n-right)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Textured Diagonal Facet Stripes across the diagonal (just like in reference image) */}
      <line x1="20" y1="12" x2="28" y2="28" stroke={CUT_STROKE_LIGHT} strokeWidth="1.2" />
      <line x1="24" y1="20" x2="32" y2="36" stroke={CUT_STROKE_LIGHT} strokeWidth="1.2" />
      <line x1="28" y1="28" x2="36" y2="44" stroke={CUT_STROKE_LIGHT} strokeWidth="1.2" />

      {/* Top highlights */}
      <path d="M 7 5 L 17 5 M 37 5 L 47 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export const LetterG2: React.FC = () => (
  <svg
    viewBox="0 0 54 60"
    className="h-7 sm:h-8 md:h-9 w-auto select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* 4 cores do calendário: Coral (Saídas), Azul (Entradas), Ocre (A Pagar), Esmeralda (Caixinhas) */}
      <linearGradient id="cal-quad-coral" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f5aba0" />
        <stop offset="100%" stopColor="#e06a55" />
      </linearGradient>
      <linearGradient id="cal-quad-blue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#5b8bb8" />
        <stop offset="100%" stopColor="#3b6790" />
      </linearGradient>
      <linearGradient id="cal-quad-ocre" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f6cb6e" />
        <stop offset="100%" stopColor="#d99b26" />
      </linearGradient>
      <linearGradient id="cal-quad-emerald" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="cal-g2-bar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#eb8573" />
        <stop offset="100%" stopColor="#e06a55" />
      </linearGradient>
    </defs>

    <g filter="url(#shadow-letter)">
      {/* 1. Top-Right Arm Terminal: Coral (Saídas) - Com garganta aberta de G! */}
      <path
        d="M 27 5 C 34 5 40 8 43 14 L 35 20 C 33 17 30 16 27 16 Z"
        fill="url(#cal-quad-coral)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* 2. Top-Left Arc: Azul (Entradas) */}
      <path
        d="M 27 5 C 16 5 7 15 7 30 L 18 30 C 18 21 21 16 27 16 Z"
        fill="url(#cal-quad-blue)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* 3. Bottom-Left Arc: Ocre (A Pagar) */}
      <path
        d="M 7 30 C 7 45 16 55 27 55 L 27 44 C 21 44 18 39 18 30 Z"
        fill="url(#cal-quad-ocre)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* 4. Bottom-Right Curve: Esmeralda (Caixinhas) */}
      <path
        d="M 27 55 C 37 55 45 49 48 42 L 48 37 L 36 37 C 36 41 32 44 27 44 Z"
        fill="url(#cal-quad-emerald)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* 5. Inward Horizontal Crossbar & Vertical Spur (G Spur & Bar) */}
      <path
        d="M 48 26 L 48 38 L 25 38 L 25 26 Z"
        fill="url(#cal-g2-bar)"
        stroke={CUT_STROKE}
        strokeWidth="0.8"
      />

      {/* Divider between spur and crossbar */}
      <line x1="36" y1="26" x2="36" y2="38" stroke={CUT_STROKE} strokeWidth="0.8" />
      {/* Texture slice grooves */}
      <line x1="12" y1="18" x2="22" y2="10" stroke={CUT_STROKE_LIGHT} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="12" y1="42" x2="22" y2="50" stroke={CUT_STROKE_LIGHT} strokeWidth="1" strokeDasharray="3 2" />

      {/* Highlight sheen */}
      <path d="M 12 10 C 16 7 21 5 27 5 C 33 5 38 7 42 12" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export const BudgetingLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-[1px] sm:gap-[2.5px] select-none opacity-75 dark:opacity-100 hover:opacity-95 transition-all duration-300 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)] hover:scale-[1.015] ${className}`}
      aria-label="Budgeting"
      title="Budgeting"
    >
      <LetterB />
      <LetterU />
      <LetterD />
      <LetterG1 />
      <LetterE />
      <LetterT />
      <LetterI />
      <LetterN />
      <LetterG2 />
    </div>
  );
};
