import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { useMarketChart } from '@/hooks/useMarketChart'
import { makeQueryWrapper } from '@/test/helpers/queryWrapper'

describe('useMarketChart', () => {
  it('is disabled when id is undefined', () => {
    const { result } = renderHook(() => useMarketChart(undefined, 'usd', 30), {
      wrapper: makeQueryWrapper(),
    })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('returns chart points on success', async () => {
    const { result } = renderHook(() => useMarketChart('bitcoin', 'usd', 30), {
      wrapper: makeQueryWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.prices.length).toBeGreaterThan(0)
  })

  it('falls back to Binance klines when CoinGecko returns 429', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/:id/market_chart', () =>
        HttpResponse.json({ error: 'rate limit' }, { status: 429 }),
      ),
      http.get('https://api.binance.com/api/v3/klines', () =>
        HttpResponse.json([
          [1700000000000, '44000', '46000', '43500', '45000', '120.5', 1700003599999],
          [1700003600000, '45000', '46500', '44500', '45800', '95.2', 1700007199999],
        ]),
      ),
    )
    const { result } = renderHook(() => useMarketChart('bitcoin', 'usd', 1), {
      wrapper: makeQueryWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.prices).toHaveLength(2)
    expect(result.current.data?.prices[0][1]).toBe(45000)
  })
})
