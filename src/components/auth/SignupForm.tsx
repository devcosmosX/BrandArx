// components/auth/SignupForm.tsx
'use client';

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Eye, EyeOff, MailCheck } from 'lucide-react'
import { signupSchema, type SignupFormData } from '../../lib/validations/auth'
import { PasswordStrength } from './PasswordStrength'
import { SocialButtons } from './SocialButtons'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'
import type { AuthTab } from '../../hooks/useAuthModal'

interface SignupFormProps {
  onSwitchTab: (tab: AuthTab) => void
  onClose: () => void
}

export function SignupForm({ onSwitchTab, onClose }: SignupFormProps) {
  const { initiateGoogleLogin } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  })

  const termsChecked = watch('terms')
  const password = watch('password') ?? ''

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setSubmitError(null)

    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim()
      await api.post('/auth/register', {
        fullName,
        email: data.email,
        password: data.password,
      })

      setRegisteredEmail(data.email)
      setIsRegistered(true)
    } catch (error: any) {
      setSubmitError(error.response?.data?.message ?? 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Successful Registration View
  if (isRegistered) {
    return (
      <div className="w-full text-center space-y-6 py-4">
        <div className="h-14 w-14 rounded-2xl bg-violet/10 border border-violet-glow/20 flex items-center justify-center mx-auto">
          <MailCheck className="h-7 w-7 text-violet-glow" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-white">Check Your Inbox</h3>
          <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-[320px] mx-auto">
            We have sent a verification email to <span className="text-white font-semibold">{registeredEmail}</span>.
            Please click the verification link in the email to activate your account.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSwitchTab('login')}
            className="w-full h-12 rounded-xl text-sm font-semibold bg-violet hover:bg-violet-glow text-white shadow-md shadow-violet/15 active:scale-[0.98] transition-all cursor-pointer"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  // Input base classes matching reference: darker fill, visible border
  const inputBase = 'w-full h-12 px-4 bg-[#2a2740] border rounded-xl text-sm text-[#E5E7EB] placeholder-[#6B7280] outline-none transition-all duration-200 focus:border-violet focus:ring-1 focus:ring-violet'
  const inputNormal = `${inputBase} border-[#3d3a56]`
  const inputError  = `${inputBase} border-[#EF4444] focus:border-[#EF4444]`

  // Signup Form View
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3 w-full">
      {/* First & Last Name row */}
      <div className="grid grid-cols-2 gap-3">
        {/* First Name */}
        <div className="flex flex-col gap-1">
          <input
            id="signup-firstname"
            type="text"
            placeholder="First name"
            aria-describedby={errors.firstName ? 'signup-firstname-error' : undefined}
            className={errors.firstName ? inputError : inputNormal}
            {...register('firstName')}
          />
          {errors.firstName && (
            <p id="signup-firstname-error" className="text-[12px] text-[#EF4444] pl-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1">
          <input
            id="signup-lastname"
            type="text"
            placeholder="Last name"
            aria-describedby={errors.lastName ? 'signup-lastname-error' : undefined}
            className={errors.lastName ? inputError : inputNormal}
            {...register('lastName')}
          />
          {errors.lastName && (
            <p id="signup-lastname-error" className="text-[12px] text-[#EF4444] pl-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          aria-describedby={errors.email ? 'signup-email-error' : undefined}
          className={errors.email ? inputError : inputNormal}
          {...register('email')}
        />
        {errors.email && (
          <p id="signup-email-error" className="text-[12px] text-[#EF4444] pl-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Enter your password"
            aria-describedby={errors.password ? 'signup-password-error' : undefined}
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
        <PasswordStrength password={password} />
        {errors.password && (
          <p id="signup-password-error" className="text-[12px] text-[#EF4444] pl-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1">
        <input
          id="signup-confirm-password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Confirm your password"
          aria-describedby={errors.confirmPassword ? 'signup-confirm-password-error' : undefined}
          className={errors.confirmPassword ? inputError : inputNormal}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p id="signup-confirm-password-error" className="text-[12px] text-[#EF4444] pl-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms checkbox */}
      <div className="flex flex-col gap-1 pt-1">
        <label className="flex cursor-pointer items-center gap-3 select-none">
          <div className="relative flex items-center justify-center shrink-0">
            <input
              id="signup-terms"
              type="checkbox"
              className="peer sr-only"
              {...register('terms')}
            />
            {/* Checkbox: unchecked = dark bg + border, checked = violet fill + white checkmark */}
            <div className="h-[18px] w-[18px] rounded-[4px] border border-[#3d3a56] bg-[#2a2740] transition-all peer-checked:bg-violet peer-checked:border-violet flex items-center justify-center">
              <svg className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <span className="text-[13px] leading-relaxed text-[#9CA3AF]">
            I agree to the{' '}
            <a href="/terms" className="text-violet-glow underline underline-offset-2 hover:text-white transition-colors">
              Terms &amp; Conditions
            </a>
          </span>
        </label>
        {errors.terms && (
          <p id="signup-terms-error" className="text-[12px] text-[#EF4444] pl-1">
            {errors.terms.message}
          </p>
        )}
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="rounded-xl px-3 py-2 text-[12px] text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 leading-relaxed text-left">
          {submitError}
        </div>
      )}

      {/* Submit button — solid violet matching reference */}
      <button
        type="submit"
        disabled={isLoading || !termsChecked}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white bg-violet hover:bg-violet-glow active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      >
        {isLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
        ) : (
          'Create account'
        )}
      </button>

      {/* Social login */}
      <SocialButtons
        onGoogleClick={initiateGoogleLogin}
        onAppleClick={() => console.log('Apple signup clicked')}
      />
    </form>
  )
}
