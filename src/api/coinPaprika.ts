import type { CoinMarket, MarketParams } from '@/types/coingecko'
import { apiFetch } from '@/lib/fetch'

const BASE = 'https://api.coinpaprika.com/v1'
const SRC = 'CoinPaprika'

interface PaprikaTicker {
  id: string
  name: string
  symbol: string
  rank: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  beta_value: number
  first_data_at: string
  last_updated: string
  quotes: Record<
    string,
    {
      price: number
      volume_24h: number
      market_cap: number
      percent_change_1h: number
      percent_change_24h: number
      percent_change_7d: number
      percent_from_price_ath: number
    }
  >
}

const paprikaLogo = (id: string): string => `https://static.coinpaprika.com/coin/${id}/logo.png`

/**
 * Best-effort mapping from CoinPaprika `/tickers` to CoinGecko's `CoinMarket` shape.
 * Fields not exposed by Paprika (high_24h, low_24h, ath_date, atl, etc.) get safe
 * placeholders. The Markets list, Heatmap, Watchlist all read fields Paprika does
 * provide — coin detail / chart still go through CoinGecko (which has its own fallback).
 */
export async function fetchCryptoMarketsViaPaprika(params: MarketParams): Promise<CoinMarket[]> {
  const { currency, sortBy, page, perPage } = params
  const quote = currency.toUpperCase()
  const url = `${BASE}/tickers?quotes=${quote}&limit=250`
  const data = await apiFetch<PaprikaTicker[]>(url, SRC)

  const start = (page - 1) * perPage
  const sorted = [...data].sort((a, b) => {
    const qa = a.quotes[quote]
    const qb = b.quotes[quote]
    if (!qa || !qb) return 0
    switch (sortBy) {
      case 'market_cap_asc':  return qa.market_cap - qb.market_cap
      case 'volume_desc':     return qb.volume_24h - qa.volume_24h
      case 'volume_asc':      return qa.volume_24h - qb.volume_24h
      case 'id_asc':          return a.id.localeCompare(b.id)
      case 'id_desc':         return b.id.localeCompare(a.id)
      // gecko_* and market_cap_desc all map to market cap descending
      default:                return qb.market_cap - qa.market_cap
    }
  })

  return sorted.slice(start, start + perPage).map((t): CoinMarket => {
    const q = t.quotes[quote] ?? Object.values(t.quotes)[0]
    const price = q?.price ?? 0
    const pct24h = q?.percent_change_24h ?? 0
    const priceChange24h = (price * pct24h) / 100
    return {
      id: t.id,
      symbol: t.symbol.toLowerCase(),
      name: t.name,
      image: paprikaLogo(t.id),
      current_price: price,
      market_cap: q?.market_cap ?? 0,
      market_cap_rank: t.rank,
      fully_diluted_valuation: null,
      total_volume: q?.volume_24h ?? 0,
      high_24h: 0,
      low_24h: 0,
      price_change_24h: priceChange24h,
      price_change_percentage_24h: pct24h,
      market_cap_change_24h: 0,
      market_cap_change_percentage_24h: pct24h,
      circulating_supply: t.circulating_supply,
      total_supply: t.total_supply || null,
      max_supply: t.max_supply || null,
      ath: 0,
      ath_change_percentage: q?.percent_from_price_ath ?? 0,
      ath_date: '',
      atl: 0,
      atl_change_percentage: 0,
      atl_date: '',
      roi: null,
      last_updated: t.last_updated,
      price_change_percentage_1h_in_currency: q?.percent_change_1h ?? 0,
      price_change_percentage_24h_in_currency: pct24h,
      price_change_percentage_7d_in_currency: q?.percent_change_7d ?? 0,
    }
  })
}
