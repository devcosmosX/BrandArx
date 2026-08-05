// ─────────────────────────────────────────────────────────────
// AmbientBackground v2 — cinematic multi-layer orbs
// ─────────────────────────────────────────────────────────────
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../tokens";

export const AmbientBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / 30;

  // Five independent orbs with different radii, drift speeds, phases
  const orbs = [
    { cx:0.50, cy:1.00, rx:0.65, ry:0.50, color:"rgba(109,40,217,0.55)", spd:0.10, ph:0.0, dx:0.05, dy:0.04 },
    { cx:0.15, cy:0.30, rx:0.32, ry:0.28, color:"rgba(139,92,246,0.20)", spd:0.08, ph:1.2, dx:0.06, dy:0.05 },
    { cx:0.85, cy:0.20, rx:0.28, ry:0.25, color:"rgba(167,139,250,0.14)", spd:0.06, ph:2.5, dx:0.05, dy:0.06 },
    { cx:0.70, cy:0.75, rx:0.22, ry:0.22, color:"rgba(34,211,238,0.08)",  spd:0.12, ph:3.8, dx:0.04, dy:0.04 },
    { cx:0.30, cy:0.60, rx:0.18, ry:0.18, color:"rgba(167,139,250,0.10)", spd:0.15, ph:0.7, dx:0.05, dy:0.05 },
  ];

  return (
    <div style={{ position:"absolute", inset:0, background:COLORS.bg, overflow:"hidden" }}>
      <svg width={width} height={height} style={{ position:"absolute", inset:0 }}>
        <defs>
          {orbs.map((o, i) => (
            <radialGradient key={i} id={`og${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={o.color} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          ))}
        </defs>

        {orbs.map((o, i) => {
          const angle = t * o.spd * Math.PI * 2 + o.ph;
          const dx = Math.sin(angle) * o.dx * width;
          const dy = Math.cos(angle * 0.73) * o.dy * height;
          const pulse = 0.65 + 0.35 * Math.sin(t * 0.55 + o.ph);
          return (
            <ellipse
              key={i}
              cx={o.cx * width  + dx}
              cy={o.cy * height + dy}
              rx={o.rx * width}
              ry={o.ry * height}
              fill={`url(#og${i})`}
              opacity={pulse}
            />
          );
        })}

        {/* Subtle dot-grid */}
        <defs>
          <pattern id="dotgrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill="rgba(255,255,255,1)" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#dotgrid)" opacity={0.022} />

        {/* Horizontal scan line sweeping every ~3s */}
        {(() => {
          const period = 90; // frames
          const progress = (frame % period) / period;
          const y = height * progress;
          return (
            <line
              x1={0} y1={y} x2={width} y2={y}
              stroke="rgba(167,139,250,0.12)"
              strokeWidth={1}
            />
          );
        })()}
      </svg>
    </div>
  );
};
