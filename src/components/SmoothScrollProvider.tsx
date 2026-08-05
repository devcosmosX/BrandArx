import { useEffect, useRef, type ReactNode } from "react";
import Lenis, { type LenisOptions } from "lenis";
import LocomotiveScroll from "locomotive-scroll";
import { useRouterState } from "@tanstack/react-router";

import "locomotive-scroll/dist/locomotive-scroll.css";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const locomotiveRef = useRef<LocomotiveScroll | null>(null);
  const rafRef = useRef<number | null>(null);
  const location = useRouterState({ select: (state) => state.location.href });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    if (!wrapper || !content || typeof window === "undefined") {
      return;
    }

    const lenisOptions: LenisOptions = {
      wrapper,
      content,
      duration: 1.15,
      lerp: 0.085,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      smoothTouch: false,
      syncTouch: true,
      infinite: false,
      touchMultiplier: 1,
      wheelMultiplier: 1,
      autoRaf: false,
    };

    const lenis = new Lenis(lenisOptions);

    lenisRef.current = lenis;

    const locomotive = new LocomotiveScroll({
      el: content,
      smooth: false,
      tablet: { smooth: false },
      smartphone: { smooth: false },
      reloadOnContextChange: true,
      getDirection: true,
      getSpeed: true,
    });

    locomotiveRef.current = locomotive;

    let locomotiveSyncFrame: number | null = null;

    const syncLocomotive = () => {
      if (locomotiveSyncFrame !== null) {
        return;
      }

      locomotiveSyncFrame = window.requestAnimationFrame(() => {
        locomotive.update();
        locomotiveSyncFrame = null;
      });
    };

    lenis.on("scroll", ({ scroll, velocity, direction, progress }) => {
      const event = new CustomEvent("brandarx:lenis-scroll", {
        detail: { scroll, velocity, direction, progress },
      });
      window.dispatchEvent(event);
      syncLocomotive();
    });

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = window.requestAnimationFrame(raf);
    };

    rafRef.current = window.requestAnimationFrame(raf);
    syncLocomotive();

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (locomotiveSyncFrame !== null) {
        window.cancelAnimationFrame(locomotiveSyncFrame);
      }
      locomotive.destroy();
      lenis.destroy();
      locomotiveRef.current = null;
      lenisRef.current = null;
      rafRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    const locomotive = locomotiveRef.current;

    if (!lenis || typeof window === "undefined") {
      return;
    }

    lenis.scrollTo(0, { immediate: true });
    window.setTimeout(() => {
      locomotive?.update();
    }, 0);
  }, [location]);

  return (
    <div ref={wrapperRef} data-scroll-wrapper className="smooth-scroll-wrapper">
      <div
        ref={contentRef}
        data-scroll-container
        className="smooth-scroll-content"
        style={{ transform: "translateZ(0)" }}
      >
        {children}
      </div>
    </div>
  );
}
