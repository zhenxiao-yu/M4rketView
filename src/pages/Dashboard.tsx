import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'
import { useGlobalData } from '@/hooks/useGlobalData'
import { useFearGreed } from '@/hooks/useFearGreed'
import { useCryptoMarkets } from '@/hooks/useCryptoMarkets'
import { formatCompact, formatPercent } from '@/lib/utils'
import type { CoinMarket } from '@/types/coingecko'
import BitcoinStats from '@/components/dashboard/BitcoinStats'
import DeFiTVL from '@/components/dashboard/DeFiTVL'
import MarketHeatmap from '@/components/MarketHeatmap'

const card = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, delay } },
})

const MetricSkeleton = () => (
  <div className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20 animate-pulse flex flex-col gap-3">
    <div className="flex justify-between">
      <div className="h-3 bg-gray-100/20 rounded w-24" />
      <div className="h-4 w-4 bg-gray-100/20 rounded" />
    </div>
    <div className="h-7 bg-gray-100/20 rounded w-32" />
    <div className="h-3 bg-gray-100/20 rounded w-20" />
  </div>
)

const MetricCard = ({
  title, value, sub, icon, trend, delay = 0,
}: {
  title: string
  value: string
  sub?: string
  icon: React.ReactNode
  trend?: number
  delay?: number
}) => (
  <motion.div {...card(delay)} className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-100 capitalize">{title}</span>
      <span className="text-cyan">{icon}</span>
    </div>
    <span className="text-2xl font-bold">{value}</span>
    {sub && <span className="text-xs text-gray-100">{sub}</span>}
    {trend != null && (
      <span className={`text-sm font-medium flex items-center gap-1 ${trend >= 0 ? 'text-green' : 'text-red'}`}>
        {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {formatPercent(trend)} (24h)
      </span>
    )}
  </motion.div>
)

const FearGreedGauge = ({ value, label, delay = 0 }: { value: number; label: string; delay?: number }) => {
  const color =
    value <= 25 ? '#e72179' : value <= 45 ? '#f97316' : value <= 55 ? '#eab308' : value <= 75 ? '#84cc16' : '#1ec471'
  return (
    <motion.div {...card(delay)} className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20 flex flex-col gap-2">
      <span className="text-sm text-gray-100">Fear & Greed Index</span>
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-lg font-bold shrink-0"
          style={{ borderColor: color, color }}
        >
          {value}
        </div>
        <div>
          <p className="text-base font-semibold" style={{ color }}>{label}</p>
          <p className="text-xs text-gray-100 mt-1">Market sentiment</p>
        </div>
      </div>
    </motion.div>
  )
}

const MoverCard = ({ coin }: { coin: CoinMarket }) => {
  const pct = coin.price_change_percentage_24h
  const isUp = pct >= 0
  return (
    <Link
      to={`/coin/${coin.id}`}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100/10 transition-colors group"
    >
      <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" loading="lazy" />
      <span className="text-sm font-medium flex-1 truncate group-hover:text-cyan transition-colors">{coin.name}</span>
      <span className={`text-xs font-semibold ${isUp ? 'text-green' : 'text-red'}`}>
        {formatPercent(pct)}
      </span>
    </Link>
  )
}

const MoversSkeleton = () => (
  <div className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20 animate-pulse">
    <div className="h-4 bg-gray-100/20 rounded w-32 mb-4" />
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-2 p-2 mb-1">
        <div className="w-6 h-6 bg-gray-100/20 rounded-full" />
        <div className="flex-1 h-3 bg-gray-100/20 rounded" />
        <div className="w-12 h-3 bg-gray-100/20 rounded" />
      </div>
    ))}
  </div>
)

const Dashboard = () => {
  const { data: globalData, isLoading: globalLoading } = useGlobalData()
  const { data: fgData } = useFearGreed()
  const { data: markets, isLoading: marketsLoading } = useCryptoMarkets()

  const gd = globalData?.data
  const totalMarketCap = gd ? formatCompact(gd.total_market_cap['usd'] ?? 0) : '—'
  const btcDominance = gd ? `${gd.market_cap_percentage['btc']?.toFixed(1)}%` : '—'
  const volume24h = gd ? formatCompact(gd.total_volume['usd'] ?? 0) : '—'
  const marketTrend = gd?.market_cap_change_percentage_24h_usd

  const gainers = markets ? [...markets].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 5) : []
  const losers = markets ? [...markets].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 5) : []

  return (
    <section className="w-full mt-8 mb-24">
      <h1 className="text-xl font-bold mb-6">Market Overview</h1>

      {/* Metric Cards */}
      {globalLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard delay={0}    title="Total Market Cap" value={totalMarketCap} icon={<DollarSign size={18} />} trend={marketTrend} />
          <MetricCard delay={0.07} title="BTC Dominance"    value={btcDominance}  icon={<Activity size={18} />}   sub="Bitcoin market share" />
          <MetricCard delay={0.14} title="24H Volume"       value={volume24h}     icon={<TrendingUp size={18} />} sub="Total trading volume" />
          {fgData ? (
            <FearGreedGauge delay={0.21} value={parseInt(fgData.value)} label={fgData.value_classification} />
          ) : (
            <MetricCard delay={0.21} title="Fear & Greed" value="—" icon={<Activity size={18} />} />
          )}
        </div>
      )}

      {/* Gainers / Losers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {marketsLoading ? (
          <>
            <MoversSkeleton />
            <MoversSkeleton />
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1 } }}
              className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20"
            >
              <h3 className="text-sm font-semibold text-green mb-3 flex items-center gap-1">
                <TrendingUp size={14} /> Top Gainers (24H)
              </h3>
              {gainers.map((c) => <MoverCard key={c.id} coin={c} />)}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.15 } }}
              className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20"
            >
              <h3 className="text-sm font-semibold text-red mb-3 flex items-center gap-1">
                <TrendingDown size={14} /> Top Losers (24H)
              </h3>
              {losers.map((c) => <MoverCard key={c.id} coin={c} />)}
            </motion.div>
          </>
        )}
      </div>

      {markets && <MarketHeatmap coins={markets} />}

      <BitcoinStats />
      <DeFiTVL />

      <div className="flex justify-center">
        <Link
          to="/markets"
          className="px-6 py-2.5 bg-cyan text-gray-300 rounded-lg font-semibold hover:bg-cyan/80 transition-colors text-sm"
        >
          View All Markets →
        </Link>
      </div>
    </section>
  )
}

export default Dashboard
