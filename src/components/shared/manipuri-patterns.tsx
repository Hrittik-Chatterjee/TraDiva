import React from "react";

/**
 * Traditional Manipuri Moirang Phee (triangular/serrated) repeating pattern divider.
 */
export function MoirangPheePattern({ className = "", height = 24 }: { className?: string; height?: number }) {
  return (
    <svg width="100%" height={height} className={`select-none ${className}`}>
      <defs>
        <pattern id="moirang-phee" width="20" height={height} patternUnits="userSpaceOnUse">
          {/* A traditional upward triangle motif */}
          <path
            d="M0 24 L10 4 L20 24 Z"
            className="fill-dark-pink/10 stroke-dark-pink stroke-2"
          />
          {/* Subtle inner vertical line typical in Manipuri weaving */}
          <path d="M10 4 L10 24" className="stroke-dark-pink/20 stroke-1" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill="url(#moirang-phee)" />
    </svg>
  );
}

/**
 * Animated Vector cartoon girl placeholder wearing traditional Manipuri attire:
 * - Phanek (striped skirt with Moirang Phee border at the bottom)
 * - Innaphi (translucent shawl draped over shoulders)
 * - Kajenglei (circular crown headgear with brass leaf details)
 * Uses CSS keyframes from globals.css for blinking eyes and waving arm.
 */
export function ManipuriGirlPlaceholder({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 280"
      className={`w-full h-full select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Soft Floating Glow */}
      <circle cx="100" cy="140" r="80" className="fill-lightest-pink/50" />

      {/* Kajenglei Traditional Headgear Crown */}
      <path
        d="M 60 70 Q 100 45 140 70"
        fill="none"
        stroke="oklch(81.9% 0.101 24.7)" /* Dark Pink Kajenglei Ring */
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Brass / Leaf Ornaments on Kajenglei */}
      <circle cx="60" cy="70" r="3" fill="#ffd02f" />
      <circle cx="70" cy="62" r="3" fill="#ffd02f" />
      <circle cx="80" cy="56" r="3" fill="#ffd02f" />
      <circle cx="90" cy="53" r="3" fill="#ffd02f" />
      <circle cx="100" cy="52" r="4" fill="#ffd02f" />
      <circle cx="110" cy="53" r="3" fill="#ffd02f" />
      <circle cx="120" cy="56" r="3" fill="#ffd02f" />
      <circle cx="130" cy="62" r="3" fill="#ffd02f" />
      <circle cx="140" cy="70" r="3" fill="#ffd02f" />

      {/* Hair */}
      <path
        d="M 65 72 C 65 65 135 65 135 72 C 135 78 143 110 143 120 C 143 128 135 125 135 120 C 135 85 65 85 65 120 C 65 125 57 128 57 120 C 57 110 65 78 65 72 Z"
        fill="oklch(24.5% 0.008 17.7)"
      />

      {/* Face */}
      <circle cx="100" cy="98" r="28" fill="#ffe3d1" />

      {/* Eyes with soft-blink animation */}
      <g className="animate-soft-blink">
        <circle cx="91" cy="96" r="3" fill="oklch(24.5% 0.008 17.7)" />
        <circle cx="109" cy="96" r="3" fill="oklch(24.5% 0.008 17.7)" />
      </g>

      {/* Cheeks - Blush */}
      <circle cx="84" cy="103" r="4" fill="oklch(81.9% 0.101 24.7)" opacity="0.4" />
      <circle cx="116" cy="103" r="4" fill="oklch(81.9% 0.101 24.7)" opacity="0.4" />

      {/* Smile */}
      <path
        d="M 96 104 Q 100 108 104 104"
        fill="none"
        stroke="oklch(24.5% 0.008 17.7)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Innaphi (Underlay Fold on Left) */}
      <path
        d="M 72 128 C 55 140 40 180 50 210 C 55 220 70 235 70 235"
        fill="none"
        stroke="oklch(89.8% 0.057 44.1)"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Phanek (Striped Wrap Skirt) */}
      <path d="M 75 128 L 125 128 L 134 235 L 66 235 Z" fill="oklch(81.9% 0.101 24.7)" />
      {/* Traditional Horizontal Stripes */}
      <line x1="74" y1="145" x2="126" y2="145" stroke="oklch(24.5% 0.008 17.7)" strokeWidth="1.5" />
      <line x1="72" y1="163" x2="128" y2="163" stroke="oklch(24.5% 0.008 17.7)" strokeWidth="1.5" />
      <line x1="70" y1="181" x2="130" y2="181" stroke="oklch(24.5% 0.008 17.7)" strokeWidth="1.5" />
      <line x1="68" y1="199" x2="132" y2="199" stroke="oklch(24.5% 0.008 17.7)" strokeWidth="1.5" />
      <line x1="66" y1="217" x2="134" y2="217" stroke="oklch(24.5% 0.008 17.7)" strokeWidth="1.5" />

      {/* Traditional Moirang Phee border at bottom of Phanek */}
      <path
        d="M 66 226 L 70 218 L 75 226 L 80 218 L 85 226 L 90 218 L 95 226 L 100 218 L 105 226 L 110 218 L 115 226 L 120 218 L 125 226 L 130 218 L 134 226"
        fill="none"
        stroke="#ffd02f" /* Yellow pattern outline */
        strokeWidth="3"
        strokeLinejoin="miter"
      />

      {/* Innaphi (Translucent overlay shawl draped across the body) */}
      <path
        d="M 75 128 C 85 140 120 180 134 218"
        fill="none"
        stroke="oklch(97.7% 0.011 31.1)"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M 75 128 C 85 140 120 180 134 218"
        fill="none"
        stroke="oklch(85.1% 0.081 26.4)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Arm & Hand waving with gentle-wave animation */}
      <g className="animate-gentle-wave origin-[65px_130px]">
        <path
          d="M 68 132 C 55 140 45 152 45 158"
          fill="none"
          stroke="#ffe3d1"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <circle cx="43" cy="161" r="6" fill="#ffe3d1" />
      </g>
    </svg>
  );
}
