import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '@/store/uiStore'

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({ theme: 'dark', compareCoins: [], searchOpen: false })
  })

  describe('theme', () => {
    it('toggleTheme flips dark → light', () => {
      useUIStore.getState().toggleTheme()
      expect(useUIStore.getState().theme).toBe('light')
    })

    it('toggleTheme flips light → dark', () => {
      useUIStore.setState({ theme: 'light' })
      useUIStore.getState().toggleTheme()
      expect(useUIStore.getState().theme).toBe('dark')
    })
  })

  describe('compareCoins', () => {
    it('addToCompare appends a new id', () => {
      useUIStore.getState().addToCompare('bitcoin')
      expect(useUIStore.getState().compareCoins).toEqual(['bitcoin'])
    })

    it('addToCompare ignores duplicates', () => {
      useUIStore.getState().addToCompare('bitcoin')
      useUIStore.getState().addToCompare('bitcoin')
      expect(useUIStore.getState().compareCoins).toEqual(['bitcoin'])
    })

    it('addToCompare caps at 3 entries', () => {
      useUIStore.getState().addToCompare('bitcoin')
      useUIStore.getState().addToCompare('ethereum')
      useUIStore.getState().addToCompare('solana')
      useUIStore.getState().addToCompare('cardano')
      expect(useUIStore.getState().compareCoins).toEqual(['bitcoin', 'ethereum', 'solana'])
    })

    it('removeFromCompare removes only the matching id', () => {
      useUIStore.setState({ compareCoins: ['bitcoin', 'ethereum', 'solana'] })
      useUIStore.getState().removeFromCompare('ethereum')
      expect(useUIStore.getState().compareCoins).toEqual(['bitcoin', 'solana'])
    })

    it('removeFromCompare on missing id is a no-op', () => {
      useUIStore.setState({ compareCoins: ['bitcoin'] })
      useUIStore.getState().removeFromCompare('unknown')
      expect(useUIStore.getState().compareCoins).toEqual(['bitcoin'])
    })

    it('clearCompare empties the list', () => {
      useUIStore.setState({ compareCoins: ['bitcoin', 'ethereum'] })
      useUIStore.getState().clearCompare()
      expect(useUIStore.getState().compareCoins).toEqual([])
    })
  })

  describe('searchOpen', () => {
    it('setSearchOpen toggles the value', () => {
      useUIStore.getState().setSearchOpen(true)
      expect(useUIStore.getState().searchOpen).toBe(true)
      useUIStore.getState().setSearchOpen(false)
      expect(useUIStore.getState().searchOpen).toBe(false)
    })
  })
})
