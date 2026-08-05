// ─────────────────────────────────────────────────────────────
// Shared UI atoms — v2
// ─────────────────────────────────────────────────────────────
import React from "react";
import { COLORS, FONT, GRADIENTS } from "../tokens";

// ── Logo mark ─────────────────────────────────────────────────
export const LogoMark: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <div style={{
    width: size, height: size,
    background: GRADIENTS.violet,
    borderRadius: size * 0.22,
    transform: "rotate(45deg)",
    flexShrink: 0,
    boxShadow: `0 0 ${size*0.7}px rgba(109,40,217,0.75), 0 0 ${size*1.4}px rgba(109,40,217,0.3)`,
  }} />
);

// ── Wordmark ──────────────────────────────────────────────────
export const Wordmark: React.FC<{ size?: number; color?: string }> = ({
  size = 40, color = COLORS.white,
}) => (
  <span style={{
    fontFamily: FONT.family, fontSize: size, fontWeight: 800,
    color, letterSpacing: "-0.025em", lineHeight: 1,
  }}>
    BrandArx
  </span>
);

// ── Logo group ────────────────────────────────────────────────
export const Logo: React.FC<{ markSize?: number; textSize?: number }> = ({
  markSize = 36, textSize = 38,
}) => (
  <div style={{ display:"flex", alignItems:"center", gap: markSize*0.55 }}>
    <LogoMark size={markSize} />
    <Wordmark size={textSize} />
  </div>
);

// ── GlassCard ─────────────────────────────────────────────────
export const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  padding?: number;
  radius?: number;
  glow?: boolean;
}> = ({ children, style, padding = 28, radius = 16, glow = false }) => (
  <div style={{
    background: COLORS.cardBg,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: radius,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    padding,
    boxShadow: glow
      ? "0 8px 40px rgba(109,40,217,0.25), 0 2px 0 rgba(255,255,255,0.06) inset"
      : "0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset",
    ...style,
  }}>
    {children}
  </div>
);

// ── Gradient text ─────────────────────────────────────────────
export const GradientText: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  gradient?: string;
}> = ({ children, style, gradient = GRADIENTS.violetText }) => (
  <span style={{
    background: gradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    ...style,
  }}>
    {children}
  </span>
);

// ── SectionTitle (eyebrow + headline) ─────────────────────────
export const SectionTitle: React.FC<{
  eyebrow: string;
  headline: string;
  sub?: string;
  width: number;
  headlineSize?: number;
}> = ({ eyebrow, headline, sub, width, headlineSize }) => {
  const hSize = headlineSize ?? Math.round(width * 0.040);
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{
        fontFamily: FONT.family,
        fontSize: Math.round(width * 0.012),
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: COLORS.violetLight,
        marginBottom: Math.round(width * 0.012),
      }}>
        {eyebrow}
      </div>
      <div style={{
        fontFamily: FONT.family,
        fontSize: hSize,
        fontWeight: 800,
        letterSpacing: "-0.025em",
        lineHeight: 1.15,
        color: COLORS.white,
      }}>
        <GradientText>{headline}</GradientText>
      </div>
      {sub && (
        <div style={{
          fontFamily: FONT.family,
          fontSize: Math.round(width * 0.018),
          color: COLORS.muted,
          marginTop: Math.round(width * 0.012),
          lineHeight: 1.55,
          maxWidth: width * 0.55,
          margin: `${Math.round(width * 0.012)}px auto 0`,
        }}>
          {sub}
        </div>
      )}
    </div>
  );
};

// ── MetricPill ────────────────────────────────────────────────
export const MetricPill: React.FC<{
  label: string;
  value: string;
  color?: string;
  fontSize?: number;
}> = ({ label, value, color = COLORS.violetLight, fontSize = 14 }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 999,
    padding: "6px 14px",
  }}>
    <div style={{
      width: 7, height: 7, borderRadius:"50%",
      background: color,
      boxShadow: `0 0 6px ${color}`,
      flexShrink: 0,
    }} />
    <span style={{ fontFamily:FONT.family, fontSize, color:COLORS.muted, fontWeight:500 }}>{label}</span>
    <span style={{ fontFamily:FONT.family, fontSize, color, fontWeight:700 }}>{value}</span>
  </div>
);

// ── ProgressBar ───────────────────────────────────────────────
export const ProgressBar: React.FC<{
  label: string;
  pct: number;
  color?: string;
  width: number;
}> = ({ label, pct, color = COLORS.violetMid, width }) => (
  <div style={{ marginBottom: Math.round(width * 0.010) }}>
    <div style={{
      display:"flex", justifyContent:"space-between", marginBottom: 5,
    }}>
      <span style={{ fontFamily:FONT.family, fontSize:Math.round(width*0.014), color:COLORS.muted }}>{label}</span>
      <span style={{ fontFamily:FONT.family, fontSize:Math.round(width*0.014), color, fontWeight:700 }}>{pct}%</span>
    </div>
    <div style={{
      width:"100%", height:5, borderRadius:99,
      background:"rgba(255,255,255,0.07)",
      overflow:"hidden",
    }}>
      <div style={{
        width:`${pct}%`, height:"100%", borderRadius:99,
        background: `linear-gradient(90deg,${color},${COLORS.violetLight})`,
        boxShadow:`0 0 8px ${color}`,
      }} />
    </div>
  </div>
);

// ── NotifToast ────────────────────────────────────────────────
export const NotifToast: React.FC<{
  icon: string;
  title: string;
  sub: string;
  color?: string;
  fontSize?: number;
}> = ({ icon, title, sub, color = COLORS.green, fontSize = 14 }) => (
  <GlassCard padding={14} radius={12} style={{ display:"flex", alignItems:"center", gap:12 }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: `${color}22`,
      border: `1px solid ${color}44`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize: 18, flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontFamily:FONT.family, fontSize, fontWeight:700, color:COLORS.white, lineHeight:1.2 }}>{title}</div>
      <div style={{ fontFamily:FONT.family, fontSize:fontSize-2, color:COLORS.muted, marginTop:2 }}>{sub}</div>
    </div>
  </GlassCard>
);

// ── Browser chrome wrapper ────────────────────────────────────
export const BrowserFrame: React.FC<{
  children: React.ReactNode;
  width: number;
  height: number;
}> = ({ children, width, height }) => (
  <div style={{
    width, height,
    borderRadius: 14,
    overflow:"hidden",
    border:"1px solid rgba(255,255,255,0.10)",
    boxShadow:"0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
    background: COLORS.surface,
  }}>
    {/* Chrome bar */}
    <div style={{
      height: 36, background:"rgba(255,255,255,0.03)",
      borderBottom:"1px solid rgba(255,255,255,0.07)",
      display:"flex", alignItems:"center", padding:"0 14px", gap:8,
    }}>
      {["#EF4444","#F59E0B","#22C55E"].map((c,i) => (
        <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:c, flexShrink:0 }} />
      ))}
      <div style={{
        flex:1, height:9, background:"rgba(255,255,255,0.05)",
        borderRadius:99, marginLeft:8,
      }} />
    </div>
    {/* Content */}
    <div style={{ width:"100%", height:`calc(100% - 36px)`, overflow:"hidden" }}>
      {children}
    </div>
  </div>
);
