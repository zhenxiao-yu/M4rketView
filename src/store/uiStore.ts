import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'dark' | 'light'
  toggleTheme: () => void
  compareCoins: string[]
  addToCompare: (id: string) => void
  removeFromCompare: (id: string) => void
  clearCompare: () => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      compareCoins: [],
      addToCompare: (id) => {
        const current = get().compareCoins
        if (current.length < 3 && !current.includes(id)) {
          set({ compareCoins: [...current, id] })
        }
      },
      removeFromCompare: (id) =>
        set((s) => ({ compareCoins: s.compareCoins.filter((c) => c !== id) })),
      clearCompare: () => set({ compareCoins: [] }),
      searchOpen: false,
      setSearchOpen: (searchOpen) => set({ searchOpen }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
