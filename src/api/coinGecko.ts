import type {
  CoinMarket,
  CoinDetail,
  TrendingCoin,
  SearchCoin,
  MarketChartData,
  GlobalData,
  FearGreedData,
  MarketParams,
} from '@/types/coingecko'
import { RateLimitError } from '@/lib/errors'

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'
const FEAR_GREED_BASE = 'https://api.alternative.me'

async function fetchJSON<T>(url: string, source = 'CoinGecko'): Promise<T> {
  const res = await fetch(url)
  if (res.status === 429) throw new RateLimitError(source)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as { error: string }).error ?? res.statusText)
  }
  return res.json() as Promise<T>
}

export async function fetchCryptoMarkets(params: MarketParams): Promise<CoinMarket[]> {
  const { currency, sortBy, page, perPage, ids = '', category = '' } = params
  const idsParam = ids ? `&ids=${ids}` : ''
  const categoryParam = category ? `&category=${category}` : ''
  return fetchJSON<CoinMarket[]>(
    `${COINGECKO_BASE}/coins/markets?vs_currency=${currency}&order=${sortBy}&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d${idsParam}${categoryParam}`
  )
}

export async function fetchCoinDetail(id: string): Promise<CoinDetail> {
  return fetchJSON<CoinDetail>(
    `${COINGECKO_BASE}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=false`
  )
}

export async function fetchTrending(): Promise<TrendingCoin[]> {
  const data = await fetchJSON<{ coins: TrendingCoin[] }>(`${COINGECKO_BASE}/search/trending`)
  return data.coins
}

export async function fetchSearch(query: string): Promise<SearchCoin[]> {
  const data = await fetchJSON<{ coins: SearchCoin[] }>(
    `${COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`
  )
  return data.coins
}

export async function fetchMarketChart(
  id: string,
  currency: string,
  days: number
): Promise<MarketChartData> {
  const interval = days === 1 ? '' : days <= 7 ? '&interval=hourly' : '&interval=daily'
  return fetchJSON<MarketChartData>(
    `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}${interval}`
  )
}

export async function fetchGlobalData(): Promise<GlobalData> {
  return fetchJSON<GlobalData>(`${COINGECKO_BASE}/global`)
}

export async function fetchFearGreed(): Promise<FearGreedData> {
  const data = await fetchJSON<{ data: FearGreedData[] }>(`${FEAR_GREED_BASE}/fng/?limit=1`)
  return data.data[0]
}
