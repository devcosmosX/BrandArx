// server/src/server.ts
import express from 'express'
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { createProxyMiddleware } from 'http-proxy-middleware'
import authRoutes from './routes/authRoutes'
import paymentRoutes from './routes/paymentRoutes'

// Load environment variables
dotenv.config()

const app           = express()
const PORT          = parseInt(process.env.PORT          || '5000', 10)
const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT || '8080', 10)
const MONGODB_URI   = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/evervault-auth'
const IS_PROD       = process.env.NODE_ENV === 'production'

// Resolve the Vite build output directory (two levels up from server/src → project root)
const DIST_DIR = path.resolve(__dirname, '../../dist')

// ── Security middleware ────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false,   // Allow Cashfree SDK scripts
    crossOriginEmbedderPolicy: false,
  })
)

// ── CORS ──────────────────────────────────────────────────────────────────
// Not needed: Express is the single entry point so the browser always talks
// to the same origin. The block below is kept only as an explicit safety net
// for local tooling (e.g. curl / Postman) that omits an Origin header.
if (!IS_PROD) {
  app.use(
    cors({
      origin: [
        `http://127.0.0.1:${PORT}`,
        `http://localhost:${PORT}`,
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  )
}

// ── Parsers — webhook raw body MUST come before express.json() ────────────
app.use('/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Rate limiters ──────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many requests. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: 'Too many payment requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// ── API routes ─────────────────────────────────────────────────────────────
app.use('/auth',     authLimiter,    authRoutes)
app.use('/payments', paymentLimiter, paymentRoutes)

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', env: process.env.NODE_ENV, timestamp: new Date() })
})

// ── Frontend: dev → reverse-proxy to Vite | prod → serve built SPA ───────
if (IS_PROD) {
  // Serve the Vite/TanStack build output as static files
  if (fs.existsSync(DIST_DIR)) {
    app.use(express.static(DIST_DIR))
    // SPA fallback: return index.html for every non-API route so client-side
    // routing (TanStack Router) works correctly on direct URL loads / refresh.
    app.get('*', (_req, res) => {
      res.sendFile(path.join(DIST_DIR, 'index.html'))
    })
  } else {
    app.get('*', (_req, res) => {
      res.status(503).send('Frontend build not found. Run `npm run build` first.')
    })
  }
} else {
  // In development, forward all non-API requests to the Vite dev server.
  // Vite HMR WebSocket is also proxied (ws: true) so hot-reload works seamlessly.
  app.use(
    '/',
    createProxyMiddleware({
      target: `http://127.0.0.1:${FRONTEND_PORT}`,
      changeOrigin: true,
      ws: true,   // proxy WebSocket → Vite HMR stays fully functional
      on: {
        error: (_err, _req, res) => {
          (res as express.Response)
            .status(502)
            .json({ error: 'Frontend dev server not ready yet — please refresh in a moment.' })
        },
      },
    })
  )
}

// ── Connect to MongoDB & start ─────────────────────────────────────────────
console.log(`\n🚀  BrandArx — ${IS_PROD ? 'PRODUCTION' : 'DEVELOPMENT'} mode`)
console.log(`📦  Connecting to MongoDB…`)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅  MongoDB connected.')
    app.listen(PORT, () => {
      console.log(`\n🌐  Single entry point → http://localhost:${PORT}`)
      console.log(`    API    : http://localhost:${PORT}/auth | /payments | /health`)
      if (IS_PROD) {
        console.log(`    UI     : http://localhost:${PORT}  (serving dist/)`)
      } else {
        console.log(`    UI     : http://localhost:${PORT}  (proxied → Vite :${FRONTEND_PORT})`)
        console.log(`    HMR    : active via WebSocket proxy`)
      }
      console.log(`    CF     : ${process.env.CASHFREE_ENV || 'sandbox'} mode`)
    })
  })
  .catch((err: Error) => {
    console.error('❌  MongoDB connection error:', err)
    process.exit(1)
  })
