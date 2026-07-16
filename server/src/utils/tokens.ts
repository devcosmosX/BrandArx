// server/src/utils/tokens.ts
import jwt from 'jsonwebtoken'
import { Response } from 'express'

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'fallback-access-secret-321'
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret-123'

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' })
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' })
}

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export const sendTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = process.env.NODE_ENV === 'production'

  // Access token cookie (15 mins)
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  })

  // Refresh token cookie (7 days)
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  })
}

export const clearTokenCookies = (res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production'
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  })
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  })
}
