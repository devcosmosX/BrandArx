import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

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
      <div className="flex items-center gap-3">
        <span className="text-sm text-foreground/80">Welcome, {user.name}!</span>
        <button
          onClick={logout}
          className="inline-flex w-full items-center justify-center rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-foreground/90 transition hover:bg-white/5 hover:text-foreground sm:w-auto sm:px-7 sm:py-3 md:text-base lg:px-8 lg:py-3.5"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={openLoginModal}
      className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-white via-white/90 to-violet-glow px-6 py-2.5 text-sm font-medium text-[oklch(0.15_0.05_280)] shadow-lg shadow-violet/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet/40 hover:scale-105 sm:w-auto sm:px-7 sm:py-3 md:text-base lg:px-8 lg:py-3.5"
    >
      Start Your Journey
    </button>
  );
}

/* ---------- Nav ---------- */
function Nav() {
  const { openLoginModal } = useAuth();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const links = [
    { name: "Portfolio", href: "#portfolio" },
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" }
  ];
  
  const serviceCategories = [
    {
      name: "Website Development",
      items: ["Custom Websites", "E-commerce", "SaaS Platforms", "Landing Pages"]
    },
    {
      name: "AI Automation",
      items: ["AI Chatbots", "Workflow Automation", "CRM Integration", "Voice AI"]
    },
    {
      name: "UI/UX Design",
      items: ["Website Design", "Mobile App Design", "Dashboard Design", "Prototyping"]
    },
    {
      name: "Digital Growth",
      items: ["SEO Services", "Marketing Automation", "Analytics", "CRO"]
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[oklch(0.08_0.03_280)]/95 backdrop-blur-xl border-b border-white/5 py-2'
          : 'bg-transparent py-3'
      }`}
    >
      <div className="mx-auto max-w-7xl pr-6 md:pr-10" style={{ paddingLeft: '6%' }}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="group relative transition-transform duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-white/10 to-white/10 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
              <span
                className="relative text-lg font-light tracking-tight text-white transition-colors duration-300"
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  letterSpacing: '-0.01em'
                }}
              >
                BrandArx
              </span>
            </div>
          </a>

          {/* Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                className="group flex items-center gap-1.5 rounded-lg px-3 py-2 text-[14px] font-normal text-foreground/70 transition-all duration-200 hover:bg-white/5 hover:text-foreground"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Services
                <ChevronDown className={`h-3.5 w-3.5 transition-all duration-300 ${isServicesOpen ? 'rotate-180 text-violet-glow' : 'text-foreground/50'}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div
                className={`absolute left-0 top-full mt-3 w-[680px] transition-all duration-300 ${
                  isServicesOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
              >
                <div className="rounded-2xl border border-white/10 bg-[oklch(0.10_0.04_280)]/98 p-6 backdrop-blur-2xl shadow-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    {serviceCategories.map((category, idx) => (
                      <div
                        key={category.name}
                        className="group/cat"
                        style={{
                          animation: isServicesOpen ? `fadeInUp 0.4s ease-out ${idx * 0.1}s both` : 'none'
                        }}
                      >
                        <div className="mb-3">
                          <h3 className="text-[14px] font-semibold text-foreground">{category.name}</h3>
                        </div>
                        <ul className="space-y-1">
                          {category.items.map((item) => (
                            <li key={item}>
                              <a
                                href="#"
                                className="group/item flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-foreground/60 transition-all duration-200 hover:bg-white/5 hover:pl-4 hover:text-foreground"
                              >
                                <span className="h-1 w-1 rounded-full bg-violet-glow opacity-0 transition-opacity duration-200 group-hover/item:opacity-100" />
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Links */}
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="group relative rounded-lg px-4 py-2.5 text-[15px] font-normal text-foreground/70 transition-all duration-200 hover:bg-white/5 hover:text-foreground"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {link.name}
                <span className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-glow to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={openLoginModal}
              className="group relative hidden overflow-hidden rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-[14px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-violet/50 hover:bg-white/10 hover:shadow-lg hover:shadow-violet/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet/50 focus:ring-offset-2 focus:ring-offset-[oklch(0.08_0.03_280)] active:scale-95 lg:inline-block"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.01em'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign in
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet/20 to-violet-glow/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
            <button
              onClick={openLoginModal}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white via-white/90 to-violet-glow px-6 py-2.5 text-[14px] font-semibold text-[oklch(0.15_0.05_280)] shadow-lg shadow-violet/30 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-violet/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-glow focus:ring-offset-2 focus:ring-offset-[oklch(0.08_0.03_280)] active:scale-95"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.01em'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-glow/20 via-violet/20 to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" style={{ background: 'radial-gradient(circle at center, oklch(0.65 0.27 290) 0%, transparent 70%)' }} />
            </button>
          </div>
        </div>
      </div>
    </header>
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
    <section className="relative overflow-hidden rounded-b-[24px] md:rounded-b-[32px]">
      {/* Base dark */}
      <div className="absolute inset-0 rounded-b-[24px] bg-[oklch(0.08_0.03_280)] md:rounded-b-[32px]" />
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

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 pb-24 pt-32 text-center sm:px-6 sm:pb-32 sm:pt-24 md:px-8 md:pb-40 md:pt-32 lg:px-10 lg:pb-48 lg:pt-40 xl:pb-56 xl:pt-48">
          <div className="w-full max-w-6xl">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground drop-shadow-[0_4px_12px_rgba(139,92,246,0.3)] sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight lg:text-7xl lg:leading-[1.1] xl:text-8xl xl:leading-[1.05]">
              Build Smarter Automate Faster Grow Revenue
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/80 sm:mt-5 sm:max-w-xl sm:text-base md:mt-6 md:max-w-2xl md:text-lg lg:mt-7 lg:max-w-3xl lg:text-xl xl:mt-8">
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
  return (
    <section className="border-y border-white/5 bg-background/60 py-16">
      <p className="mx-auto max-w-3xl px-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Trusted by innovative companies to build and scale their digital presence
      </p>
      <div className="mt-10 grid grid-cols-3 gap-8 px-6 md:grid-cols-6">
        {logos.map((l) => (
          <div
            key={l}
            className="flex h-10 items-center justify-center text-base font-semibold tracking-tight text-foreground/55 transition hover:text-foreground"
          >
            {l}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Section heading ---------- */
function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet-glow">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">{title}</h2>
    </div>
  );
}

/* ---------- Products ---------- */
function ProductsGrid() {
  const items = [
    "Website Development",
    "AI Agent Automation",
    "UI/UX Design",
    "SEO Optimization",
    "E-commerce Solutions",
    "AI Chatbot Development",
    "Brand Identity",
    "CRM Automation",
  ];
  return (
    <section className="px-6 py-28">
      <SectionHeading title="Comprehensive digital solutions to grow your business" />
      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((it) => (
          <a
            key={it}
            href="#"
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-foreground/85 transition hover:border-violet/50 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              {it}
            </div>
          </a>
        ))}
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
      className={`grid items-center gap-12 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-glow">{eyebrow}</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h3>
        <p className="mt-5 text-base text-foreground/70">{body}</p>
        <a href="#" className="mt-6 inline-flex items-center gap-1 text-sm text-foreground hover:text-violet-glow">
          Learn more
        </a>
      </div>
      <div className="relative">{visual}</div>
    </div>
  );
}

function VisualCardIssuing() {
  return (
    <div className="relative h-80 rounded-3xl border border-white/10 bg-card-dark p-8 shadow-card-elevated">
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
    <div className="relative h-80 overflow-hidden rounded-3xl border border-white/10 bg-card-dark p-8">
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
    <div className="relative grid h-80 grid-cols-3 items-center gap-3 rounded-3xl border border-white/10 bg-card-dark p-6">
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
    <section className="relative overflow-hidden border-y border-white/5 px-6 py-28">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_0%,rgba(170,120,255,0.18),transparent_50%)]" />
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading title="Why businesses choose us for their digital transformation" />
        <p className="mx-auto mt-6 max-w-2xl text-center text-foreground/70">
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
    <section className="px-6 py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-glow">Modern Tech Stack</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            Built with cutting-edge technologies for optimal performance
          </h2>
          <p className="mt-5 text-foreground/70">
            We use the latest frameworks and tools to build fast, secure, and maintainable solutions.
            From React and Next.js to AI integrations and automation platforms.
          </p>
          <a href="#" className="mt-6 inline-flex items-center gap-1 text-sm hover:text-violet-glow">
            View our tech stack
          </a>
          <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
            {["React", "Next.js", "Node.js", "AI/ML", "Cloud"].map((s) => (
              <span key={s} className="rounded-md border border-white/10 px-3 py-1.5">
                {s}
              </span>
            ))}
          </div>
        </div>
        <CodeBlock />
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
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Our Services" title="Complete digital solutions for modern businesses" />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
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
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Control" title="Granular data policies, full audit visibility" />
        <div className="mt-14 grid gap-8 md:grid-cols-2">
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
                  className="flex items-center gap-3 border-b border-white/5 px-5 py-3 text-sm last:border-b-0"
                >
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-violet to-violet-glow text-[11px] font-semibold">
                    {who[0]}
                  </div>
                  <div className="font-medium">{who}</div>
                  <div className="text-muted-foreground">{action}</div>
                  <div className="ml-auto truncate font-mono text-xs text-foreground/80">{target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
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
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Client Success" title="Trusted by businesses that demand excellence" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
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
    <section className="relative overflow-hidden px-6 py-32">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_50%,rgba(170,120,255,0.4),transparent_60%)]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Ready to transform your digital presence?
        </h2>
        <p className="mt-6 text-foreground/80">
          Let's build something amazing together. Get a free consultation and project quote today.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-violet-glow px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet/40 hover:scale-105"
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
  const cols = {
    Services: ["Website Development", "AI Automation", "UI/UX Design", "SEO & Growth", "Branding"],
    Solutions: ["E-commerce", "SaaS Platforms", "Corporate Sites", "Landing Pages", "Portfolios"],
    Company: ["About Us", "Portfolio", "Careers", "Blog", "Contact"],
    Resources: ["Case Studies", "Free Tools", "Newsletter", "Support", "FAQ"],
  };
  return (
    <footer className="border-t border-white/5 bg-background px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-light tracking-tight">BrandArx</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Digital solutions that drive real business results.
            </p>
          </div>
          {Object.entries(cols).map(([k, v]) => (
            <div key={k}>
              <h5 className="text-sm font-semibold">{k}</h5>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {v.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-foreground">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} BrandArx. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */
function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <LogoTicker />
      <ProductsGrid />
      <Features />
      <EncryptionModel />
      <DevSection />
      <Primitives />
      <PoliciesAudit />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
