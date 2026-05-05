import { Link } from 'react-router-dom'
import { GitCompare, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { useUIStore } from '@/store/uiStore'
import { useCoinDetail } from '@/hooks/useCoinDetail'
import { useCompareCharts } from '@/hooks/useCompareCharts'
import { useMarketStore } from '@/store/marketStore'
import { formatCurrency, formatCompact, formatPercent } from '@/lib/utils'

const COIN_COLORS = ['#B6EADA', '#5B8FB9', '#e72179']

const CoinCard = ({ coinId, color }: { coinId: string; color: string }) => {
  const { removeFromCompare } = useUIStore()
  const { currency } = useMarketStore()
  const { data, isLoading } = useCoinDetail(coinId)

  if (isLoading) {
    return (
      <div className="flex-1 min-w-[200px] bg-gray-200/40 rounded-xl p-4 border border-gray-100/20 animate-pulse">
        <div className="h-16 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
        </div>
      </div>
    )
  }

  if (!data) return null
  const price = data.market_data.current_price[currency] ?? data.market_data.current_price['usd']
  const pct24h = data.market_data.price_change_percentage_24h

  return (
    <div className="flex-1 min-w-[200px] bg-gray-200/40 rounded-xl p-4 border-2" style={{ borderColor: color }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src={data.image.small} alt={data.name} className="w-8 h-8 rounded-full" />
          <div>
            <Link to={`/coin/${data.id}`} className="font-semibold hover:text-cyan transition-colors text-sm">
              {data.name}
            </Link>
            <p className="text-xs text-gray-100 uppercase">{data.symbol}</p>
          </div>
        </div>
        <button onClick={() => removeFromCompare(coinId)} className="text-gray-100 hover:text-red transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-100">Price</span>
          <span className="font-semibold">{formatCurrency(price, currency)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-100">24H</span>
          <span className={pct24h >= 0 ? 'text-green font-semibold' : 'text-red font-semibold'}>
            {formatPercent(pct24h)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-100">Mkt Cap</span>
          <span>{formatCompact(data.market_data.market_cap[currency] ?? 0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-100">Volume</span>
          <span>{formatCompact(data.market_data.total_volume[currency] ?? 0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-100">Rank</span>
          <span>#{data.market_cap_rank}</span>
        </div>
      </div>
    </div>
  )
}

const NormalizedChart = ({ coinIds }: { coinIds: string[] }) => {
  const { currency } = useMarketStore()
  const { data: chartMap, isLoading } = useCompareCharts(coinIds, currency)

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan rounded-full border-b-transparent animate-spin" />
      </div>
    )
  }

  if (!chartMap) return null

  const allPrices = coinIds.map((id) => chartMap[id] ?? [])
  const minLen = Math.min(...allPrices.map((d) => d.length))
  if (minLen === 0) return null

  const chartData = Array.from({ length: minLen }, (_, i) => {
    const point: Record<string, number | string> = {
      date: new Date(allPrices[0][i][0]).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }
    allPrices.forEach((prices, idx) => {
      const base = prices[0][1]
      point[coinIds[idx]] = base > 0 ? ((prices[i][1] - base) / base) * 100 : 0
    })
    return point
  })

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData}>
        <CartesianGrid stroke="#5B8FB9" strokeOpacity={0.15} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5B8FB9' }} tickLine={false} />
        <YAxis
          tickFormatter={(v: number) => isFinite(v) ? `${v.toFixed(0)}%` : ''}
          tick={{ fontSize: 10, fill: '#5B8FB9' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip formatter={(v: number) => [isFinite(v) ? `${v.toFixed(2)}%` : 'N/A']} />
        <Legend />
        {coinIds.map((id, i) => (
          <Line
            key={id}
            type="monotone"
            dataKey={id}
            stroke={COIN_COLORS[i]}
            dot={false}
            strokeWidth={2}
            name={id}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

const Compare = () => {
  const { compareCoins } = useUIStore()

  if (compareCoins.length === 0) {
    return (
      <section className="w-full mt-8 mb-24">
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 border border-gray-100 rounded-xl">
          <GitCompare size={48} className="text-gray-100" />
          <p className="text-lg text-gray-100">No coins selected for comparison.</p>
          <p className="text-sm text-gray-100">
            Click the compare icon on any coin in the market table.
          </p>
          <Link to="/markets" className="text-cyan hover:underline text-sm">
            Go to Markets →
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full mt-8 mb-24">
      <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
        <GitCompare size={20} className="text-cyan" /> Coin Comparison
      </h1>

      <div className="flex flex-wrap gap-4 mb-6">
        {compareCoins.map((id, i) => (
          <CoinCard key={id} coinId={id} color={COIN_COLORS[i]} />
        ))}
      </div>

      {compareCoins.length >= 2 && (
        <div className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20">
          <h3 className="text-sm font-semibold mb-4 text-gray-100">
            30-Day Normalized Performance (%)
          </h3>
          <NormalizedChart coinIds={compareCoins} />
        </div>
      )}
    </section>
  )
}

export default Compare
