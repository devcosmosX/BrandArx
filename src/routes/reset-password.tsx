// routes/reset-password.tsx
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { api } from '../services/api'
import { Loader2, KeyRound, CheckCircle2, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || '',
    }
  },
})

function ResetPasswordComponent() {
  const { token } = useSearch({ from: '/reset-password' })
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError('Password reset token is missing from the link.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/reset-password', { token, password })
      setSuccess(res.data.message || 'Password reset successfully!')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#13111C] text-white p-4">
      <div className="w-full max-w-[460px] bg-[#1a1726] border border-white/[0.06] shadow-2xl rounded-[32px] p-8 text-center space-y-6">
        {/* Logo */}
        <div className="inline-flex justify-center text-xl font-bold tracking-widest text-white select-none">
          BrandArx
        </div>

        {success ? (
          <div className="space-y-4 py-4">
            <CheckCircle2 className="h-14 w-14 text-[#22C55E] mx-auto" />
            <h2 className="text-2xl font-bold tracking-tight">Password Reset!</h2>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              {success}
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate({ to: '/auth' })}
                className="w-full h-12 rounded-xl text-sm font-semibold bg-violet hover:bg-violet-glow text-white shadow-md shadow-violet/15 active:scale-[0.98] transition-all cursor-pointer"
              >
                Log In with New Password
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Create New Password</h2>
              <p className="text-sm text-[#9CA3AF]">
                Please enter a secure password containing at least 8 characters, numbers, and symbols.
              </p>
            </div>

            {error && (
              <p className="rounded-xl px-3 py-2.5 text-[12px] text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 text-left">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-12 pl-4 pr-11 bg-white/[0.04] border border-white/5 rounded-xl text-sm text-[#E5E7EB] placeholder-[#9CA3AF]/40 outline-none transition focus:border-violet"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-12 px-4 bg-white/[0.04] border border-white/5 rounded-xl text-sm text-[#E5E7EB] placeholder-[#9CA3AF]/40 outline-none transition focus:border-violet"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full h-12 rounded-xl text-sm font-semibold bg-violet hover:bg-violet-glow text-white shadow-md shadow-violet/15 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

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
