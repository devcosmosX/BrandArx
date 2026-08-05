// Scene 5 — Results / social proof (510–660, 0:17–0:22)
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENTS, SCENES } from "../tokens";
import { AmbientBackground } from "../components/AmbientBackground";
import { GlassCard, GradientText, SectionTitle, ProgressBar } from "../components/Atoms";
import { fadeIn, slideUp, slideX, stagger, countUp } from "../utils/anim";

const SI = SCENES.results.in;

const STATS = [
  { val:150, suffix:"+",  label:"Projects Delivered", icon:"🚀", color: COLORS.violetLight },
  { val:98,  suffix:"%",  label:"Client Satisfaction", icon:"⭐", color: COLORS.amber },
  { val:40,  suffix:"+",  label:"Expert Team Members", icon:"👥", color: COLORS.cyan },
  { val:5,   suffix:"★",  label:"Average Rating",      icon:"🏆", color: COLORS.green },
] as const;

const REVIEWS = [
  { name:"Priya M.", role:"CEO, NovaTech", text:"BrandArx transformed our digital presence in 6 weeks. Revenue up 42%.", rating:5 },
  { name:"Arjun S.", role:"Founder, ScaleHub", text:"The AI automation alone saves us 20+ hours a week. Unbelievable ROI.", rating:5 },
  { name:"Sofia L.", role:"CMO, GrowthLabs", text:"Best agency decision I've ever made. The team feels like our own.", rating:5 },
] as const;

const Stars: React.FC<{ n: number; size: number }> = ({ n, size }) => (
  <div style={{ display:"flex", gap:3 }}>
    {Array.from({ length: n }).map((_, i) => (
      <span key={i} style={{ fontSize: size, color: COLORS.amber }}>★</span>
    ))}
  </div>
);

export const Scene5Results: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleO = fadeIn(frame, SI+5, 18);
  const titleY = slideUp(frame, fps, SI+5, 22);

  const bigF = Math.round(width*0.038);
  const smF  = Math.round(width*0.014);
  const rvF  = Math.round(width*0.015);

  const PROGRESS_BARS = [
    { label:"Web Development",  pct: 97 },
    { label:"AI Automation",    pct: 94 },
    { label:"UI/UX Design",     pct: 98 },
    { label:"Growth Marketing", pct: 92 },
  ];

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
      <AmbientBackground />

      {/* Green glow tint — signals "success" */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 60% 40% at 50% 50%,rgba(16,185,129,0.07) 0%,transparent 70%)",
      }} />

      {/* Title */}
      <div style={{
        position:"absolute", top:height*0.05, left:0, right:0,
        opacity: titleO, transform:`translateY(${titleY}px)`,
      }}>
        <SectionTitle eyebrow="Proven Results" headline="Numbers that matter" width={width} />
      </div>

      {/* Stat cards row */}
      <div style={{
        position:"absolute",
        top: height*0.24,
        left: width*0.04, right: width*0.04,
        display:"flex", gap: Math.round(width*0.022),
      }}>
        {STATS.map((s, i) => {
          const sf = stagger(SI+22, i, 10);
          const op = fadeIn(frame, sf, 16);
          const ty = slideUp(frame, fps, sf, 36);
          const counted = countUp(frame, sf, 55, s.val);
          return (
            <div key={i} style={{ flex:1, opacity:op, transform:`translateY(${ty}px)` }}>
              <GlassCard padding={Math.round(width*0.022)} radius={16} glow style={{ textAlign:"center" }}>
                <div style={{ fontSize:Math.round(width*0.032), marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontFamily:FONT.family, fontSize:bigF, fontWeight:900, color:s.color, letterSpacing:"-0.02em", lineHeight:1 }}>
                  {counted}{s.suffix}
                </div>
                <div style={{ fontFamily:FONT.family, fontSize:smF, color:COLORS.muted, marginTop:8, lineHeight:1.3 }}>
                  {s.label}
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* Reviews row */}
      <div style={{
        position:"absolute",
        top: height*0.55,
        left: width*0.04, right: width*0.04,
        display:"flex", gap: Math.round(width*0.02),
      }}>
        {REVIEWS.map((r, i) => {
          const sf = stagger(SI+60, i, 12);
          const op = fadeIn(frame, sf, 18);
          const tx = slideX(frame, fps, sf, i === 0 ? -30 : i === 2 ? 30 : 0);
          return (
            <div key={i} style={{ flex:1, opacity:op, transform:`translateX(${tx}px)` }}>
              <GlassCard padding={Math.round(width*0.018)} radius={14}>
                <Stars n={r.rating} size={Math.round(width*0.016)} />
                <div style={{
                  fontFamily:FONT.family, fontSize:rvF,
                  color:COLORS.offWhite, lineHeight:1.5,
                  margin:`${Math.round(width*0.010)}px 0`,
                }}>
                  "{r.text}"
                </div>
                <div style={{ fontFamily:FONT.family, fontSize:Math.round(width*0.012), color:COLORS.muted, fontWeight:600 }}>
                  {r.name} · <span style={{ fontWeight:400 }}>{r.role}</span>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* Right side: skill progress bars */}
      <div style={{
        position:"absolute",
        bottom: height*0.06,
        right: width*0.04,
        width: width*0.28,
        opacity: fadeIn(frame, SI+80, 18),
      }}>
        <GlassCard padding={20} radius={14}>
          <div style={{ fontFamily:FONT.family, fontSize:Math.round(width*0.013), fontWeight:700, color:COLORS.violetLight, marginBottom:14, letterSpacing:"0.1em", textTransform:"uppercase" }}>
            Service quality
          </div>
          {PROGRESS_BARS.map((b, i) => {
            const sf = stagger(SI+85, i, 8);
            const animPct = Math.round(b.pct * Math.min(1, Math.max(0, (frame - sf) / 30)));
            return <ProgressBar key={i} label={b.label} pct={animPct} width={width} color={COLORS.violetMid} />;
          })}
        </GlassCard>
      </div>
    </div>
  );
};
