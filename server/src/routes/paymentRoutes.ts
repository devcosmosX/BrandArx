// server/src/routes/paymentRoutes.ts
import { Router } from 'express'
import { createOrder, getPaymentStatus, handleWebhook, getMyOrders, debugCredentials } from '../controllers/paymentController'
import { authenticate } from '../middleware/auth'

const router = Router()

// Public — create an order (user fills checkout form)
router.post('/create-order', createOrder)

// Public — poll status after redirect back from Cashfree
router.get('/status/:orderId', getPaymentStatus)

// Cashfree will POST to this endpoint after every payment event
// Must be raw body for HMAC verification
router.post('/webhook', handleWebhook)

// DEV ONLY — validates Cashfree credentials without creating a real order
router.get('/debug-credentials', debugCredentials)

// Protected — list current user's orders
router.get('/my-orders', authenticate as any, getMyOrders as any)

export default router
