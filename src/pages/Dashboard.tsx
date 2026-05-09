import { type ReactNode } from 'react'
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
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { staggerContainer, staggerChild, fadeInUp } from '@/lib/motion'

const MetricSkeleton = () => (
  <Card className="flex flex-col gap-3">
    <div className="flex justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-4 rounded" />
    </div>
    <Skeleton className="h-7 w-32" />
    <Skeleton className="h-3 w-20" />
  </Card>
)

const MetricCard = ({
  title, value, sub, icon, trend,
}: {
  title: string
  value: string
  sub?: string
  icon: ReactNode
  trend?: number
}) => (
  <motion.div variants={staggerChild} className="h-full">
    <Card className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted capitalize">{title}</span>
        <span className="text-accent">{icon}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
      {sub && <span className="text-xs text-muted">{sub}</span>}
      {trend != null && (
        <span className={`text-sm font-medium flex items-center gap-1 ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
          {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {formatPercent(trend)} (24h)
        </span>
      )}
    </Card>
  </motion.div>
)

const FearGreedGauge = ({ value, label }: { value: number; label: string }) => {
  const color =
    value <= 25 ? '#E5484D' : value <= 45 ? '#F08C3D' : value <= 55 ? '#E0A93B' : value <= 75 ? '#7BC369' : '#3FB57E'
  return (
    <motion.div variants={staggerChild} className="h-full">
      <Card className="flex flex-col gap-2 h-full">
        <span className="text-sm text-muted">Fear & Greed Index</span>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-lg font-bold shrink-0"
            style={{ borderColor: color, color }}
          >
            {value}
          </div>
          <div>
            <p className="text-base font-semibold" style={{ color }}>{label}</p>
            <p className="text-xs text-muted mt-1">Market sentiment</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const MoverCard = ({ coin }: { coin: CoinMarket }) => {
  const pct = coin.price_change_percentage_24h
  const isUp = pct >= 0
  return (
    <Link
      to={`/coin/${coin.id}`}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/10 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" loading="lazy" />
      <span className="text-sm font-medium flex-1 truncate group-hover:text-accent transition-colors">{coin.name}</span>
      <span className={`text-xs font-semibold ${isUp ? 'text-success' : 'text-danger'}`}>
        {formatPercent(pct)}
      </span>
    </Link>
  )
}

const MoversSkeleton = () => (
  <Card>
    <Skeleton className="h-4 w-32 mb-4" />
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-2 p-2 mb-1">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="flex-1 h-3" />
        <Skeleton className="w-12 h-3" />
      </div>
    ))}
  </Card>
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

      {/* Metric cards */}
      {globalLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <MetricCard title="Total Market Cap" value={totalMarketCap} icon={<DollarSign size={18} />} trend={marketTrend} />
          <MetricCard title="BTC Dominance"    value={btcDominance}  icon={<Activity size={18} />}   sub="Bitcoin market share" />
          <MetricCard title="24H Volume"       value={volume24h}     icon={<TrendingUp size={18} />} sub="Total trading volume" />
          {fgData ? (
            <FearGreedGauge value={parseInt(fgData.value)} label={fgData.value_classification} />
          ) : (
            <MetricCard title="Fear & Greed" value="—" icon={<Activity size={18} />} />
          )}
        </motion.div>
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
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card>
                <h3 className="text-sm font-semibold text-success mb-3 flex items-center gap-1">
                  <TrendingUp size={14} /> Top Gainers (24H)
                </h3>
                {gainers.map((c) => <MoverCard key={c.id} coin={c} />)}
              </Card>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.05 }}
            >
              <Card>
                <h3 className="text-sm font-semibold text-danger mb-3 flex items-center gap-1">
                  <TrendingDown size={14} /> Top Losers (24H)
                </h3>
                {losers.map((c) => <MoverCard key={c.id} coin={c} />)}
              </Card>
            </motion.div>
          </>
        )}
      </div>

      {markets && <MarketHeatmap coins={markets} />}

      <BitcoinStats />
      <DeFiTVL />

      <div className="flex justify-center">
        <Button asChild size="lg">
          <Link to="/markets">View All Markets →</Link>
        </Button>
      </div>
    </section>
  )
}

export default Dashboard
