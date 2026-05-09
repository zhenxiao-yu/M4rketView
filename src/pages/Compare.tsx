import { Link } from 'react-router-dom'
import { GitCompare, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { useUIStore } from '@/store/uiStore'
import { useCoinDetail } from '@/hooks/useCoinDetail'
import { useCompareCharts } from '@/hooks/useCompareCharts'
import { useMarketStore } from '@/store/marketStore'
import { formatCurrency, formatCompact, formatPercent } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'

const COIN_COLORS = ['#B6EADA', '#5B8FB9', '#e72179']

const CoinCard = ({ coinId, color }: { coinId: string; color: string }) => {
  const { removeFromCompare } = useUIStore()
  const { currency } = useMarketStore()
  const { data, isLoading } = useCoinDetail(coinId)

  if (isLoading) {
    return (
      <Card padding="md">
        <Skeleton className="h-16 w-full mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
      </Card>
    )
  }

  if (!data) return null
  const price = data.market_data.current_price[currency] ?? data.market_data.current_price['usd']
  const pct24h = data.market_data.price_change_percentage_24h

  return (
    <Card padding="md" className="border-2 h-full flex flex-col" style={{ borderColor: color }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src={data.image.small} alt={data.name} className="w-8 h-8 rounded-full" />
          <div>
            <Link to={`/coin/${data.id}`} className="font-semibold hover:text-accent transition-colors text-sm">
              {data.name}
            </Link>
            <p className="text-xs text-muted uppercase">{data.symbol}</p>
          </div>
        </div>
        <button onClick={() => removeFromCompare(coinId)} className="text-muted hover:text-danger transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Price</span>
          <span className="font-semibold">{formatCurrency(price, currency)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">24H</span>
          <span className={pct24h >= 0 ? 'text-success font-semibold' : 'text-danger font-semibold'}>
            {formatPercent(pct24h)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Mkt Cap</span>
          <span>{formatCompact(data.market_data.market_cap[currency] ?? 0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Volume</span>
          <span>{formatCompact(data.market_data.total_volume[currency] ?? 0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Rank</span>
          <span>#{data.market_cap_rank}</span>
        </div>
      </div>
    </Card>
  )
}

const NormalizedChart = ({ coinIds }: { coinIds: string[] }) => {
  const { currency } = useMarketStore()
  const { data: chartMap, isLoading } = useCompareCharts(coinIds, currency)

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Spinner size="md" label="Loading chart" />
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
        <Card tone="muted" className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
          <GitCompare size={48} className="text-muted" />
          <p className="text-lg font-semibold">Nothing to compare yet</p>
          <p className="text-sm text-muted max-w-sm">
            Tap the compare icon on any coin in the markets table to add it here. Up to 3 coins.
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
      <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
        <GitCompare size={20} className="text-accent" /> Coin Comparison
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {compareCoins.map((id, i) => (
          <CoinCard key={id} coinId={id} color={COIN_COLORS[i]} />
        ))}
      </div>

      {compareCoins.length >= 2 && (
        <Card>
          <h3 className="text-sm font-semibold mb-4 text-muted">
            30-Day Normalized Performance (%)
          </h3>
          <NormalizedChart coinIds={compareCoins} />
        </Card>
      )}
    </section>
  )
}

export default Compare
