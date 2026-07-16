// components/CookieConsent.tsx
'use client';

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useCookieConsent } from '../hooks/useCookieConsent'

export function CookieConsent() {
  const { visible, accept, decline } = useCookieConsent()
  const containerRef = useRef<HTMLDivElement>(null)

  // Animate in when visible becomes true
  useEffect(() => {
    if (!visible || !containerRef.current) return
    gsap.fromTo(
      containerRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    )
  }, [visible])

  const handleAccept = () => {
    if (!containerRef.current) { accept(); return }
    gsap.to(containerRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: accept,
    })
  }

  const handleDecline = () => {
    if (!containerRef.current) { decline(); return }
    gsap.to(containerRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: decline,
    })
  }

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent notification"
      className="fixed z-[9999] p-5 md:p-6 text-left bg-white/5 border border-white/[0.08] backdrop-blur-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300
        bottom-0 left-0 right-0 w-full max-w-none rounded-t-[16px] rounded-b-none
        md:bottom-6 md:left-6 md:right-auto md:w-[380px] md:max-w-[380px] md:rounded-[16px]"
    >
      {/* Heading */}
      <p className="mb-2 text-[15px] font-bold text-white">We use cookies</p>

      {/* Body */}
      <p className="mb-4 text-[13px] leading-relaxed text-[#A0A8B8]">
        We use cookies to enhance your browsing experience, analyze site traffic, and
        personalize content. By clicking 'Accept', you consent to our use of cookies in
        accordance with our Privacy Policy.
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleAccept}
          className="flex-1 h-10 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet to-violet-glow shadow-md shadow-violet/15 hover:shadow-lg hover:shadow-violet/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet/50"
        >
          Accept All
        </button>
        <button
          onClick={handleDecline}
          className="flex-1 h-10 rounded-lg text-sm font-medium border border-white/15 bg-transparent text-[#A0A8B8] hover:bg-white/6 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet/50"
        >
          Decline
        </button>
      </div>

      {/* Privacy Policy link */}
      <div className="mt-3 text-center md:text-left">
        <a
          href="/privacy"
          className="text-[11px] text-[#6B7280] hover:text-violet-glow hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-violet/50 focus:rounded"
        >
          View Privacy Policy
        </a>
      </div>
    </div>
  )
}
