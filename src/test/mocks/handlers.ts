import { http, HttpResponse } from 'msw'

const BASE = 'https://api.coingecko.com/api/v3'

export const mockCoinMarket = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
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

export const handlers = [
  http.get(`${BASE}/coins/markets`, () => {
    return HttpResponse.json([mockCoinMarket])
  }),

  http.get(`${BASE}/search/trending`, () => {
    return HttpResponse.json({
      coins: [
        {
          item: {
            id: 'bitcoin',
            coin_id: 1,
            name: 'Bitcoin',
            symbol: 'BTC',
            market_cap_rank: 1,
            thumb: 'https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png',
            small: 'https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png',
            large: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
            slug: 'bitcoin',
            price_btc: 1,
            score: 0,
          },
        },
      ],
    })
  }),

  http.get(`${BASE}/search`, () => {
    return HttpResponse.json({
      coins: [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'btc',
          market_cap_rank: 1,
          thumb: 'https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png',
          large: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
        },
      ],
    })
  }),

  http.get(`${BASE}/coins/:id`, () => {
    return HttpResponse.json({
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: {
        thumb: 'https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png',
        small: 'https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png',
        large: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
      },
      market_cap_rank: 1,
      coingecko_rank: 1,
      coingecko_score: 82.5,
      developer_score: 99.0,
      community_score: 71.4,
      liquidity_score: 100,
      public_interest_score: 0,
      sentiment_votes_up_percentage: 78.5,
      sentiment_votes_down_percentage: 21.5,
      description: { en: 'Bitcoin is the first cryptocurrency.' },
      links: {
        homepage: ['https://bitcoin.org'],
        blockchain_site: ['https://mempool.space'],
        official_forum_url: [],
        subreddit_url: 'https://www.reddit.com/r/Bitcoin/',
        repos_url: { github: ['https://github.com/bitcoin/bitcoin'] },
        twitter_screen_name: 'Bitcoin',
        facebook_username: '',
      },
      market_data: {
        current_price: { usd: 45000 },
        market_cap: { usd: 880000000000 },
        fully_diluted_valuation: { usd: 945000000000 },
        total_volume: { usd: 28000000000 },
        high_24h: { usd: 46000 },
        low_24h: { usd: 44000 },
        price_change_24h: 500,
        price_change_percentage_24h: 1.12,
        market_cap_change_24h: 9000000000,
        market_cap_change_percentage_24h: 1.03,
        circulating_supply: 19500000,
        total_supply: 21000000,
        max_supply: 21000000,
      },
    })
  }),

  http.get(`${BASE}/coins/:id/market_chart`, () => {
    const prices: [number, number][] = Array.from({ length: 30 }, (_, i) => [
      Date.now() - (29 - i) * 86400000,
      44000 + Math.random() * 3000,
    ])
    return HttpResponse.json({ prices, market_caps: prices, total_volumes: prices })
  }),

  http.get(`${BASE}/global`, () => {
    return HttpResponse.json({
      data: {
        active_cryptocurrencies: 13000,
        markets: 800,
        total_market_cap: { usd: 1800000000000 },
        total_volume: { usd: 95000000000 },
        market_cap_percentage: { btc: 52.4, eth: 17.2 },
        market_cap_change_percentage_24h_usd: 1.5,
        updated_at: Date.now(),
      },
    })
  }),

  http.get('https://api.alternative.me/fng/', () => {
    return HttpResponse.json({
      data: [{ value: '65', value_classification: 'Greed', timestamp: String(Date.now()), time_until_update: '86400' }],
    })
  }),
]
