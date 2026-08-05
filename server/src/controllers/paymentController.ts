// server/src/controllers/paymentController.ts
import { Request, Response } from 'express'
import axios from 'axios'
import crypto from 'crypto'
import { Payment } from '../models/Payment'
import { AuthenticatedRequest } from '../middleware/auth'

// ── Cashfree configuration ─────────────────────────────────────────────────────
// Use CASHFREE_ENV=sandbox for testing, CASHFREE_ENV=production for live payments.
// sandbox App IDs look like: TEST123456 or a numeric string
// production App IDs look like: a numeric string e.g. 1278196215
// Secret keys: cfsk_ma_test_... (sandbox) or cfsk_ma_prod_... (production)
const CF_ENV        = (process.env.CASHFREE_ENV || 'sandbox') as 'sandbox' | 'production'
const CF_APP_ID     = (process.env.CASHFREE_APP_ID || '').trim()
const CF_SECRET_KEY = (process.env.CASHFREE_SECRET_KEY || '').trim()
const CF_BASE_URL   = CF_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg'
const CF_API_VER    = '2023-08-01'

// Warn at startup if credentials look mismatched
if (!CF_APP_ID || !CF_SECRET_KEY) {
  console.error('❌  [Cashfree] CASHFREE_APP_ID or CASHFREE_SECRET_KEY is missing in .env!')
} else {
  const secretMatchesEnv =
    (CF_ENV === 'sandbox'    && CF_SECRET_KEY.startsWith('cfsk_ma_test')) ||
    (CF_ENV === 'production' && CF_SECRET_KEY.startsWith('cfsk_ma_prod'))
  if (!secretMatchesEnv) {
    console.warn(`⚠️   [Cashfree] Secret key prefix doesn't match CASHFREE_ENV=${CF_ENV}. ` +
      `Sandbox secrets start with "cfsk_ma_test", production with "cfsk_ma_prod".`)
  }
  console.log(`✅  [Cashfree] ${CF_ENV.toUpperCase()} mode — App ID: ${CF_APP_ID.slice(0,8)}… | Key: ${CF_SECRET_KEY.slice(0,18)}…`)
}

// FRONTEND_URL is used for the Cashfree return_url after payment.
// Must be publicly accessible when using Cashfree hosted checkout.
// In dev, set FRONTEND_URL=http://localhost:5000 in server/.env
const FRONTEND_URL  = process.env.FRONTEND_URL || 'http://localhost:5000'

const cfHeaders = {
  'x-api-version':   CF_API_VER,
  'x-client-id':     CF_APP_ID,
  'x-client-secret': CF_SECRET_KEY,
  'Content-Type':    'application/json',
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Generate a short unique order ID safe for Cashfree (alphanumeric + hyphens, ≤50 chars) */
function genOrderId(): string {
  const ts   = Date.now().toString(36).toUpperCase()
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `BAX-${ts}-${rand}` // e.g. BAX-LX9AKC-3F2A1B4D  (≤24 chars)
}

/** Normalise phone: Cashfree requires exactly 10 digits for Indian numbers */
function normalisePhone(phone: string): string {
  // Strip spaces, dashes, parentheses
  const digits = phone.replace(/[\s\-().+]/g, '')
  // If starts with country code (91xxxxxxxxxx → 10 digits)
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  if (digits.length === 13 && digits.startsWith('091')) return digits.slice(3)
  return digits
}

// ── Trusted plan price registry ────────────────────────────────────────────────
// Server-side source of truth. Client sends only planName; the backend
// looks up the canonical price. This prevents price-tampering attacks
// where a client sends planPrice=1 instead of the real ₹3500.
const PLAN_PRICES: Record<string, number> = {
  'Starter':      18000,
  'Professional': 49000,
  // Annual prices (20% off — matches frontend billing toggle)
  'Starter-Annual':      14400,
  'Professional-Annual': 39200,
}

// Cashfree limits: minimum ₹1, maximum ₹5,00,000 per transaction
const CF_MIN_AMOUNT = 1
const CF_MAX_AMOUNT = 500_000

// ── Create Order ───────────────────────────────────────────────────────────────

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      planName,
      planPrice,
      currency = 'INR',
      customerName,
      customerEmail,
      customerPhone,
    } = req.body

    // Validate required fields
    if (!planName || planPrice == null || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ message: 'Missing required fields: planName, planPrice, customerName, customerEmail, customerPhone.' })
    }

    // ── Server-side price verification ──────────────────────────────────────
    // Look up the canonical price from our trusted registry.
    // If the planName is in the registry, use that price — ignore whatever
    // the client sent. This prevents tampering (e.g. sending planPrice=1).
    let amount: number
    const trustedPrice = PLAN_PRICES[planName]
    if (trustedPrice !== undefined) {
      amount = trustedPrice
      if (Number(planPrice) !== trustedPrice) {
        console.warn(`[createOrder] Price mismatch for "${planName}": client sent ${planPrice}, using trusted ${trustedPrice}`)
      }
    } else {
      // Unknown / custom plan — accept client price but validate range
      amount = Math.round(Number(planPrice) * 100) / 100  // round to 2 dp
      if (isNaN(amount) || amount < CF_MIN_AMOUNT) {
        return res.status(400).json({ message: `planPrice must be at least ₹${CF_MIN_AMOUNT}.` })
      }
      if (amount > CF_MAX_AMOUNT) {
        return res.status(400).json({ message: `planPrice cannot exceed ₹${CF_MAX_AMOUNT.toLocaleString()}.` })
      }
    }

    // Cashfree requires EITHER 10-digit Indian mobile OR E.164 international
    const normalisedPhone = normalisePhone(String(customerPhone))

    const orderId = genOrderId()

    // ── Cashfree create-order payload ──────────────────────────────────────
    const cfPayload = {
      order_id:       orderId,
      order_amount:   amount,
      order_currency: currency,
      customer_details: {
        // customer_id: alphanumeric + underscore/hyphen, max 50 chars
        customer_id:    customerEmail.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50),
        customer_email: customerEmail.trim().toLowerCase(),
        customer_phone: normalisedPhone,
        customer_name:  customerName.trim(),
      },
      order_meta: {
        // {order_id} is a Cashfree template variable — do NOT replace it here
        return_url: `${FRONTEND_URL}/payment/status?order_id={order_id}`,
        notify_url: process.env.WEBHOOK_URL || '',  // blank is fine in sandbox
      },
      order_note: `BrandArx — ${planName} plan`,
    }

    console.log(`[createOrder] Calling Cashfree ${CF_ENV} API — orderId: ${orderId}`)

    let cfRes: any
    try {
      cfRes = await axios.post(`${CF_BASE_URL}/orders`, cfPayload, { headers: cfHeaders })
    } catch (cfErr: any) {
      // Surface Cashfree's own error message to help debugging
      const cfMsg = cfErr?.response?.data?.message || cfErr?.response?.data?.error_description || cfErr.message
      console.error('[createOrder] Cashfree API error:', cfErr?.response?.data || cfErr.message)
      return res.status(502).json({
        message: `Cashfree rejected the order: ${cfMsg}`,
        cashfree: cfErr?.response?.data,
      })
    }

    const cf_order_id       = cfRes.data?.cf_order_id
    const payment_session_id = cfRes.data?.payment_session_id

    if (!payment_session_id) {
      console.error('[createOrder] Cashfree response missing payment_session_id:', cfRes.data)
      return res.status(502).json({ message: 'Cashfree did not return a payment session ID.' })
    }

    // ── Persist order to DB ────────────────────────────────────────────────
    await Payment.create({
      orderId,
      cfOrderId:        cf_order_id,
      userId:           (req as AuthenticatedRequest).userId,
      planName,
      planPrice:        amount,
      currency,
      customerName:     customerName.trim(),
      customerEmail:    customerEmail.trim().toLowerCase(),
      customerPhone:    normalisedPhone,
      status:           'ACTIVE',
      paymentSessionId: payment_session_id,
    })

    console.log(`[createOrder] Order created — ${orderId} | session: ${payment_session_id.slice(0, 12)}…`)

    return res.status(201).json({
      orderId,
      cfOrderId:        cf_order_id,
      paymentSessionId: payment_session_id,
    })
  } catch (err: any) {
    console.error('[createOrder] Unexpected error:', err.message)
    return res.status(500).json({ message: 'Failed to create payment order.' })
  }
}

// ── Get Payment Status ─────────────────────────────────────────────────────────

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params
    if (!orderId) return res.status(400).json({ message: 'orderId is required.' })

    const payment = await Payment.findOne({ orderId })
    if (!payment) return res.status(404).json({ message: 'Order not found.' })

    // Already finalised — return DB state without hitting Cashfree
    if (['PAID', 'FAILED', 'CANCELLED'].includes(payment.status)) {
      return res.json({ status: payment.status, payment })
    }

    // Fetch live payment list from Cashfree
    let cfRes: any
    try {
      cfRes = await axios.get(`${CF_BASE_URL}/orders/${orderId}/payments`, { headers: cfHeaders })
    } catch (cfErr: any) {
      console.warn('[getPaymentStatus] Cashfree fetch failed:', cfErr?.response?.data || cfErr.message)
      // Return DB state gracefully — let the client keep polling
      return res.json({ status: payment.status, payment })
    }

    const payments: any[] = cfRes.data
    if (!payments || payments.length === 0) {
      return res.json({ status: payment.status, payment })
    }

    // Pick the most-recent payment attempt
    const latest = [...payments].sort((a: any, b: any) =>
      new Date(b.payment_time).getTime() - new Date(a.payment_time).getTime()
    )[0]

    let newStatus: typeof payment.status = payment.status
    if (latest.payment_status === 'SUCCESS') {
      newStatus = 'PAID'
    } else if (['FAILED', 'CANCELLED', 'VOID', 'USER_DROPPED'].includes(latest.payment_status)) {
      newStatus = 'FAILED'
    }

    payment.status        = newStatus
    payment.cfPaymentId   = latest.cf_payment_id?.toString()
    payment.paymentMethod = latest.payment_method ? JSON.stringify(latest.payment_method) : undefined
    payment.failureReason = latest.error_details?.error_description
    await payment.save()

    return res.json({ status: newStatus, payment })
  } catch (err: any) {
    console.error('[getPaymentStatus] Unexpected error:', err.message)
    return res.status(500).json({ message: 'Failed to fetch payment status.' })
  }
}

// ── Webhook ────────────────────────────────────────────────────────────────────

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-webhook-signature'] as string
    const timestamp = req.headers['x-webhook-timestamp'] as string

    // req.body is a raw Buffer (set by express.raw() in server.ts)
    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body)

    // Verify Cashfree HMAC-SHA256 signature when present
    if (signature && timestamp && CF_SECRET_KEY) {
      const signData = timestamp + rawBody
      const expected = crypto.createHmac('sha256', CF_SECRET_KEY).update(signData).digest('base64')
      if (expected !== signature) {
        console.warn('[webhook] Signature mismatch — rejecting event.')
        return res.status(200).json({ received: true }) // always 200 to Cashfree
      }
    }

    let event: any
    try {
      event = JSON.parse(rawBody)
    } catch {
      console.warn('[webhook] Could not parse body as JSON')
      return res.status(200).json({ received: true })
    }

    const orderId       = event?.data?.order?.order_id
    const paymentStatus = event?.data?.payment?.payment_status
    const cfPaymentId   = event?.data?.payment?.cf_payment_id?.toString()
    const paymentMethod = event?.data?.payment?.payment_method
      ? JSON.stringify(event.data.payment.payment_method)
      : undefined
    const failureReason = event?.data?.payment?.error_details?.error_description

    if (!orderId) return res.status(200).json({ received: true })

    const payment = await Payment.findOne({ orderId })
    if (payment) {
      if (paymentStatus === 'SUCCESS') {
        payment.status          = 'PAID'
        payment.cfPaymentId     = cfPaymentId
        payment.paymentMethod   = paymentMethod
        payment.webhookVerified = true
      } else if (['FAILED', 'CANCELLED', 'VOID', 'USER_DROPPED'].includes(paymentStatus)) {
        payment.status          = 'FAILED'
        payment.cfPaymentId     = cfPaymentId
        payment.failureReason   = failureReason
        payment.webhookVerified = true
      }
      await payment.save()
      console.log(`[webhook] ${orderId} → ${payment.status}`)
    }

    return res.status(200).json({ received: true })
  } catch (err: any) {
    console.error('[handleWebhook] Error:', err.message)
    return res.status(200).json({ received: true }) // always 200
  }
}

// ── List user's orders (authenticated) ────────────────────────────────────────

export const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = await Payment.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(20)
    return res.json({ orders })
  } catch (err: any) {
    console.error('[getMyOrders]', err.message)
    return res.status(500).json({ message: 'Failed to fetch orders.' })
  }
}

// ── Debug Credentials (DEV only) ──────────────────────────────────────────────
// GET /payments/debug-credentials
// Calls Cashfree GET /orders with a dummy non-existent order to check auth.
// A 404 from Cashfree means credentials are VALID (order just doesn't exist).
// A 401 means credentials are WRONG.

export const debugCredentials = async (_req: Request, res: Response) => {
  const info = {
    CASHFREE_ENV:    CF_ENV,
    CF_BASE_URL,
    CF_API_VER,
    APP_ID_set:      !!CF_APP_ID,
    APP_ID_preview:  CF_APP_ID ? CF_APP_ID.slice(0, 8) + '…' : '(not set)',
    SECRET_set:      !!CF_SECRET_KEY,
    SECRET_preview:  CF_SECRET_KEY ? CF_SECRET_KEY.slice(0, 18) + '…' : '(not set)',
    SECRET_prefix_ok: CF_ENV === 'production'
      ? CF_SECRET_KEY.startsWith('cfsk_ma_prod')
      : CF_SECRET_KEY.startsWith('cfsk_ma_test'),
    FRONTEND_URL,
  }

  if (!CF_APP_ID || !CF_SECRET_KEY) {
    return res.status(500).json({ ok: false, reason: 'Credentials not set in .env', info })
  }

  try {
    // Use a dummy order ID — we expect 404 (order not found) if auth is OK
    await axios.get(`${CF_BASE_URL}/orders/CRED-TEST-DUMMY-123`, { headers: cfHeaders })
    // If we somehow get 200, credentials are definitely valid
    return res.json({ ok: true, reason: '200 from Cashfree — credentials valid', info })
  } catch (err: any) {
    const status = err?.response?.status
    const data   = err?.response?.data

    if (status === 404) {
      return res.json({
        ok: true,
        reason: '404 — order not found, but credentials ARE valid ✅',
        info,
      })
    }

    // 401 / 403 = wrong credentials
    if (status === 401 || status === 403) {
      return res.status(502).json({
        ok: false,
        reason: `${status} Authentication Failed — check CASHFREE_APP_ID and CASHFREE_SECRET_KEY`,
        cashfree_error: data,
        info,
        fix: CF_ENV === 'production'
          ? 'Production App ID and cfsk_ma_prod_... secret must be copied from merchant.cashfree.com → Developers → API Keys'
          : 'Sandbox App ID and cfsk_ma_test_... secret must be copied from merchant.cashfree.com → Developers → API Keys (Test)',
      })
    }

    return res.status(502).json({
      ok: false,
      reason: `Unexpected Cashfree error: ${status}`,
      cashfree_error: data,
      info,
    })
  }
}
