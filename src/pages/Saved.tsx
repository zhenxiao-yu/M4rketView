import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, StarOff, RefreshCw, Download, TrendingUp, TrendingDown } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useWatchlistStore } from '@/store/watchlistStore'
import { useMarketStore } from '@/store/marketStore'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { exportWatchlistCSV } from '@/lib/export'
import { useQuery } from '@tanstack/react-query'
import { fetchCryptoMarkets } from '@/api/coinGecko'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { staggerContainer, staggerChild } from '@/lib/motion'
import { STALE_1MIN } from '@/lib/queryTimings'
import type { CoinMarket } from '@/types/coingecko'

const PctCell = ({ value }: { value: number | undefined }) => {
  if (value == null) return <span className="text-muted">—</span>
  const pos = value >= 0
  return (
    <span className={`inline-flex items-center justify-center gap-0.5 ${pos ? 'text-success' : 'text-danger'}`}>
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
      className="text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded"
      aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {saved ? <Star size={16} className="fill-accent text-accent" /> : <StarOff size={16} />}
    </button>
  )
}

const MobileSkeleton = () => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface/30 border border-border/20">
        <Skeleton className="w-4 h-4 shrink-0" />
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-2.5 w-12" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-20 ml-auto" />
          <Skeleton className="h-2.5 w-12 ml-auto" />
        </div>
      </div>
    ))}
  </div>
)

const TableSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <tr key={i} className="border-b border-border">
        {Array.from({ length: 7 }).map((__, j) => (
          <td key={j} className="py-4 px-3">
            <Skeleton className="h-4 w-full" />
          </td>
        ))}
      </tr>
    ))}
  </>
)

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
    staleTime: STALE_1MIN,
  })

  if (coinIds.length === 0) {
    return (
      <section className="w-full mt-8 mb-24">
        <Card tone="muted" className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
          <Star size={48} className="text-muted" />
          <p className="text-lg font-semibold">No saved coins yet</p>
          <p className="text-sm text-muted max-w-xs">
            Star coins from the Markets page to track them here.
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-2">
            <Link to="/markets">Browse markets</Link>
          </Button>
        </Card>
      </section>
    )
  }

  return (
    <section className="w-full mt-8 mb-24">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h1 className="text-lg font-semibold">Watchlist <span className="text-muted font-normal">({coinIds.length})</span></h1>
        <div className="flex gap-2 items-center">
          {savedData && savedData.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { exportWatchlistCSV(savedData, currency); toast.success('Exported to CSV') }}
            >
              <Download size={16} /> <span className="hidden sm:inline">Export CSV</span>
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={() => refetch()} aria-label="Refresh watchlist" className="text-accent">
            <RefreshCw size={18} />
          </Button>
        </div>
      </div>

      {/* Mobile card list — below md */}
      <div className="md:hidden">
        {isLoading ? (
          <MobileSkeleton />
        ) : savedData && savedData.length > 0 ? (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-2">
            {savedData.map((coin) => (
              <motion.div key={coin.id} variants={staggerChild}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface/30 border border-border/20 hover:border-accent/40 transition-colors">
                  <SaveBtn coin={coin} />
                  <Link to={`/coin/${coin.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
                    <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full shrink-0" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate group-hover:text-accent transition-colors">{coin.name}</p>
                      <p className="text-xs text-muted uppercase mt-0.5">{coin.symbol}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-mono font-semibold">
                        {formatCurrency(coin.current_price, currency)}
                      </div>
                      <PctCell value={coin.price_change_percentage_24h_in_currency} />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card tone="muted" className="min-h-[40vh] flex items-center justify-center">
            <p className="text-muted text-sm">No data available</p>
          </Card>
        )}
      </div>

      {/* Desktop table — md+ */}
      <div className="hidden md:block border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <table className="w-full table-auto">
            <tbody>
              <TableSkeleton />
            </tbody>
          </table>
        ) : savedData && savedData.length > 0 ? (
          <table className="w-full table-auto">
            <thead className="text-sm text-muted font-medium border-b border-border bg-surface/30">
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
            <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
              {savedData.map((coin) => (
                <motion.tr variants={staggerChild} key={coin.id} className="text-center text-sm border-b border-border hover:bg-surface/50 last:border-b-0 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <SaveBtn coin={coin} />
                      <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" loading="lazy" />
                      <Link to={`/coin/${coin.id}`} className="uppercase font-semibold hover:text-accent transition-colors">
                        {coin.symbol}
                      </Link>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <Link to={`/coin/${coin.id}`} className="hover:text-accent transition-colors">{coin.name}</Link>
                  </td>
                  <td className="py-3 px-3 font-mono">{formatCurrency(coin.current_price, currency)}</td>
                  <td className="py-3 px-3 hidden md:table-cell text-muted">
                    {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(coin.total_volume)}
                  </td>
                  <td className="py-3 px-3"><PctCell value={coin.price_change_percentage_24h_in_currency} /></td>
                  <td className="py-3 px-3 hidden lg:table-cell"><PctCell value={coin.price_change_percentage_1h_in_currency} /></td>
                  <td className="py-3 px-3 hidden lg:table-cell"><PctCell value={coin.price_change_percentage_7d_in_currency} /></td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        ) : (
          <div className="min-h-[40vh] flex items-center justify-center">
            <p className="text-muted text-sm">No data available</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Saved
