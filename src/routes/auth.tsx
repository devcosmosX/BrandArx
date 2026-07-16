// routes/auth.tsx — Aurora-inspired two-column auth page
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Circle } from 'lucide-react'
import { LoginForm } from '../components/auth/LoginForm'
import { SignupForm } from '../components/auth/SignupForm'
import type { AuthTab } from '../hooks/useAuthModal'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/auth')({
  component: AuthRouteComponent,
})

/* ── Step Item ── */
function StepItem({ number, text, active }: { number: number; text: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-3.5 rounded-2xl px-5 py-3.5 transition-all duration-300 ${
      active
        ? 'bg-white text-black border border-white'
        : 'bg-[#1A1A1A] text-white border border-transparent'
    }`}>
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
        active ? 'bg-black text-white' : 'bg-white/10 text-white/40'
      }`}>
        {number}
      </div>
      <span className={`text-sm font-medium ${active ? 'text-black' : 'text-white/80'}`}>{text}</span>
    </div>
  )
}

function AuthRouteComponent() {
  const [activeTab, setActiveTab] = useState<AuthTab>('signup')
  const navigate = useNavigate()
  const { user, isLoading, googleLogin } = useAuth()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState('')

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: '/dashboard' })
    }
  }, [user, isLoading, navigate])

  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('id_token=')) {
      const params = new URLSearchParams(hash.substring(1))
      const idToken = params.get('id_token')
      if (idToken) {
        window.history.replaceState(null, '', window.location.pathname)
        const performGoogleLogin = async () => {
          setGoogleLoading(true)
          setGoogleError('')
          try {
            await googleLogin(idToken)
            navigate({ to: '/dashboard' })
          } catch (err: any) {
            setGoogleError(err.response?.data?.message || 'Google authentication failed.')
          } finally {
            setGoogleLoading(false)
          }
        }
        performGoogleLogin()
      }
    }
  }, [googleLogin, navigate])

  const handleClose = () => {
    navigate({ to: '/' })
  }

  if (isLoading || googleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-violet-glow" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm text-white/50">
            {googleLoading ? 'Authenticating with Google...' : 'Verifying session...'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen w-full bg-black selection:bg-white/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4">

      {/* ═══ LEFT COLUMN — Hero with Video ═══ */}
      <div className="relative hidden w-[52%] flex-col items-center justify-end rounded-3xl overflow-hidden shadow-2xl lg:flex h-full pb-32 px-12">
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline preload="auto"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" type="video/mp4" />
        </video>

        {/* Hero content over video */}
        <div className="relative z-10 w-full max-w-xs space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <Circle className="h-5 w-5 fill-white text-white" />
            <span className="text-xl font-semibold tracking-tight text-white">BrandArx</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl font-medium tracking-tight text-white whitespace-nowrap">
              {activeTab === 'signup' ? 'Join BrandArx' : 'Welcome Back'}
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              {activeTab === 'signup'
                ? 'Follow these 3 quick phases to activate your space.'
                : 'Sign in to continue building amazing experiences.'}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-2.5">
            <StepItem number={1} text="Register your identity" active={activeTab === 'signup'} />
            <StepItem number={2} text="Configure your workspace" />
            <StepItem number={3} text="Finalize your profile" />
          </div>
        </div>
      </div>

      {/* ═══ RIGHT COLUMN — Form ═══ */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div>
            {/* Mobile brand */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <Circle className="h-5 w-5 fill-white text-white" />
              <span className="text-lg font-semibold tracking-tight text-white">BrandArx</span>
            </div>

            <h2 className="text-3xl font-medium tracking-tight text-white">
              {activeTab === 'signup' ? 'Create New Profile' : 'Sign In'}
            </h2>
            <p className="mt-2 text-white/40 text-sm">
              {activeTab === 'signup' ? (
                <>
                  Input your basic details to begin the journey.{' '}
                  <button type="button" onClick={() => setActiveTab('login')}
                    className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">
                    Log in instead
                  </button>
                </>
              ) : (
                <>
                  Enter your credentials to access your workspace.{' '}
                  <button type="button" onClick={() => setActiveTab('signup')}
                    className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">
                    Create account
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Google error */}
          {googleError && (
            <div className="rounded-xl px-3 py-2 text-[12px] text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 text-center">
              {googleError}
            </div>
          )}

          {/* Form */}
          {activeTab === 'signup' ? (
            <SignupForm onSwitchTab={setActiveTab} onClose={handleClose} />
          ) : (
            <LoginForm onSwitchTab={setActiveTab} onClose={handleClose} />
          )}
        </div>
      </div>
    </main>
  )
}
