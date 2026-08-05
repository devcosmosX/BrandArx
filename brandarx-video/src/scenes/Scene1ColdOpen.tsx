// Scene 1 — Cinematic cold open / brand reveal (0–120, 0:00–0:04)
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENTS, SCENES } from "../tokens";
import { AmbientBackground } from "../components/AmbientBackground";
import { GradientText, LogoMark, Wordmark } from "../components/Atoms";
import { fadeIn, scaleIn, slideUp, ramp, easeOutExpo, clamp01 } from "../utils/anim";

const SI = SCENES.coldOpen.in;

// Particle — tiny dot that bursts outward from center
const Particle: React.FC<{
  angle: number; speed: number; frame: number; size: number; color: string;
}> = ({ angle, speed, frame, size, color }) => {
  const t = ramp(frame, SI + 2, 22, easeOutExpo);
  const dist = t * speed;
  const x = Math.cos(angle) * dist;
  const y = Math.sin(angle) * dist;
  const opacity = t < 0.3 ? t / 0.3 : clamp01(1 - (t - 0.3) / 0.7);
  return (
    <div style={{
      position:"absolute", top:"50%", left:"50%",
      width: size, height: size, borderRadius:"50%",
      background: color,
      boxShadow:`0 0 ${size*2}px ${color}`,
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      opacity,
    }} />
  );
};

export const Scene1ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const markScale  = scaleIn(frame, fps, SI + 4, 0.0, { damping:18, stiffness:120 });
  const markOpacity = fadeIn(frame, SI + 4, 20);

  const wordOpacity = fadeIn(frame, SI + 24, 18);
  const wordSlide   = slideUp(frame, fps, SI + 24, 28);

  const tagOpacity  = fadeIn(frame, SI + 44, 22);
  const tagSlide    = slideUp(frame, fps, SI + 44, 32);

  // Sub eyebrow
  const subOpacity  = fadeIn(frame, SI + 60, 20);
  const subSlide    = slideUp(frame, fps, SI + 60, 20);

  const glowPulse = 0.80 + 0.20 * Math.sin((frame / fps) * 2.2);

  const markSize = Math.round(width * 0.058);
  const textSize = Math.round(width * 0.062);

  // 24 radial particles
  const particles = Array.from({ length: 24 }, (_, i) => ({
    angle: (i / 24) * Math.PI * 2,
    speed: (80 + (i % 5) * 30) * (width / 1280),
    size: (2 + (i % 3)) * (width / 1280),
    color: i % 3 === 0 ? COLORS.violetLight : i % 3 === 1 ? COLORS.cyan : COLORS.violetMid,
  }));

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
      <AmbientBackground />

      {/* Hero glow arc from bottom */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0,
        height: height * 0.65,
        background: GRADIENTS.heroGlow,
        transform: `scaleX(${glowPulse})`,
        transformOrigin:"50% 100%",
      }} />

      {/* Particles burst */}
      <div style={{ position:"absolute", inset:0 }}>
        {particles.map((p, i) => (
          <Particle key={i} {...p} frame={frame} />
        ))}
      </div>

      {/* Logo mark */}
      <div style={{
        position:"absolute",
        top: height/2 - height*0.16,
        left:0, right:0,
        display:"flex", alignItems:"center", justifyContent:"center",
        gap: markSize * 0.55,
      }}>
        <div style={{ opacity:markOpacity, transform:`scale(${markScale})` }}>
          <LogoMark size={markSize} />
        </div>
        <div style={{ opacity:wordOpacity, transform:`translateY(${wordSlide}px)` }}>
          <Wordmark size={textSize} />
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        position:"absolute",
        top: height/2 + height*0.04,
        left:0, right:0, textAlign:"center",
        opacity: tagOpacity,
        transform:`translateY(${tagSlide}px)`,
        padding:`0 ${width*0.08}px`,
      }}>
        <div style={{
          fontFamily: FONT.family,
          fontSize: Math.round(width * 0.028),
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}>
          <GradientText>
            Build Smarter.&nbsp; Automate Faster.&nbsp; Grow Revenue.
          </GradientText>
        </div>
      </div>

      {/* Sub copy */}
      <div style={{
        position:"absolute",
        top: height/2 + height*0.16,
        left:0, right:0, textAlign:"center",
        opacity: subOpacity,
        transform:`translateY(${subSlide}px)`,
      }}>
        <span style={{
          fontFamily: FONT.family,
          fontSize: Math.round(width * 0.016),
          color: COLORS.muted,
          letterSpacing:"0.04em",
          fontWeight: 400,
        }}>
          The all-in-one digital agency platform
        </span>
      </div>
    </div>
  );
};
