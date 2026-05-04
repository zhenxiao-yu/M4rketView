import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WatchlistState {
  coinIds: string[]
  addCoin: (id: string) => void
  removeCoin: (id: string) => void
  toggleCoin: (id: string) => void
  isWatched: (id: string) => boolean
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      coinIds: [],
      addCoin: (id) => set((s) => ({ coinIds: [...s.coinIds, id] })),
      removeCoin: (id) => set((s) => ({ coinIds: s.coinIds.filter((c) => c !== id) })),
      toggleCoin: (id) => {
        if (get().isWatched(id)) {
          get().removeCoin(id)
        } else {
          get().addCoin(id)
        }
      },
      isWatched: (id) => get().coinIds.includes(id),
    }),
    { name: 'watchlist-store' }
  )
)
