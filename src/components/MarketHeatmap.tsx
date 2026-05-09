import { useNavigate } from 'react-router-dom'
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'
import type { CoinMarket } from '@/types/coingecko'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

function heatColor(pct: number): string {
  if (pct < -5) return '#B91C2A'
  if (pct < 0) return '#E5484D'
  if (pct < 5) return '#3FB57E'
  return '#2A8A5C'
}

interface HeatmapItem {
  name: string
  size: number
  pct: number
  id: string
  price: number
  fullName: string
}

interface CustomContentProps {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  pct?: number
}

const CustomContent = (props: CustomContentProps) => {
  const { x = 0, y = 0, width = 0, height = 0, name = '', pct = 0 } = props
  const color = heatColor(pct)
  const showLabel = width > 45 && height > 32

  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        fill={color}
        fillOpacity={0.85}
        rx={4}
      />
      {showLabel && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 7}
            textAnchor="middle"
            fill="white"
            fontSize={Math.min(13, width / 4)}
            fontWeight="bold"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 9}
            textAnchor="middle"
            fill="white"
            fillOpacity={0.9}
            fontSize={Math.min(11, width / 5)}
          >
            {formatPercent(pct)}
          </text>
        </>
      )}
    </g>
  )
}

interface TooltipPayloadItem {
  payload?: HeatmapItem
}

const HeatmapTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-background border border-border/20 rounded-lg p-3 text-xs shadow-lg">
      <p className="font-bold mb-1">{d.fullName}</p>
      <p className="text-muted">{formatCurrency(d.price, 'usd')}</p>
      <p className={d.pct >= 0 ? 'text-success' : 'text-danger'}>{formatPercent(d.pct)} (24h)</p>
    </div>
  )
}

interface Props {
  coins: CoinMarket[]
}

const MarketHeatmap = ({ coins }: Props) => {
  const navigate = useNavigate()

  const data: HeatmapItem[] = coins
    .filter((c) => c.market_cap > 0)
    .map((c) => ({
      name: c.symbol.toUpperCase(),
      size: c.market_cap,
      pct: c.price_change_percentage_24h ?? 0,
      id: c.id,
      price: c.current_price,
      fullName: c.name,
    }))

  const handleClick = (item: HeatmapItem) => {
    if (item?.id) navigate(`/coin/${item.id}`)
  }

  return (
    <Card className="mb-8">
      <h2 className="text-base font-semibold mb-4">Market Heatmap (24H)</h2>
      <div className="h-[260px] sm:h-[300px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="size"
            content={<CustomContent />}
            onClick={(item) => handleClick(item as unknown as HeatmapItem)}
            isAnimationActive={false}
          >
            <Tooltip content={<HeatmapTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 sm:justify-end text-xs text-muted">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#B91C2A] inline-block" /> &lt;-5%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#E5484D] inline-block" /> -5% to 0</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#3FB57E] inline-block" /> 0 to +5%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#2A8A5C] inline-block" /> &gt;+5%</span>
      </div>
    </Card>
  )
}

export default MarketHeatmap
