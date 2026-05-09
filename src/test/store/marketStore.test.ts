import { describe, it, expect, beforeEach } from 'vitest'
import { useMarketStore } from '@/store/marketStore'

describe('marketStore', () => {
  beforeEach(() => {
    useMarketStore.setState({
      currency: 'usd',
      sortBy: 'market_cap_desc',
      page: 1,
      perPage: 10,
      coinSearch: '',
      category: '',
    })
  })

  it('starts with sensible defaults', () => {
    const s = useMarketStore.getState()
    expect(s.currency).toBe('usd')
    expect(s.sortBy).toBe('market_cap_desc')
    expect(s.page).toBe(1)
    expect(s.perPage).toBe(10)
    expect(s.coinSearch).toBe('')
    expect(s.category).toBe('')
  })

  it('setCurrency updates currency and resets page', () => {
    useMarketStore.setState({ page: 5 })
    useMarketStore.getState().setCurrency('eur')
    expect(useMarketStore.getState().currency).toBe('eur')
    expect(useMarketStore.getState().page).toBe(1)
  })

  it('setSortBy updates sort and resets page', () => {
    useMarketStore.setState({ page: 3 })
    useMarketStore.getState().setSortBy('volume_desc')
    expect(useMarketStore.getState().sortBy).toBe('volume_desc')
    expect(useMarketStore.getState().page).toBe(1)
  })

  it('setPage does not reset other fields', () => {
    useMarketStore.setState({ coinSearch: 'btc', category: 'defi' })
    useMarketStore.getState().setPage(7)
    expect(useMarketStore.getState().page).toBe(7)
    expect(useMarketStore.getState().coinSearch).toBe('btc')
    expect(useMarketStore.getState().category).toBe('defi')
  })

  it('setPerPage updates perPage and resets page', () => {
    useMarketStore.setState({ page: 4 })
    useMarketStore.getState().setPerPage(50)
    expect(useMarketStore.getState().perPage).toBe(50)
    expect(useMarketStore.getState().page).toBe(1)
  })

  it('setCoinSearch updates search and resets page', () => {
    useMarketStore.setState({ page: 9 })
    useMarketStore.getState().setCoinSearch('eth')
    expect(useMarketStore.getState().coinSearch).toBe('eth')
    expect(useMarketStore.getState().page).toBe(1)
  })

  it('setCategory updates category and resets page', () => {
    useMarketStore.setState({ page: 9 })
    useMarketStore.getState().setCategory('layer-1')
    expect(useMarketStore.getState().category).toBe('layer-1')
    expect(useMarketStore.getState().page).toBe(1)
  })

  it('reset clears page, search, category but keeps currency/sort/perPage', () => {
    useMarketStore.setState({
      currency: 'eur',
      sortBy: 'volume_desc',
      perPage: 100,
      page: 5,
      coinSearch: 'btc',
      category: 'defi',
    })
    useMarketStore.getState().reset()
    const s = useMarketStore.getState()
    expect(s.page).toBe(1)
    expect(s.coinSearch).toBe('')
    expect(s.category).toBe('')
    expect(s.currency).toBe('eur')
    expect(s.sortBy).toBe('volume_desc')
    expect(s.perPage).toBe(100)
  })
})
