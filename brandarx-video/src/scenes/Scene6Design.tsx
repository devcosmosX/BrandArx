// Scene 6 — Design / UI Showcase (660–780, 0:22–0:26)
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENTS, SCENES } from "../tokens";
import { AmbientBackground } from "../components/AmbientBackground";
import { GlassCard, GradientText, SectionTitle } from "../components/Atoms";
import { fadeIn, slideUp, slideX, scaleIn, stagger, wipeRight } from "../utils/anim";

const SI = SCENES.design.in;

// UI Card mock — shows a product card design
const UICardMock: React.FC<{
  title: string; tag: string; accent: string; icon: string;
  width: number;
}> = ({ title, tag, accent, icon, width }) => {
  const p = Math.round(width * 0.020);
  const r = 14;
  return (
    <div style={{
      background: `linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))`,
      border:`1px solid rgba(255,255,255,0.10)`,
      borderRadius: r,
      padding: p,
      boxShadow:`0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
    }}>
      {/* Icon area */}
      <div style={{
        width: Math.round(width*0.048), height: Math.round(width*0.048),
        borderRadius: Math.round(width*0.012),
        background:`${accent}22`,
        border:`1px solid ${accent}44`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize: Math.round(width*0.026),
        marginBottom: Math.round(width*0.012),
      }}>
        {icon}
      </div>
      {/* Tag */}
      <div style={{
        display:"inline-block",
        padding:`3px 10px`,
        borderRadius:99,
        background:`${accent}18`,
        border:`1px solid ${accent}35`,
        fontFamily:FONT.family,
        fontSize: Math.round(width*0.011),
        fontWeight:700,
        color:accent,
        letterSpacing:"0.1em",
        textTransform:"uppercase",
        marginBottom: Math.round(width*0.008),
      }}>
        {tag}
      </div>
      {/* Title */}
      <div style={{
        fontFamily:FONT.family,
        fontSize: Math.round(width*0.016),
        fontWeight:700,
        color:COLORS.white,
        lineHeight:1.3,
      }}>
        {title}
      </div>
      {/* Fake progress */}
      <div style={{
        marginTop: Math.round(width*0.010),
        height:3,
        borderRadius:99,
        background:"rgba(255,255,255,0.06)",
        overflow:"hidden",
      }}>
        <div style={{
          height:"100%", borderRadius:99,
          width:`${40 + Math.random()*50}%`,
          background:`linear-gradient(90deg,${accent},rgba(255,255,255,0.5))`,
        }} />
      </div>
    </div>
  );
};

const CARDS = [
  { title:"Website Redesign Sprint", tag:"Web Dev",  accent:COLORS.violetLight, icon:"🌐" },
  { title:"AI Chatbot Integration",  tag:"Automation",accent:COLORS.cyan,        icon:"🤖" },
  { title:"Brand Identity System",   tag:"Design",    accent:COLORS.amber,       icon:"🎨" },
  { title:"SEO Content Campaign",    tag:"Marketing", accent:COLORS.green,       icon:"📈" },
  { title:"Mobile App UI/UX",        tag:"UI/UX",     accent:COLORS.violetMid,   icon:"📱" },
  { title:"E-commerce Conversion",   tag:"Growth",    accent:COLORS.cyan,        icon:"🛒" },
] as const;

export const Scene6Design: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleO = fadeIn(frame, SI+5, 18);
  const titleY = slideUp(frame, fps, SI+5, 22);

  // Feature callout strips — left side
  const featureLines = [
    { icon:"✦", text:"Pixel-perfect design systems" },
    { icon:"✦", text:"Responsive across all devices" },
    { icon:"✦", text:"Premium micro-interactions" },
    { icon:"✦", text:"Handoff-ready developer specs" },
  ] as const;

  const cardCols = 3;
  const cardW = Math.round(width * 0.22);

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
      <AmbientBackground />

      {/* Title */}
      <div style={{
        position:"absolute", top:height*0.05, left:0, right:0,
        opacity:titleO, transform:`translateY(${titleY}px)`,
      }}>
        <SectionTitle
          eyebrow="Crafted with Precision"
          headline="Design that converts"
          sub="Every pixel intentional. Every interaction purposeful."
          width={width}
        />
      </div>

      {/* Card grid */}
      <div style={{
        position:"absolute",
        top: height*0.30,
        left: width*0.04,
        width: cardCols * cardW + (cardCols-1) * Math.round(width*0.018),
        display:"grid",
        gridTemplateColumns:`repeat(${cardCols},1fr)`,
        gap: Math.round(width*0.018),
      }}>
        {CARDS.map((c, i) => {
          const sf = stagger(SI+22, i, 9);
          const op = fadeIn(frame, sf, 15);
          const ty = slideUp(frame, fps, sf, 30);
          const sc = scaleIn(frame, fps, sf, 0.88);
          return (
            <div key={i} style={{
              opacity:op,
              transform:`translateY(${ty}px) scale(${sc})`,
            }}>
              <UICardMock {...c} width={cardW} />
            </div>
          );
        })}
      </div>

      {/* Right callout panel */}
      <div style={{
        position:"absolute",
        top: height*0.30,
        right: width*0.04,
        width: width*0.22,
        opacity: fadeIn(frame, SI+35, 18),
        transform:`translateX(${slideX(frame, fps, SI+35, 40)}px)`,
      }}>
        <GlassCard padding={24} radius={16} glow>
          <div style={{
            fontFamily:FONT.family, fontSize:Math.round(width*0.014),
            fontWeight:700, color:COLORS.violetLight,
            letterSpacing:"0.15em", textTransform:"uppercase",
            marginBottom:18,
          }}>
            What we deliver
          </div>
          {featureLines.map((f, i) => {
            const sf = stagger(SI+42, i, 10);
            return (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:10,
                marginBottom:14,
                opacity: fadeIn(frame, sf, 14),
                transform:`translateX(${slideX(frame, fps, sf, 20)}px)`,
              }}>
                <div style={{
                  color:COLORS.violetLight, fontSize:Math.round(width*0.016),
                  flexShrink:0,
                }}>
                  {f.icon}
                </div>
                <div style={{
                  fontFamily:FONT.family, fontSize:Math.round(width*0.014),
                  color:COLORS.offWhite, lineHeight:1.4,
                }}>
                  {f.text}
                </div>
              </div>
            );
          })}

          {/* Wipe-reveal trust badge */}
          <div style={{
            marginTop:20,
            clipPath: wipeRight(frame, SI+75, 28),
            background:GRADIENTS.violetSharp,
            borderRadius:10, padding:"10px 16px",
            textAlign:"center",
          }}>
            <div style={{ fontFamily:FONT.family, fontSize:Math.round(width*0.014), fontWeight:700, color:"#fff" }}>
              Trusted by 150+ brands
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
