import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ChevronDown, Check, Zap, Sparkles, ShieldCheck, Layers, Clock, ArrowRight, Sun, Moon, Code2, BrainCircuit, LineChart, AppWindow, FlaskConical, Database, Headphones, Server, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { PaymentModal } from "../components/PaymentModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgencyPro — Professional Web Development & AI Automation Services" },
      {
        name: "description",
        content:
          "Transform your business with expert web development, AI automation, UI/UX design, and digital marketing. Custom solutions for startups and enterprises.",
      },
    ],
  }),
  component: Index,
});

/* ---------- Login Button ---------- */
function LoginButton() {
  const { openLoginModal, isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <span className="text-sm text-foreground/80">Welcome, {user.name}!</span>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link
            to="/dashboard"
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet to-violet-glow px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet/40 hover:scale-105 sm:w-auto sm:px-7 sm:py-3"
          >
            Dashboard
          </Link>
          <button
            onClick={logout}
            className="inline-flex w-full items-center justify-center rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-foreground/90 transition hover:bg-white/5 hover:text-foreground sm:w-auto sm:px-7 sm:py-3"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={openLoginModal}
      data-auth-trigger="true"
      className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-white via-white/90 to-violet-glow px-6 py-2.5 text-sm font-medium text-[oklch(0.15_0.05_280)] shadow-lg shadow-violet/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet/40 hover:scale-105 sm:w-auto sm:px-7 sm:py-3 md:text-base lg:px-8 lg:py-3.5"
    >
      Start Your Journey
    </button>
  );
}

/* ---------- Theme toggle hook ---------- */
function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('theme');
    if (stored === 'light') return false;
    if (stored === 'dark') return true;
    return !document.documentElement.classList.contains('light');
  });

  // Sync class on mount based on stored preference
  useEffect(() => {
    const html = document.documentElement;
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      html.classList.add('light');
      setIsDark(false);
    } else if (stored === 'dark') {
      html.classList.remove('light');
      setIsDark(true);
    }
  }, []);

  const toggle = useCallback(() => {
    const html = document.documentElement;
    if (html.classList.contains('light')) {
      html.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    } else {
      html.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    }
  }, []);

  return { isDark, toggle };
}

/* ---------- Nav ---------- */
function Nav() {
  const { openLoginModal } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    if (scrolled && mobileMenuOpen) setMobileMenuOpen(false);
  }, [scrolled]);

  const links = [
    { name: "Work",      href: "#portfolio" },
    { name: "Pricing",   href: "#pricing"   },
    { name: "About",     href: "#about"     },
    { name: "Blog",      href: "#blog"      },
    { name: "Contact",   href: "#contact"   },
  ];

  const serviceCategories = [
    { name: "Website Development", items: ["Custom Websites", "E-commerce", "SaaS Platforms", "Landing Pages"] },
    { name: "AI Automation",       items: ["AI Chatbots", "Workflow Automation", "CRM Integration", "Voice AI"] },
    { name: "UI/UX Design",        items: ["Website Design", "Mobile App Design", "Dashboard Design", "Prototyping"] },
    { name: "Digital Growth",      items: ["SEO Services", "Marketing Automation", "Analytics", "CRO"] },
  ];

  return (
    <>
      {/* Inline keyframes for ascend effect */}
      <style>{`
        .nav-link-wrap { overflow: hidden; display: inline-flex; flex-direction: column; height: 1.1em; }
        .nav-link-text { display: block; transition: transform 0.28s cubic-bezier(0.22,1,0.36,1); line-height: 1.1em; }
        .nav-link-text-clone { display: block; line-height: 1.1em; }
        .nav-link-hover:hover .nav-link-text { transform: translateY(-100%); }
        .nav-link-hover:hover .nav-link-text-clone { transform: translateY(-100%); }
        .mobile-menu-enter { animation: mobileMenuIn 0.28s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[oklch(0_0_0)]/90 backdrop-blur-2xl border-b border-white/[0.06] py-2.5'
          : 'bg-transparent py-4'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 md:px-10">

          {/* ── Logo ── */}
          <a href="#" className="group flex items-center select-none">
            <span className="text-[19px] font-light tracking-[-0.02em] text-white">
              Brand<span className="text-white">Arx</span>
            </span>
          </a>

          {/* ── Nav links (desktop) ── */}
          <nav className="hidden items-center gap-0.5 lg:flex">

            {/* Services dropdown */}
            <div className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}>

              <button className="nav-link-hover group flex items-center gap-1 px-4 py-2.5 text-[13.5px] font-medium text-white/55 transition-colors duration-200 hover:text-white">
                <span className="nav-link-wrap">
                  <span className="nav-link-text">Services</span>
                  <span className="nav-link-text-clone" aria-hidden>Services</span>
                </span>
                <ChevronDown className={`h-3 w-3 transition-all duration-300 ${isServicesOpen ? 'rotate-180 text-white' : 'text-white/40'}`}/>
              </button>

              {/* Mega-dropdown */}
              <div className={`absolute left-1/2 top-full mt-2 w-[620px] -translate-x-1/3 transition-all duration-250 ${
                isServicesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}>
                {/* top connector bridge */}
                <div className="mx-auto mb-0 h-2 w-px bg-white/10"/>
                <div className="rounded-2xl border border-white/[0.08] bg-[#0d0c1e]/97 p-5 shadow-2xl shadow-black/60 backdrop-blur-2xl">
                  {/* header row */}
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">Our Services</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {serviceCategories.map((cat, idx) => (
                      <div key={cat.name}
                        style={{ animation: isServicesOpen ? `fadeInUp 0.35s ease-out ${idx * 0.07}s both` : 'none' }}>
                        <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35">{cat.name}</p>
                        {cat.items.map(item => (
                          <a key={item} href="#"
                            className="group/i flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-white/55 transition-all duration-200 hover:bg-white/[0.05] hover:text-white">
                            <span className="h-[3px] w-[3px] rounded-full bg-violet-glow opacity-0 transition-opacity duration-200 group-hover/i:opacity-100 shrink-0"/>
                            {item}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                  {/* footer CTA */}
                  <div className="mt-4 border-t border-white/[0.06] pt-4">
                    <a href="#" className="group/all flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-2.5 transition-colors duration-200 hover:bg-white/[0.07]">
                      <span className="text-[13px] font-medium text-white/70 group-hover/all:text-white">View all services</span>
                      <ArrowRight className="h-3.5 w-3.5 text-white/30 transition-transform duration-200 group-hover/all:translate-x-1 group-hover/all:text-white"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Regular links — ascend on hover */}
            {links.map(link => (
              <a key={link.name} href={link.href}
                className="nav-link-hover group relative px-4 py-2.5 text-[13.5px] font-medium text-white/55 transition-colors duration-200 hover:text-white">
                <span className="nav-link-wrap">
                  <span className="nav-link-text">{link.name}</span>
                  <span className="nav-link-text-clone" aria-hidden>{link.name}</span>
                </span>
              </a>
            ))}
          </nav>

          {/* ── CTA (desktop) ── */}
          <div className="flex items-center gap-2.5">
            {/* Sign in — ghost */}
            <button
              onClick={openLoginModal}
              data-auth-trigger="login"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13.5px] font-medium text-white/60 transition-all duration-200 hover:bg-white/[0.06] hover:text-white active:scale-95"
            >
              Sign in
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden lg:inline-flex items-center justify-center rounded-lg w-8 h-8 text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white active:scale-95"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Get Started — filled (desktop) */}
            <button
              onClick={openLoginModal}
              data-auth-trigger="signup"
              className="hidden lg:inline-flex group items-center gap-1.5 rounded-full bg-gradient-to-r from-white via-white/90 to-violet-glow px-5 py-2 text-[13.5px] font-medium text-[oklch(0.15_0.05_280)] shadow-lg shadow-violet/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet/40 hover:scale-105 active:scale-95"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"/>
            </button>

            {/* ── Hamburger (mobile / tablet) ── */}
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="flex lg:hidden items-center justify-center w-9 h-9 rounded-lg bg-white/[0.07] text-white transition-colors hover:bg-white/[0.12] active:scale-95"
            >
              {mobileMenuOpen ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Panel ── */}
        {mobileMenuOpen && (
          <div className="mobile-menu-enter lg:hidden border-t border-white/[0.07] bg-[oklch(0_0_0)]/95 backdrop-blur-2xl">
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">

              {/* Services accordion */}
              <div>
                <button
                  onClick={() => setIsServicesOpen(v => !v)}
                  className="w-full flex items-center justify-between px-3 py-3 text-[14px] font-medium text-white/70 rounded-xl hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  Services
                  <ChevronDown className={`h-4 w-4 text-white/40 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isServicesOpen && (
                  <div className="mt-1 ml-3 grid grid-cols-2 gap-x-4 gap-y-0.5 pb-2">
                    {serviceCategories.map(cat => (
                      <div key={cat.name} className="mt-2">
                        <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">{cat.name}</p>
                        {cat.items.map(item => (
                          <a key={item} href="#"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-2 py-1.5 text-[13px] text-white/60 rounded-lg hover:bg-white/[0.05] hover:text-white transition-colors">
                            {item}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Regular links */}
              {links.map(link => (
                <a key={link.name} href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 text-[14px] font-medium text-white/70 rounded-xl hover:bg-white/[0.05] hover:text-white transition-colors">
                  {link.name}
                </a>
              ))}

              {/* Divider */}
              <div className="my-3 border-t border-white/[0.06]" />

              {/* Mobile CTA row */}
              <div className="flex items-center gap-2 px-1 pb-2">
                <button
                  onClick={() => { openLoginModal(); setMobileMenuOpen(false); }}
                  data-auth-trigger="login"
                  className="flex-1 rounded-xl border border-white/10 py-2.5 text-[13.5px] font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-all active:scale-95"
                >
                  Sign in
                </button>
                <button
                  onClick={() => { openLoginModal(); setMobileMenuOpen(false); }}
                  data-auth-trigger="signup"
                  className="flex-1 rounded-xl bg-gradient-to-r from-white via-white/90 to-violet-glow py-2.5 text-[13.5px] font-medium text-[oklch(0.15_0.05_280)] shadow-lg shadow-violet/25 transition-all hover:brightness-105 active:scale-95"
                >
                  Get Started
                </button>
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-white transition-all"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

/* ---------- Padlock ASCII Art (deterministic, hydration-safe) ---------- */
function PadlockAscii() {
  const mask = [
    "            ##########            ",
    "          ##############          ",
    "        ###            ###        ",
    "       ##                ##       ",
    "      ##                  ##      ",
    "      ##                  ##      ",
    "      ##                  ##      ",
    "     ##                    ##     ",
    "  ##########################  ",
    " ############################ ",
    "##############################",
    "##############################",
    "#############    #############",
    "############      ############",
    "############      ############",
    "#############    #############",
    "##############################",
    "##############################",
    "##############################",
    " ############################ ",
    "  ##########################  ",
  ];
  const pool = "0123456789ABCDEF$#+=*KQYWS%@&";
  let s = 0x9e3779b9;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return (
    <pre
      aria-hidden
      className="select-none font-mono text-[10px] leading-[12px] text-white/85 md:text-[11px] md:leading-[13px]"
      style={{
        textShadow:
          "0 0 6px rgba(200,170,255,0.55), 0 0 14px rgba(140,90,240,0.4)",
      }}
    >
      {mask.map((row, y) => (
        <div key={y}>
          {Array.from(row)
            .map((ch) =>
              ch === " " ? "\u00A0\u00A0" : pool[Math.floor(rand() * pool.length)] + "\u00A0",
            )
            .join("")}
        </div>
      ))}
    </pre>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section data-hero-section className="relative overflow-hidden rounded-b-[24px] md:rounded-b-[32px]">
      {/* Base dark */}
      <div className="absolute inset-0 rounded-b-[24px] bg-[oklch(0_0_0)] md:rounded-b-[32px]" />
      {/* Main violet radial bloom from center-bottom - extended to match reference */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 100%, oklch(0.78 0.22 295) 0%, oklch(0.65 0.27 290) 20%, oklch(0.50 0.25 288) 40%, oklch(0.35 0.18 285) 60%, oklch(0.22 0.12 282) 75%, transparent 90%)",
        }}
      />
      {/* Bottom soft lavender fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, oklch(0.86 0.07 295 / 0.55) 70%, oklch(0.92 0.05 295 / 0.85) 100%)",
        }}
      />
      {/* Top vignette */}
      <div
        className="absolute inset-x-0 top-0 h-72"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.06 0.02 280) 0%, transparent 100%)",
        }}
      />

      <div className="relative">
        <Nav />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 pb-20 pt-28 text-center sm:px-6 sm:pb-28 sm:pt-28 md:px-8 md:pb-36 md:pt-32 lg:px-10 lg:pb-44 lg:pt-40 xl:pb-52 xl:pt-48">
          <div className="w-full max-w-6xl">
            <h1 data-hero-heading className="text-[clamp(2rem,8vw,5rem)] font-semibold leading-tight tracking-tight sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight lg:text-7xl lg:leading-[1.1] xl:text-8xl xl:leading-[1.05]">
              {/* Line 1 — bright white fading to silver */}
              <span className="block" style={{
                background: "linear-gradient(180deg, #ffffff 0%, #d0d0d8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Build Smarter Automate
              </span>
              {/* Line 2 — white → silver → slight black */}
              <span className="block" style={{
                background: "linear-gradient(180deg, #f0f0f0 0%, #c8c8d0 35%, #909098 70%, #404048 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Faster Grow Revenue
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-[90%] text-sm text-foreground/80 sm:mt-5 sm:max-w-xl sm:text-base md:mt-6 md:max-w-2xl md:text-lg lg:mt-7 lg:max-w-3xl lg:text-xl xl:mt-8">
              We blend strategy, design, development, and AI automation to help brands increase efficiency, improve customer experiences, and unlock new growth opportunities.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-7 sm:flex-row sm:gap-4 md:mt-8 lg:mt-10">
              <LoginButton />
              <a
                href="#"
                className="inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-foreground/90 transition hover:text-foreground sm:w-auto sm:px-7 sm:py-3 md:text-base lg:px-8 lg:py-3.5"
              >
                Explore Capabilities
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Logo ticker ---------- */
function LogoTicker() {
  const logos = [
    "TechCorp", "StartupHub", "GrowthLabs", "InnovateCo", "ScaleUp",
    "DigitalFirst", "CloudNine", "NextGen", "FutureStack", "WebFlow", "DataDrive", "SmartBiz",
  ];
  // Duplicate the list so the loop is seamless — second copy scrolls in as first scrolls out
  const track = [...logos, ...logos];

  return (
    <section className="border-y border-white/5 bg-background/60 py-10 overflow-hidden sm:py-14">
      {/* Keyframe injection */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 28s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <p className="mx-auto max-w-3xl px-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground mb-8 sm:px-6 sm:text-sm sm:mb-10">
        Trusted by innovative companies to build and scale their digital presence
      </p>

      {/* Fade masks on left & right edges */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="marquee-track">
          {track.map((name, i) => (
            <span
              key={i}
              className="mx-12 text-xl font-semibold tracking-tight text-foreground/40 transition-colors duration-300 hover:text-foreground cursor-default select-none whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Before / After Showcase ---------- */
function BeforeAfterShowcase() {
  return (
    <section className="relative py-16 md:py-28 overflow-hidden bg-background">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 md:px-10">

        {/* ── Heading ── */}
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet-glow">
            Real Results
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-5xl">
            Website Redesigns That Drive Real Business Growth
          </h2>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto sm:text-base sm:mt-5">
            See how we transform slow, outdated websites into high-performance, conversion-optimised digital experiences — built to rank, engage, and scale.
          </p>
        </div>

        {/* ── Agency video frame ── */}
        <div className="relative mx-auto max-w-5xl">
          {/* Ambient glow behind video */}
          <div className="pointer-events-none absolute -inset-6 rounded-3xl opacity-30"
            style={{ background: "radial-gradient(ellipse at center, oklch(0.62 0.22 290) 0%, transparent 70%)" }} />
          {/* Video */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video"
            style={{ boxShadow: "0 40px 80px -10px oklch(0 0 0 / 0.6), 0 0 50px oklch(0.62 0.22 290 / 0.1)" }}>
            <video
              src="/src/video/B-A.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover block"
              style={{ display: "block" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section heading ---------- */
function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 text-center sm:px-0">
      {eyebrow && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet-glow">{eyebrow}</p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-5xl">{title}</h2>
    </div>
  );
}

/* ---------- Products ---------- */

/* ── Card SVG visuals — animated ── */

const AIAgentVisual = () => (
  <svg viewBox="0 0 260 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="aiGlow" cx="50%" cy="55%" r="45%">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.55"/>
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
      </radialGradient>
    </defs>
    {/* pulsing glow blob */}
    <ellipse cx="130" cy="95" rx="90" ry="70" fill="url(#aiGlow)"
      style={{ animation: "glowPulse 3s ease-in-out infinite" }}/>
    {/* connector lines */}
    <line x1="130" y1="80" x2="60"  y2="38"  stroke="#4a4a6a" strokeWidth="1.2"/>
    <line x1="130" y1="80" x2="200" y2="38"  stroke="#4a4a6a" strokeWidth="1.2"/>
    <line x1="130" y1="80" x2="45"  y2="110" stroke="#4a4a6a" strokeWidth="1.2"/>
    <line x1="130" y1="80" x2="215" y2="110" stroke="#4a4a6a" strokeWidth="1.2"/>
    <line x1="130" y1="80" x2="130" y2="18"  stroke="#4a4a6a" strokeWidth="1.2"/>
    {/* central node — scale pulse */}
    <g style={{ transformOrigin: "130px 80px", animation: "glowPulse 2.5s ease-in-out infinite" }}>
      <circle cx="130" cy="80" r="22" fill="#2a1f50" stroke="#6d3fc9" strokeWidth="1.5"/>
      <circle cx="130" cy="80" r="14" fill="#3b2a6e"/>
      <circle cx="130" cy="74" r="5" fill="#c4b5fd"/>
      <path d="M120 88 Q130 83 140 88" stroke="#c4b5fd" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </g>
    {/* satellite nodes — each floats independently */}
    {([
      [60,38,0],[200,38,0.4],[45,110,0.8],[215,110,1.2],[130,18,1.6]
    ] as [number,number,number][]).map(([cx,cy,delay],i) => (
      <g key={i} style={{ animation: `floatTablet 3s ease-in-out ${delay}s infinite`, transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r="12" fill="#1a1630" stroke="#3a3060" strokeWidth="1.2"/>
        <circle cx={cx} cy={cy-2} r="3.5" fill="#9070d0"/>
        <path d={`M${cx-4} ${cy+5} Q${cx} ${cy+2} ${cx+4} ${cy+5}`} stroke="#9070d0" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      </g>
    ))}
  </svg>
)

const WebDevVisual = () => (
  <svg viewBox="0 0 280 170" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tabletFace" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2a2a40"/>
        <stop offset="100%" stopColor="#141420"/>
      </linearGradient>
      <linearGradient id="phoneFace" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#232336"/>
        <stop offset="100%" stopColor="#111120"/>
      </linearGradient>
    </defs>
    {/* tablet — floats slowly */}
    <g style={{ animation: "floatTablet 4s ease-in-out infinite", transformOrigin: "180px 84px" }}>
      <ellipse cx="185" cy="148" rx="55" ry="8" fill="#000" opacity="0.3"/>
      <rect x="120" y="30" width="120" height="108" rx="8" fill="url(#tabletFace)" stroke="#3a3a58" strokeWidth="1.5"/>
      <rect x="120" y="30" width="120" height="3" rx="2" fill="#4a4a68" opacity="0.5"/>
      <rect x="127" y="38" width="106" height="88" rx="3" fill="#0d0d1c"/>
      <rect x="133" y="46" width="60" height="4" rx="2" fill="#2a2a44"/>
      <rect x="133" y="54" width="40" height="3" rx="1.5" fill="#1e1e34"/>
      <rect x="133" y="62" width="90" height="3" rx="1.5" fill="#1e1e34"/>
      <rect x="133" y="69" width="70" height="3" rx="1.5" fill="#1e1e34"/>
      <circle cx="180" cy="132" r="4" fill="#252538" stroke="#3a3a54" strokeWidth="1"/>
    </g>
    {/* phone — floats with offset phase */}
    <g style={{ animation: "floatPhone 3.2s ease-in-out 0.6s infinite", transformOrigin: "98px 106px" }}>
      <ellipse cx="105" cy="148" rx="28" ry="6" fill="#000" opacity="0.28"/>
      <rect x="68" y="55" width="60" height="102" rx="8" fill="url(#phoneFace)" stroke="#333348" strokeWidth="1.5"/>
      <rect x="68" y="55" width="60" height="3" rx="2" fill="#44445a" opacity="0.5"/>
      <rect x="73" y="66" width="50" height="80" rx="2" fill="#0a0a18"/>
      <rect x="78" y="73" width="30" height="3" rx="1.5" fill="#1e1e32"/>
      <rect x="78" y="80" width="22" height="3" rx="1.5" fill="#181830"/>
      <rect x="78" y="87" width="36" height="3" rx="1.5" fill="#181830"/>
      <rect x="88" y="62" width="20" height="3" rx="1.5" fill="#0a0a18"/>
    </g>
  </svg>
)

const UIUXVisual = () => (
  <svg viewBox="0 0 300 170" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="uiRingGlow" cx="68%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3b2a5e" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#3b2a5e" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="205" cy="85" rx="90" ry="80" fill="url(#uiRingGlow)"
      style={{ animation: "glowPulse 4s ease-in-out infinite" }}/>
    {/* outer ring rotates slowly, inner rings counter-rotate */}
    <g style={{ transformOrigin: "205px 85px", animation: "ringRotate 18s linear infinite" }}>
      <circle cx="205" cy="85" r="75" stroke="#2e2450" strokeWidth="1" fill="none" strokeDasharray="6 4"/>
    </g>
    <g style={{ transformOrigin: "205px 85px", animation: "ringRotate 12s linear infinite reverse" }}>
      <circle cx="205" cy="85" r="58" stroke="#2e2450" strokeWidth="1" fill="none" strokeDasharray="4 6"/>
    </g>
    <circle cx="205" cy="85" r="42" stroke="#2e2450" strokeWidth="1" fill="none" opacity="0.7"/>
    <circle cx="205" cy="85" r="28" stroke="#2e2450" strokeWidth="1" fill="none" opacity="0.55"/>
    <circle cx="205" cy="85" r="15" stroke="#2e2450" strokeWidth="1" fill="none" opacity="0.4"/>
    {/* cursor floats around */}
    <g style={{ animation: "cursorFloat 5s ease-in-out infinite" }}>
      <path d="M196 75 L196 93 L200 88 L204 95 L207 93.5 L203 87 L209 87 Z"
        fill="white" stroke="#0a0a18" strokeWidth="0.6"/>
    </g>
    <rect x="228" y="108" width="28" height="3.5" rx="1.75" fill="#3b82f6"/>
    <rect x="236" y="116" width="20" height="3.5" rx="1.75" fill="#7c3aed"/>
  </svg>
)

/* ─────────────────────────────────────────────────────────────────────────────
   EcommerceVisual — full sequenced animation
   Phase 0 (0s)      : cart races in from left at speed (train acceleration)
   Phase 1 (~1.1s)   : cart brakes & stops at checkout zone
   Phase 2 (~1.8s)   : product drops into cart with bounce physics
   Phase 3 (~2.8s)   : payment processing spinner + card scan
   Phase 4 (~4.0s)   : green success checkmark draws in
   Phase 5 (~5.2s)   : brief hold, then fade-reset → loop
   Total cycle: ~6.5s
───────────────────────────────────────────────────────────────────────────── */
const EcommerceVisual = () => {
  // phase: 0=racing | 1=braking | 2=drop | 3=payment | 4=success | 5=reset
  const [phase, setPhase] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const clearAll = () => { timersRef.current.forEach(clearTimeout); timersRef.current = [] }
    const after = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms); timersRef.current.push(id)
    }

    const run = () => {
      clearAll()
      setPhase(0)                        // cart races in (off-screen → center)
      after(() => setPhase(1),  1000)    // brakes at checkout
      after(() => setPhase(2),  1700)    // product drops
      after(() => setPhase(3),  2700)    // payment processing
      after(() => setPhase(4),  4100)    // success checkmark
      after(() => setPhase(5),  5400)    // fade & reset
      after(() => run(),        6600)    // infinite loop
    }
    run()
    return clearAll
  }, [])

  // ── cart X position per phase ──
  const cartX = phase === 0 ? -160 : phase === 1 ? 10 : phase >= 2 ? 10 : 10

  // ── cart transition style ──
  const cartTransition =
    phase === 0 ? 'transform 0.01s linear'                              // instant reset (off-screen)
    : phase === 1 ? 'transform 0.9s cubic-bezier(0.22,1,0.36,1)'       // fast in + overshoot brake
    : 'transform 0.4s ease-out'

  // ── product drop: starts above cart, drops with bounce ──
  const productY   = phase === 2 ? 0  : phase >= 3 ? 0  : -60
  const productOp  = phase >= 2 && phase < 5 ? 1 : 0
  const productTr  = phase === 2
    ? 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease'   // bouncy drop
    : 'transform 0.3s ease, opacity 0.3s ease'

  // ── speed lines (phase 0) ──
  const speedLinesOp = phase === 0 ? 1 : 0

  // ── dust puff on brake (phase 1) ──
  const dustOp = phase === 1 ? 1 : 0

  // ── payment ring progress (phase 3) ──
  const payProgress = phase === 3 ? 1 : 0

  // ── success state ──
  const successOp = phase === 4 || phase === 5 ? 1 : 0
  const successScale = phase === 4 ? 1 : phase === 5 ? 1.05 : 0.4

  // ── overall fade for reset ──
  const wrapOp = phase === 5 ? 0 : 1

  return (
    <div className="w-full h-full relative overflow-hidden"
         style={{ transition: 'opacity 0.6s ease', opacity: wrapOp }}>
      <style>{`
        @keyframes speedLine {
          from { transform: translateX(0); opacity: 0.7; }
          to   { transform: translateX(-80px); opacity: 0; }
        }
        @keyframes dustPuff {
          0%   { transform: scale(0.4) translateX(0);  opacity: 0.8; }
          60%  { transform: scale(1.4) translateX(8px); opacity: 0.5; }
          100% { transform: scale(2)   translateX(16px); opacity: 0; }
        }
        @keyframes payRing {
          from { stroke-dashoffset: 113; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes successPop {
          0%   { transform: scale(0.3); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          80%  { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes cardScan {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(22px); }
        }
        @keyframes pulseRing {
          0%   { r: 22; opacity: 0.6; }
          100% { r: 38; opacity: 0; }
        }
      `}</style>

      <svg viewBox="0 0 300 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ecBg" cx="50%" cy="65%" r="55%">
            <stop offset="0%" stopColor="#1e1040" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#0a0a18" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="trackGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a1a30" stopOpacity="0"/>
            <stop offset="30%" stopColor="#2a2a45" stopOpacity="1"/>
            <stop offset="100%" stopColor="#2a2a45" stopOpacity="1"/>
          </linearGradient>
          <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7c5cd8" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#7c5cd8" stopOpacity="0"/>
          </radialGradient>
          <clipPath id="cartClip">
            <rect x="0" y="0" width="300" height="180"/>
          </clipPath>
        </defs>

        {/* ── Background glow ── */}
        <ellipse cx="150" cy="120" rx="130" ry="65" fill="url(#ecBg)"/>

        {/* ── Ground / track ── */}
        <rect x="0" y="148" width="300" height="2" rx="1" fill="url(#trackGrad)" opacity="0.6"/>
        <rect x="0" y="152" width="300" height="1" rx="0.5" fill="#ffffff" opacity="0.04"/>

        {/* ── Checkout zone marker ── */}
        <rect x="175" y="120" width="1.5" height="28" rx="0.75" fill="#3a3a60" opacity="0.7"/>
        <rect x="176" y="118" width="52" height="15" rx="4"
          fill="#1a1a30" stroke="#3a3a55" strokeWidth="1"/>
        <text x="202" y="129" textAnchor="middle" fill="#8080b0"
          fontSize="7.5" fontFamily="system-ui,sans-serif" letterSpacing="0.5">CHECKOUT</text>

        {/* ── Speed lines (phase 0 only) ── */}
        <g style={{ opacity: speedLinesOp, transition: 'opacity 0.15s' }} clipPath="url(#cartClip)">
          {[30,50,70,90,42,62].map((y, i) => (
            <line key={i}
              x1={80 - i*4} y1={y + cartX * 0.1} x2={140 - i * 4} y2={y + cartX * 0.1}
              stroke="#4040a0" strokeWidth={i % 2 === 0 ? 1.5 : 1} opacity={0.4 - i * 0.04}
              style={{ animation: `speedLine ${0.3 + i * 0.05}s linear ${i * 0.04}s infinite` }}/>
          ))}
        </g>

        {/* ── Cart group (translate X) ── */}
        <g style={{ transform: `translateX(${cartX}px)`, transition: cartTransition }}>

          {/* wheel glow halos */}
          <circle cx="114" cy="149" r="14" fill="url(#wheelGlow)"
            style={{ opacity: phase === 0 ? 0.85 : 0.28 }}/>
          <circle cx="143" cy="149" r="14" fill="url(#wheelGlow)"
            style={{ opacity: phase === 0 ? 0.85 : 0.28 }}/>

          {/* ── Cart body — clean professional silhouette ── */}
          {/* Outer cart path: handle → neck → basket as one shape */}
          {/* Basket: trapezoid — wider at top (57px), slightly narrower bottom (50px), 24px tall */}
          {/*   top-left (106,118)  top-right (163,118)                                          */}
          {/*   bot-left (109,142)  bot-right (159,142)                                          */}

          {/* Subtle basket fill for depth */}
          <path d="M106 118 L163 118 L159 142 L109 142 Z"
            fill="#1a1840" opacity="0.55"/>

          {/* Basket outer stroke — single clean path */}
          <path d="M106 118 L163 118 L159 142 L109 142 Z"
            stroke="#c8c8e8" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>

          {/* Basket vertical dividers — 2 evenly spaced, follow trapezoid taper */}
          <line x1="125" y1="118" x2="124" y2="142" stroke="#7070a8" strokeWidth="1" opacity="0.55"/>
          <line x1="144" y1="118" x2="142" y2="142" stroke="#7070a8" strokeWidth="1" opacity="0.55"/>

          {/* Basket single horizontal mid-line */}
          <line x1="107" y1="130" x2="161" y2="130" stroke="#7070a8" strokeWidth="0.9" opacity="0.4"/>

          {/* Handle — smooth arc from left of basket, curves up and back */}
          {/* Neck connects top-left of basket to underside of handle */}
          <path d="M106 118 Q104 108 100 106 L84 106"
            stroke="#c8c8e8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

          {/* Handle grip — horizontal bar with rounded ends */}
          <line x1="84" y1="106" x2="76" y2="106"
            stroke="#c8c8e8" strokeWidth="2.8" strokeLinecap="round"/>

          {/* Handle end cap circle (grip detail) */}
          <circle cx="75" cy="106" r="2.2" fill="#c8c8e8" opacity="0.6"/>

          {/* wheels — placed under the basket bottom edge (y=142) */}
          <circle cx="114" cy="149" r="7" fill="#1e1e35" stroke="#9090c8" strokeWidth="1.8"/>
          <circle cx="114" cy="149" r="2.5" fill="#2a2a48"/>
          <circle cx="143" cy="149" r="7" fill="#1e1e35" stroke="#9090c8" strokeWidth="1.8"/>
          <circle cx="143" cy="149" r="2.5" fill="#2a2a48"/>

          {/* wheel glow halos — re-declared here to match new wheel positions */}

          {/* wheel spokes (spin in phase 0) — axle cross inside each wheel */}
          <g style={{ transformOrigin: '114px 149px',
            animation: phase === 0 ? 'ringRotate 0.35s linear infinite' : 'none' }}>
            <line x1="114" y1="143" x2="114" y2="155" stroke="#6060a0" strokeWidth="1" opacity="0.55"/>
            <line x1="108" y1="149" x2="120" y2="149" stroke="#6060a0" strokeWidth="1" opacity="0.55"/>
          </g>
          <g style={{ transformOrigin: '143px 149px',
            animation: phase === 0 ? 'ringRotate 0.35s linear infinite' : 'none' }}>
            <line x1="143" y1="143" x2="143" y2="155" stroke="#6060a0" strokeWidth="1" opacity="0.55"/>
            <line x1="137" y1="149" x2="149" y2="149" stroke="#6060a0" strokeWidth="1" opacity="0.55"/>
          </g>

          {/* ── Product in cart (phase 2+) ── */}
          {/* Sits inside the basket: basket interior is ~x110–158, y118–142, mid-y≈130 */}
          <g style={{
            transform: `translateY(${productY}px)`,
            opacity: productOp,
            transition: productTr,
            transformOrigin: '134px 131px'
          }}>
            {/* product box — fits neatly inside basket */}
            <rect x="116" y="122" width="36" height="15" rx="2.5" fill="#3a2a6a" stroke="#7c5cd8" strokeWidth="1.2"/>
            {/* top shine highlight */}
            <rect x="118" y="123.5" width="32" height="3" rx="1.5" fill="#ffffff" opacity="0.13"/>
            {/* brand label stripe */}
            <rect x="121" y="131" width="18" height="2" rx="1" fill="#a080f0" opacity="0.65"/>
            {/* small star icon on box */}
            <text x="146" y="133" fill="#c4b5fd" fontSize="6" opacity="0.7">★</text>
          </g>
        </g>

        {/* ── Dust puff on brake (phase 1) ── */}
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={180 + i * 6} cy={145} r={4 + i}
            fill="#3a3a60" opacity="0"
            style={{
              opacity: dustOp,
              animation: dustOp ? `dustPuff 0.6s ease-out ${i * 0.08}s both` : 'none'
            }}/>
        ))}

        {/* ── Payment overlay (phase 3) ── */}
        <g style={{
          opacity: phase === 3 ? 1 : 0,
          transition: 'opacity 0.4s ease',
          transform: phase === 3 ? 'scale(1)' : 'scale(0.85)',
        }}>
          {/* card */}
          <rect x="95" y="55" width="110" height="72" rx="8"
            fill="#1a1230" stroke="#3a2a6a" strokeWidth="1.5"/>
          <rect x="95" y="55" width="110" height="22" rx="8" fill="#2a1a48"/>
          <rect x="95" y="67" width="110" height="10" rx="0" fill="#221640"/>
          {/* chip */}
          <rect x="108" y="85" width="18" height="14" rx="3" fill="#2a2040" stroke="#5a4a88" strokeWidth="1"/>
          <rect x="111" y="88" width="12" height="8" rx="1.5" fill="#1a1530"/>
          <line x1="111" y1="92" x2="123" y2="92" stroke="#4a3a78" strokeWidth="0.8"/>
          <line x1="117" y1="88" x2="117" y2="96" stroke="#4a3a78" strokeWidth="0.8"/>
          {/* card number dots */}
          {[0,1,2,3].map(g => (
            [0,1,2,3].map(d => (
              <circle key={`${g}-${d}`} cx={136 + g * 14 + d * 2.8} cy={92}
                r="1.2" fill="#5a5080" opacity="0.8"/>
            ))
          ))}
          {/* scan line */}
          <line x1="97" y1="77" x2="203" y2="77" stroke="#7c5cd8" strokeWidth="1" opacity="0.4"
            style={{ animation: phase === 3 ? 'cardScan 1.2s ease-in-out infinite' : 'none' }}/>

          {/* processing ring */}
          <circle cx="230" cy="70" r="18" stroke="#1e1e38" strokeWidth="3" fill="none"/>
          <circle cx="230" cy="70" r="18"
            stroke="#7c5cd8" strokeWidth="3" fill="none"
            strokeDasharray="113" strokeDashoffset="113"
            strokeLinecap="round"
            style={{
              transformOrigin: '230px 70px',
              transform: 'rotate(-90deg)',
              animation: phase === 3 ? 'payRing 1.3s cubic-bezier(0.4,0,0.2,1) 0.2s forwards' : 'none'
            }}/>
          {/* pulsing outer ring */}
          <circle cx="230" cy="70" r="22"
            stroke="#7c5cd8" strokeWidth="1" fill="none"
            style={{ animation: phase === 3 ? 'pulseRing 1s ease-out 1.1s forwards' : 'none', opacity: 0 }}/>
          {/* lock icon inside ring */}
          <rect x="225" y="67" width="10" height="8" rx="1.5" fill="none" stroke="#a090e0" strokeWidth="1.2"/>
          <path d="M227 67 Q227 63 230 63 Q233 63 233 67" stroke="#a090e0" strokeWidth="1.2" fill="none"/>
          <circle cx="230" cy="71" r="1.5" fill="#c4b5fd"/>

          {/* "Processing…" label */}
          <text x="150" y="120" textAnchor="middle" fill="#6060a8"
            fontSize="8" fontFamily="system-ui,sans-serif" letterSpacing="0.8">PROCESSING</text>
          {[0,1,2].map(i => (
            <circle key={i} cx={160 + i * 8} cy={128} r="2.2" fill="#4040a0"
              style={{ animation: `dot${i+1} 1.2s ease-in-out infinite` }}/>
          ))}
        </g>

        {/* ── Success (phase 4) ── */}
        <g style={{
          opacity: successOp,
          transform: `scale(${successScale})`,
          transformOrigin: '150px 95px',
          transition: 'opacity 0.3s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          {/* green glow bg */}
          <circle cx="150" cy="90" r="45" fill="#052015" opacity="0.8"/>
          <circle cx="150" cy="90" r="32"
            fill="none" stroke="#22c55e" strokeWidth="2"
            style={{ animation: phase === 4 ? 'successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none' }}/>
          {/* outer pulse ring */}
          <circle cx="150" cy="90" r="36"
            fill="none" stroke="#22c55e" strokeWidth="1" opacity="0"
            style={{ animation: phase === 4 ? 'pulseRing 0.9s ease-out 0.4s forwards' : 'none' }}/>
          {/* checkmark — drawn on */}
          <path d="M136 90 L146 100 L165 78"
            stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
            fill="none"
            strokeDasharray="60" strokeDashoffset="60"
            style={{ animation: phase === 4 ? 'checkDraw 0.45s cubic-bezier(0.4,0,0.2,1) 0.25s forwards' : 'none' }}/>
          {/* "Payment Complete" text */}
          <text x="150" y="136" textAnchor="middle" fill="#22c55e"
            fontSize="9" fontFamily="system-ui,sans-serif" fontWeight="600" letterSpacing="0.5"
            style={{ opacity: phase === 4 ? 1 : 0, transition: 'opacity 0.4s ease 0.6s' }}>
            Payment Complete
          </text>
        </g>
      </svg>
    </div>
  )
}

/*
 * ChatbotVisual — sequenced animation
 * p0  0s    : power-on glow burst
 * p1  0.8s  : left eye lights up
 * p2  1.3s  : right eye lights up; energy pulse travels to NLP bar
 * p3  2.0s  : thinking — typing dots + data particles scan across bar
 * p4  3.4s  : text reveal with typewriter effect
 * p5  4.8s  : success checkmark + completed state
 * p6  6.0s  : fade out → loop  (total ~7.2s)
 */
const ChatbotVisual = () => {
  const [p, setP] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
    const after = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)) }
    const run = () => {
      clear(); setP(0)
      after(() => setP(1),  800)
      after(() => setP(2), 1300)
      after(() => setP(3), 2000)
      after(() => setP(4), 3400)
      after(() => setP(5), 4800)
      after(() => setP(6), 6000)
      after(() => run(),   7200)
    }
    run(); return clear
  }, [])

  // particles: 6 dots flying from bot toward NLP bar
  const particles = [
    { cx: 92, cy: 44, dx: 40, delay: 0    },
    { cx: 92, cy: 50, dx: 50, delay: 0.08 },
    { cx: 92, cy: 56, dx: 35, delay: 0.16 },
    { cx: 92, cy: 42, dx: 60, delay: 0.24 },
    { cx: 92, cy: 58, dx: 45, delay: 0.06 },
    { cx: 92, cy: 48, dx: 55, delay: 0.20 },
  ]

  return (
    <div style={{ opacity: p === 6 ? 0 : 1, transition: 'opacity 0.6s ease' }}
         className="w-full h-full">
      <style>{`
        @keyframes botFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes eyeOn      { from{opacity:0;transform:scaleX(0.2)} to{opacity:1;transform:scaleX(1)} }
        @keyframes eyeBlink   { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.08)} }
        @keyframes energyPulse{ 0%{stroke-dashoffset:120;opacity:0} 30%{opacity:1} 100%{stroke-dashoffset:0;opacity:0} }
        @keyframes particle   { 0%{transform:translateX(0);opacity:0.8} 100%{transform:translateX(var(--dx));opacity:0} }
        @keyframes scanBar    { from{transform:translateX(-100%)} to{transform:translateX(260%)} }
        @keyframes textReveal { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
        @keyframes successRing{ 0%{r:14;opacity:0} 40%{opacity:1} 100%{r:26;opacity:0} }
        @keyframes checkIn    { from{stroke-dashoffset:40} to{stroke-dashoffset:0} }
        @keyframes antennaPulse{ 0%,100%{r:2.5;opacity:0.6} 50%{r:4;opacity:1} }
        @keyframes outerGlow  { 0%,100%{opacity:0.15} 50%{opacity:0.45} }
      `}</style>

      <svg viewBox="0 0 280 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="botGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="eyeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e0d0ff"/>
            <stop offset="100%" stopColor="#7c5cd8"/>
          </radialGradient>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id="bubbleClip"><rect x="93" y="27" width="172" height="19" rx="4"/></clipPath>
        </defs>

        {/* ── Bot group — floats gently ── */}
        <g style={{ animation: 'botFloat 3s ease-in-out infinite', transformOrigin: '46px 50px' }}>

          {/* outer glow halo — power-on */}
          <circle cx="46" cy="50" r="38" fill="url(#botGlow)"
            style={{ opacity: p >= 1 ? 1 : 0, transition: 'opacity 0.4s ease',
              animation: p >= 1 ? 'outerGlow 2.5s ease-in-out infinite' : 'none' }}/>

          {/* head shell */}
          <circle cx="46" cy="50" r="30" fill="#13122a" stroke="#2e2c52" strokeWidth="1.5"/>

          {/* power-on burst ring */}
          <circle cx="46" cy="50" r="30" fill="none" stroke="#7c3aed" strokeWidth="2"
            style={{ opacity: p === 0 ? 1 : 0,
              animation: p === 0 ? 'successRing 0.8s ease-out forwards' : 'none' }}/>

          {/* visor band */}
          <rect x="20" y="41" width="52" height="20" rx="6" fill="#1c1a38" stroke="#36335e" strokeWidth="1"/>

          {/* ── Left eye ── */}
          <g style={{ transformOrigin: '35px 51px',
            animation: p >= 1 ? 'eyeBlink 4s ease-in-out infinite' : 'none' }}>
            <rect x="27" y="45" width="16" height="10" rx="3" fill="#12112a" stroke="#4433aa" strokeWidth="1"/>
            <rect x="29" y="47" width="12" height="6" rx="2" fill="url(#eyeGrad)"
              style={{ opacity: p >= 1 ? 1 : 0,
                animation: p === 1 ? 'eyeOn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
                transformOrigin: '35px 50px' }}
              filter="url(#glowFilter)"/>
          </g>

          {/* ── Right eye ── */}
          <g style={{ transformOrigin: '57px 51px',
            animation: p >= 2 ? 'eyeBlink 4s ease-in-out 2s infinite' : 'none' }}>
            <rect x="49" y="45" width="16" height="10" rx="3" fill="#12112a" stroke="#4433aa" strokeWidth="1"/>
            <rect x="51" y="47" width="12" height="6" rx="2" fill="url(#eyeGrad)"
              style={{ opacity: p >= 2 ? 1 : 0,
                animation: p === 2 ? 'eyeOn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
                transformOrigin: '57px 50px' }}
              filter="url(#glowFilter)"/>
          </g>

          {/* mouth bar */}
          <rect x="30" y="64" width="32" height="5" rx="2.5" fill="#1c1a38" stroke="#36335e" strokeWidth="1"/>
          <rect x="35" y="65.5" width="14" height="2" rx="1"
            fill={p >= 4 ? '#22c55e' : '#4040a0'}
            style={{ transition: 'fill 0.4s ease', width: p >= 4 ? 22 : 14 }}/>

          {/* ear bolts */}
          <circle cx="16" cy="50" r="5" fill="#13122a" stroke="#2e2c52" strokeWidth="1.2"/>
          <circle cx="76" cy="50" r="5" fill="#13122a" stroke="#2e2c52" strokeWidth="1.2"/>
          <circle cx="16" cy="50" r="2" fill="#2a2850"/>
          <circle cx="76" cy="50" r="2" fill="#2a2850"/>

          {/* antenna */}
          <line x1="46" y1="20" x2="46" y2="11" stroke="#3a3870" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="46" cy="9" r="2.5" fill="#5533bb" stroke="#9070e0" strokeWidth="1"
            style={{ animation: 'antennaPulse 1.6s ease-in-out infinite' }}/>
        </g>

        {/* ── Energy pulse arc: bot → bubble (phase 2) ── */}
        <path d="M78 50 Q85 50 92 48"
          stroke="#a080ff" strokeWidth="1.5" fill="none" strokeLinecap="round"
          strokeDasharray="20" strokeDashoffset="20"
          style={{ opacity: p === 2 ? 1 : 0,
            animation: p === 2 ? 'energyPulse 0.6s ease-out forwards' : 'none' }}/>

        {/* ── NLP Speech bubble ── */}
        <rect x="93" y="22" width="178" height="56" rx="8" fill="#12112a" stroke="#2a2850" strokeWidth="1.2"
          style={{ opacity: p >= 2 ? 1 : 0, transition: 'opacity 0.3s ease' }}/>
        {/* tail */}
        <path d="M93 45 L81 51 L96 51" fill="#12112a" stroke="#2a2850" strokeWidth="1"
          style={{ opacity: p >= 2 ? 1 : 0, transition: 'opacity 0.3s ease' }}/>

        {/* NLP label */}
        <text x="182" y="36" textAnchor="middle" fill="#4a4880"
          fontSize="8" fontFamily="system-ui,sans-serif" letterSpacing="0.6"
          style={{ opacity: p >= 2 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          natural language processing
        </text>

        {/* ── Scan light (phase 3) ── */}
        <rect x="93" y="23" width="18" height="54" rx="4"
          fill="url(#botGlow)" opacity="0.5"
          style={{ animation: p === 3 ? 'scanBar 1.4s cubic-bezier(0.4,0,0.2,1) infinite' : 'none',
            display: p === 3 ? 'block' : 'none' }}/>

        {/* ── Data particles (phase 3) ── */}
        {p === 3 && particles.map((pt, i) => (
          <circle key={i} cx={pt.cx} cy={pt.cy} r="1.8" fill="#a080ff" opacity="0"
            style={{
              '--dx': `${pt.dx}px`,
              animation: `particle 0.7s ease-out ${pt.delay}s infinite`,
            } as React.CSSProperties}/>
        ))}

        {/* ── Typing dots (phase 3) ── */}
        {[0,1,2].map(i => (
          <circle key={i} cx={110 + i * 14} cy={56} r="3.5" fill="#5050a8"
            style={{ opacity: p === 3 ? 1 : 0, transition: 'opacity 0.2s ease',
              animation: p === 3 ? `dot${i+1} 1.2s ease-in-out infinite` : 'none' }}/>
        ))}

        {/* ── Text response reveal (phase 4) ── */}
        <g clipPath="url(#bubbleClip)"
          style={{ opacity: p === 4 || p === 5 ? 1 : 0, transition: 'opacity 0.2s ease' }}>
          <text x="96" y="40" fill="#c0b8f0" fontSize="9" fontFamily="system-ui,sans-serif"
            style={{ animation: p === 4 ? 'textReveal 0.9s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
              clipPath: p === 4 ? undefined : 'inset(0 0% 0 0)' }}>
            How can I assist you today?
          </text>
        </g>
        {/* cursor blink in phase 4 */}
        <rect x="243" y="32" width="1.5" height="11" rx="0.75" fill="#a080ff"
          style={{ opacity: p === 4 ? 1 : 0,
            animation: p === 4 ? 'cursorBlink 0.7s ease-in-out infinite' : 'none' }}/>

        {/* second line */}
        <text x="96" y="53" fill="#7060a0" fontSize="7.5" fontFamily="system-ui,sans-serif"
          style={{ opacity: p === 4 || p === 5 ? 1 : 0, transition: 'opacity 0.4s ease 0.5s',
            animation: p === 4 ? 'textReveal 0.7s ease-out 0.4s both' : 'none' }}>
          AI response generated ✓
        </text>


        {/* connection dots between bot and bubble */}
        {[0,1,2].map(i => (
          <circle key={i} cx={82 + i * 3} cy={50} r="1.2" fill="#4040a0"
            style={{ opacity: p >= 2 && p < 6 ? 0.6 - i * 0.15 : 0,
              transition: 'opacity 0.3s ease',
              animation: p >= 3 ? `dot${(i%3)+1} 1s ease-in-out ${i*0.2}s infinite` : 'none' }}/>
        ))}
      </svg>
    </div>
  )
}

/*
 * CRMVisual — sequenced pipeline animation
 * p0  0s    : dashboard activates with glow
 * p1  0.8s  : lead cards slide into pipeline stages
 * p2  2.0s  : connection lines animate + data sync pulses
 * p3  3.2s  : chart bars grow upward + notification appears
 * p4  4.4s  : deal closes — success badge + analytics update
 * p5  5.8s  : fade reset → loop  (total ~7.0s)
 */
const CRMVisual = () => {
  const [p, setP] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
    const after = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)) }
    const run = () => {
      clear(); setP(0)
      after(() => setP(1),  800)
      after(() => setP(2), 2000)
      after(() => setP(3), 3200)
      after(() => setP(4), 4400)
      after(() => setP(5), 5800)
      after(() => run(),   7000)
    }
    run(); return clear
  }, [])

  // pipeline stages
  const stages = ['New', 'Qualified', 'Proposal', 'Closed']
  const stageX = [18, 58, 98, 138]
  const stageColors = ['#3b82f6','#a855f7','#f59e0b','#22c55e']

  // chart bar heights (grow in p3)
  const barHeights = [28, 38, 22, 46, 32, 52]

  return (
    <div style={{ opacity: p === 5 ? 0 : 1, transition: 'opacity 0.7s ease' }}
         className="w-full h-full">
      <style>{`
        @keyframes dashActivate { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes cardSlideIn  { from{transform:translateY(-18px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes lineGrow     { from{stroke-dashoffset:80} to{stroke-dashoffset:0} }
        @keyframes syncPulse    { 0%{r:2;opacity:0.9} 100%{r:7;opacity:0} }
        @keyframes barGrow      { from{transform:scaleY(0)} to{transform:scaleY(1)} }
        @keyframes notifSlide   { from{transform:translateX(40px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes dealBadge    { 0%{transform:scale(0.3);opacity:0} 60%{transform:scale(1.15);opacity:1} 80%{transform:scale(0.95)} 100%{transform:scale(1)} }
        @keyframes chartLine    { from{stroke-dashoffset:300} to{stroke-dashoffset:0} }
        @keyframes dataFlow     { 0%{stroke-dashoffset:60;opacity:0.8} 100%{stroke-dashoffset:0;opacity:0} }
        @keyframes countUp      { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <svg viewBox="0 0 200 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="crmAreaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.65"/>
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="crmArea2G" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </linearGradient>
          <radialGradient id="dashGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b2a6e" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#3b2a6e" stopOpacity="0"/>
          </radialGradient>
          <clipPath id="dashClip"><rect x="16" y="30" width="168" height="118"/></clipPath>
        </defs>

        {/* ── Monitor frame ── */}
        <rect x="8" y="6" width="184" height="138" rx="7"
          fill="#0e0d1e" stroke="#252542" strokeWidth="1.5"
          style={{ animation: p === 0 ? 'dashActivate 0.5s ease-out forwards' : 'none', opacity: p === 0 ? 0 : 1 }}/>

        {/* title bar */}
        <rect x="8" y="6" width="184" height="18" rx="7" fill="#111128"/>
        <rect x="8" y="16" width="184" height="8" fill="#111128"/>
        <text x="18" y="18" fill="#5050a0" fontSize="7" fontFamily="system-ui,sans-serif" fontWeight="600">CRM Pipeline</text>
        <circle cx="172" cy="15" r="2.5" fill="#ff5f56"/>
        <circle cx="179" cy="15" r="2.5" fill="#ffbd2e"/>
        <circle cx="186" cy="15" r="2.5" fill="#27c93f"/>

        {/* dashboard glow */}
        <ellipse cx="100" cy="90" rx="85" ry="65" fill="url(#dashGlow)"
          style={{ opacity: p >= 1 ? 0.6 : 0, transition: 'opacity 0.6s ease' }}/>

        {/* ── Pipeline stage headers ── */}
        {stages.map((s, i) => (
          <g key={s} style={{ opacity: p >= 1 ? 1 : 0, transition: `opacity 0.3s ease ${i * 0.1}s` }}>
            <rect x={stageX[i]} y="28" width="35" height="10" rx="3"
              fill={stageColors[i]} opacity="0.18"/>
            <rect x={stageX[i]} y="28" width="35" height="10" rx="3"
              fill="none" stroke={stageColors[i]} strokeWidth="0.7" opacity="0.5"/>
            <text x={stageX[i] + 17.5} y="36" textAnchor="middle" fill={stageColors[i]}
              fontSize="5.5" fontFamily="system-ui,sans-serif" fontWeight="600">{s}</text>
          </g>
        ))}

        {/* ── Lead cards (slide in p1) ── */}
        {stages.map((s, i) => {
          const visible = p >= 1 && !(i === 3 && p < 4)
          return (
            <g key={`card-${s}`}
              style={{ opacity: visible ? 1 : 0,
                animation: visible ? `cardSlideIn 0.45s cubic-bezier(0.34,1.56,0.64,1) ${i*0.15}s both` : 'none' }}>
              <rect x={stageX[i]} y="42" width="35" height="22" rx="3"
                fill="#16152e" stroke={stageColors[i]} strokeWidth="0.8" opacity="0.9"/>
              {/* avatar circle */}
              <circle cx={stageX[i] + 7} cy={stageX[i] === 138 ? 50 : 53} r="4"
                fill={stageColors[i]} opacity="0.7"/>
              <rect x={stageX[i] + 13} y="48" width="18" height="2.5" rx="1.2" fill="#3a3860"/>
              <rect x={stageX[i] + 13} y="53" width="12" height="2" rx="1" fill="#2a2850"/>
              {/* status dot */}
              <circle cx={stageX[i] + 32} cy="45" r="2" fill={stageColors[i]} opacity="0.9"/>
            </g>
          )
        })}

        {/* ── Connection lines between stages (p2) ── */}
        {[0,1,2].map(i => (
          <g key={`conn-${i}`} style={{ opacity: p >= 2 ? 1 : 0, transition: `opacity 0.3s ease ${i*0.1}s` }}>
            <line
              x1={stageX[i] + 35} y1="53"
              x2={stageX[i+1]} y2="53"
              stroke={stageColors[i+1]} strokeWidth="1" strokeDasharray="3 2" opacity="0.5"/>
            {/* animated flow dot */}
            <circle cx={stageX[i] + 35} cy="53" r="2" fill={stageColors[i+1]}
              style={{ animation: p === 2 || p === 3 ? `syncPulse 1.2s ease-out ${i*0.3}s infinite` : 'none', opacity: 0 }}/>
          </g>
        ))}

        {/* ── Data sync flow lines (p2) ── */}
        {p >= 2 && [0,1,2].map(i => (
          <line key={`flow-${i}`}
            x1={stageX[i] + 35} y1="53"
            x2={stageX[i+1]} y2="53"
            stroke="#a080ff" strokeWidth="1.5" strokeLinecap="round"
            strokeDasharray="8" strokeDashoffset="8"
            style={{ animation: `dataFlow 0.8s ease-out ${i*0.25}s infinite`, opacity: 0 }}/>
        ))}

        {/* ── Chart area (p3) ── */}
        <g clipPath="url(#dashClip)"
          style={{ opacity: p >= 3 ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          {/* axes */}
          <line x1="20" y1="126" x2="185" y2="126" stroke="#1e1e3a" strokeWidth="0.8"/>
          <line x1="20" y1="76" x2="20" y2="126" stroke="#1e1e3a" strokeWidth="0.8"/>
          {/* grid */}
          {[0,1,2].map(i => (
            <line key={i} x1="20" y1={126 - i*16} x2="185" y2={126 - i*16}
              stroke="#1a1a32" strokeWidth="0.6" strokeDasharray="3 3"/>
          ))}
          {/* area fills */}
          <path d="M20 118 C40 114 55 120 75 105 C95 90 115 98 135 86 C150 78 165 90 185 84 L185 126 L20 126 Z"
            fill="url(#crmArea2G)"/>
          <path d="M20 122 C40 116 60 104 80 96 C100 88 118 100 138 88 C152 80 168 88 185 82 L185 126 L20 126 Z"
            fill="url(#crmAreaG)"/>
          {/* animated lines */}
          <path d="M20 118 C40 114 55 120 75 105 C95 90 115 98 135 86 C150 78 165 90 185 84"
            stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeLinecap="round"
            strokeDasharray="300" strokeDashoffset="300"
            style={{ animation: p >= 3 ? 'chartLine 1.4s ease-out forwards' : 'none' }}/>
          <path d="M20 122 C40 116 60 104 80 96 C100 88 118 100 138 88 C152 80 168 88 185 82"
            stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round"
            strokeDasharray="300" strokeDashoffset="300"
            style={{ animation: p >= 3 ? 'chartLine 1.4s ease-out 0.2s forwards' : 'none' }}/>
          {/* data points */}
          {([[80,96],[138,88],[185,82]] as [number,number][]).map(([x,y],i) => (
            <g key={i} style={{ animation: p >= 3 ? `dotPop 0.3s ease-out ${0.9 + i*0.2}s both` : 'none' }}>
              <circle cx={x} cy={y} r="4" fill="#a855f7" stroke="#0e0d1e" strokeWidth="1.2"/>
              <circle cx={x} cy={y} r="1.8" fill="#e9d5ff"/>
            </g>
          ))}
          {/* floating tooltip */}
          <g style={{ animation: p >= 3 ? 'tooltipFloat 3s ease-in-out infinite' : 'none',
            opacity: p >= 3 ? 1 : 0, transition: 'opacity 0.3s ease 1s' }}>
            <rect x="140" y="70" width="36" height="13" rx="3" fill="#2a1f5a" stroke="#5533aa" strokeWidth="0.8"/>
            <text x="158" y="80" textAnchor="middle" fill="#c4b5fd" fontSize="6.5" fontFamily="system-ui">+18.6%</text>
          </g>
        </g>

        {/* ── Notification card (p3) ── */}
        <g style={{ opacity: p === 3 || p === 4 ? 1 : 0,
          animation: p === 3 ? 'notifSlide 0.45s cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
          transition: 'opacity 0.3s ease' }}>
          <rect x="110" y="42" width="76" height="28" rx="4"
            fill="#0e1a0e" stroke="#22c55e" strokeWidth="0.8" opacity="0.95"/>
          <circle cx="120" cy="49" r="4" fill="#22c55e" opacity="0.7"/>
          <text x="128" y="50" fill="#22c55e" fontSize="6" fontFamily="system-ui" fontWeight="600">New lead scored</text>
          <text x="128" y="58" fill="#4a7a4a" fontSize="5.5" fontFamily="system-ui">Score: 94 • Hot prospect</text>
          <circle cx="181" cy="45" r="2.5" fill="#22c55e"
            style={{ animation: p === 3 ? 'syncPulse 1s ease-out infinite' : 'none', opacity: 0 }}/>
        </g>

      </svg>
    </div>
  )
}

/* ── Number badge ── */
const NumBadge = ({ n, count }: { n: string; count?: string }) => (
  <div className="flex w-full items-start justify-between">
    <span className="text-[11px] font-mono font-medium text-white/40 tracking-[0.18em]">{n} //</span>
    {count && <span className="text-[11px] font-mono text-white/30">{count}</span>}
  </div>
)

/* ── Card shell — shared styles ── */
const cardBase =
  "group relative overflow-hidden rounded-2xl border border-white/10 bg-black p-5 flex flex-col transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_rgba(90,60,180,0.15)]"

function ProductsGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  // Scroll-reveal: add `.in-view` to each `.card-reveal` when it enters viewport
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.card-reveal')
    if (!cards?.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-28">
      <SectionHeading title="Comprehensive digital solutions to grow your business" />

      <div ref={gridRef} className="mx-auto mt-10 max-w-6xl space-y-3 sm:mt-14">

        {/* ── Row 1: 3 equal columns ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

          {/* 01 – AI Agent Automation */}
          <div className={`card-reveal ${cardBase} min-h-[240px]`}
               style={{ animationDelay: '0ms' }}>
            <NumBadge n="01" count="2" />
            <div className="flex-1 flex items-center justify-center mt-2">
              <div className="w-full h-[140px]"><AIAgentVisual /></div>
            </div>
            <div className="mt-4">
              <p className="text-[24px] font-bold leading-[1.15] text-white">AI Agent</p>
              <p className="text-[24px] font-bold leading-[1.15] text-white/60">Automation</p>
            </div>
          </div>

          {/* 02 – Website Development */}
          <div className={`card-reveal ${cardBase} min-h-[240px]`}
               style={{ animationDelay: '90ms' }}>
            <NumBadge n="02" />
            <div className="flex-1 flex items-center justify-center mt-2">
              <div className="w-full h-[140px]"><WebDevVisual /></div>
            </div>
            <div className="mt-4">
              <p className="text-[24px] font-bold leading-[1.15] text-white">Website</p>
              <p className="text-[24px] font-bold leading-[1.15] text-white/60">Development</p>
            </div>
          </div>

          {/* 03 – UI/UX Design */}
          <div className={`card-reveal ${cardBase} min-h-[240px]`}
               style={{ animationDelay: '180ms' }}>
            <NumBadge n="03" count="3" />
            <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
              <div className="w-[200px] h-full"><UIUXVisual /></div>
            </div>
            <div className="relative mt-auto pt-16">
              <p className="text-[28px] font-bold leading-[1.1] text-white">UI/UX Design</p>
              <div className="flex gap-1.5 mt-3">
                <span className="h-[3px] w-8 rounded-full bg-blue-500 block"/>
                <span className="h-[3px] w-5 rounded-full bg-violet-500 block"/>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: 4 columns ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* 04 – E-commerce text card */}
          <div className={`card-reveal ${cardBase} min-h-[240px]`}
               style={{ animationDelay: '270ms' }}>
            <NumBadge n="04" count="4" />
            <div className="flex-1" />
            <div className="mt-4">
              <p className="text-[24px] font-bold leading-[1.15] text-white">E-commerce</p>
              <p className="text-[24px] font-bold leading-[1.15] text-white/60">Solutions</p>
            </div>
          </div>

          {/* 04b – E-commerce visual */}
          <div className={`card-reveal ${cardBase} min-h-[300px] items-center justify-center !p-2`}
               style={{ animationDelay: '340ms' }}>
            <div className="w-full h-full min-h-[280px]"><EcommerceVisual /></div>
          </div>

          {/* 05 – AI Chatbot */}
          <div className={`card-reveal ${cardBase} min-h-[240px]`}
               style={{ animationDelay: '410ms' }}>
            <NumBadge n="05" count="≡1" />
            <div className="flex-1 flex items-end pb-1">
              <div className="w-full h-[90px]"><ChatbotVisual /></div>
            </div>
            <div className="mt-3">
              <p className="text-[24px] font-bold leading-[1.15] text-white">AI Chatbot</p>
              <p className="text-[24px] font-bold leading-[1.15] text-white/60">Development</p>
            </div>
          </div>

          {/* 06 – CRM & Automation */}
          <div className={`card-reveal ${cardBase} min-h-[240px]`}
               style={{ animationDelay: '480ms' }}>
            <NumBadge n="06" />
            <div className="flex-1 flex items-center justify-center mt-1">
              <div className="w-full h-[130px]"><CRMVisual /></div>
            </div>
            <div className="mt-3">
              <p className="text-[24px] font-bold leading-[1.15] text-white">CRM &amp;</p>
              <p className="text-[24px] font-bold leading-[1.15] text-white/60">Automation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Feature blocks ---------- */
function FeatureBlock({
  eyebrow,
  title,
  body,
  visual,
  reverse,
}: {
  eyebrow: string;
  title: string;
  body: string;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`grid items-center gap-8 md:gap-12 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-glow">{eyebrow}</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">{title}</h3>
        <p className="mt-4 text-sm text-foreground/70 sm:text-base sm:mt-5">{body}</p>
        <a href="#" className="mt-5 inline-flex items-center gap-1 text-sm text-foreground hover:text-violet-glow">
          Learn more
        </a>
      </div>
      <div className="relative">{visual}</div>
    </div>
  );
}

function VisualCardIssuing() {
  return (
    <div className="relative h-60 sm:h-80 rounded-3xl border border-white/10 bg-card-dark p-8 shadow-card-elevated">
      <div className="absolute inset-0 rounded-3xl [background:radial-gradient(circle_at_70%_30%,rgba(170,120,255,0.25),transparent_60%)]" />
      <div className="relative flex h-full items-center justify-center">
        <div className="rotate-[-6deg] scale-90">
          <PadlockAscii />
        </div>
      </div>

    </div>
  );
}

function VisualCounter() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v + 1) % 100), 80);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative h-60 sm:h-80 overflow-hidden rounded-3xl border border-white/10 bg-card-dark p-8">
      <div className="absolute inset-0 [background:radial-gradient(circle_at_30%_70%,rgba(170,120,255,0.25),transparent_60%)]" />
      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="font-mono text-7xl font-bold tabular-nums text-foreground">
          {String(n).padStart(2, "0")}
        </div>
        <div className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">ms latency</div>
      </div>
    </div>
  );
}

function VisualSharing() {
  return (
    <div className="relative grid h-60 sm:h-80 grid-cols-3 items-center gap-3 rounded-3xl border border-white/10 bg-card-dark p-6">
      {["Issuer", "Securepay", "Partner"].map((label, i) => (
        <div
          key={label}
          className={`flex h-full flex-col items-center justify-center rounded-2xl p-4 text-center text-xs ${
            i === 1 ? "bg-card-purple shadow-violet-glow text-white" : "border border-white/10 bg-white/[0.03] text-foreground/80"
          }`}
        >
          <div className="font-mono text-2xl">{["#", "*", "+"][i]}</div>
          <div className="mt-2">{label}</div>
        </div>
      ))}
      <svg className="pointer-events-none absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="33" y1="50" x2="38" y2="50" stroke="rgba(170,120,255,0.6)" strokeDasharray="2 2" />
        <line x1="62" y1="50" x2="67" y2="50" stroke="rgba(170,120,255,0.6)" strokeDasharray="2 2" />
      </svg>
    </div>
  );
}

function Features() {
  return (
    <section className="space-y-28 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <FeatureBlock
          eyebrow="Website Development"
          title="Custom websites built for performance, scalability, and conversion"
          body="From corporate websites to e-commerce platforms, we build responsive, SEO-optimized websites that drive results. Our development process ensures fast load times, seamless user experience, and easy content management."
          visual={<VisualCardIssuing />}
        />
      </div>
      <div className="mx-auto max-w-6xl">
        <FeatureBlock
          eyebrow="AI Agent Automation"
          title="Intelligent automation that works 24/7 for your business"
          body="Deploy AI chatbots, customer support agents, and lead generation systems that handle inquiries, book appointments, and qualify leads automatically. Integrate with WhatsApp, CRM, and your existing tools."
          visual={<VisualSharing />}
          reverse
        />
      </div>
      <div className="mx-auto max-w-6xl">
        <FeatureBlock
          eyebrow="Digital Growth"
          title="Data-driven strategies to scale your online presence"
          body="Comprehensive SEO optimization, conversion rate optimization, and marketing automation. We analyze, optimize, and automate your digital marketing to maximize ROI and sustainable growth."
          visual={<VisualCounter />}
        />
      </div>
    </section>
  );
}

/* ---------- Encryption model section ---------- */
function EncryptionModel() {
  const items = [
    {
      title: "Fast Turnaround",
      body: "We deliver projects on time without compromising quality. Our agile process ensures rapid development with continuous feedback and iterations.",
    },
    {
      title: "Scalable Solutions",
      body: "Build for today, scale for tomorrow. Our architecture and code are designed to grow with your business needs and handle increasing traffic.",
    },
    {
      title: "Ongoing Support",
      body: "We don't disappear after launch. Get continuous maintenance, updates, and support to keep your digital assets running smoothly.",
    },
  ];
  return (
    <section className="relative overflow-hidden border-y border-white/5 px-4 py-16 sm:px-6 sm:py-20 md:py-28">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_0%,rgba(170,120,255,0.18),transparent_50%)]" />
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading title="Why businesses choose us for their digital transformation" />
        <p className="mx-auto mt-5 max-w-2xl px-4 text-center text-sm text-foreground/70 sm:mt-6 sm:px-0 sm:text-base">
          We combine technical expertise with business understanding to deliver solutions that
          not only look great but drive measurable results for your bottom line.
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((i) => (
            <div
              key={i.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <h4 className="text-lg font-semibold">{i.title}</h4>
              <p className="mt-3 text-sm text-foreground/70">{i.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Devs / Code block ---------- */
function CodeBlock() {
  const lines = [
    `import { Card, themes } from "@securepay/react"`,
    `import theme from './theme'`,
    ``,
    `export function Checkout() {`,
    `  return (`,
    `    <Card theme={theme} />`,
    `  )`,
    `}`,
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-card-dark shadow-card-elevated">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-muted-foreground">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3">Checkout.jsx</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6">
        {lines.map((l, i) => (
          <div key={i} className="flex">
            <span className="w-8 select-none text-muted-foreground/50">{i + 1}</span>
            <span className="text-foreground/90">{l}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

function DevSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:gap-12 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-glow">Modern Tech Stack</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl">
            Built with cutting-edge technologies for optimal performance
          </h2>
          <p className="mt-4 text-sm text-foreground/70 sm:mt-5 sm:text-base">
            We use the latest frameworks and tools to build fast, secure, and maintainable solutions.
            From React and Next.js to AI integrations and automation platforms.
          </p>
          <a href="#" className="mt-5 inline-flex items-center gap-1 text-sm hover:text-violet-glow">
            View our tech stack
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
            {["React", "Next.js", "Node.js", "AI/ML", "Cloud"].map((s) => (
              <span key={s} className="rounded-md border border-white/10 px-3 py-1.5">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto"><CodeBlock /></div>
      </div>
    </section>
  );
}

/* ---------- Primitives ---------- */
function Primitives() {
  const items = [
    { name: "Web Development", body: "Custom websites, e-commerce platforms, and SaaS applications built with modern frameworks." },
    { name: "AI Automation", body: "Intelligent chatbots, workflow automation, and AI agents that streamline your operations." },
    { name: "UI/UX Design", body: "Beautiful, intuitive interfaces designed to convert visitors into customers." },
    { name: "Growth Marketing", body: "SEO, CRO, and marketing automation strategies that drive sustainable growth." },
  ];
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Our Services" title="Complete digital solutions for modern businesses" />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:mt-14 lg:grid-cols-4">
          {items.map((i) => (
            <div
              key={i.name}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet/40 hover:bg-white/[0.06]"
            >
              <div className="mb-4 h-10 w-10 rounded-lg bg-gradient-to-br from-violet to-violet-glow shadow-violet-glow" />
              <h4 className="text-lg font-semibold">{i.name}</h4>
              <p className="mt-2 text-sm text-foreground/70">{i.body}</p>
              <a href="#" className="mt-4 inline-flex text-sm text-violet-glow opacity-0 transition group-hover:opacity-100">
                Learn more
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Data Policies ---------- */
function PolicyCard({
  service,
  conditions,
}: {
  service: string;
  conditions: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-card-dark p-5 font-mono text-[13px]">
      <div className="text-foreground/70">
        <span className="text-violet-glow">Allow Decryption</span> for{" "}
        <span className="rounded bg-white/10 px-1.5 py-0.5 text-foreground">{service}</span>
      </div>
      <div className="mt-3 space-y-2 text-foreground/80">
        {conditions.map((c, i) => (
          <div key={i}>
            <span className="text-muted-foreground">{i === 0 ? "when " : "and "}</span>
            {c.label}{" "}
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-foreground">{c.value}</span>
          </div>
        ))}
      </div>
      <button className="mt-4 text-xs text-violet-glow">+ Add condition</button>
    </div>
  );
}

function PoliciesAudit() {
  const audit = [
    ["Claude", "created Relay to", "api.stripe.com"],
    ["Lucy", "created Merchant", "Ollivander's Wand Shop"],
    ["Nev", "created API Key", "EU Resources Key"],
    ["Eoin", "deleted Function", "validate-credit-card"],
    ["Anna", "invited", "steve@acme.co"],
    ["Thomas", "updated Relay", "api.adyen.com"],
    ["Sara", "deleted API Key", "Synthetics Test"],
    ["Dylan", "deployed Enclave", "hello-enclave"],
  ];
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Control" title="Granular data policies, full audit visibility" />
        <div className="mt-10 grid gap-8 md:grid-cols-2 sm:mt-14">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Data Policies
            </h4>
            <PolicyCard
              service="api.stripe.com"
              conditions={[
                { label: "Request IP equals", value: "92.158.1.38" },
                { label: "Region equals", value: "US (Virginia)" },
              ]}
            />
            <PolicyCard
              service="api.twilio.com"
              conditions={[
                { label: "Timestamp is before", value: "20/08/2024" },
                { label: "Region equals", value: "EU (Ireland)" },
              ]}
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Audit Logging
            </h4>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-card-dark">
              {audit.map(([who, action, target], i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 sm:gap-3 border-b border-white/5 px-3 sm:px-5 py-3 text-sm last:border-b-0"
                >
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet to-violet-glow text-[11px] font-semibold">
                    {who[0]}
                  </div>
                  <div className="font-medium shrink-0">{who}</div>
                  <div className="text-muted-foreground hidden sm:block">{action}</div>
                  <div className="ml-auto truncate font-mono text-xs text-foreground/80 max-w-[100px] sm:max-w-none">{target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */
function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number | string; currency?: string } | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Starter",
      description: "Essential creative services for growing startups and businesses.",
      price: { monthly: 3500, annually: 2800 },
      cta: "Choose Starter",
      highlight: false,
      glowColor: "violet" as const,
      specs: [
        { label: "1 active request slot", icon: Layers },
        { label: "7-10 business days delivery", icon: Clock },
      ],
      features: [
        { name: "Brand Identity Design (Basic)" },
        { name: "Website Design (Up to 5 pages)" },
        { name: "Website Development" },
        { name: "Social Media Creative Assets" },
        { name: "SEO Optimization (Basic)", tag: "Essential" },
        { name: "Content Strategy (Basic)" },
        { name: "Priority Support (Email & Chat)" },
      ],
    },
    {
      name: "Professional",
      description: "Our most popular plan. A full-service creative solution for scaling brands.",
      price: { monthly: 7200, annually: 5760 },
      cta: "Choose Professional",
      highlight: true,
      badge: "Most Popular",
      glowColor: "violet" as const,
      specs: [
        { label: "2 active request slots", icon: Layers },
        { label: "Priority 48-hour delivery", icon: Clock },
      ],
      features: [
        { name: "Brand Identity (Full System)", tag: "Premium" },
        { name: "UI/UX Design (Web & Mobile)" },
        { name: "Website Design & Development" },
        { name: "Social Media Creative Assets" },
        { name: "Motion Graphics (Up to 30s/mo)" },
        { name: "SEO Optimization (Full)" },
        { name: "Content Strategy (Advanced)" },
        { name: "Dedicated Project Manager", tag: "Dedicated" },
        { name: "Priority Support (Slack, <24h)" },
      ],
    },
    {
      name: "Enterprise",
      description: "Fully customized creative and technical solutions for enterprise brands.",
      price: { monthly: "Custom", annually: "Custom" },
      cta: "Contact Sales",
      highlight: false,
      badge: "Custom Solution",
      glowColor: "violet" as const,
      specs: [
        { label: "Unlimited active requests", icon: Layers },
        { label: "Next-day delivery available", icon: Clock },
      ],
      features: [
        { name: "Brand Identity, UI/UX, Dev" },
        { name: "Unlimited Revisions", tag: "Exclusive" },
        { name: "Motion Graphics (Unlimited)" },
        { name: "Custom Integrations & API" },
        { name: "Strategy & Consulting", tag: "Weekly" },
        { name: "Dedicated Creative Director" },
        { name: "24/7 VIP Phone & Slack Support" },
      ],
    },
  ];

  return (
    <>
    <section id="pricing" className="relative overflow-hidden py-28 sm:py-36">

      {/* ── Deep dark canvas ── */}
      <div className="absolute inset-0 bg-[oklch(0.06_0.02_280)]" />
      {/* top & bottom page-blends */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />

      {/* ── Ambient glow blobs ── */}
      {/* large violet — top-left */}
      <div className="pointer-events-none absolute -top-60 -left-40 h-[700px] w-[700px] rounded-full opacity-[0.18]"
        style={{ background: "radial-gradient(circle,oklch(0.62 0.22 290) 0%,transparent 70%)", filter: "blur(80px)" }} />
      {/* cyan accent — bottom-right */}
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full opacity-[0.12]"
        style={{ background: "radial-gradient(circle,oklch(0.75 0.18 210) 0%,transparent 70%)", filter: "blur(80px)" }} />
      {/* indigo — center */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle,oklch(0.55 0.25 270) 0%,transparent 70%)", filter: "blur(100px)" }} />
      {/* subtle dot-grid noise */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "radial-gradient(circle,oklch(1 0 0) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">

        {/* ── Section header ── */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-violet-glow mb-4">Pricing Plans</p>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.98 0.005 280) 0%, oklch(0.98 0.005 280) 50%, oklch(0.78 0.18 295) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Transparent pricing,
            </span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.78 0.18 295) 0%, oklch(0.72 0.20 260) 50%, oklch(0.75 0.18 210) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              real creative value.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-foreground/50 sm:text-base leading-relaxed">
            Supercharge your brand with design, development, and marketing automation.
            Simple monthly pricing. Cancel or pause anytime.
          </p>
        </div>

        {/* ── Billing toggle — pill-style sliding indicator ── */}
        <div className="mt-10 flex items-center justify-center">
          <div className="relative flex items-center rounded-2xl border border-white/[0.09] bg-white/[0.04] p-1 backdrop-blur-sm">
            {/* sliding pill */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white/[0.10] border border-white/[0.12] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ left: billingPeriod === "monthly" ? "4px" : "calc(50%)" }}
            />
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`relative z-10 px-6 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 ${billingPeriod === "monthly" ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annually")}
              className={`relative z-10 flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 ${billingPeriod === "annually" ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"}`}
            >
              Annually
              <span className="rounded-full bg-violet/25 border border-violet-glow/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-glow">
                −20%
              </span>
            </button>
          </div>
        </div>

        {/* ── Cards grid ── */}
        <div className="mt-14 grid gap-5 grid-cols-1 md:grid-cols-3 md:items-stretch sm:mt-16">
          {plans.map((plan, planIdx) => {
            const isHighlight = plan.highlight;
            const isHovered   = hoveredPlan === plan.name;
            const currentPrice = plan.price[billingPeriod];

            return (
              <div
                key={plan.name}
                onMouseEnter={() => setHoveredPlan(plan.name)}
                onMouseLeave={() => setHoveredPlan(null)}
                style={{ animationDelay: `${planIdx * 80}ms` }}
                className={[
                  // base layout
                  "relative overflow-hidden rounded-[28px] flex flex-col border",
                  "transition-all duration-300 ease-out",
                  // lift on hover
                  isHovered && !isHighlight ? "-translate-y-2" : "",
                  // highlighted card — glowing ring + scale
                  isHighlight
                    ? [
                        "z-10 md:scale-[1.04]",
                        "bg-gradient-to-b from-[oklch(0.17_0.06_285)] via-[oklch(0.13_0.05_282)] to-[oklch(0.10_0.04_280)]",
                        "border-[oklch(0.62_0.22_290_/_0.50)]",
                        "shadow-[0_0_0_1px_oklch(0.62_0.22_290_/_0.20),0_32px_64px_-8px_oklch(0_0_0_/_0.7),0_0_60px_-10px_oklch(0.62_0.22_290_/_0.25)]",
                        isHovered ? "shadow-[0_0_0_1px_oklch(0.62_0.22_290_/_0.35),0_40px_80px_-8px_oklch(0_0_0_/_0.8),0_0_80px_-10px_oklch(0.62_0.22_290_/_0.40)] -translate-y-1" : "",
                      ].join(" ")
                    : [
                        "bg-gradient-to-b from-[oklch(0.12_0.03_282)] to-[oklch(0.09_0.025_280)]",
                        "border-white/[0.08]",
                        isHovered
                          ? "border-white/[0.16] shadow-[0_32px_64px_-8px_oklch(0_0_0_/_0.6),0_0_40px_-10px_oklch(0.62_0.22_290_/_0.15)]"
                          : "shadow-[0_16px_40px_-8px_oklch(0_0_0_/_0.5)]",
                      ].join(" "),
                ].join(" ")}
              >
                {/* ── Per-card ambient glow ── */}
                <div
                  className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[160%] h-64 blur-3xl"
                  style={{
                    background: `radial-gradient(ellipse at center, oklch(0.62 0.22 290 / ${isHighlight ? "0.30" : isHovered ? "0.14" : "0.08"}) 0%, transparent 70%)`,
                    transition: "background 0.3s ease",
                  }}
                />
                {/* ── Dot-grid texture ── */}
                <div className="pointer-events-none absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: "radial-gradient(circle at center,oklch(1 0 0 / 0.07) 1px,transparent 1.5px)",
                    backgroundSize: "14px 14px",
                  }}
                />
                {/* ── Top edge accent line ── */}
                <div className={[
                  "pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-opacity duration-300",
                  isHighlight ? "via-violet-glow/60 opacity-100" : isHovered ? "via-white/20 opacity-100" : "via-white/8 opacity-60",
                ].join(" ")} />

                <div className="relative flex flex-col h-full p-7 sm:p-8">

                  {/* ── Card top: icon + badge ── */}
                  <div className="flex items-start justify-between mb-6">
                    {/* Icon tile */}
                    <div className={[
                      "flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-all duration-300",
                      isHighlight
                        ? "bg-gradient-to-br from-violet to-[oklch(0.55_0.25_285)] shadow-[0_0_24px_oklch(0.62_0.22_290_/_0.5)]"
                        : isHovered
                          ? "bg-[oklch(0.62_0.22_290_/_0.20)] border border-[oklch(0.62_0.22_290_/_0.35)] shadow-[0_0_16px_oklch(0.62_0.22_290_/_0.20)]"
                          : "bg-[oklch(0.62_0.22_290_/_0.10)] border border-[oklch(0.62_0.22_290_/_0.18)]",
                    ].join(" ")}>
                      {plan.glowColor === "violet" && plan.name === "Starter"      && <Zap className="h-5 w-5" />}
                      {plan.glowColor === "violet" && plan.name === "Professional" && <Sparkles className="h-5 w-5" />}
                      {plan.glowColor === "violet" && plan.name === "Enterprise"   && <ShieldCheck className="h-5 w-5" />}
                    </div>
                    {/* Badge */}
                    {plan.badge && (
                      <span className={[
                        "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                        isHighlight
                          ? "border border-violet/50 bg-violet/20 text-violet-glow shadow-[0_0_12px_oklch(0.62_0.22_290_/_0.25)]"
                          : "border border-white/[0.12] bg-white/[0.06] text-foreground/50",
                      ].join(" ")}>
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* ── Plan name + description ── */}
                  <h3 className={[
                    "text-xl font-bold tracking-tight transition-colors duration-200",
                    isHighlight ? "text-foreground" : isHovered ? "text-foreground" : "text-foreground/85",
                  ].join(" ")}>
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/45 leading-relaxed">{plan.description}</p>

                  {/* ── Price ── */}
                  <div className="mt-7 flex items-baseline gap-1.5">
                    {typeof currentPrice === "number" ? (
                      <>
                        <span className="text-lg font-semibold text-foreground/40">₹</span>
                        <span className={[
                          "text-5xl font-extrabold tracking-tight leading-none transition-all duration-300",
                          isHighlight ? "text-foreground" : "text-foreground/90",
                        ].join(" ")}>
                          {currentPrice.toLocaleString("en-IN")}
                        </span>
                        <div className="ml-1 flex flex-col">
                          <span className="text-sm font-medium text-foreground/35 leading-none">/ mo</span>
                          {billingPeriod === "annually" && (
                            <span className="text-[11px] text-violet-glow/70 mt-1 leading-none">billed annually</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <span className="text-5xl font-extrabold tracking-tight text-foreground/90">
                        Custom
                      </span>
                    )}
                  </div>

                  {/* ── CTA button ── */}
                  <div className="mt-8">
                    <button
                      className={[
                        "w-full rounded-2xl py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer",
                        isHighlight
                          ? "bg-gradient-to-r from-violet to-violet-glow text-white shadow-[0_0_24px_oklch(0.62_0.22_290_/_0.40)] hover:shadow-[0_0_36px_oklch(0.62_0.22_290_/_0.60)] hover:scale-[1.02] hover:from-[oklch(0.68_0.22_290)] hover:to-[oklch(0.82_0.18_295)]"
                          : "border border-white/[0.12] bg-white/[0.05] text-foreground/80 hover:bg-white/[0.10] hover:border-white/[0.22] hover:text-foreground hover:scale-[1.02]",
                      ].join(" ")}
                      onClick={() => {
                        const price = plan.price[billingPeriod];
                        if (typeof price === "number") {
                          // Billing-period-aware planName for backend PLAN_PRICES registry
                          // "Starter-Annual" → ₹2800 | "Starter" → ₹3500
                          const planKey = billingPeriod === "annually"
                            ? `${plan.name}-Annual`
                            : plan.name;
                          setSelectedPlan({ name: planKey, price, currency: "INR" });
                        } else {
                          window.location.href = "mailto:hello@brandarx.com?subject=Enterprise%20Plan%20Inquiry";
                        }
                      }}
                    >
                      {plan.cta}
                    </button>
                  </div>

                  {/* ── Specs ── */}
                  <div className="mt-7 space-y-2.5 border-t border-white/[0.06] pt-6">
                    {plan.specs.map((spec, sIdx) => {
                      const IconComp = spec.icon;
                      return (
                        <div key={sIdx} className="flex items-center gap-2.5 text-sm">
                          <span className={[
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                            isHighlight ? "bg-violet/20 text-violet-glow" : "bg-white/[0.06] text-foreground/40",
                          ].join(" ")}>
                            <IconComp className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-foreground/55">{spec.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Divider ── */}
                  <div className="relative flex items-center my-7">
                    <div className="w-full border-t border-white/[0.07]" />
                    <span className={[
                      "absolute left-1/2 -translate-x-1/2 px-3 text-[10px] font-bold uppercase tracking-[0.22em] whitespace-nowrap",
                      "bg-[oklch(0.12_0.03_282)]",
                      isHighlight ? "text-violet-glow/50" : "text-foreground/25",
                    ].join(" ")}>
                      Included
                    </span>
                  </div>

                  {/* ── Features list ── */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="group/feat flex items-start gap-3">
                        {/* Checkmark */}
                        <div className={[
                          "mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                          isHighlight
                            ? "bg-violet/25 border border-violet/40 text-violet-glow"
                            : "bg-white/[0.06] border border-white/[0.12] text-foreground/45 group-hover/feat:bg-violet/15 group-hover/feat:border-violet/25 group-hover/feat:text-violet-glow/70",
                        ].join(" ")}>
                          <Check className="h-3 w-3" />
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-sm">
                          <span className={[
                            "leading-relaxed transition-colors duration-150",
                            isHighlight ? "text-foreground/80" : "text-foreground/60 group-hover/feat:text-foreground/80",
                          ].join(" ")}>
                            {feat.name}
                          </span>
                          {feat.tag && (
                            <span className={[
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                              isHighlight
                                ? "border border-violet/35 bg-violet/12 text-violet-glow"
                                : "border border-white/[0.10] bg-white/[0.04] text-foreground/40",
                            ].join(" ")}>
                              {feat.tag}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom trust line ── */}
        <p className="mt-12 text-center text-sm text-foreground/30">
          No lock-in contracts · Pause or cancel anytime · Invoiced in INR
        </p>
      </div>
    </section>

    {/* Payment Modal — unchanged, all props preserved */}
    {selectedPlan && (
      <PaymentModal
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    )}
    </>
  );
}

/* ---------- Testimonials ---------- */
function Testimonials() {
  const quotes = [
    {
      q: "AgencyPro transformed our online presence completely. The new website increased our conversions by 150% and the AI chatbot handles 80% of customer inquiries automatically.",
      who: "Sarah Chen",
      role: "CEO, TechStartup Inc",
    },
    {
      q: "The team delivered beyond expectations. Fast turnaround, excellent communication, and a website that truly represents our brand. Highly recommended!",
      who: "Michael Rodriguez",
      role: "Founder, GrowthLabs",
    },
    {
      q: "From design to deployment, everything was seamless. The AI automation they built saves us 20+ hours per week. Best investment we've made.",
      who: "Emily Watson",
      role: "Marketing Director, ScaleUp",
    },
  ];
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Client Success" title="Trusted by businesses that demand excellence" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 sm:mt-14">
          {quotes.map((t) => (
            <figure
              key={t.who}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <blockquote className="text-base leading-relaxed text-foreground/90">"{t.q}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 text-sm">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet to-violet-glow text-xs font-semibold">
                  {t.who[0]}
                </div>
                <div>
                  <div className="font-medium">{t.who}</div>
                  <div className="text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 md:py-32">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_50%,rgba(170,120,255,0.4),transparent_60%)]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-6xl">
          Ready to transform your digital presence?
        </h2>
        <p className="mt-5 text-sm text-foreground/80 sm:mt-6 sm:text-base">
          Let's build something amazing together. Get a free consultation and project quote today.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <a
            href="#"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet to-violet-glow px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet/40 hover:scale-105 sm:w-auto"
          >
            Schedule a Call
          </a>
          <a href="#" className="text-sm text-foreground/85 hover:text-foreground">
            View Portfolio
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const navCols = [
    { title: "Services", links: ["Website Development", "AI Automation", "UI/UX Design", "SEO & Growth"] },
    { title: "Solutions", links: ["E-commerce", "SaaS Platforms", "Corporate Sites", "Landing Pages"] },
    { title: "Company", links: ["About Us", "Portfolio", "Careers", "Blog", "Contact"] },
  ];

  const socials = [
    { name: "Discord", href: "#", d: "M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" },
    { name: "X", href: "#", d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
    { name: "LinkedIn", href: "#", d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
    { name: "GitHub", href: "#", d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
  ];

  return (
    <footer className="relative bg-background overflow-hidden px-4 py-10 sm:px-6 sm:py-12 md:py-16">
      {/* ── Two-card grid (Kresna-inspired) ── */}
      <div className="mx-auto grid max-w-[1150px] gap-4 grid-cols-1 md:grid-cols-[350px_1fr]">

        {/* ═══ LEFT CARD — Gradient visual ═══ */}
        <div className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[28px] p-6 sm:p-8 md:min-h-[340px]"
          style={{
            background: "linear-gradient(145deg, oklch(0.55 0.25 290) 0%, oklch(0.38 0.22 285) 50%, oklch(0.22 0.15 280) 100%)",
            boxShadow: "0 12px 40px oklch(0.45 0.22 290 / 0.3)",
          }}>
          {/* Decorative glow orb */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, oklch(0.78 0.18 295) 0%, transparent 70%)" }} />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/30 bg-white/15">
              <span className="text-sm font-bold text-white" style={{ letterSpacing: "-0.02em" }}>B</span>
            </div>
            <span className="text-[22px] font-bold tracking-tight text-white" style={{ letterSpacing: "-0.02em" }}>BrandArx</span>
          </div>

          {/* Tagline */}
          <div className="relative z-10 mb-7 mt-auto">
            <p className="text-[19px] font-normal leading-[1.45] text-white">
              Smarter digital growth,<br/>
              <span className="text-white/65">powered by AI &amp; design.</span>
            </p>
          </div>

          {/* Social row */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[17px] font-semibold italic text-white/90" style={{ fontFamily: "inherit" }}>
              Stay in touch!
            </span>
            <div className="flex gap-[7px]">
              {socials.map((s) => (
                <a key={s.name} href={s.href} aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#0e1014] transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_8px_22px_rgba(0,0,0,0.4)]"
                  style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2)" }}>
                  <svg className="h-[15px] w-[15px]" fill="white" viewBox="0 0 24 24"><path d={s.d}/></svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT CARD — Navigation + Subscribe ═══ */}
        <div className="relative flex flex-col justify-between overflow-visible rounded-[28px] bg-secondary p-6 sm:p-8 md:p-10 mt-12 md:mt-0"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>

          {/* Floating badge */}
          <div className="absolute -top-9 right-4 z-10 flex flex-col items-start gap-1.5 sm:right-10 md:right-12">
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-[22px] shadow-[8px_14px_28px_oklch(0.45_0.22_290_/_0.35)]"
              style={{
                background: "linear-gradient(135deg, oklch(0.68 0.18 290) 0%, oklch(0.45 0.22 285) 55%, oklch(0.38 0.20 282) 100%)",
                transform: "rotate(-10deg)",
                boxShadow: "inset 3px 3px 8px rgba(255,255,255,0.35), inset -3px -3px 12px rgba(0,0,0,0.18), 8px 14px 28px oklch(0.45 0.22 290 / 0.35)",
              }}>
              <span className="text-[36px] sm:text-[42px] font-bold text-white" style={{ transform: "rotate(10deg)", letterSpacing: "-0.04em", textShadow: "0 3px 6px rgba(0,0,0,0.25)" }}>B</span>
            </div>
            <div className="flex items-center gap-1.5" style={{ transform: "rotate(-4deg)", marginTop: "4px" }}>
              <svg className="h-[22px] w-[22px] text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20 C 6 14, 10 9, 18 5"/><path d="M18 5 L 12 5"/><path d="M18 5 L 18 11"/>
              </svg>
              <span className="whitespace-nowrap text-[20px] font-semibold italic text-muted-foreground">Feeling lucky?</span>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="flex flex-wrap gap-x-6 gap-y-6 pt-2 sm:gap-x-10 sm:gap-y-8 md:gap-x-16">
            {navCols.map((col) => (
              <div key={col.title}>
                <h5 className="mb-3 text-[18px] font-semibold italic text-muted-foreground/60 sm:mb-4 sm:text-[24px]">{col.title}</h5>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[14px] font-semibold text-foreground transition-colors duration-200 hover:text-violet">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom: CTA + subscribe */}
          <div className="mt-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <p className="text-[12.5px] font-medium text-muted-foreground">
              © {new Date().getFullYear()} BrandArx. All rights reserved.
            </p>
            <div className="flex flex-col gap-3.5">
              <p className="text-[15px] text-muted-foreground leading-[1.45]">
                AI moves fast.<br/>
                <strong className="text-[19px] font-bold text-foreground">Stay ahead with BrandArx.</strong>
              </p>
              <div className="flex w-full max-w-full sm:max-w-[310px] items-center rounded-xl border border-white/10 bg-background p-[5px]"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="flex-1 bg-transparent px-3.5 py-2.5 text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button className="shrink-0 rounded-lg bg-[#111214] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-black hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                  style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.15)" }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Giant watermark below cards ── */}
      <div className="pointer-events-none mx-auto -mt-14 max-w-[1150px] select-none" aria-hidden="true">
        <svg className="block w-full overflow-visible" viewBox="62 95 876 175" preserveAspectRatio="xMidYMid meet">
          <text x="500" y="240" textAnchor="middle" fontSize="320"
            className="fill-foreground/[0.03]"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 700, letterSpacing: "-0.03em" }}>
            BrandArx
          </text>
        </svg>
      </div>
    </footer>
  );
}

/* ---------- Services Offering ---------- */
const SERVICES = [
  {
    id: "software-development",
    icon: Code2,
    label: "Software development",
    eyebrow: "Core Capability",
    heading: "Engineering software built to last",
    body: "A software development company with deep business excellence, we engineer reliable, scalable, and secure software solutions for any OS, browser, and device. We bring together domain expertise and the latest advancements to deliver custom solutions that perfectly fit the needs and behavior of their users.",
    stat: { value: "37+", label: "years of delivery" },
    sub: [
      "Software consulting",
      "Custom software development",
      "Software development outsourcing",
      "Software product development",
      "Team augmentation",
      "Cloud application development",
      "Legacy software modernization",
      "Post-launch support",
    ],
  },
  {
    id: "ai-enablement",
    icon: BrainCircuit,
    label: "AI enablement",
    eyebrow: "Intelligence Layer",
    heading: "Embed intelligence across every workflow",
    body: "We help organizations move from AI experimentation to production-grade deployment. From LLM integration and prompt engineering to autonomous agents and RAG pipelines — we design AI systems that are observable, controllable, and tied to real business outcomes.",
    stat: { value: "10×", label: "productivity gains" },
    sub: [
      "LLM integration & fine-tuning",
      "AI agent & workflow automation",
      "RAG pipeline design",
      "Prompt engineering & governance",
      "Model evaluation frameworks",
      "MLOps & deployment",
      "AI product strategy",
      "Responsible AI audits",
    ],
  },
  {
    id: "it-consulting",
    icon: Zap,
    label: "IT consulting",
    eyebrow: "Strategic Guidance",
    heading: "Technology strategy that drives decisions",
    body: "Our consultants work alongside your leadership to translate business objectives into technology roadmaps. We assess your current stack, identify risk and opportunity, and design a path forward — whether you're modernizing, scaling, or navigating a complex transformation.",
    stat: { value: "500+", label: "projects delivered" },
    sub: [
      "IT strategy & roadmapping",
      "Architecture review",
      "Digital transformation advisory",
      "Vendor & platform selection",
      "IT cost optimization",
      "Technology due diligence",
      "CTO-as-a-service",
      "Change management",
    ],
  },
  {
    id: "application-services",
    icon: AppWindow,
    label: "Application services",
    eyebrow: "End-to-End Delivery",
    heading: "Applications managed across their full lifecycle",
    body: "From design and build to integration and ongoing management, we own the full application lifecycle. We bring structured delivery practices and deep engineering expertise so your teams can stay focused on products while we keep systems healthy and evolving.",
    stat: { value: "99.9%", label: "uptime SLA" },
    sub: [
      "Application design & build",
      "API design & integration",
      "Performance optimization",
      "Application migration",
      "Application re-platforming",
      "Managed application services",
      "SLA-based support",
      "Capacity planning",
    ],
  },
  {
    id: "testing-qa",
    icon: FlaskConical,
    label: "Testing and QA",
    eyebrow: "Quality Assurance",
    heading: "Quality built in, not bolted on",
    body: "We embed quality at every stage of the delivery cycle — not just at the end. Our QA engineers combine manual expertise with automation at scale to find defects early, ensure release confidence, and build testing practices that stay ahead of velocity.",
    stat: { value: "80%", label: "defect reduction" },
    sub: [
      "Test strategy & planning",
      "Automated testing (UI, API, unit)",
      "Performance & load testing",
      "Security & penetration testing",
      "Accessibility testing",
      "Mobile testing",
      "QA as a service",
      "Test data management",
    ],
  },
  {
    id: "data-analytics",
    icon: Database,
    label: "Data analytics",
    eyebrow: "Data Intelligence",
    heading: "Turn raw data into decisions",
    body: "We design and build data platforms that let your teams answer hard questions fast. From data warehousing and pipeline engineering to BI dashboards and advanced analytics, we create a single source of truth that powers confident decision-making across every function.",
    stat: { value: "3×", label: "faster insights" },
    sub: [
      "Data platform engineering",
      "ETL / ELT pipeline design",
      "Data warehouse & lakehouse",
      "Business intelligence & dashboards",
      "Real-time analytics",
      "Data governance & quality",
      "Predictive analytics",
      "Self-service analytics enablement",
    ],
  },
  {
    id: "help-desk",
    icon: Headphones,
    label: "Help desk services",
    eyebrow: "User Support",
    heading: "Support experiences users actually remember",
    body: "We operate tiered help desk functions that resolve issues fast and collect feedback that improves your product. Our teams handle L1–L3 support across channels — backed by knowledge bases, runbooks, and SLA monitoring — so your users are never left waiting.",
    stat: { value: "<2 hr", label: "avg. resolution" },
    sub: [
      "L1 / L2 / L3 support tiers",
      "Multi-channel support (chat, email, phone)",
      "Knowledge base management",
      "ITSM tooling & ticketing",
      "Incident management",
      "End-user onboarding",
      "SLA design & monitoring",
      "Support analytics & reporting",
    ],
  },
  {
    id: "infrastructure",
    icon: Server,
    label: "Infrastructure services",
    eyebrow: "Platform Engineering",
    heading: "Infrastructure that scales with confidence",
    body: "We design, build, and operate cloud and hybrid infrastructure that is secure, observable, and built for change. From IaC and container orchestration to cost governance and 24/7 monitoring, we give your platform the operational maturity it needs to grow.",
    stat: { value: "60%", label: "cost reduction avg." },
    sub: [
      "Cloud architecture (AWS, GCP, Azure)",
      "Infrastructure as Code (Terraform, Pulumi)",
      "Kubernetes & container orchestration",
      "CI/CD pipeline design",
      "Cost optimization & FinOps",
      "Observability & monitoring",
      "Disaster recovery & HA design",
      "Hybrid & multi-cloud strategy",
    ],
  },
  {
    id: "cybersecurity",
    icon: Lock,
    label: "Cybersecurity services",
    eyebrow: "Security Practice",
    heading: "Security engineered into every layer",
    body: "Cyber threats don't wait for convenient timing. We integrate security into design, development, and operations — delivering threat modeling, continuous monitoring, and rapid response capabilities that protect your systems, data, and reputation at every stage.",
    stat: { value: "0", label: "breaches on our watch" },
    sub: [
      "Security architecture review",
      "Penetration testing & red teaming",
      "DevSecOps integration",
      "SIEM & threat monitoring",
      "Identity & access management",
      "Compliance (SOC 2, ISO 27001, GDPR)",
      "Vulnerability management",
      "Incident response & forensics",
    ],
  },
] as const;

type ServiceId = (typeof SERVICES)[number]["id"];

function ServicesOffering() {
  const [activeId, setActiveId] = useState<ServiceId>("software-development");
  const activeIdx = SERVICES.findIndex((s) => s.id === activeId);
  const active = SERVICES[activeIdx];
  const Icon = active.icon;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* deep section background */}
      <div className="absolute inset-0 bg-[oklch(0.07_0.02_280)]" />
      {/* top fade from page bg */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
      {/* bottom fade to page bg */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      {/* large violet bloom — top-right */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-violet/[0.08] blur-[120px]" />
      {/* subtle noise grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage:"radial-gradient(circle,oklch(1 0 0)_1px,transparent_1px)", backgroundSize:"24px 24px" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between mb-14 sm:mb-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-glow mb-3">
              Explore Our Offering
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              What we do,{" "}
              <span className="text-gradient-fade">end to end</span>
            </h2>
          </div>
          <p className="text-sm text-foreground/40 sm:text-right sm:max-w-[220px] leading-relaxed">
            {SERVICES.length} practice areas.<br className="hidden sm:block" />
            One integrated partner.
          </p>
        </div>

        {/* ── Main layout: sidebar + panel ── */}
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-0 lg:rounded-3xl lg:border lg:border-white/[0.07] lg:overflow-hidden lg:bg-[oklch(0.09_0.025_280)]">

          {/* ── LEFT: tab list ── */}
          <nav
            aria-label="Service categories"
            className="flex flex-row flex-wrap gap-2 p-2
                       lg:flex-col lg:w-72 lg:shrink-0 lg:gap-0 lg:p-3
                       lg:border-r lg:border-white/[0.06]"
          >
            {SERVICES.map((s, i) => {
              const isActive = s.id === activeId;
              const SideIcon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-all duration-200 w-auto lg:w-full",
                    isActive
                      ? "bg-white/[0.08] text-foreground"
                      : "text-foreground/45 hover:text-foreground/80 hover:bg-white/[0.04]",
                  ].join(" ")}
                >
                  {/* active left bar */}
                  {isActive && (
                    <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-violet-glow shadow-[0_0_8px_oklch(0.78_0.18_295)]" />
                  )}
                  {/* icon */}
                  <span className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-br from-violet/40 to-violet/15 text-violet-glow shadow-[0_0_14px_oklch(0.62_0.22_290_/_0.35)]"
                      : "bg-white/[0.04] text-foreground/30 group-hover:bg-white/[0.07] group-hover:text-foreground/55",
                  ].join(" ")}>
                    <SideIcon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 leading-snug">{s.label}</span>
                  {/* index number */}
                  <span className={[
                    "hidden lg:block text-[11px] tabular-nums font-mono transition-colors",
                    isActive ? "text-violet-glow/50" : "text-foreground/20 group-hover:text-foreground/35",
                  ].join(" ")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* ── RIGHT: detail panel ── */}
          <div
            key={activeId}
            className="flex-1 min-w-0 relative overflow-hidden
                       rounded-2xl border border-white/[0.07] bg-[oklch(0.09_0.025_280)]
                       lg:rounded-none lg:border-0 lg:bg-transparent
                       animate-in fade-in duration-300"
          >
            {/* panel corner bloom */}
            <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-violet/[0.10] blur-[80px]" />
            {/* top accent line */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-glow/30 to-transparent" />

            <div className="relative p-6 sm:p-10">

              {/* ── Top meta row ── */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* icon + eyebrow */}
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet/25 bg-gradient-to-br from-violet/30 to-violet/10 text-violet-glow shadow-[0_0_24px_oklch(0.62_0.22_290_/_0.3)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-glow">
                      {active.eyebrow}
                    </p>
                    <p className="text-[11px] text-foreground/35 mt-0.5">
                      {String(activeIdx + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
                    </p>
                  </div>
                </div>
                {/* stat pill */}
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-3">
                  <div>
                    <p className="text-2xl font-extrabold tracking-tight leading-none text-foreground">{active.stat.value}</p>
                    <p className="text-[11px] text-foreground/35 mt-1 whitespace-nowrap">{active.stat.label}</p>
                  </div>
                </div>
              </div>

              {/* ── Heading ── */}
              <h3 className="relative mt-7 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl leading-[1.15]">
                {active.heading}
              </h3>

              {/* ── Body ── */}
              <p className="relative mt-4 text-sm leading-relaxed text-foreground/55 sm:text-[15px] max-w-2xl">
                {active.body}
              </p>

              {/* ── Divider with label ── */}
              <div className="relative mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/[0.06]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/25">
                  Capabilities
                </span>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              {/* ── Sub-services — two column compact list ── */}
              <ul className="relative mt-5 grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-x-4">
                {active.sub.map((item, idx) => (
                  <li
                    key={item}
                    className="group/item flex items-center gap-3 border-b border-white/[0.05] py-3 last:border-0 sm:[&:nth-last-child(2)]:border-0"
                  >
                    {/* number */}
                    <span className="w-6 shrink-0 text-[11px] tabular-nums font-mono text-foreground/20 group-hover/item:text-violet-glow/50 transition-colors duration-150">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {/* label */}
                    <span className="flex-1 text-sm text-foreground/65 group-hover/item:text-foreground/90 transition-colors duration-150">
                      {item}
                    </span>
                    {/* hover arrow */}
                    <ArrowRight className="h-3.5 w-3.5 text-violet-glow/0 group-hover/item:text-violet-glow/50 transition-all duration-150 -translate-x-1 group-hover/item:translate-x-0 shrink-0" />
                  </li>
                ))}
              </ul>

              {/* ── Footer CTA ── */}
              <div className="relative mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-7 border-t border-white/[0.06]">
                <div>
                  <p className="text-sm font-medium text-foreground/70">
                    Interested in {active.label.toLowerCase()}?
                  </p>
                  <p className="text-xs text-foreground/35 mt-0.5">
                    Talk to a specialist — no commitments.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="mailto:hello@brandarx.com"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-foreground/70 transition-all duration-200 hover:bg-white/[0.08] hover:text-foreground hover:border-white/[0.18]"
                  >
                    Contact us
                  </a>
                  <a
                    href="#pricing"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-violet-glow px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_oklch(0.62_0.22_290_/_0.35)] transition-all duration-200 hover:shadow-[0_0_30px_oklch(0.62_0.22_290_/_0.5)] hover:scale-[1.02]"
                  >
                    Get started
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <LogoTicker />
      <BeforeAfterShowcase />
      <ProductsGrid />
      <Features />
      <EncryptionModel />
      <DevSection />
      <Primitives />
      <ServicesOffering />
      <PoliciesAudit />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
