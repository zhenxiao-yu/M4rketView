import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'
import { useGlobalData } from '@/hooks/useGlobalData'
import { useFearGreed } from '@/hooks/useFearGreed'
import { useCryptoMarkets } from '@/hooks/useCryptoMarkets'
import { formatCompact, formatPercent } from '@/lib/utils'
import type { CoinMarket } from '@/types/coingecko'
import BitcoinStats from '@/components/dashboard/BitcoinStats'
import DeFiTVL from '@/components/dashboard/DeFiTVL'
import MarketHeatmap from '@/components/MarketHeatmap'

const MetricCard = ({
  title, value, sub, icon, trend,
}: {
  title: string
  value: string
  sub?: string
  icon: React.ReactNode
  trend?: number
}) => (
  <div className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20 flex flex-col gap-2">
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
  </div>
)

const FearGreedGauge = ({ value, label }: { value: number; label: string }) => {
  const color =
    value <= 25 ? '#e72179' : value <= 45 ? '#f97316' : value <= 55 ? '#eab308' : value <= 75 ? '#84cc16' : '#1ec471'
  return (
    <div className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20 flex flex-col gap-2">
      <span className="text-sm text-gray-100">Fear & Greed Index</span>
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-lg font-bold"
          style={{ borderColor: color, color }}
        >
          {value}
        </div>
        <div>
          <p className="text-base font-semibold" style={{ color }}>{label}</p>
          <p className="text-xs text-gray-100 mt-1">Market sentiment</p>
        </div>
      </div>
    </div>
  )
}

const MoverCard = ({ coin, currency }: { coin: CoinMarket; currency: string }) => {
  const pct = coin.price_change_percentage_24h
  const isUp = pct >= 0
  return (
    <Link
      to={`/coin/${coin.id}`}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100/10 transition-colors"
    >
      <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
      <span className="text-sm font-medium flex-1 truncate">{coin.name}</span>
      <span className={`text-xs font-semibold ${isUp ? 'text-green' : 'text-red'}`}>
        {formatPercent(pct)}
      </span>
    </Link>
  )
}

const Dashboard = () => {
  const { data: globalData, isLoading: globalLoading } = useGlobalData()
  const { data: fgData } = useFearGreed()
  const { data: markets } = useCryptoMarkets()

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Market Cap"
          value={globalLoading ? '...' : totalMarketCap}
          icon={<DollarSign size={18} />}
          trend={marketTrend}
        />
        <MetricCard
          title="BTC Dominance"
          value={globalLoading ? '...' : btcDominance}
          sub="Bitcoin market share"
          icon={<Activity size={18} />}
        />
        <MetricCard
          title="24H Volume"
          value={globalLoading ? '...' : volume24h}
          sub="Total trading volume"
          icon={<TrendingUp size={18} />}
        />
        {fgData ? (
          <FearGreedGauge value={parseInt(fgData.value)} label={fgData.value_classification} />
        ) : (
          <MetricCard title="Fear & Greed" value="—" icon={<Activity size={18} />} />
        )}
      </div>

      {markets && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20">
            <h3 className="text-sm font-semibold text-green mb-3 flex items-center gap-1">
              <TrendingUp size={14} /> Top Gainers (24H)
            </h3>
            {gainers.map((c) => <MoverCard key={c.id} coin={c} currency="usd" />)}
          </div>
          <div className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20">
            <h3 className="text-sm font-semibold text-red mb-3 flex items-center gap-1">
              <TrendingDown size={14} /> Top Losers (24H)
            </h3>
            {losers.map((c) => <MoverCard key={c.id} coin={c} currency="usd" />)}
          </div>
        </div>
      )}

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
