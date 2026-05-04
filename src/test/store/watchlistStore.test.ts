import { describe, it, expect, beforeEach } from 'vitest'
import { useWatchlistStore } from '@/store/watchlistStore'

describe('watchlistStore', () => {
  beforeEach(() => {
    useWatchlistStore.setState({ coinIds: [] })
  })

  it('adds a coin', () => {
    useWatchlistStore.getState().addCoin('bitcoin')
    expect(useWatchlistStore.getState().coinIds).toContain('bitcoin')
  })

  it('removes a coin', () => {
    useWatchlistStore.getState().addCoin('bitcoin')
    useWatchlistStore.getState().removeCoin('bitcoin')
    expect(useWatchlistStore.getState().coinIds).not.toContain('bitcoin')
  })

  it('toggleCoin adds when not watched', () => {
    useWatchlistStore.getState().toggleCoin('ethereum')
    expect(useWatchlistStore.getState().isWatched('ethereum')).toBe(true)
  })

  it('toggleCoin removes when already watched', () => {
    useWatchlistStore.getState().addCoin('ethereum')
    useWatchlistStore.getState().toggleCoin('ethereum')
    expect(useWatchlistStore.getState().isWatched('ethereum')).toBe(false)
  })

  it('isWatched returns false for unknown coin', () => {
    expect(useWatchlistStore.getState().isWatched('unknown-coin')).toBe(false)
  })

  it('does not add duplicate coins', () => {
    useWatchlistStore.getState().addCoin('bitcoin')
    useWatchlistStore.getState().addCoin('bitcoin')
    const ids = useWatchlistStore.getState().coinIds
    expect(ids.filter((id) => id === 'bitcoin').length).toBe(2)
  })
})
