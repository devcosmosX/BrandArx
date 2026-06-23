import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight, Check } from 'lucide-react'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type LoginFormData = z.infer<typeof loginSchema>
type SignupFormData = z.infer<typeof signupSchema>

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      rememberMe: false,
    },
  })

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  })

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Login data:', data)
      alert('Login successful! (This is a demo)')
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const onSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Signup data:', data)
      alert('Account created successfully! (This is a demo)')
    } catch (err) {
      setError('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: 'google' | 'github') => {
    console.log(`${provider} OAuth login`)
    alert(`${provider} login coming soon!`)
  }

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    const length = password.length
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSymbol = /[^A-Za-z0-9]/.test(password)
    
    if (length < 6) {
      return { strength: 33, label: 'Weak', color: '#EF4444' }
    } else if (length < 10 || !hasUpper || !hasNumber) {
      return { strength: 66, label: 'Medium', color: '#F59E0B' }
    } else if (hasUpper && hasNumber && hasSymbol) {
      return { strength: 100, label: 'Strong', color: '#22C55E' }
    }
    return { strength: 66, label: 'Medium', color: '#F59E0B' }
  }

  const passwordStrength = getPasswordStrength(signupForm.watch('password') || '')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.08_0.03_280)]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.08_0.03_280)] via-[oklch(0.10_0.04_285)] to-[oklch(0.08_0.03_280)]" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-violet/20 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-violet-glow/20 blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
              BrandArx
            </h1>
            <p className="text-foreground/60 text-sm">
              {activeTab === 'login' ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}
            </p>
          </div>

          {/* Auth Card */}
          <div className="rounded-3xl border border-white/10 bg-[oklch(0.12_0.04_280)]/80 p-8 backdrop-blur-2xl shadow-2xl">
            {/* Tab Switcher */}
            <div className="mb-8 flex gap-2 rounded-2xl bg-white/5 p-1.5">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 rounded-xl py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-violet to-violet-glow text-white shadow-lg shadow-violet/30'
                    : 'text-foreground/60 hover:text-foreground/80'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 rounded-xl py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-violet to-violet-glow text-white shadow-lg shadow-violet/30'
                    : 'text-foreground/60 hover:text-foreground/80'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                {/* Email Field */}
                <div className="group">
                  <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-foreground/90">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 transition-colors group-focus-within:text-violet" />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...loginForm.register('email')}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder:text-foreground/40 transition-all duration-300 focus:border-violet focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet/20"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="group">
                  <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-foreground/90">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 transition-colors group-focus-within:text-violet" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      {...loginForm.register('password')}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white placeholder:text-foreground/40 transition-all duration-300 focus:border-violet focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/60 transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...loginForm.register('rememberMe')}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-violet transition-all focus:ring-2 focus:ring-violet/20 focus:ring-offset-0"
                    />
                    <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a href="#" className="text-sm text-violet-glow hover:text-violet transition-colors">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet to-violet-glow py-3.5 font-semibold text-white shadow-lg shadow-violet/30 transition-all duration-300 hover:shadow-2xl hover:shadow-violet/50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-glow focus:ring-offset-2 focus:ring-offset-[oklch(0.12_0.04_280)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-glow to-violet opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[oklch(0.12_0.04_280)] px-3 text-foreground/60">OR CONTINUE WITH</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-foreground/90 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-[1.02] active:scale-95"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('github')}
                    className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-foreground/90 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-[1.02] active:scale-95"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </button>
                </div>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-5">
                {/* Name Field */}
                <div className="group">
                  <label htmlFor="signup-name" className="mb-2 block text-sm font-medium text-foreground/90">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 transition-colors group-focus-within:text-violet" />
                    <input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      placeholder="John Doe"
                      {...signupForm.register('name')}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder:text-foreground/40 transition-all duration-300 focus:border-violet focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet/20"
                    />
                  </div>
                  {signupForm.formState.errors.name && (
                    <p className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                      {signupForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="group">
                  <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-foreground/90">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 transition-colors group-focus-within:text-violet" />
                    <input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...signupForm.register('email')}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder:text-foreground/40 transition-all duration-300 focus:border-violet focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet/20"
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <p className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="group">
                  <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-foreground/90">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 transition-colors group-focus-within:text-violet" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      {...signupForm.register('password')}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white placeholder:text-foreground/40 transition-all duration-300 focus:border-violet focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/60 transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {signupForm.watch('password') && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-300">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-foreground/60">Password strength</span>
                        <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${passwordStrength.strength}%`,
                            backgroundColor: passwordStrength.color,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="group">
                  <label htmlFor="signup-confirm-password" className="mb-2 block text-sm font-medium text-foreground/90">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40 transition-colors group-focus-within:text-violet" />
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      {...signupForm.register('confirmPassword')}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white placeholder:text-foreground/40 transition-all duration-300 focus:border-violet focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/60 transition-colors hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        id="terms"
                        type="checkbox"
                        {...signupForm.register('terms')}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-white/20 bg-white/5 transition-all checked:border-violet checked:bg-violet focus:ring-2 focus:ring-violet/20 focus:ring-offset-0"
                      />
                      <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                    </div>
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                      I agree to the{' '}
                      <a href="/terms" className="text-violet-glow hover:text-violet transition-colors">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-violet-glow hover:text-violet transition-colors">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {signupForm.formState.errors.terms && (
                    <p className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                      {signupForm.formState.errors.terms.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !signupForm.watch('terms')}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet to-violet-glow py-3.5 font-semibold text-white shadow-lg shadow-violet/30 transition-all duration-300 hover:shadow-2xl hover:shadow-violet/50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-glow focus:ring-offset-2 focus:ring-offset-[oklch(0.12_0.04_280)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-glow to-violet opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[oklch(0.12_0.04_280)] px-3 text-foreground/60">OR CONTINUE WITH</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-foreground/90 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-[1.02] active:scale-95"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('github')}
                    className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-foreground/90 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:scale-[1.02] active:scale-95"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
