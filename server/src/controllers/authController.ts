// server/src/controllers/authController.ts
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, sendTokenCookies, clearTokenCookies } from '../utils/tokens'
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/mailer'
import { AuthenticatedRequest } from '../middleware/auth'

// Password validation regex (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      provider: 'email',
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: verificationTokenExpires,
    })

    await user.save()

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    return res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ message: 'An error occurred during registration.' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email })
    if (!user || user.provider !== 'email' || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        message: 'Email not verified.',
        emailNotVerified: true,
      })
    }

    // Check 2FA
    if (user.twoFactorEnabled) {
      // Issue a temporary short-lived 2FA token
      const tempToken = jwt.sign(
        { userId: user.id, is2FA: true },
        process.env.JWT_2FA_SECRET || 'temp-2fa-secret-key-111',
        { expiresIn: '5m' }
      )
      return res.status(200).json({
        twoFactorRequired: true,
        tempToken,
      })
    }

    // Log in directly
    user.lastLogin = new Date()
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    user.refreshToken = refreshToken
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    await user.save()

    sendTokenCookies(res, accessToken, refreshToken)

    return res.status(200).json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        provider: user.provider,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'An error occurred during login.' })
  }
}

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ message: 'ID token is required.' })
    }

    // Verify token with Google's tokeninfo API
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
    if (!googleRes.ok) {
      return res.status(401).json({ message: 'Invalid Google credential token.' })
    }

    const payload = (await googleRes.json()) as {
      email: string
      name: string
      picture?: string
      email_verified?: string | boolean
    }

    const email = payload.email.toLowerCase()
    let user = await User.findOne({ email })

    if (!user) {
      // Auto-create user
      user = new User({
        fullName: payload.name,
        email,
        profileImage: payload.picture,
        provider: 'google',
        emailVerified: payload.email_verified === 'true' || payload.email_verified === true,
      })
      await user.save()
    } else if (user.provider !== 'google') {
      // Link to Google account or update provider
      user.provider = 'google'
      if (payload.picture && !user.profileImage) {
        user.profileImage = payload.picture
      }
      user.emailVerified = true
      await user.save()
    }

    // Check 2FA
    if (user.twoFactorEnabled) {
      const tempToken = jwt.sign(
        { userId: user.id, is2FA: true },
        process.env.JWT_2FA_SECRET || 'temp-2fa-secret-key-111',
        { expiresIn: '5m' }
      )
      return res.status(200).json({
        twoFactorRequired: true,
        tempToken,
      })
    }

    // Log in directly
    user.lastLogin = new Date()
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    user.refreshToken = refreshToken
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await user.save()

    sendTokenCookies(res, accessToken, refreshToken)

    return res.status(200).json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        provider: user.provider,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error('Google login error:', error)
    return res.status(500).json({ message: 'An error occurred during Google sign in.' })
  }
}

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.userId) {
      const user = await User.findById(req.userId)
      if (user) {
        user.refreshToken = undefined
        user.refreshTokenExpires = undefined
        await user.save()
      }
    }
    clearTokenCookies(res)
    return res.status(200).json({ message: 'Logged out successfully.' })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({ message: 'An error occurred during logout.' })
  }
}

export const logoutAllDevices = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.userId) {
      const user = await User.findById(req.userId)
      if (user) {
        user.refreshToken = undefined
        user.refreshTokenExpires = undefined
        await user.save()
      }
    }
    clearTokenCookies(res)
    return res.status(200).json({ message: 'Logged out from all devices.' })
  } catch (error) {
    console.error('Logout all devices error:', error)
    return res.status(500).json({ message: 'An error occurred.' })
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.cookies

    if (!refresh_token) {
      return res.status(401).json({ message: 'No refresh token provided.' })
    }

    const decoded = verifyRefreshToken(refresh_token)
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token.' })
    }

    const user = await User.findById(decoded.userId)
    if (!user || user.refreshToken !== refresh_token) {
      return res.status(401).json({ message: 'Invalid refresh token.' })
    }

    if (user.refreshTokenExpires && user.refreshTokenExpires < new Date()) {
      return res.status(401).json({ message: 'Refresh token expired.' })
    }

    // Rotate access token
    const accessToken = generateAccessToken(user.id)
    sendTokenCookies(res, accessToken, refresh_token)

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Refresh token error:', error)
    return res.status(500).json({ message: 'An error occurred.' })
  }
}

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ message: 'Token is required.' })
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpires: { $gt: new Date() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Verification link is invalid or has expired.' })
    }

    user.emailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationTokenExpires = undefined
    await user.save()

    return res.status(200).json({ message: 'Email verified successfully! You can now log in.' })
  } catch (error) {
    console.error('Email verification error:', error)
    return res.status(500).json({ message: 'An error occurred during verification.' })
  }
}

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' })
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'This email is already verified.' })
    }

    // Regenerate verification token
    const token = crypto.randomBytes(32).toString('hex')
    user.emailVerificationToken = token
    user.emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await user.save()

    await sendVerificationEmail(user.email, token)

    return res.status(200).json({ message: 'Verification email resent! Please check your inbox.' })
  } catch (error) {
    console.error('Resend verification error:', error)
    return res.status(500).json({ message: 'An error occurred.' })
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' })
    }

    const user = await User.findOne({ email })
    // Return success message even if email not found to prevent user enumeration
    if (!user || user.provider !== 'email') {
      return res.status(200).json({ message: 'If an account exists, a password reset link has been sent.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = token
    user.resetPasswordExpires = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
    await user.save()

    await sendPasswordResetEmail(user.email, token)

    return res.status(200).json({ message: 'If an account exists, a password reset link has been sent.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return res.status(500).json({ message: 'An error occurred.' })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required.' })
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      })
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Reset token is invalid or has expired.' })
    }

    user.password = await bcrypt.hash(password, 12)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    // Terminate current sessions as a security precaution
    user.refreshToken = undefined
    user.refreshTokenExpires = undefined
    await user.save()

    return res.status(200).json({ message: 'Password has been reset successfully! You can now log in.' })
  } catch (error) {
    console.error('Reset password error:', error)
    return res.status(500).json({ message: 'An error occurred.' })
  }
}

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    return res.status(200).json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        provider: user.provider,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return res.status(500).json({ message: 'An error occurred.' })
  }
}
