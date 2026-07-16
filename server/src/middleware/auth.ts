// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, verifyRefreshToken, generateAccessToken, sendTokenCookies } from '../utils/tokens'
import { User } from '../models/User'

export interface AuthenticatedRequest extends Request {
  userId?: string
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req.cookies

  if (access_token) {
    const decoded = verifyAccessToken(access_token)
    if (decoded) {
      const userExists = await User.exists({ _id: decoded.userId })
      if (userExists) {
        req.userId = decoded.userId
        return next()
      }
    }
  }

  // Fallback to refresh token validation (Silent Token Refresh)
  if (refresh_token) {
    const decodedRefresh = verifyRefreshToken(refresh_token)
    if (decodedRefresh) {
      try {
        const user = await User.findById(decodedRefresh.userId)
        if (user && user.refreshToken === refresh_token) {
          // Check if refresh token has expired (optional double-check)
          if (user.refreshTokenExpires && user.refreshTokenExpires < new Date()) {
            return res.status(401).json({ message: 'Session expired. Please log in again.' })
          }

          // Issue a new access token
          const newAccessToken = generateAccessToken(user.id)
          sendTokenCookies(res, newAccessToken, refresh_token)
          req.userId = user.id
          return next()
        }
      } catch (err) {
        return res.status(401).json({ message: 'Authentication error.' })
      }
    }
  }

  return res.status(401).json({ message: 'Authentication required. Please log in.' })
}
