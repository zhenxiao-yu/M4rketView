import type { MarketChartData } from '@/types/coingecko'
import { apiFetch } from '@/lib/fetch'
import { COINGECKO_TO_BINANCE } from '@/lib/binanceSymbols'

const BASE = 'https://api.binance.com/api/v3'
const SRC = 'Binance'

/** Binance kline tuple: [openTime, open, high, low, close, volume, closeTime, quoteAssetVolume, ...]. */
type BinanceKline = [number, string, string, string, string, string, number, ...unknown[]]

function intervalFor(days: number): { interval: string; limit: number } {
  if (days <= 1)   return { interval: '15m', limit: 96 }   // 96 × 15m = 24h
  if (days <= 7)   return { interval: '1h',  limit: 24 * 7 }
  if (days <= 30)  return { interval: '4h',  limit: 6 * 30 }
  if (days <= 90)  return { interval: '1d',  limit: 90 }
  if (days <= 365) return { interval: '1d',  limit: 365 }
  return { interval: '1w', limit: 200 }
}

/**
 * Binance `/klines` → CoinGecko `MarketChartData` shape.
 * Only works for coins in our COINGECKO_TO_BINANCE map. Anything else throws so the
 * caller knows there's no fallback price history available for that coin.
 */
export async function fetchMarketChartViaBinance(
  id: string,
  _currency: string,
  days: number,
): Promise<MarketChartData> {
  const symbol = COINGECKO_TO_BINANCE[id]
  if (!symbol) throw new Error(`Binance: no symbol mapping for "${id}"`)

  const { interval, limit } = intervalFor(days)
  const url = `${BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  const klines = await apiFetch<BinanceKline[]>(url, SRC)

  const prices: [number, number][] = []
  const market_caps: [number, number][] = []
  const total_volumes: [number, number][] = []

  for (const k of klines) {
    const t = k[0]
    const close = parseFloat(k[4])
    const volume = parseFloat(k[5])
    if (!isFinite(close)) continue
    prices.push([t, close])
    total_volumes.push([t, isFinite(volume) ? volume : 0])
    // Binance has no market-cap data; chart fallback only populates prices+volumes.
  }

  return { prices, market_caps, total_volumes }
}
