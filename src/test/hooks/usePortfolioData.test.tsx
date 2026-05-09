import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePortfolioData } from '@/hooks/usePortfolioData'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useMarketStore } from '@/store/marketStore'
import { makeQueryWrapper } from '@/test/helpers/queryWrapper'

describe('usePortfolioData', () => {
  beforeEach(() => {
    usePortfolioStore.setState({ entries: [] })
    useMarketStore.setState({
      currency: 'usd',
      sortBy: 'market_cap_desc',
      page: 1,
      perPage: 10,
      coinSearch: '',
      category: '',
    })
  })

  it('is disabled when portfolio is empty', () => {
    const { result } = renderHook(() => usePortfolioData(), { wrapper: makeQueryWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.data).toBeUndefined()
  })

  it('fetches market data when portfolio has entries', async () => {
    usePortfolioStore.getState().addEntry({
      coinId: 'bitcoin',
      coinName: 'Bitcoin',
      coinSymbol: 'btc',
      coinImage: '',
      quantity: 1,
      avgBuyPrice: 30000,
    })

    const { result } = renderHook(() => usePortfolioData(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.[0].id).toBe('bitcoin')
  })
})
