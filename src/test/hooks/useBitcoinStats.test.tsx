import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { useBitcoinStats } from '@/hooks/useBitcoinStats'
import { makeQueryWrapper } from '@/test/helpers/queryWrapper'

const PRIMARY = 'https://api.blockchain.info/stats'
const FALLBACK = 'https://api.blockchair.com/bitcoin/stats'

describe('useBitcoinStats', () => {
  it('returns blockchain.info stats on success', async () => {
    server.use(
      http.get(PRIMARY, () =>
        HttpResponse.json({
          hash_rate: 500_000_000,
          difficulty: 70_000_000_000_000,
          n_tx: 320_000,
          miners_revenue_btc: 900,
          miners_revenue_usd: 40_000_000,
          blocks_size: 100_000,
          total_fees_btc: 10,
          n_btc_mined: 900,
          timestamp: 1_700_000_000,
        }),
      ),
    )
    const { result } = renderHook(() => useBitcoinStats(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.n_tx).toBe(320_000)
  })

  it('falls back to Blockchair when blockchain.info rate-limits (429)', async () => {
    server.use(
      http.get(PRIMARY, () => HttpResponse.json({ error: 'rate limit' }, { status: 429 })),
      http.get(FALLBACK, () =>
        HttpResponse.json({
          data: {
            blocks: 800_000,
            transactions_24h: 290_000,
            difficulty: 65_000_000_000_000,
            hashrate_24h: '500000000000000000000', // raw H/s
            market_price_usd: 45000,
            mempool_size: 120_000_000,
            mempool_transactions: 45_000,
            mempool_total_fee_usd: 220_000,
            suggested_transaction_fee_per_byte_sat: 12,
          },
        }),
      ),
    )
    const { result } = renderHook(() => useBitcoinStats(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.n_tx).toBe(290_000)
    expect(result.current.data?.difficulty).toBe(65_000_000_000_000)
  })
})
