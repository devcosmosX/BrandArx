// Scene 4 — AI Automation showcase (390–510, 0:13–0:17)
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENTS, SCENES } from "../tokens";
import { AmbientBackground } from "../components/AmbientBackground";
import { GlassCard, GradientText, SectionTitle } from "../components/Atoms";
import { fadeIn, slideUp, slideX, stagger, clamp01 } from "../utils/anim";

const SI = SCENES.aiAuto.in;

// Typing indicator
const Dots: React.FC<{ frame: number; fps: number; size: number }> = ({ frame, fps, size }) => {
  const t = (frame / fps) % 1.0;
  return (
    <div style={{ display:"flex", gap:4, padding:"8px 12px", alignItems:"center" }}>
      {[0, 0.25, 0.5].map((d, i) => {
        const phase = ((t - d + 1) % 1);
        const s = phase < 0.35 ? 0.5 + (phase / 0.35) * 0.9 : 1.4 - ((phase - 0.35) / 0.65) * 0.9;
        return (
          <div key={i} style={{
            width: size, height: size, borderRadius:"50%",
            background: COLORS.violetLight,
            transform:`scale(${Math.max(0.5, s)})`,
            opacity: 0.5 + 0.5 * Math.max(0, s - 0.5),
          }} />
        );
      })}
    </div>
  );
};

// Chat bubble
const Bubble: React.FC<{
  text: string; from:"bot"|"user";
  opacity: number; tx: number; fontSize: number;
}> = ({ text, from, opacity, tx, fontSize }) => {
  const isBot = from === "bot";
  return (
    <div style={{
      display:"flex", justifyContent: isBot ? "flex-start" : "flex-end",
      opacity, transform:`translateX(${tx}px)`,
      marginBottom: 10,
    }}>
      <div style={{
        maxWidth:"80%",
        padding:"10px 15px",
        borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
        background: isBot ? "rgba(109,40,217,0.20)" : "rgba(255,255,255,0.07)",
        border:`1px solid ${isBot ? "rgba(167,139,250,0.30)" : "rgba(255,255,255,0.10)"}`,
        fontFamily: FONT.family,
        fontSize,
        color: COLORS.white,
        lineHeight: 1.45,
      }}>
        {text}
      </div>
    </div>
  );
};

// Automation flow node
const FlowNode: React.FC<{
  label: string; icon: string;
  active: boolean; opacity: number; ty: number;
  width: number;
}> = ({ label, icon, active, opacity, ty, width }) => (
  <div style={{
    opacity, transform:`translateY(${ty}px)`,
    display:"flex", flexDirection:"column", alignItems:"center", gap:6,
  }}>
    <div style={{
      width: Math.round(width*0.055), height: Math.round(width*0.055),
      borderRadius: Math.round(width*0.015),
      background: active ? GRADIENTS.violet : "rgba(255,255,255,0.05)",
      border:`1px solid ${active ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.10)"}`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize: Math.round(width*0.024),
      boxShadow: active ? "0 0 20px rgba(109,40,217,0.5)" : "none",
    }}>
      {icon}
    </div>
    <div style={{
      fontFamily: FONT.family,
      fontSize: Math.round(width*0.012),
      color: active ? COLORS.white : COLORS.mutedDim,
      fontWeight: active ? 700 : 400,
      textAlign:"center",
      maxWidth: Math.round(width*0.10),
      lineHeight:1.3,
    }}>
      {label}
    </div>
  </div>
);

// Arrow connector
const Arrow: React.FC<{ opacity: number; width: number }> = ({ opacity, width }) => (
  <div style={{
    opacity, display:"flex", alignItems:"center",
    paddingBottom: Math.round(width*0.022),
  }}>
    <div style={{
      height:2, width: Math.round(width*0.035),
      background:`linear-gradient(90deg,${COLORS.violetDim},${COLORS.violetLight})`,
    }} />
    <div style={{
      width:0, height:0,
      borderTop:`5px solid transparent`,
      borderBottom:`5px solid transparent`,
      borderLeft:`7px solid ${COLORS.violetLight}`,
    }} />
  </div>
);

export const Scene4AI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const localF = frame - SI;

  // Title
  const titleO = fadeIn(frame, SI+5, 18);
  const titleY = slideUp(frame, fps, SI+5, 22);

  // Chat card
  const chatO  = fadeIn(frame, SI+16, 18);
  const chatX  = slideX(frame, fps, SI+16, -55);

  // Automation flow card
  const flowO  = fadeIn(frame, SI+20, 18);
  const flowX  = slideX(frame, fps, SI+20, 55);

  // Bubbles
  const b1O = fadeIn(frame, SI+28, 14);
  const b1X = slideX(frame, fps, SI+28, -18);
  const dotsO = clamp01(localF >= 44 && localF < 62 ? Math.min(1,(localF-44)/8) : localF>=62 ? Math.max(0,1-(localF-62)/8) : 0);
  const b2O = fadeIn(frame, SI+62, 14);
  const b2X = slideX(frame, fps, SI+62, 18);
  const b3O = fadeIn(frame, SI+78, 14);
  const b3X = slideX(frame, fps, SI+78, -18);

  // Flow nodes: trigger, process, notify, deliver — each activates in sequence
  const nodes = [
    { label:"Lead Captured", icon:"📥", activeFrom: SI+30 },
    { label:"AI Qualifies",  icon:"🤖", activeFrom: SI+44 },
    { label:"Auto-Assign",   icon:"⚡", activeFrom: SI+58 },
    { label:"Report Sent",   icon:"📊", activeFrom: SI+72 },
  ];

  const bfS  = Math.round(width*0.014);
  const chatW = Math.round(width*0.42);
  const flowW = Math.round(width*0.42);

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
      <AmbientBackground />

      {/* Title */}
      <div style={{
        position:"absolute", top:height*0.05, left:0, right:0,
        opacity:titleO, transform:`translateY(${titleY}px)`,
      }}>
        <SectionTitle
          eyebrow="AI Automation"
          headline="Your business, on autopilot"
          sub="Intelligent workflows that qualify leads, assign tasks, and deliver reports — 24/7."
          width={width}
        />
      </div>

      {/* Chat card */}
      <div style={{
        position:"absolute",
        top: height*0.30,
        left: width*0.04,
        width: chatW,
        opacity: chatO,
        transform:`translateX(${chatX}px)`,
      }}>
        <GlassCard padding={18} radius={18} glow>
          {/* Header */}
          <div style={{
            display:"flex", alignItems:"center", gap:10,
            paddingBottom:14, borderBottom:"1px solid rgba(255,255,255,0.06)",
            marginBottom:14,
          }}>
            <div style={{
              width:34, height:34, borderRadius:"50%",
              background: GRADIENTS.violet,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily: FONT.family, fontSize:14, fontWeight:800, color:"#fff",
              flexShrink:0,
            }}>B</div>
            <div>
              <div style={{ fontFamily:FONT.family, fontSize:Math.round(width*0.015), fontWeight:700, color:COLORS.white }}>BrandArx AI</div>
              <div style={{ fontFamily:FONT.family, fontSize:Math.round(width*0.012), color:COLORS.green }}>● Active 24/7</div>
            </div>
          </div>

          <Bubble text="Hi! 👋 I've qualified 3 new leads from your latest campaign." from="bot" opacity={b1O} tx={b1X} fontSize={bfS} />
          {dotsO > 0.01 && (
            <div style={{ opacity:dotsO }}>
              <div style={{
                display:"inline-flex",
                background:"rgba(109,40,217,0.18)",
                border:"1px solid rgba(167,139,250,0.30)",
                borderRadius:"4px 16px 16px 16px",
                marginBottom:10,
              }}>
                <Dots frame={frame} fps={fps} size={7} />
              </div>
            </div>
          )}
          <Bubble text="Which leads should I prioritize this week?" from="user" opacity={b2O} tx={b2X} fontSize={bfS} />
          <Bubble text="Top priority: Acme Corp (₹2.4L potential). I've already drafted the proposal and booked a discovery call for Thursday 2PM." from="bot" opacity={b3O} tx={b3X} fontSize={bfS} />
        </GlassCard>
      </div>

      {/* Automation flow card */}
      <div style={{
        position:"absolute",
        top: height*0.30,
        right: width*0.04,
        width: flowW,
        opacity: flowO,
        transform:`translateX(${flowX}px)`,
      }}>
        <GlassCard padding={24} radius={18}>
          <div style={{
            fontFamily:FONT.family,
            fontSize: Math.round(width*0.014),
            fontWeight:700, letterSpacing:"0.15em",
            textTransform:"uppercase",
            color:COLORS.violetLight,
            marginBottom:20,
          }}>
            Live Automation Flow
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0 }}>
            {nodes.map((node, i) => {
              const active = frame >= node.activeFrom;
              const op = fadeIn(frame, stagger(SI+30, i, 14), 14);
              const ty = (active ? 0 : 8) * Math.max(0, 1 - (frame - stagger(SI+30, i, 14)) / 14);
              return (
                <React.Fragment key={i}>
                  <FlowNode label={node.label} icon={node.icon} active={active} opacity={op} ty={ty} width={width} />
                  {i < nodes.length - 1 && (
                    <Arrow opacity={fadeIn(frame, stagger(SI+38, i, 14), 12)} width={width} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* ROI pill */}
          <div style={{
            marginTop:20,
            padding:"10px 16px",
            borderRadius:10,
            background:"rgba(16,185,129,0.10)",
            border:"1px solid rgba(16,185,129,0.25)",
            opacity: fadeIn(frame, SI+85, 16),
          }}>
            <div style={{ fontFamily:FONT.family, fontSize:Math.round(width*0.013), color:COLORS.green, fontWeight:600 }}>
              ⚡ 18 hours of manual work automated this week
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
