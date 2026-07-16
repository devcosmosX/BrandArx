// hooks/useCookieConsent.ts
import { useState, useEffect } from 'react'

export type ConsentStatus = 'accepted' | 'declined' | null

const STORAGE_KEY = 'cookie_consent'

/**
 * Stub: wire up your actual analytics provider here.
 * Called only when the user explicitly accepts cookies.
 */
function loadAnalytics(): void {
  // TODO: Replace with actual analytics initialisation
  // e.g. window.gtag('config', 'G-XXXXXXX') or Segment.identify()
  console.log('[Analytics] Consent granted — analytics loaded.')
}

export function useCookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentStatus | null
    if (stored === 'accepted' || stored === 'declined') {
      setStatus(stored)
      setVisible(false)
      if (stored === 'accepted') loadAnalytics()
      return
    }
    // Show banner after 1.5 s on first visit
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setStatus('accepted')
    loadAnalytics()
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setStatus('declined')
    setVisible(false)
  }

  return { status, visible, accept, decline }
}
