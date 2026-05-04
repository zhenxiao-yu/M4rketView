export interface CoinMarket {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: null | { times: number; currency: string; percentage: number }
  last_updated: string
  price_change_percentage_1h_in_currency: number
  price_change_percentage_24h_in_currency: number
  price_change_percentage_7d_in_currency: number
}

export interface PriceMap {
  [currency: string]: number
}

export interface CoinDetail {
  id: string
  symbol: string
  name: string
  image: { thumb: string; small: string; large: string }
  market_cap_rank: number
  coingecko_rank: number
  coingecko_score: number
  developer_score: number
  community_score: number
  liquidity_score: number
  public_interest_score: number
  sentiment_votes_up_percentage: number
  sentiment_votes_down_percentage: number
  description: { en: string }
  links: {
    homepage: string[]
    blockchain_site: string[]
    official_forum_url: string[]
    subreddit_url: string
    repos_url: { github: string[] }
    twitter_screen_name: string
    facebook_username: string
  }
  market_data: {
    current_price: PriceMap
    market_cap: PriceMap
    fully_diluted_valuation: PriceMap
    total_volume: PriceMap
    high_24h: PriceMap
    low_24h: PriceMap
    price_change_24h: number
    price_change_percentage_24h: number
    market_cap_change_24h: number
    market_cap_change_percentage_24h: number
    circulating_supply: number
    total_supply: number | null
    max_supply: number | null
  }
}

export interface TrendingCoinItem {
  id: string
  coin_id: number
  name: string
  symbol: string
  market_cap_rank: number
  thumb: string
  small: string
  large: string
  slug: string
  price_btc: number
  score: number
}

export interface TrendingCoin {
  item: TrendingCoinItem
}

export interface SearchCoin {
  id: string
  name: string
  symbol: string
  market_cap_rank: number
  thumb: string
  large: string
}

export interface MarketChartData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export interface GlobalData {
  data: {
    active_cryptocurrencies: number
    markets: number
    total_market_cap: PriceMap
    total_volume: PriceMap
    market_cap_percentage: PriceMap
    market_cap_change_percentage_24h_usd: number
    updated_at: number
  }
}

export interface FearGreedData {
  value: string
  value_classification: string
  timestamp: string
  time_until_update: string
}

export interface MarketParams {
  currency: string
  sortBy: string
  page: number
  perPage: number
  ids?: string
  category?: string
}

export type ChartType = 'prices' | 'market_caps' | 'total_volumes'
export type ChartDays = 1 | 7 | 14 | 30 | 90 | 365
