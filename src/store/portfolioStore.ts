import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PortfolioEntry {
  coinId: string
  coinName: string
  coinSymbol: string
  coinImage: string
  quantity: number
  avgBuyPrice: number
  addedAt: number
}

interface PortfolioState {
  entries: PortfolioEntry[]
  addEntry: (entry: Omit<PortfolioEntry, 'addedAt'>) => void
  removeEntry: (coinId: string) => void
  updateEntry: (coinId: string, quantity: number, avgBuyPrice: number) => void
  hasEntry: (coinId: string) => boolean
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) =>
        set((s) => ({
          entries: [...s.entries, { ...entry, addedAt: Date.now() }],
        })),
      removeEntry: (coinId) =>
        set((s) => ({ entries: s.entries.filter((e) => e.coinId !== coinId) })),
      updateEntry: (coinId, quantity, avgBuyPrice) =>
        set((s) => ({
          entries: s.entries.map((e) =>
            e.coinId === coinId ? { ...e, quantity, avgBuyPrice } : e
          ),
        })),
      hasEntry: (coinId) => get().entries.some((e) => e.coinId === coinId),
    }),
    { name: 'portfolio-store' }
  )
)
