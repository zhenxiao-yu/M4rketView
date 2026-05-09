import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { fetchMarketChartViaBinance } from '@/api/binanceRest'

const KLINES_URL = 'https://api.binance.com/api/v3/klines'

describe('fetchMarketChartViaBinance', () => {
  it('throws when the coin id has no Binance symbol mapping', async () => {
    await expect(fetchMarketChartViaBinance('not-a-real-coin', 'usd', 1)).rejects.toThrow(
      /no symbol mapping/,
    )
  })

  it('maps klines to MarketChartData with prices and volumes', async () => {
    server.use(
      http.get(KLINES_URL, () =>
        HttpResponse.json([
          [1700000000000, '44000', '46000', '43500', '45000', '120.5', 1700003599999],
          [1700003600000, '45000', '46500', '44500', '45800', '95.2',  1700007199999],
        ]),
      ),
    )

    const out = await fetchMarketChartViaBinance('bitcoin', 'usd', 1)
    expect(out.prices).toEqual([
      [1700000000000, 45000],
      [1700003600000, 45800],
    ])
    expect(out.total_volumes).toEqual([
      [1700000000000, 120.5],
      [1700003600000, 95.2],
    ])
    expect(out.market_caps).toEqual([])
  })

  it('skips klines with non-finite close', async () => {
    server.use(
      http.get(KLINES_URL, () =>
        HttpResponse.json([
          [1700000000000, '44000', '46000', '43500', '45000', '120.5', 1700003599999],
          [1700003600000, '45000', '46500', '44500', 'oops', '0',      1700007199999],
        ]),
      ),
    )

    const out = await fetchMarketChartViaBinance('bitcoin', 'usd', 1)
    expect(out.prices).toHaveLength(1)
    expect(out.prices[0][1]).toBe(45000)
  })
})
