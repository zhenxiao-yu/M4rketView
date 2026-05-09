import { describe, it, expect, beforeEach } from 'vitest'
import { usePortfolioStore, type PortfolioEntry } from '@/store/portfolioStore'

const sample: Omit<PortfolioEntry, 'addedAt'> = {
  coinId: 'bitcoin',
  coinName: 'Bitcoin',
  coinSymbol: 'btc',
  coinImage: 'https://example.com/btc.png',
  quantity: 0.5,
  avgBuyPrice: 30000,
}

describe('portfolioStore', () => {
  beforeEach(() => {
    usePortfolioStore.setState({ entries: [] })
  })

  it('addEntry appends a new entry with addedAt timestamp', () => {
    usePortfolioStore.getState().addEntry(sample)
    const entries = usePortfolioStore.getState().entries
    expect(entries).toHaveLength(1)
    expect(entries[0].coinId).toBe('bitcoin')
    expect(entries[0].quantity).toBe(0.5)
    expect(typeof entries[0].addedAt).toBe('number')
    expect(entries[0].addedAt).toBeGreaterThan(0)
  })

  it('addEntry allows multiple entries (no dedupe)', () => {
    usePortfolioStore.getState().addEntry(sample)
    usePortfolioStore.getState().addEntry({ ...sample, coinId: 'ethereum' })
    expect(usePortfolioStore.getState().entries).toHaveLength(2)
  })

  it('removeEntry deletes only the matching coinId', () => {
    usePortfolioStore.getState().addEntry(sample)
    usePortfolioStore.getState().addEntry({ ...sample, coinId: 'ethereum' })
    usePortfolioStore.getState().removeEntry('bitcoin')
    const entries = usePortfolioStore.getState().entries
    expect(entries).toHaveLength(1)
    expect(entries[0].coinId).toBe('ethereum')
  })

  it('removeEntry on missing coin is a no-op', () => {
    usePortfolioStore.getState().addEntry(sample)
    usePortfolioStore.getState().removeEntry('unknown')
    expect(usePortfolioStore.getState().entries).toHaveLength(1)
  })

  it('updateEntry replaces quantity and avgBuyPrice on the matching entry', () => {
    usePortfolioStore.getState().addEntry(sample)
    usePortfolioStore.getState().updateEntry('bitcoin', 1.25, 45000)
    const entry = usePortfolioStore.getState().entries[0]
    expect(entry.quantity).toBe(1.25)
    expect(entry.avgBuyPrice).toBe(45000)
    expect(entry.coinId).toBe('bitcoin')
  })

  it('updateEntry preserves addedAt and other fields', () => {
    usePortfolioStore.getState().addEntry(sample)
    const before = usePortfolioStore.getState().entries[0]
    usePortfolioStore.getState().updateEntry('bitcoin', 2, 50000)
    const after = usePortfolioStore.getState().entries[0]
    expect(after.addedAt).toBe(before.addedAt)
    expect(after.coinName).toBe(before.coinName)
    expect(after.coinImage).toBe(before.coinImage)
  })

  it('hasEntry returns true for present, false for absent', () => {
    usePortfolioStore.getState().addEntry(sample)
    expect(usePortfolioStore.getState().hasEntry('bitcoin')).toBe(true)
    expect(usePortfolioStore.getState().hasEntry('ethereum')).toBe(false)
  })
})
