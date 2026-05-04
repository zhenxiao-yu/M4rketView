import type { CoinMarket } from '@/types/coingecko'

export function exportWatchlistCSV(coins: CoinMarket[], currency: string) {
  const headers = ['Symbol', 'Name', 'Price', '24h Change %', '7d Change %', 'Market Cap', 'Volume']
  const rows = coins.map((c) => [
    c.symbol.toUpperCase(),
    c.name,
    c.current_price,
    c.price_change_percentage_24h?.toFixed(2) ?? '',
    c.price_change_percentage_7d_in_currency?.toFixed(2) ?? '',
    c.market_cap,
    c.total_volume,
  ])
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `m4rketview-watchlist-${currency}-${Date.now()}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
