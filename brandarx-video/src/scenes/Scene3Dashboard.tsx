// Scene 3 — Dashboard product reveal (240–390, 0:08–0:13)
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, GRADIENTS, SCENES } from "../tokens";
import { AmbientBackground } from "../components/AmbientBackground";
import { BrowserFrame, GlassCard, GradientText, MetricPill, ProgressBar, SectionTitle, NotifToast } from "../components/Atoms";
import { fadeIn, slideUp, slideX, scaleIn, stagger, countUp, wipeRight, parallaxScale } from "../utils/anim";

const SI = SCENES.dashboard.in;

// Mini chart — animated SVG bar chart
const MiniBarChart: React.FC<{ frame: number; width: number; height: number }> = ({ frame, width, height }) => {
  const bars = [42, 58, 35, 72, 65, 88, 74, 95, 82, 100];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display:"block" }}>
      {bars.map((h, i) => {
        const barW = (width / bars.length) * 0.6;
        const x = i * (width / bars.length) + (width / bars.length) * 0.2;
        const barH = (h / 100) * (height - 8);
        const y = height - barH;
        const animH = barH * Math.min(1, Math.max(0, (frame - SI - 40 - i*3) / 20));
        const isLast = i === bars.length - 1;
        return (
          <rect key={i}
            x={x} y={height - animH} width={barW} height={animH}
            rx={3}
            fill={isLast
              ? "url(#barGradHL)"
              : `rgba(109,40,217,${0.25 + (h/100)*0.35})`}
          />
        );
      })}
      <defs>
        <linearGradient id="barGradHL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Sparkline
const Sparkline: React.FC<{ frame: number; width: number; height: number }> = ({ frame, width, height }) => {
  const pts = [20,35,28,45,40,58,52,70,65,82,75,95];
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * width);
  const ys = pts.map(v => height - (v / 100) * height);
  const progress = Math.min(1, Math.max(0, (frame - SI - 50) / 35));
  const visiblePts = Math.round(progress * (pts.length - 1));
  if (visiblePts < 1) return null;
  const pathD = xs.slice(0, visiblePts + 1).map((x, i) => `${i===0?"M":"L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} style={{ display:"block", overflow:"visible" }}>
      <path d={pathD} fill="none" stroke={COLORS.violetLight} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={pathD + ` L${xs[visiblePts]},${height} L0,${height} Z`}
        fill="url(#sparkFill)" opacity={0.2} />
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const Scene3Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Parallax scale — slow push in
  const bgScale = parallaxScale(frame, SI, SCENES.dashboard.out, 0.04);

  // Title
  const titleO = fadeIn(frame, SI + 5, 18);
  const titleY = slideUp(frame, fps, SI + 5, 22);

  // Browser frame slides up
  const bfO   = fadeIn(frame, SI + 18, 20);
  const bfY   = slideUp(frame, fps, SI + 18, 60, { damping:20, stiffness:120 });
  const bfSc  = 0.92 + 0.08 * Math.min(1, Math.max(0, (frame - SI - 18) / 22));

  // Sidebar metric pills stagger
  const metricData = [
    { label:"Revenue", value:"+38%",  color: COLORS.green },
    { label:"Leads",   value:"1.24k", color: COLORS.violetLight },
    { label:"Conv.",   value:"9.4%",  color: COLORS.cyan },
  ];

  // Right-side notification toasts
  const toastData = [
    { icon:"🚀", title:"Campaign launched", sub:"BrandArx AI activated — 2:41 PM", color: COLORS.violetLight },
    { icon:"✅", title:"Project delivered",  sub:"Website redesign complete",       color: COLORS.green },
    { icon:"📈", title:"Traffic +214%",      sub:"Organic search spike detected",   color: COLORS.cyan },
  ];

  const bfW = Math.round(width * 0.66);
  const bfH = Math.round(height * 0.58);
  const pf  = Math.round(width * 0.014);

  // Stats count-up
  const stat1 = countUp(frame, SI + 40, 50, 150);
  const stat2 = countUp(frame, SI + 44, 50, 98);
  const stat3 = countUp(frame, SI + 48, 50, 2.4 * 10) / 10;

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
      <div style={{ transform:`scale(${bgScale})`, transformOrigin:"50% 50%", position:"absolute", inset:0 }}>
        <AmbientBackground />
      </div>

      {/* Title */}
      <div style={{
        position:"absolute", top: height*0.05, left:0, right:0,
        opacity: titleO, transform:`translateY(${titleY}px)`,
      }}>
        <SectionTitle eyebrow="Your Command Center" headline="One platform. Total clarity." width={width} />
      </div>

      {/* Browser frame — main dashboard */}
      <div style={{
        position:"absolute",
        top: height * 0.21,
        left: width * 0.03,
        opacity: bfO,
        transform:`translateY(${bfY}px) scale(${bfSc})`,
        transformOrigin:"50% 0%",
      }}>
        <BrowserFrame width={bfW} height={bfH}>
          {/* Dashboard interior */}
          <div style={{
            display:"flex", height:"100%",
            background: COLORS.surface,
          }}>
            {/* Left sidebar */}
            <div style={{
              width: bfW * 0.22,
              borderRight:"1px solid rgba(255,255,255,0.06)",
              padding: Math.round(bfW * 0.025),
              display:"flex", flexDirection:"column", gap: 8,
            }}>
              {["Dashboard","Projects","Analytics","Campaigns","Settings"].map((item, i) => (
                <div key={i} style={{
                  fontFamily: FONT.family,
                  fontSize: Math.round(bfW * 0.022),
                  color: i===0 ? COLORS.violetLight : COLORS.mutedDim,
                  fontWeight: i===0 ? 700 : 400,
                  padding:"7px 10px",
                  borderRadius: 8,
                  background: i===0 ? "rgba(109,40,217,0.15)" : "transparent",
                }}>
                  {item}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div style={{
              flex:1, padding: Math.round(bfW * 0.025),
              overflow:"hidden",
            }}>
              {/* Stat cards row */}
              <div style={{ display:"flex", gap: Math.round(bfW*0.018), marginBottom: Math.round(bfH*0.04) }}>
                {[
                  { label:"Projects", val:`${stat1}+`, col: COLORS.violetLight },
                  { label:"Satisfaction", val:`${stat2}%`, col: COLORS.green },
                  { label:"Avg Rating", val:`${stat3}★`, col: COLORS.amber },
                ].map((s, i) => {
                  const sf = stagger(SI + 40, i, 8);
                  const op = fadeIn(frame, sf, 14);
                  const sc = 0.85 + 0.15 * Math.min(1, Math.max(0,(frame-sf)/14));
                  return (
                    <div key={i} style={{
                      flex:1,
                      background:"rgba(255,255,255,0.04)",
                      border:"1px solid rgba(255,255,255,0.08)",
                      borderRadius:10, padding:Math.round(bfH*0.03),
                      opacity:op, transform:`scale(${sc})`,
                    }}>
                      <div style={{ fontFamily:FONT.family, fontSize:Math.round(bfW*0.019), color:COLORS.muted, marginBottom:4 }}>{s.label}</div>
                      <div style={{ fontFamily:FONT.family, fontSize:Math.round(bfW*0.030), fontWeight:800, color:s.col }}>{s.val}</div>
                    </div>
                  );
                })}
              </div>

              {/* Chart row */}
              <div style={{ display:"flex", gap: Math.round(bfW*0.018) }}>
                <div style={{
                  flex:2,
                  background:"rgba(255,255,255,0.03)",
                  border:"1px solid rgba(255,255,255,0.07)",
                  borderRadius:10, padding:Math.round(bfH*0.025),
                  opacity: fadeIn(frame, SI+52, 16),
                }}>
                  <div style={{ fontFamily:FONT.family, fontSize:Math.round(bfW*0.017), color:COLORS.muted, marginBottom:8 }}>Revenue this month</div>
                  <MiniBarChart frame={frame} width={bfW*0.38} height={bfH*0.20} />
                </div>
                <div style={{
                  flex:1,
                  background:"rgba(255,255,255,0.03)",
                  border:"1px solid rgba(255,255,255,0.07)",
                  borderRadius:10, padding:Math.round(bfH*0.025),
                  opacity: fadeIn(frame, SI+58, 16),
                }}>
                  <div style={{ fontFamily:FONT.family, fontSize:Math.round(bfW*0.017), color:COLORS.muted, marginBottom:8 }}>Organic traffic</div>
                  <Sparkline frame={frame} width={bfW*0.20} height={bfH*0.20} />
                </div>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </div>

      {/* Right-side toasts */}
      <div style={{
        position:"absolute",
        top: height * 0.28,
        right: width * 0.02,
        width: width * 0.26,
        display:"flex", flexDirection:"column", gap: Math.round(height*0.018),
      }}>
        {toastData.map((t, i) => {
          const sf = stagger(SI + 60, i, 14);
          const op = fadeIn(frame, sf, 16);
          const tx = slideX(frame, fps, sf, 50);
          return (
            <div key={i} style={{ opacity:op, transform:`translateX(${tx}px)` }}>
              <NotifToast {...t} fontSize={Math.round(width*0.013)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
