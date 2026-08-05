import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../contexts/AuthContext";
import { AuthModal } from "../components/auth/AuthModal";
import { CookieConsent } from "../components/CookieConsent";
import { SmoothScrollProvider } from "../components/SmoothScrollProvider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BrandArx — Web Development, AI Automation & Digital Growth Agency" },
      {
        name: "description",
        content:
          "Full-service digital agency specializing in custom website development, AI automation, UI/UX design, and growth marketing. Transform your business with cutting-edge solutions.",
      },
      // Open Graph
      { property: "og:title", content: "BrandArx — Web Development & AI Automation Agency" },
      {
        property: "og:description",
        content:
          "Expert web development, AI chatbots, automation, and digital marketing services. Build, automate, and grow your business with BrandArx.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://brandarx.com/" },
      { property: "og:image", content: "https://brandarx.com/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      // Twitter / X card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "BrandArx — Web Development & AI Automation Agency" },
      {
        name: "twitter:description",
        content:
          "Expert web development, AI chatbots, automation, and digital marketing services. Build, automate, and grow your business with BrandArx.",
      },
      { name: "twitter:image", content: "https://brandarx.com/og-image.png" },
      // SEO controls
      { name: "robots", content: "index, follow" },
      { name: "keywords", content: "web development, AI automation, chatbot development, UI/UX design, SEO services, digital agency, website design, e-commerce development, SaaS development, AI agents" },
    ],
    links: [
      // Preconnect to Google Fonts to eliminate round-trip latency
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // DNS prefetch as a fallback for older browsers
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      // Preload the font stylesheet so the browser discovers it early
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap",
      },
      // Actual font stylesheet with display=swap already present
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap",
      },
      // Canonical URL
      { rel: "canonical", href: "https://brandarx.com/" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="overflow-x-hidden">
        <div className="relative min-h-screen overflow-x-hidden" data-scroll-section>
          {/* Left black border with inner rounded edge from bottom */}
          <div className="fixed left-0 top-0 z-50 h-full w-1.5 bg-black sm:w-3 md:w-6" style={{ borderRadius: '0 0 50% 0' }} />
          {/* Right black border with inner rounded edge from bottom */}
          <div className="fixed right-0 top-0 z-50 h-full w-1.5 bg-black sm:w-3 md:w-6" style={{ borderRadius: '0 0 0 50%' }} />
          {/* Main content with rounded bottom corners */}
          <div
            className="overflow-x-hidden px-1.5 sm:px-3 md:px-6"
            data-scroll-section
            style={{ borderRadius: '0 0 50px 50px' }}
          >
            {children}
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SmoothScrollProvider>
          <Outlet />
          <AuthModal />
          <CookieConsent />
        </SmoothScrollProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
