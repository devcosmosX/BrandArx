// Scene 7 — Outro / CTA (780–900, 0:26–0:30)
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENTS, SCENES } from "../tokens";
import { AmbientBackground } from "../components/AmbientBackground";
import { GradientText, Logo } from "../components/Atoms";
import { fadeIn, scaleIn, slideUp, wipeRight } from "../utils/anim";

const SI = SCENES.outro.in;

export const Scene7Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const glowO  = fadeIn(frame, SI,    22);
  const logoO  = fadeIn(frame, SI+10, 20);
  const logoSc = scaleIn(frame, fps, SI+10, 0.72, { damping:20, stiffness:110 });

  // CTA headline types in via wipe
  const ctaClip = wipeRight(frame, SI+26, 30);

  const questionO = fadeIn(frame, SI+28, 20);
  const questionY = slideUp(frame, fps, SI+28, 24);

  const btnO  = fadeIn(frame, SI+44, 20);
  const btnY  = slideUp(frame, fps, SI+44, 22);

  const subO  = fadeIn(frame, SI+58, 18);
  const subY  = slideUp(frame, fps, SI+58, 18);

  // Pulsing ring around the CTA button
  const ringScale = 1 + 0.08 * Math.sin((frame / fps) * 2.5);
  const ringO = btnO * (0.3 + 0.2 * Math.sin((frame / fps) * 2.5));

  const logoMark = Math.round(width * 0.054);
  const logoText = Math.round(width * 0.057);
  const ctaFont  = Math.round(width * 0.032);
  const btnFont  = Math.round(width * 0.020);
  const qFont    = Math.round(width * 0.025);

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
      <AmbientBackground />

      {/* Hero glow arc — matches cold open */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0,
        height: height * 0.68,
        background: GRADIENTS.heroGlow,
        opacity: glowO,
      }} />

      {/* Top glow */}
      <div style={{
        position:"absolute", top:0, left:0, right:0,
        height: height * 0.4,
        background: GRADIENTS.topGlow,
        opacity: glowO * 0.6,
      }} />

      {/* Center content */}
      <div style={{
        position:"absolute", inset:0,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        gap: Math.round(height * 0.032),
      }}>

        {/* Logo */}
        <div style={{ opacity:logoO, transform:`scale(${logoSc})` }}>
          <Logo markSize={logoMark} textSize={logoText} />
        </div>

        {/* CTA headline — wipe reveal */}
        <div style={{
          clipPath: ctaClip,
          textAlign:"center",
          padding:`0 ${width*0.06}px`,
        }}>
          <div style={{
            fontFamily: FONT.family,
            fontSize: ctaFont,
            fontWeight: 900,
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
          }}>
            <GradientText>
              Your brand deserves<br />
              <span style={{ color: COLORS.white }}>to be unmissable.</span>
            </GradientText>
          </div>
        </div>

        {/* Question */}
        <div style={{
          opacity: questionO,
          transform:`translateY(${questionY}px)`,
          textAlign:"center",
        }}>
          <span style={{
            fontFamily: FONT.family,
            fontSize: qFont,
            fontWeight: 400,
            color: COLORS.muted,
            letterSpacing:"0.005em",
          }}>
            Ready to transform your digital presence?
          </span>
        </div>

        {/* CTA button group */}
        <div style={{
          opacity: btnO,
          transform:`translateY(${btnY}px)`,
          display:"flex", flexDirection:"column", alignItems:"center", gap:14,
        }}>
          {/* Pulsing ring */}
          <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{
              position:"absolute",
              width: "120%", height: "120%",
              borderRadius:999,
              border:`1.5px solid ${COLORS.violetLight}`,
              transform:`scale(${ringScale})`,
              opacity: ringO,
            }} />
            <div style={{
              background: GRADIENTS.ctaBtn,
              borderRadius:999,
              padding:`${Math.round(height*0.024)}px ${Math.round(width*0.060)}px`,
              fontFamily: FONT.family,
              fontSize: btnFont,
              fontWeight: 800,
              color: COLORS.white,
              letterSpacing:"0.015em",
              boxShadow:`0 0 40px rgba(109,40,217,0.70), 0 12px 32px rgba(0,0,0,0.40)`,
              display:"inline-block",
            }}>
              Get Started — It's Free
            </div>
          </div>

          <div style={{
            fontFamily: FONT.family,
            fontSize: Math.round(width * 0.013),
            color: COLORS.mutedDim,
          }}>
            No credit card required · Results in 48 hours
          </div>
        </div>

        {/* Footer */}
        <div style={{
          opacity: subO,
          transform:`translateY(${subY}px)`,
          textAlign:"center",
        }}>
          <div style={{
            fontFamily:FONT.family,
            fontSize:Math.round(width*0.012),
            color:COLORS.mutedDim,
            letterSpacing:"0.05em",
          }}>
            brandarx.com · hello@brandarx.com
          </div>
        </div>
      </div>
    </div>
  );
};
