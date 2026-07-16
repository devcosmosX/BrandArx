// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { loginSchema, type LoginFormData } from '../../lib/validations/auth'
import { SocialButtons } from './SocialButtons'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'
import type { AuthTab } from '../../hooks/useAuthModal'
import { useNavigate } from '@tanstack/react-router'

interface LoginFormProps {
  onSwitchTab: (tab: AuthTab) => void
  onClose: () => void
}

type LoginView = 'form' | 'reset' | '2fa'

export function LoginForm({ onSwitchTab, onClose }: LoginFormProps) {
  const { login, initiateGoogleLogin, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [view, setView] = useState<LoginView>('form')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // Forgot password states
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  // 2FA pending states
  const [temp2FAToken, setTemp2FAToken] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [isBackupMode, setIsBackupMode] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setSubmitError(null)

    try {
      const res = await login(data.email, data.password)
      if (res && res.twoFactorRequired) {
        setTemp2FAToken(res.tempToken)
        setView('2fa')
      } else {
        onClose()
      }
    } catch (error: any) {
      if (error.response?.data?.emailNotVerified) {
        setSubmitError('Email not verified. Please check your email for the verification link.')
      } else {
        setSubmitError(error.response?.data?.message ?? 'Invalid email or password. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    setSubmitError(null)
    try {
      await api.post('/auth/forgot-password', { email: resetEmail })
      setResetSent(true)
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to send password reset email.')
    } finally {
      setResetLoading(false)
    }
  }

  const handle2FAVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode) return

    setOtpLoading(true)
    setOtpError('')
    try {
      await api.post('/auth/2fa/verify-login', {
        token: otpCode,
        tempToken: temp2FAToken,
      })

      // Refresh auth context then navigate to dashboard
      await refreshUser()
      onClose()
      navigate({ to: '/dashboard' })
    } catch (err: any) {
      setOtpError(err.response?.data?.message || 'Verification failed. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  // 2FA View
  if (view === '2fa') {
    return (
      <form onSubmit={handle2FAVerify} className="space-y-4 w-full">
        <div className="flex flex-col items-center justify-center text-center space-y-3 pb-2">
          <div className="h-12 w-12 rounded-xl bg-violet/10 border border-violet-glow/20 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-violet-glow" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
            <p className="text-xs text-[#9CA3AF] mt-1 max-w-[280px] mx-auto leading-relaxed">
              {isBackupMode
                ? 'Enter one of your 8-character backup recovery codes.'
                : 'Enter the 6-digit verification code from your authenticator app.'}
            </p>
          </div>
        </div>

        {otpError && (
          <p className="rounded-xl px-3 py-2 text-[12px] text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 text-center">
            {otpError}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <input
            type="text"
            maxLength={isBackupMode ? 8 : 6}
            placeholder={isBackupMode ? "Recovery Code" : "000000"}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            required
            className="w-full h-12 px-4 bg-white/[0.04] border border-white/5 rounded-xl text-center text-sm font-mono text-[#E5E7EB] placeholder-[#9CA3AF]/40 outline-none transition focus:border-violet focus:ring-1 focus:ring-violet"
          />
        </div>

        <button
          type="submit"
          disabled={otpLoading || (isBackupMode ? otpCode.length < 8 : otpCode.length !== 6)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white bg-violet hover:bg-violet-glow shadow-md shadow-violet/15 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
        >
          {otpLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</> : 'Verify & Log In'}
        </button>

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => { setView('form'); setOtpCode(''); setOtpError('') }}
            className="text-xs font-semibold text-violet-glow hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsBackupMode(b => !b); setOtpCode(''); setOtpError('') }}
            className="text-xs font-semibold text-violet-glow hover:text-white transition-colors cursor-pointer"
          >
            {isBackupMode ? 'Use Authenticator App' : 'Use Recovery Code'}
          </button>
        </div>
      </form>
    )
  }

  // Reset Password View
  if (view === 'reset') {
    return (
      <div className="w-full space-y-4">
        {resetSent ? (
          <div className="rounded-xl p-4 text-sm bg-green-500/10 border border-green-500/20 text-[#22C55E] text-center leading-relaxed">
            Reset link sent! Please check your email inbox to reset your password.
          </div>
        ) : (
          <form onSubmit={onResetSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="w-full h-12 px-4 bg-white/[0.04] border border-white/5 rounded-xl text-sm text-[#E5E7EB] placeholder-[#9CA3AF]/40 outline-none transition focus:border-violet focus:ring-1 focus:ring-violet disabled:opacity-50"
              />
            </div>
            {submitError && (
              <p className="rounded-xl px-3 py-2 text-[12px] text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              disabled={resetLoading || !resetEmail}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white bg-violet hover:bg-violet-glow shadow-md shadow-violet/15 active:scale-[0.98] transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resetLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : 'Send Reset Link'}
            </button>
          </form>
        )}
        <button
          type="button"
          onClick={() => { setView('form'); setResetSent(false); setSubmitError(null) }}
          className="mt-4 text-xs font-semibold text-violet-glow hover:text-white transition-colors cursor-pointer"
        >
          ← Back to Log In
        </button>
      </div>
    )
  }

  // Standard Login View
  const inputBase = 'w-full h-12 px-4 bg-[#2a2740] border rounded-xl text-sm text-[#E5E7EB] placeholder-[#6B7280] outline-none transition-all duration-200 focus:border-violet focus:ring-1 focus:ring-violet'
  const inputNormal = `${inputBase} border-[#3d3a56]`
  const inputError  = `${inputBase} border-[#EF4444] focus:border-[#EF4444]`

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3 w-full">
      {/* Email */}
      <div className="flex flex-col gap-1">
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          className={errors.email ? inputError : inputNormal}
          {...register('email')}
        />
        {errors.email && (
          <p id="login-email-error" className="text-[12px] text-[#EF4444] pl-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            className={`${errors.password ? inputError : inputNormal} pr-11`}
            {...register('password')}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors text-[#6B7280] hover:text-white"
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" className="text-[12px] text-[#EF4444] pl-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Forgot password */}
      <div className="flex justify-end pr-1">
        <button
          type="button"
          onClick={() => { setView('reset'); setSubmitError(null) }}
          className="text-xs font-semibold text-violet-glow hover:text-white transition-colors cursor-pointer"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="rounded-xl px-3 py-2 text-[12px] text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 leading-relaxed text-left">
          {submitError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white bg-violet hover:bg-violet-glow active:scale-[0.98] transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 mt-1"
      >
        {isLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Logging in...</>
        ) : (
          'Log In'
        )}
      </button>

      {/* Social login */}
      <SocialButtons
        onGoogleClick={initiateGoogleLogin}
        onAppleClick={() => console.log('Apple login clicked')}
      />
    </form>
  )
}
