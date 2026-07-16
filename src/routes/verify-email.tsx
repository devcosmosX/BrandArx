// routes/verify-email.tsx
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Loader2, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/verify-email')({
  component: VerifyEmailComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || '',
    }
  },
})

function VerifyEmailComponent() {
  const { token } = useSearch({ from: '/verify-email' })
  const navigate = useNavigate()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided in the URL link.')
      return
    }

    const verify = async () => {
      try {
        const res = await api.post('/auth/verify-email', { token })
        setStatus('success')
        setMessage(res.data.message || 'Email verified successfully!')
      } catch (err: any) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Failed to verify email. The token might have expired.')
      }
    }

    verify()
  }, [token])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resendEmail) return

    setResendLoading(true)
    setResendSuccess('')
    setMessage('')
    try {
      const res = await api.post('/auth/send-verification', { email: resendEmail })
      setResendSuccess(res.data.message || 'Verification email sent!')
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to resend verification email.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#13111C] text-white p-4">
      <div className="w-full max-w-[460px] bg-[#1a1726] border border-white/[0.06] shadow-2xl rounded-[32px] p-8 text-center space-y-6">
        {/* Logo */}
        <div className="inline-flex justify-center text-xl font-bold tracking-widest text-white select-none">
          BrandArx
        </div>

        {status === 'loading' && (
          <div className="space-y-4 py-6">
            <Loader2 className="h-10 w-10 animate-spin text-violet-glow mx-auto" />
            <h2 className="text-xl font-semibold">Verifying your email...</h2>
            <p className="text-sm text-[#9CA3AF]">Please hold on while we process your request.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-4">
            <CheckCircle2 className="h-14 w-14 text-[#22C55E] mx-auto" />
            <h2 className="text-2xl font-bold tracking-tight">Email Verified!</h2>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              {message}
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate({ to: '/auth' })}
                className="w-full h-12 rounded-xl text-sm font-semibold bg-violet hover:bg-violet-glow text-white shadow-md shadow-violet/15 active:scale-[0.98] transition-all cursor-pointer"
              >
                Log In to Your Account
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 py-4">
            <AlertTriangle className="h-14 w-14 text-[#EF4444] mx-auto" />
            <h2 className="text-2xl font-bold tracking-tight">Verification Failed</h2>
            <p className="text-sm text-[#EF4444] leading-relaxed">
              {message}
            </p>

            {/* Resend Verification Form */}
            <div className="border-t border-white/5 pt-6 text-left space-y-3">
              <h3 className="text-sm font-medium text-white/80">Need to resend the verification email?</h3>
              <form onSubmit={handleResend} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  required
                  className="w-full h-11 px-4 bg-white/[0.04] border border-white/5 rounded-xl text-sm text-[#E5E7EB] placeholder-[#9CA3AF]/40 outline-none transition focus:border-violet"
                />
                <button
                  type="submit"
                  disabled={resendLoading || !resendEmail}
                  className="w-full h-11 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </form>
              {resendSuccess && (
                <p className="text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 p-3 rounded-xl">
                  {resendSuccess}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate({ to: '/auth' })}
                className="inline-flex items-center justify-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
