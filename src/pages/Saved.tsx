import { Link } from 'react-router-dom'
import { Star, StarOff, RefreshCw, Download, TrendingUp, TrendingDown } from 'lucide-react'
import { useWatchlistStore } from '@/store/watchlistStore'
import { useMarketStore } from '@/store/marketStore'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { exportWatchlistCSV } from '@/lib/export'
import { useQuery } from '@tanstack/react-query'
import { fetchCryptoMarkets } from '@/api/coinGecko'
import type { CoinMarket } from '@/types/coingecko'

const PctCell = ({ value }: { value: number }) => {
  const pos = value >= 0
  return (
    <span className={`flex items-center justify-center gap-0.5 ${pos ? 'text-green' : 'text-red'}`}>
      {pos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {formatPercent(value)}
    </span>
  )
}

const SaveBtn = ({ coin }: { coin: CoinMarket }) => {
  const { toggleCoin, isWatched } = useWatchlistStore()
  const saved = isWatched(coin.id)
  return (
    <button
      onClick={() => toggleCoin(coin.id)}
      className="text-gray-100 hover:text-cyan transition-colors"
      aria-label="Remove from watchlist"
    >
      {saved ? <Star size={16} className="fill-cyan text-cyan" /> : <StarOff size={16} />}
    </button>
  )
}

const Saved = () => {
  const { coinIds } = useWatchlistStore()
  const { currency, sortBy } = useMarketStore()

  const { data: savedData, isLoading, refetch } = useQuery({
    queryKey: ['saved-coins', coinIds, currency, sortBy],
    queryFn: () =>
      fetchCryptoMarkets({
        currency,
        sortBy,
        page: 1,
        perPage: 250,
        ids: coinIds.join(','),
      }),
    enabled: coinIds.length > 0,
    staleTime: 60 * 1000,
  })

  if (coinIds.length === 0) {
    return (
      <section className="w-full mt-8 mb-24">
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 border border-gray-100 rounded-xl">
          <Star size={48} className="text-gray-100" />
          <p className="text-lg text-gray-100">No saved coins yet.</p>
          <p className="text-sm text-gray-100">Star coins from the Crypto page to add them here.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full mt-8 mb-24 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Watchlist ({coinIds.length})</h2>
        <div className="flex gap-2">
          {savedData && (
            <button
              onClick={() => exportWatchlistCSV(savedData, currency)}
              className="flex items-center gap-1.5 text-sm text-gray-100 hover:text-cyan transition-colors"
            >
              <Download size={16} /> Export CSV
            </button>
          )}
          <button onClick={() => refetch()} className="text-cyan hover:scale-110 transition-transform">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-cyan rounded-full border-b-transparent animate-spin" />
          </div>
        ) : savedData && savedData.length > 0 ? (
          <table className="w-full table-auto">
            <thead className="text-sm text-gray-100 font-medium border-b border-gray-100 bg-gray-200/30">
              <tr>
                <th className="py-3 px-3 text-left">Asset</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3 hidden md:table-cell">Volume</th>
                <th className="py-3 px-3">24H Δ</th>
                <th className="py-3 px-3 hidden lg:table-cell">1H</th>
                <th className="py-3 px-3 hidden lg:table-cell">7D</th>
              </tr>
            </thead>
            <tbody>
              {savedData.map((coin) => (
                <tr key={coin.id} className="text-center text-sm border-b border-gray-100 hover:bg-gray-200/50 last:border-b-0 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <SaveBtn coin={coin} />
                      <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                      <Link to={`/coin/${coin.id}`} className="uppercase font-semibold hover:text-cyan transition-colors">
                        {coin.symbol}
                      </Link>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <Link to={`/coin/${coin.id}`} className="hover:text-cyan transition-colors">{coin.name}</Link>
                  </td>
                  <td className="py-3 px-3 font-mono">{formatCurrency(coin.current_price, currency)}</td>
                  <td className="py-3 px-3 hidden md:table-cell text-gray-100">
                    {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(coin.total_volume)}
                  </td>
                  <td className="py-3 px-3"><PctCell value={coin.price_change_percentage_24h_in_currency} /></td>
                  <td className="py-3 px-3 hidden lg:table-cell"><PctCell value={coin.price_change_percentage_1h_in_currency} /></td>
                  <td className="py-3 px-3 hidden lg:table-cell"><PctCell value={coin.price_change_percentage_7d_in_currency} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="min-h-[40vh] flex items-center justify-center">
            <p className="text-gray-100">No data available</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Saved
