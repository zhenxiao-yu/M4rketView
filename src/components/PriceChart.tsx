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
    <div className="bg-gray-300 border border-gray-100 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-100 mb-1">{label}</p>
      <p className="text-sm font-semibold text-cyan">
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
    `text-xs py-0.5 px-2 rounded-lg transition-all font-medium ${
      active ? 'bg-cyan text-gray-300' : 'bg-gray-200 text-gray-100 hover:text-cyan'
    }`

  return (
    <div className="w-full h-[60%] min-h-[200px]">
      {isLoading ? (
        <div className="w-full h-[90%] flex items-center justify-center">
          <Spinner label="Loading chart" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
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

      <div className="flex flex-wrap gap-1.5 mt-2 px-1">
        {CHART_TYPES.map((t) => (
          <button key={t.key} className={btnClass(type === t.key)} onClick={() => setType(t.key)}>
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex gap-1.5">
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
