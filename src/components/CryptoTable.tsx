import { Link } from 'react-router-dom'
import { Star, StarOff, TrendingUp, TrendingDown, GitCompare } from 'lucide-react'
import { useCryptoMarkets } from '@/hooks/useCryptoMarkets'
import { useMarketStore } from '@/store/marketStore'
import { useWatchlistStore } from '@/store/watchlistStore'
import { useUIStore } from '@/store/uiStore'
import { formatCurrency, formatPercent } from '@/lib/utils'
import Pagination from './Pagination'
import type { CoinMarket } from '@/types/coingecko'

const TableSkeleton = () => (
  <>
    {Array.from({ length: 10 }).map((_, i) => (
      <tr key={i} className="border-b border-gray-100 animate-pulse">
        {Array.from({ length: 8 }).map((__, j) => (
          <td key={j} className="py-4 px-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
          </td>
        ))}
      </tr>
    ))}
  </>
)

const PctBadge = ({ value }: { value: number | undefined }) => {
  if (value == null) return <span className="text-gray-100">—</span>
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
      className="flex-shrink-0 text-gray-100 hover:text-cyan transition-all hover:scale-110"
      onClick={(e) => { e.preventDefault(); toggleCoin(coin.id) }}
      aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {saved ? <Star size={16} className="fill-cyan text-cyan" /> : <StarOff size={16} />}
    </button>
  )
}

const CompareBtn = ({ coin }: { coin: CoinMarket }) => {
  const { compareCoins, addToCompare, removeFromCompare } = useUIStore()
  const inCompare = compareCoins.includes(coin.id)
  const disabled = compareCoins.length >= 3 && !inCompare

  return (
    <button
      className={`text-gray-100 transition-all hover:scale-110 ${inCompare ? 'text-cyan' : ''} ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:text-cyan'}`}
      onClick={(e) => {
        e.preventDefault()
        inCompare ? removeFromCompare(coin.id) : addToCompare(coin.id)
      }}
      disabled={disabled}
      title={inCompare ? 'Remove from compare' : 'Add to compare'}
    >
      <GitCompare size={14} />
    </button>
  )
}

const CryptoTable = () => {
  const { currency } = useMarketStore()
  const { data, isLoading, error } = useCryptoMarkets()

  return (
    <>
      <div className="flex flex-col mt-9 border border-gray-100 rounded-lg overflow-hidden">
        {error ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <p className="text-red text-lg">{error.message || 'Failed to load data'}</p>
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead className="capitalize text-sm text-gray-100 font-medium border-b border-gray-100 bg-gray-200/30">
              <tr>
                <th className="py-3 px-2 text-left">Asset</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2 hidden md:table-cell">Volume</th>
                <th className="py-3 px-2 hidden md:table-cell">MktCap Δ</th>
                <th className="py-3 px-2 hidden lg:table-cell">1H</th>
                <th className="py-3 px-2 hidden lg:table-cell">24H</th>
                <th className="py-3 px-2 hidden lg:table-cell">7D</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton />
              ) : (
                data?.map((coin) => (
                  <tr
                    key={coin.id}
                    className="text-center text-sm border-b border-gray-100 hover:bg-gray-200/50 last:border-b-0 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <SaveBtn coin={coin} />
                        <CompareBtn coin={coin} />
                        <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                        <Link
                          to={`/coin/${coin.id}`}
                          className="uppercase font-semibold hover:text-cyan transition-colors"
                        >
                          {coin.symbol}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Link to={`/coin/${coin.id}`} className="hover:text-cyan transition-colors">
                        {coin.name}
                      </Link>
                    </td>
                    <td className="py-3 px-2 font-mono">
                      {formatCurrency(coin.current_price, currency)}
                    </td>
                    <td className="py-3 px-2 hidden md:table-cell text-gray-100">
                      {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(coin.total_volume)}
                    </td>
                    <td className={`py-3 px-2 hidden md:table-cell ${coin.market_cap_change_percentage_24h >= 0 ? 'text-green' : 'text-red'}`}>
                      {formatPercent(coin.market_cap_change_percentage_24h)}
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <PctBadge value={coin.price_change_percentage_1h_in_currency} />
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <PctBadge value={coin.price_change_percentage_24h_in_currency} />
                    </td>
                    <td className="py-3 px-2 hidden lg:table-cell">
                      <PctBadge value={coin.price_change_percentage_7d_in_currency} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 h-8">
        <span className="text-sm text-gray-100">
          Data by{' '}
          <a href="https://www.coingecko.com" className="text-cyan hover:underline" target="_blank" rel="noreferrer">
            CoinGecko
          </a>
        </span>
        <Pagination />
      </div>
    </>
  )
}

export default CryptoTable
