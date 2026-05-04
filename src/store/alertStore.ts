import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PriceAlert {
  id: string
  coinId: string
  coinName: string
  coinImage: string
  targetPrice: number
  direction: 'above' | 'below'
  triggered: boolean
  createdAt: number
}

interface AlertState {
  alerts: PriceAlert[]
  addAlert: (alert: Omit<PriceAlert, 'id' | 'triggered' | 'createdAt'>) => void
  removeAlert: (id: string) => void
  markTriggered: (id: string) => void
  clearTriggered: () => void
  activeCount: () => number
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      alerts: [],
      addAlert: (alert) =>
        set((s) => ({
          alerts: [
            ...s.alerts,
            {
              ...alert,
              id: `${alert.coinId}-${Date.now()}`,
              triggered: false,
              createdAt: Date.now(),
            },
          ],
        })),
      removeAlert: (id) =>
        set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
      markTriggered: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) => (a.id === id ? { ...a, triggered: true } : a)),
        })),
      clearTriggered: () =>
        set((s) => ({ alerts: s.alerts.filter((a) => !a.triggered) })),
      activeCount: () => get().alerts.filter((a) => !a.triggered).length,
    }),
    { name: 'alert-store' }
  )
)
