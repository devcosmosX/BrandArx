// routes/dashboard.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Clock,
  LogOut,
  Smartphone,
  KeyRound,
  CheckCircle,
  Copy,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const { user, isLoading, logout, refreshUser } = useAuth()
  const navigate = useNavigate()

  // 2FA states
  const [is2FALoading, setIs2FALoading] = useState(false)
  const [setupStep, setSetupStep] = useState<'idle' | 'qr' | 'codes'>('idle')
  const [qrCodeData, setQrCodeData] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [copiedCodes, setCopiedCodes] = useState(false)
  const [twoFactorError, setTwoFactorError] = useState('')
  const [twoFactorSuccess, setTwoFactorSuccess] = useState('')

  // Disable 2FA states
  const [isDisabling, setIsDisabling] = useState(false)
  const [disableCode, setDisableCode] = useState('')

  // Logout all states
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false)

  // Route Guard: redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/auth' })
    }
  }, [user, isLoading, navigate])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#13111C]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-glow" />
          <p className="text-sm text-[#9CA3AF]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Setup 2FA: calls /auth/2fa/setup
  const handleInitiate2FA = async () => {
    setIs2FALoading(true)
    setTwoFactorError('')
    setTwoFactorSuccess('')
    try {
      const res = await api.post('/auth/2fa/setup')
      setQrCodeData(res.data.qrCode)
      setSecretKey(res.data.secret)
      setSetupStep('qr')
    } catch (err: any) {
      setTwoFactorError(err.response?.data?.message || 'Failed to initiate 2FA setup.')
    } finally {
      setIs2FALoading(false)
    }
  }

  // Verify and enable 2FA: calls /auth/2fa/verify
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode) return

    setIs2FALoading(true)
    setTwoFactorError('')
    try {
      const res = await api.post('/auth/2fa/verify', { token: verificationCode })
      setRecoveryCodes(res.data.recoveryCodes)
      setTwoFactorSuccess(res.data.message)
      setSetupStep('codes')
      await refreshUser()
    } catch (err: any) {
      setTwoFactorError(err.response?.data?.message || 'Invalid code. Please try again.')
    } finally {
      setIs2FALoading(false)
    }
  }

  // Disable 2FA: calls /auth/2fa/disable
  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!disableCode) return

    setIs2FALoading(true)
    setTwoFactorError('')
    try {
      await api.post('/auth/2fa/disable', { token: disableCode })
      setTwoFactorSuccess('Two-Factor Authentication disabled successfully.')
      setIsDisabling(false)
      setDisableCode('')
      await refreshUser()
    } catch (err: any) {
      setTwoFactorError(err.response?.data?.message || 'Invalid verification code.')
    } finally {
      setIs2FALoading(false)
    }
  }

  // Logout all devices: calls /auth/logout-all
  const handleLogoutAllDevices = async () => {
    if (!confirm('Are you sure you want to log out of all devices? This will invalidate all active sessions.')) {
      return
    }

    setIsLoggingOutAll(true)
    try {
      await api.post('/auth/logout-all')
      await logout()
      navigate({ to: '/auth' })
    } catch (err: any) {
      alert('An error occurred during logout.')
    } finally {
      setIsLoggingOutAll(false)
    }
  }

  // Copy recovery codes to clipboard
  const handleCopyCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'))
    setCopiedCodes(true)
    setTimeout(() => setCopiedCodes(false), 2000)
  }

  // Format dates cleanly
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  return (
    <div className="min-h-screen bg-[#13111C] text-white py-12 px-4 md:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet to-violet-glow flex items-center justify-center shadow-lg shadow-violet/25 font-bold text-xl text-white">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.fullName} className="h-full w-full rounded-2xl object-cover" />
              ) : (
                user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{user.fullName}</h1>
              <p className="text-sm text-[#9CA3AF] flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout().then(() => navigate({ to: '/' }))}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-sm font-medium transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout Session
          </button>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Profile Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Account Details Card */}
            <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-4">
                <UserIcon className="h-5 w-5 text-violet-glow" />
                <h2 className="text-lg font-semibold">Profile Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">Account Status</p>
                  <div className="flex items-center gap-2 text-[#22C55E]">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Active & Verified</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">Login Provider</p>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-violet-glow" />
                    <span className="capitalize">{user.provider} Auth</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">Created Date</p>
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="h-4 w-4 text-white/30" />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">Last Login</p>
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="h-4 w-4 text-white/30" />
                    <span>{formatDate(user.lastLogin)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions Card */}
            <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-4">
                <KeyRound className="h-5 w-5 text-violet-glow" />
                <h2 className="text-lg font-semibold">Session Management</h2>
              </div>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                If you suspect unauthorized access to your account, you can force logout all other devices and browser sessions immediately.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleLogoutAllDevices}
                  disabled={isLoggingOutAll}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoggingOutAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                  Logout from All Devices
                </button>
              </div>
            </div>
          </div>

          {/* Col 2: 2FA Settings Card */}
          <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl flex flex-col justify-between min-h-[360px]">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-4">
                {user.twoFactorEnabled ? (
                  <ShieldCheck className="h-5 w-5 text-[#22C55E]" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-[#EF4444]" />
                )}
                <h2 className="text-lg font-semibold">2FA Security</h2>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  Status:{' '}
                  <span className={user.twoFactorEnabled ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
                    {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </p>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  Two-Factor Authentication adds an extra layer of protection by requiring a 6-digit verification code from Google Authenticator to log in.
                </p>
              </div>

              {/* Status Notifications */}
              {twoFactorError && (
                <div className="flex items-start gap-2 p-3 text-xs bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444]">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{twoFactorError}</span>
                </div>
              )}

              {twoFactorSuccess && (
                <div className="flex items-start gap-2 p-3 text-xs bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl text-[#22C55E]">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{twoFactorSuccess}</span>
                </div>
              )}

              {/* 2FA SETUP WIZARD */}
              {setupStep === 'qr' && (
                <div className="space-y-4 pt-2 border-t border-white/5">
                  <p className="text-xs font-medium text-white/80">1. Scan QR code in Google Authenticator:</p>
                  <div className="flex justify-center p-2 bg-white rounded-xl max-w-[160px] mx-auto">
                    <img src={qrCodeData} alt="2FA QR Code" className="h-36 w-36" />
                  </div>
                  <p className="text-[11px] text-center text-[#9CA3AF] break-all">
                    Or enter manual key: <span className="font-mono text-white font-semibold">{secretKey}</span>
                  </p>

                  <form onSubmit={handleVerify2FA} className="space-y-3">
                    <p className="text-xs font-medium text-white/80">2. Enter the 6-digit confirmation code:</p>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-10 px-3 bg-white/[0.04] border border-white/10 rounded-xl text-center font-mono text-sm tracking-widest outline-none focus:border-violet"
                    />
                    <button
                      type="submit"
                      disabled={is2FALoading || verificationCode.length !== 6}
                      className="w-full h-10 rounded-xl text-xs font-semibold bg-violet hover:bg-violet-glow text-white transition-all cursor-pointer disabled:opacity-50"
                    >
                      {is2FALoading ? 'Verifying...' : 'Enable 2FA'}
                    </button>
                  </form>
                </div>
              )}

              {setupStep === 'codes' && (
                <div className="space-y-4 pt-2 border-t border-white/5">
                  <div className="rounded-xl p-3 bg-white/[0.03] border border-white/10 space-y-2">
                    <p className="text-xs font-bold text-white/90">Backup Recovery Codes</p>
                    <p className="text-[10px] text-[#9CA3AF] leading-relaxed">
                      Store these codes securely! Each code can be used once to log in if you lose your phone app.
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 font-mono text-xs pt-1.5">
                      {recoveryCodes.map((code) => (
                        <div key={code} className="bg-white/5 border border-white/5 rounded px-2 py-1 text-center select-all">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyCodes}
                      className="flex-1 flex items-center justify-center gap-1.5 h-10 border border-white/10 hover:bg-white/5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copiedCodes ? 'Copied!' : 'Copy Codes'}
                    </button>
                    <button
                      onClick={() => setSetupStep('idle')}
                      className="flex-1 h-10 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              {/* DISABLE 2FA FORM */}
              {isDisabling && (
                <form onSubmit={handleDisable2FA} className="space-y-3 pt-2 border-t border-white/5">
                  <p className="text-xs font-medium text-white/80">Enter verification code to disable:</p>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={disableCode}
                    onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-10 px-3 bg-white/[0.04] border border-white/10 rounded-xl text-center font-mono text-sm tracking-widest outline-none focus:border-violet"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDisabling(false)}
                      className="flex-1 h-10 border border-white/10 hover:bg-white/5 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={is2FALoading || disableCode.length !== 6}
                      className="flex-1 h-10 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer disabled:opacity-50"
                    >
                      {is2FALoading ? 'Disabling...' : 'Disable'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Enable/Disable Trigger Buttons */}
            {setupStep === 'idle' && !isDisabling && (
              <div className="pt-6">
                {user.twoFactorEnabled ? (
                  <button
                    onClick={() => {
                      setIsDisabling(true)
                      setTwoFactorError('')
                      setTwoFactorSuccess('')
                    }}
                    className="w-full h-11 border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    Disable Two-Factor Auth
                  </button>
                ) : (
                  <button
                    onClick={handleInitiate2FA}
                    disabled={is2FALoading}
                    className="w-full h-11 bg-violet hover:bg-violet-glow text-white shadow-md shadow-violet/15 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {is2FALoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Enable Two-Factor Auth
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
