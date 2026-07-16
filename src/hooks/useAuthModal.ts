// hooks/useAuthModal.ts
import { create } from 'zustand'

export type AuthTab = 'login' | 'signup'

interface AuthModalState {
  isOpen: boolean
  activeTab: AuthTab
  open: (tab?: AuthTab) => void
  close: () => void
  setTab: (tab: AuthTab) => void
}

export const useAuthModal = create<AuthModalState>((set) => ({
  isOpen: false,
  activeTab: 'signup',
  open: (tab = 'signup') => set({ isOpen: true, activeTab: tab }),
  close: () => set({ isOpen: false }),
  setTab: (tab) => set({ activeTab: tab }),
}))

// Expose programmatic opener on window for developer convenience
if (typeof window !== 'undefined') {
  ;(window as Window & { openAuthModal?: (tab?: AuthTab) => void }).openAuthModal =
    (tab?: AuthTab) => useAuthModal.getState().open(tab)
}
