// src/routes/payment/status.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, ArrowRight, RotateCcw, Home } from 'lucide-react'
import { fetchPaymentStatus, PaymentStatusResponse } from '../../services/payment'

export const Route = createFileRoute('/payment/status')({
  component: PaymentStatus,
})

function PaymentStatus() {
  const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const orderId = search.get('order_id') || ''

  const [data, setData] = useState<PaymentStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    if (!orderId) { setError('No order ID found.'); setLoading(false); return }

    let timer: ReturnType<typeof setTimeout>

    const poll = async () => {
      try {
        const result = await fetchPaymentStatus(orderId)
        setData(result)
        // Keep polling if still ACTIVE/PENDING (max 10 times, 3s apart)
        if (['PENDING', 'ACTIVE'].includes(result.status) && pollCount < 10) {
          setPollCount(c => c + 1)
          timer = setTimeout(poll, 3000)
        } else {
          setLoading(false)
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Could not fetch payment status.')
        setLoading(false)
      }
    }

    poll()
    return () => clearTimeout(timer)
  }, [orderId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── UI ────────────────────────────────────────────────────────────────────

  const status = data?.status
  const isPaid = status === 'PAID'
  const isFailed = status === 'FAILED' || status === 'CANCELLED'
  const isPending = !status || status === 'PENDING' || status === 'ACTIVE'

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 [background:radial-gradient(ellipse_70%_50%_at_50%_30%,oklch(0.62_0.22_290_/_0.1),transparent_60%)]" />

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-[oklch(0.15_0.05_280)] p-5 sm:p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">

          {/* Loading / Polling */}
          {(loading || isPending) && (
            <div className="flex flex-col items-center text-center gap-5">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-violet/10 border border-violet/20">
                <Clock className="h-9 w-9 text-violet-glow animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Verifying Payment…</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  We're confirming your payment with Cashfree. This may take a few seconds.
                </p>
              </div>
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <span key={i} className="h-2 w-2 rounded-full bg-violet-glow animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {!loading && isPaid && (
            <div className="flex flex-col items-center text-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thank you, <strong>{data?.payment?.customerName}</strong>! Your{' '}
                  <strong>{data?.payment?.planName}</strong> plan is now active.
                </p>
              </div>

              <div className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-foreground text-xs break-all">{data?.payment?.orderId ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="text-foreground">
                    {(data?.payment?.planName ?? '—').replace('-Annual', '')}
                    {data?.payment?.planName?.includes('Annual') && (
                      <span className="ml-1 text-[10px] text-violet-glow font-semibold uppercase tracking-wider">Annual</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="text-green-400 font-semibold">
                    {typeof data?.payment?.planPrice === 'number'
                      ? `₹${data.payment.planPrice.toLocaleString('en-IN')}`
                      : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency</span>
                  <span className="text-foreground">{data?.payment?.currency ?? 'INR'}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                A confirmation has been sent to <strong>{data?.payment?.customerEmail}</strong>.
              </p>

              <Link to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-white via-white/90 to-[oklch(0.85_0.12_290)] px-6 py-3 min-h-[44px] text-sm font-semibold text-[oklch(0.15_0.05_280)] shadow-lg transition hover:brightness-105">
                Back to Home <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* FAILED / CANCELLED */}
          {!loading && isFailed && (
            <div className="flex flex-col items-center text-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                <XCircle className="h-10 w-10 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Payment Failed</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {data?.payment?.failureReason
                    ? `Reason: ${data.payment.failureReason}`
                    : 'Your payment could not be processed. No amount has been deducted.'}
                </p>
              </div>

              <div className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-foreground text-xs">{data?.payment?.orderId}</span>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <a href="/#pricing"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-foreground hover:bg-white/[0.09] transition">
                  <RotateCcw className="h-4 w-4" /> Try Again
                </a>
                <Link to="/"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition">
                  <Home className="h-4 w-4" /> Home
                </Link>
              </div>
            </div>
          )}

          {/* Error fetching status */}
          {!loading && error && !data && (
            <div className="flex flex-col items-center text-center gap-4">
              <XCircle className="h-12 w-12 text-red-400" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Link to="/" className="text-sm text-violet-glow hover:underline">← Back to Home</Link>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Secured by <strong>Cashfree Payments</strong> · PCI-DSS Level 1 Certified
        </p>
      </div>
    </main>
  )
}
