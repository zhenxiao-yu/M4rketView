import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { fetchBitcoinStatsViaBlockchair } from '@/api/blockchair'

const URL = 'https://api.blockchair.com/bitcoin/stats'

describe('fetchBitcoinStatsViaBlockchair', () => {
  it('maps Blockchair shape to BitcoinStats and converts hash rate to GH/s', async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({
          data: {
            blocks: 800_000,
            transactions_24h: 290_000,
            difficulty: 65_000_000_000_000,
            hashrate_24h: '500000000000', // 500 GH/s in raw H/s
            market_price_usd: 45000,
            mempool_size: 0,
            mempool_transactions: 0,
            mempool_total_fee_usd: 0,
            suggested_transaction_fee_per_byte_sat: 0,
          },
        }),
      ),
    )

    const out = await fetchBitcoinStatsViaBlockchair()
    expect(out.n_tx).toBe(290_000)
    expect(out.difficulty).toBe(65_000_000_000_000)
    expect(out.hash_rate).toBe(500) // 500e9 H/s ÷ 1e9 = 500 GH/s
    expect(typeof out.timestamp).toBe('number')
  })

  it('returns 0 hash rate when hashrate_24h is unparseable', async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({
          data: {
            blocks: 0,
            transactions_24h: 0,
            difficulty: 0,
            hashrate_24h: 'not-a-number',
            market_price_usd: 0,
            mempool_size: 0,
            mempool_transactions: 0,
            mempool_total_fee_usd: 0,
            suggested_transaction_fee_per_byte_sat: 0,
          },
        }),
      ),
    )

    const out = await fetchBitcoinStatsViaBlockchair()
    expect(out.hash_rate).toBe(0)
  })

  it('throws on upstream failure', async () => {
    server.use(http.get(URL, () => HttpResponse.json({ error: 'down' }, { status: 500 })))
    await expect(fetchBitcoinStatsViaBlockchair()).rejects.toThrow()
  })
})
