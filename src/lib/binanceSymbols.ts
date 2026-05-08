/**
 * Mapping between Binance trading pairs and CoinGecko ids for the top ~20 coins.
 * Used by:
 *   - useLivePrices.ts (live WebSocket prices)
 *   - api/binanceRest.ts (chart fallback when CoinGecko 429s)
 * Coins outside this list will not have a chart fallback — that's an acceptable
 * trade-off vs. maintaining a much larger lookup table.
 */
export const BINANCE_TO_COINGECKO: Record<string, string> = {
  BTCUSDT: 'bitcoin',
  ETHUSDT: 'ethereum',
  BNBUSDT: 'binancecoin',
  SOLUSDT: 'solana',
  XRPUSDT: 'ripple',
  ADAUSDT: 'cardano',
  DOGEUSDT: 'dogecoin',
  AVAXUSDT: 'avalanche-2',
  DOTUSDT: 'polkadot',
  MATICUSDT: 'matic-network',
  LINKUSDT: 'chainlink',
  UNIUSDT: 'uniswap',
  ATOMUSDT: 'cosmos',
  LTCUSDT: 'litecoin',
  ETCUSDT: 'ethereum-classic',
  XLMUSDT: 'stellar',
  ALGOUSDT: 'algorand',
  VETUSDT: 'vechain',
  TRXUSDT: 'tron',
  NEARUSDT: 'near',
}

export const COINGECKO_TO_BINANCE: Record<string, string> = Object.fromEntries(
  Object.entries(BINANCE_TO_COINGECKO).map(([sym, id]) => [id, sym]),
)
