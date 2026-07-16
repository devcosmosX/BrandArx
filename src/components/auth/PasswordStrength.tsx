// components/auth/PasswordStrength.tsx
interface PasswordStrengthProps {
  password: string
}

function getStrength(password: string): { pct: number; label: string; color: string } {
  if (!password) return { pct: 0, label: '', color: '#EF4444' }
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)
  const len = password.length
  if (len < 6) return { pct: 33, label: 'Weak', color: '#EF4444' }
  if (len >= 10 && hasUpper && hasNumber && hasSymbol)
    return { pct: 100, label: 'Strong', color: '#22C55E' }
  return { pct: 66, label: 'Medium', color: '#F59E0B' }
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null
  const { pct, label, color } = getStrength(password)
  return (
    <div className="mt-2">
      <div
        className="h-1 w-full overflow-hidden rounded-sm"
        style={{ background: 'rgba(255,255,255,0.08)' }}
        aria-hidden="true"
      >
        <div
          className="h-full rounded-sm"
          style={{ width: `${pct}%`, backgroundColor: color, transition: 'width 0.3s ease' }}
        />
      </div>
      <p className="mt-1 text-[11px] font-medium" style={{ color }}>
        {label}
      </p>
    </div>
  )
}
