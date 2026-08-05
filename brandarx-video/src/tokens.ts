// ─────────────────────────────────────────────────────────────
// BrandArx design tokens — v2 (cinematic rebuild)
// ─────────────────────────────────────────────────────────────

export const COLORS = {
  bg:           "#080810",
  bgDeep:       "#050508",
  surface:      "#0E0E1C",
  surfaceHigh:  "#13132A",
  violet:       "#6D28D9",
  violetLight:  "#A78BFA",
  violetMid:    "#8B5CF6",
  violetDim:    "#4C1D95",
  cyan:         "#22D3EE",
  cyanDim:      "#0E7490",
  green:        "#10B981",
  greenDim:     "#065F46",
  amber:        "#F59E0B",
  white:        "#FFFFFF",
  offWhite:     "#E2E8F0",
  muted:        "#94A3B8",
  mutedDim:     "#475569",
  cardBg:       "rgba(255,255,255,0.04)",
  cardBorder:   "rgba(255,255,255,0.09)",
  glassBg:      "rgba(109,40,217,0.07)",
  glassStroke:  "rgba(167,139,250,0.18)",
} as const;

export const GRADIENTS = {
  violet:        "linear-gradient(135deg,#6D28D9 0%,#A78BFA 100%)",
  violetSharp:   "linear-gradient(135deg,#4C1D95 0%,#8B5CF6 100%)",
  violetText:    "linear-gradient(90deg,#C4B5FD 0%,#FFFFFF 50%,#A78BFA 100%)",
  cyanViolet:    "linear-gradient(135deg,#22D3EE 0%,#8B5CF6 100%)",
  ctaBtn:        "linear-gradient(135deg,#6D28D9 0%,#8B5CF6 60%,#A78BFA 100%)",
  heroGlow:      "radial-gradient(ellipse 80% 55% at 50% 105%,rgba(109,40,217,0.65) 0%,transparent 70%)",
  centerGlow:    "radial-gradient(ellipse 55% 55% at 50% 50%,rgba(109,40,217,0.30) 0%,transparent 68%)",
  topGlow:       "radial-gradient(ellipse 60% 40% at 50% 0%,rgba(109,40,217,0.25) 0%,transparent 70%)",
  cardShine:     "linear-gradient(135deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.01) 100%)",
  greenGlow:     "radial-gradient(ellipse 50% 50% at 50% 50%,rgba(16,185,129,0.25) 0%,transparent 70%)",
  cyanGlow:      "radial-gradient(ellipse 50% 50% at 50% 50%,rgba(34,211,238,0.20) 0%,transparent 70%)",
} as const;

export const FONT = {
  family: '"Inter","Geist",system-ui,sans-serif',
} as const;

// ── Video constants ──────────────────────────────────────────
export const FPS          = 30;
export const DURATION_SEC = 30;
export const TOTAL_FRAMES = DURATION_SEC * FPS; // 900

// ── Scene frame map ─────────────────────────────────────────
//  Scene 1  Cold open / brand reveal          0:00–0:04   0–120
//  Scene 2  Problem statement                  0:04–0:08   120–240
//  Scene 3  Dashboard product reveal           0:08–0:13   240–390
//  Scene 4  AI Automation showcase             0:13–0:17   390–510
//  Scene 5  Results / social proof             0:17–0:22   510–660
//  Scene 6  Design / UI showcase               0:22–0:26   660–780
//  Scene 7  Outro / CTA                        0:26–0:30   780–900
export const SCENES = {
  coldOpen:   { in:   0, out: 120 },
  problem:    { in: 120, out: 240 },
  dashboard:  { in: 240, out: 390 },
  aiAuto:     { in: 390, out: 510 },
  results:    { in: 510, out: 660 },
  design:     { in: 660, out: 780 },
  outro:      { in: 780, out: 900 },
} as const;

// Transition duration in frames (cross-dissolve overlap)
export const XFADE = 18;
