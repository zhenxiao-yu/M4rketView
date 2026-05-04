import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportWatchlistCSV } from '@/lib/export'
import type { CoinMarket } from '@/types/coingecko'

const mockCoin: CoinMarket = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: 'https://example.com/btc.png',
  current_price: 45000,
  market_cap: 880000000000,
  market_cap_rank: 1,
  fully_diluted_valuation: 945000000000,
  total_volume: 28000000000,
  high_24h: 46000,
  low_24h: 44000,
  price_change_24h: 500,
  price_change_percentage_24h: 1.12,
  market_cap_change_24h: 9000000000,
  market_cap_change_percentage_24h: 1.03,
  circulating_supply: 19500000,
  total_supply: 21000000,
  max_supply: 21000000,
  ath: 69045,
  ath_change_percentage: -34.9,
  ath_date: '2021-11-10T14:24:11.849Z',
  atl: 67.81,
  atl_change_percentage: 66243.2,
  atl_date: '2013-07-06T00:00:00.000Z',
  roi: null,
  last_updated: new Date().toISOString(),
  price_change_percentage_1h_in_currency: 0.21,
  price_change_percentage_24h_in_currency: 1.12,
  price_change_percentage_7d_in_currency: -2.4,
}

describe('exportWatchlistCSV', () => {
  let clickSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    clickSpy = vi.fn()
    // Save original before spying to avoid infinite recursion
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag)
      if (tag === 'a') (el as HTMLAnchorElement).click = clickSpy
      return el
    })
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    vi.spyOn(document.body, 'appendChild').mockImplementation((el) => el)
    vi.spyOn(document.body, 'removeChild').mockImplementation((el) => el)
  })

  it('triggers a download click', () => {
    exportWatchlistCSV([mockCoin], 'usd')
    expect(clickSpy).toHaveBeenCalledOnce()
  })

  it('creates a blob URL and revokes it', () => {
    exportWatchlistCSV([mockCoin], 'usd')
    expect(URL.createObjectURL).toHaveBeenCalledOnce()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })
})
