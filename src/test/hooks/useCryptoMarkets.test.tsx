import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { useCryptoMarkets } from '@/hooks/useCryptoMarkets'
import { useMarketStore } from '@/store/marketStore'
import { mockCoinMarket } from '@/test/mocks/handlers'
import { makeQueryWrapper } from '@/test/helpers/queryWrapper'

describe('useCryptoMarkets', () => {
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

  it('returns market data from CoinGecko on success', async () => {
    const { result } = renderHook(() => useCryptoMarkets(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].id).toBe('bitcoin')
  })

  it('falls back to CoinPaprika when CoinGecko returns 429', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/markets', () =>
        HttpResponse.json({ error: 'rate limit' }, { status: 429 }),
      ),
      http.get('https://api.coinpaprika.com/v1/tickers', () =>
        HttpResponse.json([
          {
            id: 'btc-bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            rank: 1,
            circulating_supply: 19500000,
            total_supply: 21000000,
            max_supply: 21000000,
            quotes: {
              USD: {
                price: 45000,
                volume_24h: 28_000_000_000,
                market_cap: 880_000_000_000,
                percent_change_1h: 0.21,
                percent_change_24h: 1.12,
                percent_change_7d: -2.4,
                ath_price: 69045,
                percent_from_price_ath: -34.9,
              },
            },
          },
        ]),
      ),
    )

    const { result } = renderHook(() => useCryptoMarkets(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.[0].id).toBe('btc-bitcoin')
  })

  it('surfaces error when both primary and fallback fail', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/markets', () =>
        HttpResponse.json({ error: 'down' }, { status: 500 }),
      ),
      http.get('https://api.coinpaprika.com/v1/tickers', () =>
        HttpResponse.json({ error: 'down' }, { status: 500 }),
      ),
    )

    const { result } = renderHook(() => useCryptoMarkets(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('re-runs when store filters change', async () => {
    const { result } = renderHook(() => useCryptoMarkets(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const firstUpdatedAt = result.current.dataUpdatedAt
    expect(result.current.data?.[0].current_price).toBe(mockCoinMarket.current_price)

    act(() => {
      useMarketStore.getState().setCurrency('eur')
    })
    await waitFor(
      () => expect(result.current.dataUpdatedAt).toBeGreaterThan(firstUpdatedAt),
      { timeout: 2000 },
    )
  })
})
