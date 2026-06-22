import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Securepay — Flexible Payments Security" },
      {
        name: "description",
        content:
          "Maximum protection, minimum compliance burden. Tokenize cards, optimize margins, comply with PCI, and spin up card issuing.",
      },
    ],
  }),
  component: Index,
});

/* ---------- Nav ---------- */
function Nav() {
  const links = ["Home", "Use Cases", "Pricing", "Blog", "Docs"];
  return (
    <header className="relative z-30 flex items-center justify-between px-6 py-5 md:px-10">
      <a href="#" className="flex items-center gap-2 text-foreground">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-violet to-violet-glow text-[10px] font-bold">
          S
        </span>
        <span className="text-base font-semibold tracking-tight">securepay</span>
      </a>

      <nav className="hidden items-center rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 backdrop-blur-xl md:flex">
        {links.map((l) => (
          <a
            key={l}
            href="#"
            className="rounded-full px-4 py-1.5 text-sm text-foreground/80 transition hover:bg-white/10 hover:text-foreground"
          >
            {l}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <a href="#" className="hidden text-sm text-foreground/80 hover:text-foreground md:inline">
          Log in
        </a>
        <a
          href="#"
          className="rounded-md bg-foreground px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Get started
        </a>
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
    <section className="relative overflow-hidden">
      {/* Base dark */}
      <div className="absolute inset-0 bg-[oklch(0.08_0.03_280)]" />
      {/* Main violet radial bloom from center-bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 95%, oklch(0.78 0.22 295) 0%, oklch(0.62 0.27 290) 18%, oklch(0.42 0.23 285) 38%, oklch(0.22 0.12 282) 60%, transparent 80%)",
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

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-40 pt-16 md:grid-cols-2 md:px-10 md:pb-56 md:pt-24">
          <div className="max-w-xl">
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight text-foreground md:text-7xl">
              Effortless
              <br />
              Encryption for
              <br />
              <span className="bg-gradient-to-r from-white via-white/90 to-violet-glow bg-clip-text text-transparent">
                Developers
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base text-foreground/80 md:text-lg">
              The first encryption platform that allows you to encrypt, process,
              and share sensitive customer data — without touching it in plaintext.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a
                href="#"
                className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[oklch(0.15_0.05_280)] transition hover:opacity-90"
              >
                Get started
              </a>
              <a
                href="#"
                className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-foreground/90 transition hover:text-foreground"
              >
                Get in touch
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center md:justify-end">
            <div className="relative">
              <div
                className="absolute -inset-10 -z-10 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(closest-side, oklch(0.7 0.25 295 / 0.45), transparent 70%)",
                }}
              />
              <PadlockAscii />
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
    "rippling", "cartrawler", "sorare", "modern treasury", "uniswap",
    "morse", "ramp", "stitch", "xp", "overwolf", "duffel", "humaans",
  ];
  return (
    <section className="border-y border-white/5 bg-background/60 py-16">
      <p className="mx-auto max-w-3xl px-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Global leaders trust Securepay to secure their most sensitive payment data
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
    "PCI Compliance",
    "Payments Optimization",
    "Card Issuing",
    "Network Tokens",
    "Card Insights",
    "Key Management",
    "BIN Lookup",
    "3D Secure",
  ];
  return (
    <section className="px-6 py-28">
      <SectionHeading title="Accelerate your business with a first-class payments stack" />
      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((it) => (
          <a
            key={it}
            href="#"
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-foreground/85 transition hover:border-violet/50 hover:bg-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              {it}
              <span className="text-violet-glow opacity-0 transition group-hover:opacity-100">→</span>
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
          Learn more <span aria-hidden>→</span>
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
          <div className="font-mono text-2xl">{["⊡", "✦", "⊞"][i]}</div>
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
          eyebrow="Accelerate your card product"
          title="Expedite the security and compliance requirements of launching a card product"
          body="Improve your card's time-to-market from months to days. Tokenize cards from the issuer of your choice, store card data with minimal PCI compliance impact, and reveal raw card numbers to users."
          visual={<VisualCardIssuing />}
        />
      </div>
      <div className="mx-auto max-w-6xl">
        <FeatureBlock
          eyebrow="Build complex card sharing workflows"
          title="Share card data securely while keeping compliance scope to a minimum"
          body="Flexible, compliant products for sharing card data with third-parties. Booking aggregators and platforms can forward card data to partners for storing or processing."
          visual={<VisualSharing />}
          reverse
        />
      </div>
      <div className="mx-auto max-w-6xl">
        <FeatureBlock
          eyebrow="Optimize pay-in performance"
          title="Improve payment costs & global coverage with a multi-processor setup"
          body="Avoid payment processor vendor lock-in, optimize payment costs and acceptance rates by selectively routing payments to different processors."
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
      title: "Reduced risk of data breach",
      body: "Our dual-custody model means a successful breach would require both you and us to be breached, instead of a single point of failure.",
    },
    {
      title: "Improve Performance",
      body: "Create encrypted tokens without any network requests. Tokens can be encrypted in microseconds, not seconds.",
    },
    {
      title: "Maximum resiliency",
      body: "Avoid lock-in by storing encrypted data yourself. Keys can be shared with a third-party key escrow provider.",
    },
  ];
  return (
    <section className="relative overflow-hidden border-y border-white/5 px-6 py-28">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_0%,rgba(170,120,255,0.18),transparent_50%)]" />
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading title="Tokenization, but with a powerful and flexible encryption model" />
        <p className="mx-auto mt-6 max-w-2xl text-center text-foreground/70">
          Our encryption model is built different. We never store your data — we store the keys, you
          store data as you normally would, fully encrypted.
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-glow">Built for Developers</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            Powered by an easy-to-use, developer friendly platform
          </h2>
          <p className="mt-5 text-foreground/70">
            Built to save developer time and make securing data incredibly easy. Use language-specific
            SDKs or our REST API to integrate seamlessly into your stack.
          </p>
          <a href="#" className="mt-6 inline-flex items-center gap-1 text-sm hover:text-violet-glow">
            View our docs <span aria-hidden>→</span>
          </a>
          <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
            {["React", "Node", "Python", "Ruby", "Go"].map((s) => (
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
    { name: "Relay", body: "An encryption proxy that encrypts or decrypts data within a network request." },
    { name: "Functions", body: "Secure serverless functions to run logic on encrypted data outside your infrastructure." },
    { name: "UI Components", body: "Embeddable components for collecting and displaying cardholder data without touching plaintext." },
    { name: "Enclaves", body: "Deploy any Docker container to a Secure Enclave with zero extra provisioning." },
  ];
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Primitives" title="Composable building blocks for any payment workflow" />
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
                Learn more →
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
      q: "Securepay balances flexibility and security extremely well. Clean and thoughtful abstractions over advanced security foundations — the product just works.",
      who: "Sylvain Utard",
      role: "Head of Platform, Sorare",
    },
    {
      q: "We barely have to think about it. The team ships fast and the platform feels solid under load.",
      who: "Mike Hudack",
      role: "CEO, Morse",
    },
    {
      q: "Going from idea to a production card flow took us days, not months. The DX is unreal.",
      who: "João Víctor Martins",
      role: "Product Manager, XP",
    },
  ];
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Why trust us?" title="Secure by default. Built by paranoid engineers." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {quotes.map((t) => (
            <figure
              key={t.who}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <blockquote className="text-base leading-relaxed text-foreground/90">“{t.q}”</blockquote>
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
          Enhance customer experience and maximize revenue with your payments.
        </h2>
        <p className="mt-6 text-foreground/80">
          Use Securepay's flexible building blocks to build secure and compliant payment workflows.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Talk to an Expert →
          </a>
          <a href="#" className="text-sm text-foreground/85 hover:text-foreground">
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const cols = {
    Products: ["PCI Compliance", "Network Tokens", "Card Issuing", "3D Secure", "BIN Lookup"],
    Solutions: ["Payments Optimization", "Card Sharing", "Wallet Management", "Multi-PSP"],
    Company: ["Customers", "Pricing", "Careers", "Blog", "Contact"],
    Resources: ["Docs", "Changelog", "Status", "Security", "Trust"],
  };
  return (
    <footer className="border-t border-white/5 bg-background px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-violet to-violet-glow text-[10px] font-bold">
                S
              </span>
              <span className="text-lg font-semibold tracking-tight">securepay</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Flexible payments security for modern teams.
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
          <div>© {new Date().getFullYear()} Securepay. A tribute to evervault.com design language.</div>
          <div className="flex gap-5">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
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
