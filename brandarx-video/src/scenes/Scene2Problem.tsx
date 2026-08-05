// Scene 2 — Problem statement (120–240, 0:04–0:08)
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENTS, SCENES } from "../tokens";
import { AmbientBackground } from "../components/AmbientBackground";
import { GlassCard, SectionTitle } from "../components/Atoms";
import { fadeIn, slideUp, slideX, stagger } from "../utils/anim";

const SI = SCENES.problem.in;

const PAINS = [
  { icon:"😩", title:"Inconsistent delivery", body:"Freelancers miss deadlines. Agencies overpromise. You're left chasing updates." },
  { icon:"💸", title:"Hidden costs spiral",   body:"Scope creep and retainer bloat eat your budget before results arrive." },
  { icon:"📉", title:"No measurable ROI",     body:"Beautiful work, zero metrics. You can't prove what moved the needle." },
  { icon:"🔄", title:"Fragmented stack",       body:"10 vendors, 10 logins, zero coordination. Your brand looks different everywhere." },
] as const;

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleOpacity = fadeIn(frame, SI + 8,  18);
  const titleSlide   = slideUp(frame, fps, SI + 8, 24);

  const cardFontBig  = Math.round(width * 0.016);
  const cardFontSm   = Math.round(width * 0.013);

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
      <AmbientBackground />

      {/* Dim red tint overlay — signals "problem" */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 70% 50% at 50% 50%,rgba(239,68,68,0.06) 0%,transparent 70%)",
      }} />

      {/* Heading */}
      <div style={{
        position:"absolute",
        top: height * 0.08,
        left:0, right:0,
        opacity: titleOpacity,
        transform:`translateY(${titleSlide}px)`,
      }}>
        <SectionTitle
          eyebrow="The Problem"
          headline="Your growth is stuck"
          sub="Most brands waste months on fragmented agencies, missed deadlines, and zero accountability."
          width={width}
        />
      </div>

      {/* Pain cards — 2×2 grid */}
      <div style={{
        position:"absolute",
        top: height * 0.34,
        left: width * 0.06,
        right: width * 0.06,
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap: Math.round(width * 0.022),
      }}>
        {PAINS.map((pain, i) => {
          const sf = stagger(SI + 28, i, 12);
          const opacity = fadeIn(frame, sf, 16);
          const ty = slideX(frame, fps, sf, i % 2 === 0 ? -36 : 36);
          return (
            <div key={i} style={{ opacity, transform:`translateX(${ty}px)` }}>
              <GlassCard padding={Math.round(width * 0.022)} radius={14}>
                <div style={{
                  fontSize: Math.round(width * 0.026),
                  marginBottom: 10,
                }}>
                  {pain.icon}
                </div>
                <div style={{
                  fontFamily: FONT.family,
                  fontSize: cardFontBig,
                  fontWeight: 700,
                  color: COLORS.white,
                  marginBottom: 6,
                }}>
                  {pain.title}
                </div>
                <div style={{
                  fontFamily: FONT.family,
                  fontSize: cardFontSm,
                  color: COLORS.muted,
                  lineHeight: 1.5,
                }}>
                  {pain.body}
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};
