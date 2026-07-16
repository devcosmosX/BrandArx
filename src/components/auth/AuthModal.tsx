// components/auth/AuthModal.tsx — Aurora-inspired modal
'use client';

import { useEffect, useRef } from 'react'
import { X, Circle } from 'lucide-react'
import gsap from 'gsap'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '../ui/dialog'
import { useAuthModal } from '../../hooks/useAuthModal'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

/* ── Step Item ── */
function StepItem({ number, text, active }: { number: number; text: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-300 ${
      active
        ? 'bg-white text-black border border-white'
        : 'bg-white/[0.06] text-white border border-transparent'
    }`}>
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
        active ? 'bg-black text-white' : 'bg-white/10 text-white/40'
      }`}>
        {number}
      </div>
      <span className={`text-[13px] font-medium ${active ? 'text-black' : 'text-white/70'}`}>{text}</span>
    </div>
  )
}

export function AuthModal() {
  const { isOpen, activeTab, open, close, setTab } = useAuthModal()
  const panelRef = useRef<HTMLDivElement>(null)

  // GSAP panel entrance
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const isMobile = window.innerWidth < 768
      gsap.fromTo(
        panelRef.current,
        { y: isMobile ? 80 : 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
      )
    }
  }, [isOpen])

  const handleClose = () => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        y: 16,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: close,
      })
    } else {
      close()
    }
  }

  // Wire data-auth-trigger clicks globally
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-auth-trigger]')
      if (!target) return
      const raw = (target as HTMLElement).dataset.authTrigger
      const tab = raw === 'login' ? 'login' : 'signup'
      open(tab)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [open])

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent
        className="p-0 overflow-hidden border-0 bg-transparent shadow-none max-w-none w-full md:max-w-[1050px] data-[state=open]:animate-none data-[state=closed]:animate-none"
        onInteractOutside={handleClose}
        onEscapeKeyDown={handleClose}
      >
        {/* Accessible title */}
        <DialogTitle className="sr-only">
          {activeTab === 'login' ? 'Log in to your account' : 'Create an account'}
        </DialogTitle>

        {/* Panel */}
        <div
          ref={panelRef}
          className="relative mx-auto w-full md:w-[1050px] flex flex-col md:flex-row gap-0 bg-black border border-white/[0.08] shadow-2xl rounded-[20px] md:rounded-[28px] overflow-hidden max-h-[100dvh] md:max-h-[680px]"
        >
          {/* Close button (mobile) */}
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/15 md:hidden"
          >
            <X className="h-4 w-4 text-white" />
          </button>

          {/* ═══ LEFT — Video Hero ═══ */}
          <div className="relative hidden md:flex md:w-[52%] flex-col items-center justify-end overflow-hidden rounded-l-[28px] pb-10 px-8">
            {/* Video background — no overlay */}
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay muted loop playsInline preload="auto"
            >
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" type="video/mp4" />
            </video>

            {/* Content over video */}
            <div className="relative z-10 w-full max-w-[260px] space-y-6">
              {/* Brand */}
              <div className="flex items-center gap-2">
                <Circle className="h-4.5 w-4.5 fill-white text-white" />
                <span className="text-lg font-semibold tracking-tight text-white">BrandArx</span>
              </div>

              {/* Heading */}
              <div className="space-y-1.5">
                <h1 className="text-3xl font-medium tracking-tight text-white">
                  {activeTab === 'signup' ? 'Join BrandArx' : 'Welcome Back'}
                </h1>
                <p className="text-white/55 text-[13px] leading-relaxed">
                  {activeTab === 'signup'
                    ? 'Follow these quick steps to get started.'
                    : 'Sign in to continue building.'}
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <StepItem number={1} text="Register your identity" active={activeTab === 'signup'} />
                <StepItem number={2} text="Configure your workspace" />
                <StepItem number={3} text="Finalize your profile" />
              </div>
            </div>

            {/* Close/back button (desktop) */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 z-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full px-3.5 py-1.5 text-[11px] text-white flex items-center gap-1.5 transition-all font-medium cursor-pointer"
            >
              Back
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* ═══ RIGHT — Form ═══ */}
          <div className="w-full md:w-[48%] flex flex-col justify-center px-5 py-7 sm:px-6 sm:py-8 md:px-10 overflow-y-auto max-h-[calc(100dvh-0px)] md:max-h-none bg-black">
            {/* Header */}
            <div className="mb-5">
              {/* Mobile brand */}
              <div className="flex items-center gap-2 mb-4 md:hidden">
                <Circle className="h-4 w-4 fill-white text-white" />
                <span className="text-base font-semibold tracking-tight text-white">BrandArx</span>
              </div>

              <h2 className="text-[28px] font-medium text-white tracking-tight leading-tight">
                {activeTab === 'signup' ? 'Create New Profile' : 'Sign In'}
              </h2>
              <p className="mt-2 text-[13px] text-white/40">
                {activeTab === 'signup' ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="text-white/70 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Log in
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('signup')}
                      className="text-white/70 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Form */}
            <div>
              {activeTab === 'signup' ? (
                <SignupForm onSwitchTab={setTab} onClose={handleClose} />
              ) : (
                <LoginForm onSwitchTab={setTab} onClose={handleClose} />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
