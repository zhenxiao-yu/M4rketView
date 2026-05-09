import { memo, useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Star, StarOff, TrendingUp, TrendingDown, GitCompare, Wifi } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useCryptoMarkets } from '@/hooks/useCryptoMarkets'
import { useLivePrices } from '@/hooks/useLivePrices'
import { useMarketStore } from '@/store/marketStore'
import { useWatchlistStore } from '@/store/watchlistStore'
import { useUIStore } from '@/store/uiStore'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { deriveDataStatus } from '@/lib/dataStatus'
import ErrorCard from '@/components/ui/ErrorCard'
import DataStatusBadge from '@/components/ui/DataStatusBadge'
import Disclaimer from '@/components/ui/Disclaimer'
import { Skeleton } from '@/components/ui/Skeleton'
import { staggerContainer, staggerChild } from '@/lib/motion'
import Pagination from './Pagination'
import type { CoinMarket } from '@/types/coingecko'

const CardSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface/30 border border-border/20">
        <div className="flex flex-col gap-1.5 shrink-0">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-4 h-4" />
        </div>
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
  </>
)

const TableSkeleton = () => (
  <>
    {Array.from({ length: 10 }).map((_, i) => (
      <tr key={i} className="border-b border-border">
        {Array.from({ length: 8 }).map((__, j) => (
          <td key={j} className="py-4 px-2">
            <Skeleton className="h-4 w-full" />
          </td>
        ))}
      </tr>
    ))}
  </>
)

const PctBadge = ({ value }: { value: number | undefined }) => {
  if (value == null) return <span className="text-muted">—</span>
  const pos = value >= 0
  return (
    <span className={`flex items-center justify-center gap-0.5 ${pos ? 'text-success' : 'text-danger'}`}>
      {pos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {formatPercent(value)}
    </span>
  )
}

const PriceCell = memo(function PriceCell({ coinId, basePrice, currency, livePrice }: {
  coinId: string
  basePrice: number
  currency: string
  livePrice?: number
}) {
  const price = livePrice ?? basePrice
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const prevRef = useRef(price)

  useEffect(() => {
    if (prevRef.current === price) return
    setFlash(price > prevRef.current ? 'up' : 'down')
    prevRef.current = price
    const t = setTimeout(() => setFlash(null), 800)
    return () => clearTimeout(t)
  }, [price])

  return (
    <motion.span
      key={`${coinId}-${price}`}
      className={`font-mono transition-colors duration-300 ${
        flash === 'up' ? 'text-success' : flash === 'down' ? 'text-danger' : ''
      }`}
      animate={flash ? { scale: [1, 1.06, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {formatCurrency(price, currency)}
    </motion.span>
  )
})

const SaveBtn = memo(function SaveBtn({ coin }: { coin: CoinMarket }) {
  const { toggleCoin, isWatched } = useWatchlistStore()
  const saved = isWatched(coin.id)

  const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const willAdd = !saved
    toggleCoin(coin.id)
    toast(willAdd ? `${coin.name} added to watchlist` : `${coin.name} removed from watchlist`, {
      icon: willAdd ? '⭐' : '🗑',
    })
  }

  return (
    <button
      className="flex-shrink-0 text-muted hover:text-accent transition-all hover:scale-110"
      onClick={handleToggle}
      aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {saved ? <Star size={16} className="fill-accent text-accent" /> : <StarOff size={16} />}
    </button>
  )
})

const CompareBtn = memo(function CompareBtn({ coin }: { coin: CoinMarket }) {
  const { compareCoins, addToCompare, removeFromCompare } = useUIStore()
  const inCompare = compareCoins.includes(coin.id)
  const disabled = compareCoins.length >= 3 && !inCompare

  return (
    <button
      className={`text-muted transition-all hover:scale-110 ${inCompare ? 'text-accent' : ''} ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:text-accent'}`}
      onClick={(e) => {
        e.preventDefault()
        if (inCompare) removeFromCompare(coin.id); else addToCompare(coin.id)
      }}
      disabled={disabled}
      title={inCompare ? 'Remove from compare' : 'Add to compare'}
      aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
    >
      <GitCompare size={14} />
    </button>
  )
})

const MobileCard = memo(function MobileCard({ coin, currency, livePrice }: {
  coin: CoinMarket
  currency: string
  livePrice?: number
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface/30 border border-border/20 hover:border-accent/40 transition-colors">
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <SaveBtn coin={coin} />
        <CompareBtn coin={coin} />
      </div>
      <Link to={`/coin/${coin.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full shrink-0" loading="lazy" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate group-hover:text-accent transition-colors">{coin.name}</p>
          <p className="text-xs text-muted uppercase mt-0.5">{coin.symbol}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-mono font-semibold">
            <PriceCell coinId={coin.id} basePrice={coin.current_price} currency={currency} livePrice={livePrice} />
          </div>
          <PctBadge value={coin.price_change_percentage_24h_in_currency} />
        </div>
      </Link>
    </div>
  )
})

const CryptoTable = () => {
  const { currency } = useMarketStore()
  const { data, isLoading, isError, error, dataUpdatedAt } = useCryptoMarkets()
  const { prices, connected } = useLivePrices()
  const dataStatus = deriveDataStatus({ isLoading, isError, error, dataUpdatedAt })

  return (
    <>
      <div className="flex flex-col mt-9 border border-border rounded-lg overflow-hidden">
        {error ? (
          <ErrorCard error={error as Error} minHeight="min-h-[50vh]" />
        ) : (
          <>
            {/* Mobile card list — shown below md breakpoint */}
            <div className="md:hidden flex flex-col gap-2 p-3">
              {isLoading ? (
                <CardSkeleton />
              ) : (
                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-2">
                  {data?.map((coin) => (
                    <motion.div key={coin.id} variants={staggerChild}>
                      <MobileCard coin={coin} currency={currency} livePrice={prices[coin.id]} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Desktop table — shown at md+ */}
            <Tooltip.Provider delayDuration={300}>
            <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto min-w-[640px]">
              <thead className="capitalize text-sm text-muted font-medium border-b border-border bg-surface/30">
                <tr>
                  <th className="py-3 px-2 text-left">Asset</th>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">
                    Price
                    {connected && (
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Wifi size={11} className="inline ml-1 text-success animate-pulse cursor-help" />
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content className="bg-surface border border-border/20 text-xs px-2.5 py-1.5 rounded-lg shadow-lg z-50" sideOffset={5}>
                            Real-time via Binance WebSocket
                            <Tooltip.Arrow className="fill-surface" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    )}
                  </th>
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
                      className="text-center text-sm border-b border-border hover:bg-surface/50 last:border-b-0 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1.5">
                          <SaveBtn coin={coin} />
                          <CompareBtn coin={coin} />
                          <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" loading="lazy" />
                          <Link
                            to={`/coin/${coin.id}`}
                            className="uppercase font-semibold hover:text-accent transition-colors"
                          >
                            {coin.symbol}
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Link to={`/coin/${coin.id}`} className="hover:text-accent transition-colors">
                          {coin.name}
                        </Link>
                      </td>
                      <td className="py-3 px-2">
                        <PriceCell
                          coinId={coin.id}
                          basePrice={coin.current_price}
                          currency={currency}
                          livePrice={prices[coin.id]}
                        />
                      </td>
                      <td className="py-3 px-2 hidden md:table-cell text-muted">
                        {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(coin.total_volume)}
                      </td>
                      <td className={`py-3 px-2 hidden md:table-cell ${coin.market_cap_change_percentage_24h >= 0 ? 'text-success' : 'text-danger'}`}>
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
            </div>
            </Tooltip.Provider>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between mt-4 gap-y-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">
            Data by{' '}
            <a href="https://www.coingecko.com" className="text-accent hover:underline" target="_blank" rel="noreferrer">
              CoinGecko
            </a>
          </span>
          <DataStatusBadge status={dataStatus} dataUpdatedAt={dataUpdatedAt} source="CoinGecko" />
        </div>
        <Pagination />
      </div>
      <Disclaimer className="mt-3" />
    </>
  )
}

export default CryptoTable
