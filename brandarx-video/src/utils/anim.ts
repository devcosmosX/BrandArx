// ─────────────────────────────────────────────────────────────
// Animation utility helpers — v2
// ─────────────────────────────────────────────────────────────
import { interpolate, spring, type SpringConfig } from "remotion";

// ── Easing curves ────────────────────────────────────────────
export const easeOutCubic   = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeOutQuart   = (t: number) => 1 - Math.pow(1 - t, 4);
export const easeOutExpo    = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
export const easeInOutCubic = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
export const easeInQuart    = (t: number) => t * t * t * t;

export function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

// ── Core ramp ────────────────────────────────────────────────
export function ramp(
  frame: number,
  startFrame: number,
  durationFrames: number,
  easeFn: (t: number) => number = easeOutCubic,
): number {
  return easeFn(clamp01((frame - startFrame) / durationFrames));
}

// ── Spring entrance ──────────────────────────────────────────
export function springEntrance(
  frame: number,
  fps: number,
  startFrame: number,
  config: Partial<SpringConfig> = {},
): number {
  return spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 24, stiffness: 160, mass: 0.7, ...config },
  });
}

// ── Fade helpers ─────────────────────────────────────────────
export function fadeIn(frame: number, startFrame: number, dur = 18): number {
  return clamp01(interpolate(frame, [startFrame, startFrame + dur], [0, 1]));
}
export function fadeOut(frame: number, startFrame: number, dur = 18): number {
  return clamp01(interpolate(frame, [startFrame, startFrame + dur], [1, 0]));
}

// Fade-in then fade-out — hold between
export function fadeInOut(
  frame: number,
  inStart: number,
  inDur: number,
  outStart: number,
  outDur: number,
): number {
  const fin  = clamp01(interpolate(frame, [inStart,  inStart  + inDur],  [0, 1]));
  const fout = clamp01(interpolate(frame, [outStart, outStart + outDur], [1, 0]));
  return Math.min(fin, fout);
}

// ── Slide helpers ─────────────────────────────────────────────
export function slideUp(
  frame: number, fps: number, startFrame: number,
  fromY = 40, config: Partial<SpringConfig> = {},
): number {
  return (1 - springEntrance(frame, fps, startFrame, config)) * fromY;
}

export function slideX(
  frame: number, fps: number, startFrame: number,
  fromX = 80, config: Partial<SpringConfig> = {},
): number {
  return (1 - springEntrance(frame, fps, startFrame, config)) * fromX;
}

// ── Scale helpers ─────────────────────────────────────────────
export function scaleIn(
  frame: number, fps: number, startFrame: number,
  fromScale = 0.7, config: Partial<SpringConfig> = {},
): number {
  const s = springEntrance(frame, fps, startFrame, config);
  return fromScale + (1 - fromScale) * s;
}

// ── Blur-zoom (cinematic push) ────────────────────────────────
// Returns a scale > 1 that slowly pushes in over the scene duration
export function parallaxScale(
  frame: number,
  sceneIn: number,
  sceneOut: number,
  amount = 0.06,
): number {
  const t = clamp01((frame - sceneIn) / (sceneOut - sceneIn));
  return 1 + amount * easeInOutCubic(t);
}

// ── Clip-path wipe (left → right reveal) ─────────────────────
// Returns an inset(0 X% 0 0) string
export function wipeRight(
  frame: number,
  startFrame: number,
  durationFrames: number,
): string {
  const pct = clamp01(1 - ramp(frame, startFrame, durationFrames, easeOutCubic));
  return `inset(0 ${(pct * 100).toFixed(2)}% 0 0)`;
}

// ── Count-up (for stats) ──────────────────────────────────────
export function countUp(
  frame: number,
  startFrame: number,
  duration: number,
  target: number,
): number {
  return Math.round(ramp(frame, startFrame, duration, easeOutQuart) * target);
}

// ── Stagger offset — returns startFrame + i * staggerFrames ──
export function stagger(base: number, i: number, step = 8): number {
  return base + i * step;
}
