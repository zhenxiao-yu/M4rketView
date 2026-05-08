import type { BitcoinStats } from '@/types/coingecko'
import { apiFetch } from '@/lib/fetch'

const URL = 'https://api.blockchair.com/bitcoin/stats'
const SRC = 'Blockchair'

interface BlockchairStats {
  data: {
    blocks: number
    transactions_24h: number
    difficulty: number
    hashrate_24h: string
    market_price_usd: number
    mempool_size: number
    mempool_transactions: number
    mempool_total_fee_usd: number
    suggested_transaction_fee_per_byte_sat: number
  }
}

export async function fetchBitcoinStatsViaBlockchair(): Promise<BitcoinStats> {
  const res = await apiFetch<BlockchairStats>(URL, SRC)
  const d = res.data
  const hashRate = parseFloat(d.hashrate_24h)
  return {
    hash_rate: isFinite(hashRate) ? hashRate / 1e9 : 0, // blockchain.info reports in GH/s; blockchair gives raw H/s
    difficulty: d.difficulty,
    n_tx: d.transactions_24h,
    miners_revenue_btc: 0,
    miners_revenue_usd: 0,
    blocks_size: 0,
    total_fees_btc: 0,
    n_btc_mined: 0,
    timestamp: Math.floor(Date.now() / 1000),
  }
}
