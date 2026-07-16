// server/src/routes/authRoutes.ts
import { Router } from 'express'
import {
  register,
  login,
  googleLogin,
  logout,
  refreshToken,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  logoutAllDevices,
} from '../controllers/authController'
import { setup2FA, verify2FA, disable2FA, verify2FALogin } from '../controllers/twoFactorController'
import { authenticate } from '../middleware/auth'

const router = Router()

// Public auth endpoints
router.post('/register', register)
router.post('/login', login)
router.post('/google', googleLogin)
router.post('/refresh-token', refreshToken)
router.post('/verify-email', verifyEmail)
router.post('/send-verification', resendVerification)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/2fa/verify-login', verify2FALogin)

// Protected auth endpoints
router.post('/logout', authenticate as any, logout as any)
router.post('/logout-all', authenticate as any, logoutAllDevices as any)
router.get('/me', authenticate as any, getMe as any)

// Protected 2FA setup endpoints
router.post('/2fa/setup', authenticate as any, setup2FA as any)
router.post('/2fa/verify', authenticate as any, verify2FA as any)
router.post('/2fa/disable', authenticate as any, disable2FA as any)

export default router
