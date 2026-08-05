// src/components/PaymentModal.tsx
import { useState } from 'react'
import { X, CreditCard, Shield, Lock, CheckCircle, XCircle, Loader2, Phone, Mail, User } from 'lucide-react'
import { createPaymentOrder } from '../services/payment'

interface Plan {
  name: string
  price: number | string
  currency?: string
}

interface PaymentModalProps {
  plan: Plan
  onClose: () => void
}

type Step = 'form' | 'processing' | 'redirecting' | 'error'

const CASHFREE_SDK = 'https://sdk.cashfree.com/js/v3/cashfree.js'

// Match the backend CASHFREE_ENV: set VITE_CASHFREE_ENV=production for live payments,
// leave unset (defaults to 'sandbox') for testing.
const CF_MODE = (import.meta.env.VITE_CASHFREE_ENV || 'sandbox') as 'sandbox' | 'production'

function loadCashfreeSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Cashfree) { resolve(); return }
    const existing = document.getElementById('cashfree-sdk')
    if (existing) {
      // If already loading, wait for it; if already loaded this shouldn't be reached
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Cashfree SDK')))
      return
    }
    const script = document.createElement('script')
    script.id  = 'cashfree-sdk'
    script.src = CASHFREE_SDK
    script.onload  = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Cashfree SDK'))
    document.head.appendChild(script)
  })
}

export function PaymentModal({ plan, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<Step>('form')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Guard: "Custom" plan (Enterprise) should never reach this modal
  const price = typeof plan.price === 'number' ? plan.price : 0
  const isCustom = typeof plan.price !== 'number' || price <= 0

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim())                                          errs.name  = 'Full name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))    errs.email = 'Valid email is required.'
    if (!/^\+?[0-9\s\-().]{7,20}$/.test(form.phone.trim()))       errs.phone = 'Valid phone number required (7–15 digits).'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isCustom) return          // extra safety — should not be reachable
    if (!validate()) return

    setStep('processing')
    setError('')

    try {
      // 1. Create order — backend verifies price from its own registry,
      //    so planPrice here is advisory only (server ignores it for known plans).
      const order = await createPaymentOrder({
        planName:      plan.name,          // e.g. "Starter" or "Starter-Annual"
        planPrice:     price,              // backend will verify against PLAN_PRICES
        currency:      plan.currency || 'INR',
        customerName:  form.name.trim(),
        customerEmail: form.email.trim().toLowerCase(),
        customerPhone: form.phone.trim(),
      })

      // 2. Load Cashfree JS SDK
      await loadCashfreeSDK()
      const cashfree = (window as any).Cashfree({ mode: CF_MODE })

      setStep('redirecting')

      // 3. Redirect to Cashfree hosted checkout (most reliable, handles all payment modes)
      cashfree.checkout({
        paymentSessionId: order.paymentSessionId,
        redirectTarget: '_self', // full-page redirect; return_url handles callback
      })

    } catch (err: any) {
      console.error('[PaymentModal] Error:', err)
      setError(err?.response?.data?.message || err.message || 'Something went wrong. Please try again.')
      setStep('error')
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={step === 'form' ? onClose : undefined} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[oklch(0.13_0.04_280)] shadow-[0_40px_80px_rgba(0,0,0,0.7)] overflow-hidden">

        {/* Top violet glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[120%] h-48 blur-3xl"
          style={{ background: 'radial-gradient(ellipse at center, oklch(0.62 0.22 290 / 0.3) 0%, transparent 70%)' }} />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/[0.07] px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet/20 border border-violet/30">
              <CreditCard className="h-4 w-4 text-violet-glow" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Checkout</p>
              <p className="text-xs text-muted-foreground">{plan.name} Plan</p>
            </div>
          </div>
          {step === 'form' && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Price summary */}
        <div className="relative border-b border-white/[0.07] px-4 py-4 sm:px-6 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {plan.name.replace('-Annual', '')} Plan
              {plan.name.includes('Annual') ? ' · Annual' : ' · Monthly'}
            </span>
            <div className="text-right">
              <span className="text-xl font-bold text-foreground">
                {typeof plan.price === 'number'
                  ? `₹${plan.price.toLocaleString('en-IN')}`
                  : plan.price}
              </span>
              {typeof plan.price === 'number' && (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {plan.name.includes('Annual') ? 'per month, billed annually' : 'per month'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative px-4 py-5 sm:px-6 sm:py-6">

          {/* FORM step */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-muted-foreground mb-4">
                Enter your details to proceed to secure payment.
              </p>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-white/20 focus:outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/30 transition"
                  />
                </div>
                {formErrors.name && <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-white/20 focus:outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/30 transition"
                  />
                </div>
                {formErrors.email && <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-white/20 focus:outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/30 transition"
                  />
                </div>
                {formErrors.phone && <p className="mt-1 text-xs text-red-400">{formErrors.phone}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isCustom}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-white via-white/90 to-[oklch(0.85_0.12_290)] py-3 text-sm font-semibold text-[oklch(0.15_0.05_280)] shadow-lg shadow-violet/20 transition-all duration-300 hover:brightness-105 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Pay ₹{price.toLocaleString('en-IN')} →
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> SSL Secured</span>
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Cashfree PCI-DSS</span>
              </div>
            </form>
          )}

          {/* PROCESSING step */}
          {(step === 'processing' || step === 'redirecting') && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet/20 border border-violet/30">
                <Loader2 className="h-8 w-8 text-violet-glow animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {step === 'processing' ? 'Creating your order…' : 'Redirecting to payment…'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Please do not close this window.</p>
              </div>
            </div>
          )}

          {/* ERROR step */}
          {step === 'error' && (
            <div className="flex flex-col items-center justify-center gap-4 py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Payment Initiation Failed</p>
                <p className="mt-1 text-xs text-muted-foreground max-w-xs">{error}</p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => { setStep('form'); setError('') }}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] py-2.5 text-sm font-medium text-foreground hover:bg-white/[0.09] transition"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
