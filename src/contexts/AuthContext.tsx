// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'
import { useAuthModal } from '../hooks/useAuthModal'

export interface User {
  id: string
  fullName: string
  name: string // for backward compatibility
  email: string
  profileImage?: string
  provider: 'email' | 'google'
  emailVerified: boolean
  twoFactorEnabled: boolean
  createdAt: string
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<any>
  googleLogin: (token: string) => Promise<any>
  initiateGoogleLogin: () => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  openLoginModal: () => void
  closeLoginModal: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { open: openModal, close: closeModal } = useAuthModal()

  const initiateGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1051515286546-dummy-client-id.apps.googleusercontent.com'
    const redirectUri = `${window.location.origin}/auth`
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid%20profile%20email&nonce=${Math.random().toString(36).substring(2)}`
    window.location.href = googleUrl
  }

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me')
      if (res.data && res.data.user) {
        setUser({
          ...res.data.user,
          name: res.data.user.fullName, // backward compatibility mapping
        })
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Load session on startup
  useEffect(() => {
    refreshUser()
  }, [])

  // Listen to auto-logout/session-expired events from Axios interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null)
    }
    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    if (res.data && res.data.user) {
      setUser({
        ...res.data.user,
        name: res.data.user.fullName,
      })
      closeModal()
    }
    return res.data
  }

  const googleLogin = async (token: string) => {
    const res = await api.post('/auth/google', { token })
    if (res.data && res.data.user) {
      setUser({
        ...res.data.user,
        name: res.data.user.fullName,
      })
      closeModal()
    }
    return res.data
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        googleLogin,
        initiateGoogleLogin,
        logout,
        refreshUser,
        openLoginModal: () => openModal('login'),
        closeLoginModal: closeModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
