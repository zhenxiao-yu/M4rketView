import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MarketState {
  currency: string
  sortBy: string
  page: number
  perPage: number
  coinSearch: string
  category: string
  setCurrency: (v: string) => void
  setSortBy: (v: string) => void
  setPage: (v: number) => void
  setPerPage: (v: number) => void
  setCoinSearch: (v: string) => void
  setCategory: (v: string) => void
  reset: () => void
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set) => ({
      currency: 'usd',
      sortBy: 'market_cap_desc',
      page: 1,
      perPage: 10,
      coinSearch: '',
      category: '',
      setCurrency: (currency) => set({ currency, page: 1 }),
      setSortBy: (sortBy) => set({ sortBy, page: 1 }),
      setPage: (page) => set({ page }),
      setPerPage: (perPage) => set({ perPage, page: 1 }),
      setCoinSearch: (coinSearch) => set({ coinSearch, page: 1 }),
      setCategory: (category) => set({ category, page: 1 }),
      reset: () => set({ page: 1, coinSearch: '', category: '' }),
    }),
    {
      name: 'market-store',
      partialize: (state) => ({ currency: state.currency, perPage: state.perPage }),
    }
  )
)
