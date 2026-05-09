import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useMarketChart } from '@/hooks/useMarketChart'
import { useMarketStore } from '@/store/marketStore'
import { formatCurrency } from '@/lib/utils'
import { Spinner } from '@/components/ui/Spinner'
import type { ChartType, ChartDays } from '@/types/coingecko'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  currency: string
}

const CustomTooltip = ({ active, payload, label, currency }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-sm font-semibold text-accent">
        {formatCurrency(payload[0].value, currency)}
      </p>
    </div>
  )
}

const CHART_TYPES: { key: ChartType; label: string }[] = [
  { key: 'prices', label: 'Price' },
  { key: 'market_caps', label: 'Market Cap' },
  { key: 'total_volumes', label: 'Volume' },
]

const CHART_DAYS: { days: ChartDays; label: string }[] = [
  { days: 1, label: '1D' },
  { days: 7, label: '7D' },
  { days: 14, label: '14D' },
  { days: 30, label: '1M' },
  { days: 90, label: '3M' },
  { days: 365, label: '1Y' },
]

interface PriceChartProps {
  coinId: string
}

const PriceChart = ({ coinId }: PriceChartProps) => {
  const [type, setType] = useState<ChartType>('prices')
  const [days, setDays] = useState<ChartDays>(7)
  const { currency } = useMarketStore()
  const { data: chartData, isLoading } = useMarketChart(coinId, currency, days)

  const formattedData = chartData?.[type].map(([timestamp, value]) => ({
    date: new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(days === 1 ? { hour: '2-digit', minute: '2-digit' } : {}),
    }),
    value,
  }))

  const btnClass = (active: boolean) =>
    `text-xs h-7 px-2.5 rounded-lg transition-all font-medium whitespace-nowrap ${
      active ? 'bg-accent text-accent-foreground' : 'bg-surface text-muted hover:text-accent'
    }`

  return (
    <div className="w-full flex flex-col h-full min-h-[260px]">
      <div className="flex-1 min-h-[180px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner label="Loading chart" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B6EADA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#B6EADA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#B6EADA"
                strokeWidth={1.5}
                fill="url(#chartGradient)"
                dot={false}
              />
              <CartesianGrid stroke="#5B8FB9" strokeOpacity={0.2} />
              <XAxis dataKey="date" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                content={<CustomTooltip currency={currency} />}
                cursor={{ stroke: '#5B8FB9', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3 px-1">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Chart metric">
          {CHART_TYPES.map((t) => (
            <button key={t.key} className={btnClass(type === t.key)} onClick={() => setType(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:ml-auto" role="group" aria-label="Chart range">
          {CHART_DAYS.map((d) => (
            <button key={d.days} className={btnClass(days === d.days)} onClick={() => setDays(d.days)}>
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PriceChart
