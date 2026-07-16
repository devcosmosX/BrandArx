// server/src/controllers/twoFactorController.ts
import { Request, Response } from 'express'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { AuthenticatedRequest } from '../middleware/auth'
import { generateAccessToken, generateRefreshToken, sendTokenCookies } from '../utils/tokens'

export const setup2FA = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `BrandArx:${user.email}`,
    })

    // Temporarily save secret until verified
    user.twoFactorTempSecret = secret.base32
    await user.save()

    // Generate QR Code data URL
    if (!secret.otpauth_url) {
      return res.status(500).json({ message: 'Error generating 2FA QR code URI.' })
    }

    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url)

    return res.status(200).json({
      qrCode: qrCodeDataUrl,
      secret: secret.base32,
    })
  } catch (error) {
    console.error('2FA setup error:', error)
    return res.status(500).json({ message: 'An error occurred during 2FA setup.' })
  }
}

export const verify2FA = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { token } = req.body
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }

    if (!token) {
      return res.status(400).json({ message: 'Verification token code is required.' })
    }

    const user = await User.findById(req.userId)
    if (!user || !user.twoFactorTempSecret) {
      return res.status(400).json({ message: '2FA setup has not been initiated.' })
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorTempSecret,
      encoding: 'base32',
      token,
      window: 1, // allow 30 seconds clock drift
    })

    if (!verified) {
      return res.status(400).json({ message: 'Invalid verification code. Please try again.' })
    }

    // Enable 2FA
    user.twoFactorEnabled = true
    user.twoFactorSecret = user.twoFactorTempSecret
    user.twoFactorTempSecret = undefined

    // Generate 10 backup recovery codes
    const recoveryCodes: string[] = []
    for (let i = 0; i < 10; i++) {
      recoveryCodes.push(crypto.randomBytes(4).toString('hex')) // 8-char codes
    }
    user.recoveryCodes = recoveryCodes
    await user.save()

    return res.status(200).json({
      message: 'Two-Factor Authentication enabled successfully.',
      recoveryCodes,
    })
  } catch (error) {
    console.error('2FA verify error:', error)
    return res.status(500).json({ message: 'An error occurred during 2FA verification.' })
  }
}

export const disable2FA = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { token } = req.body
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }

    if (!token) {
      return res.status(400).json({ message: 'Verification code is required to disable 2FA.' })
    }

    const user = await User.findById(req.userId)
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA is not enabled.' })
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    })

    if (!verified) {
      return res.status(400).json({ message: 'Invalid verification code.' })
    }

    // Disable 2FA
    user.twoFactorEnabled = false
    user.twoFactorSecret = undefined
    user.recoveryCodes = []
    await user.save()

    return res.status(200).json({ message: 'Two-Factor Authentication disabled successfully.' })
  } catch (error) {
    console.error('2FA disable error:', error)
    return res.status(500).json({ message: 'An error occurred.' })
  }
}

export const verify2FALogin = async (req: Request, res: Response) => {
  try {
    const { token, tempToken } = req.body

    if (!token || !tempToken) {
      return res.status(400).json({ message: 'Verification code and session token are required.' })
    }

    // Verify temporary token
    let decoded: { userId: string }
    try {
      decoded = jwt.verify(
        tempToken,
        process.env.JWT_2FA_SECRET || 'temp-2fa-secret-key-111'
      ) as { userId: string }
    } catch {
      return res.status(400).json({ message: 'Your login session has expired. Please log in again.' })
    }

    const user = await User.findById(decoded.userId)
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ message: 'User not found or 2FA is not enabled.' })
    }

    // Check if recovery code is used
    let isRecoveryCode = false
    const recoveryCodeIndex = user.recoveryCodes.indexOf(token)
    if (recoveryCodeIndex !== -1) {
      isRecoveryCode = true
      // Remove used recovery code
      user.recoveryCodes.splice(recoveryCodeIndex, 1)
    } else {
      // Verify standard TOTP token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: 1,
      })

      if (!verified) {
        return res.status(400).json({ message: 'Invalid verification code.' })
      }
    }

    // Complete login
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
      usedRecoveryCode: isRecoveryCode,
    })
  } catch (error) {
    console.error('2FA login verify error:', error)
    return res.status(500).json({ message: 'An error occurred during verification.' })
  }
}
