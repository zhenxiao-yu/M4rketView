import { TrendingUp, TrendingDown, Link2 } from 'lucide-react'
import ErrorCard from '@/components/ui/ErrorCard'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useDeFiProtocols, useDeFiChains, useGlobalTvlHistory } from '@/hooks/useDeFiTVL'
import { formatCompact, formatPercent } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

const DeFiSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
    {[0, 1].map((i) => (
      <Card key={i} className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32" />
        {Array.from({ length: 5 }).map((_, j) => (
          <div key={j} className="flex items-center gap-2">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="flex-1 h-2 rounded-full" />
            <Skeleton className="w-12 h-3" />
          </div>
        ))}
      </Card>
    ))}
  </div>
)

const DeFiTVL = () => {
  const { data: protocols, isLoading: protoLoading, error: protoError, refetch } = useDeFiProtocols()
  const { data: chains, isLoading: chainsLoading } = useDeFiChains()
  const { data: history } = useGlobalTvlHistory()

  const totalTvl = protocols ? protocols.reduce((s, p) => s + p.tvl, 0) : 0
  const topChains = chains?.slice(0, 5) ?? []
  const maxChainTvl = topChains[0]?.tvl ?? 1
  const topProtocols = protocols?.slice(0, 5) ?? []

  const chartData = (history ?? []).map((pt) => ({
    date: new Date(pt.date * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    tvl: pt.tvl,
  }))

  const loading = protoLoading || chainsLoading

  if (protoError) {
    return (
      <div className="mb-8">
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Link2 size={16} className="text-cyan" /> DeFi TVL
        </h2>
        <ErrorCard error={protoError as Error} onRetry={() => refetch()} compact />
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Link2 size={16} className="text-cyan" />
        DeFi TVL
        {!loading && (
          <span className="text-2xl font-bold ml-2">${formatCompact(totalTvl)}</span>
        )}
      </h2>

      {loading ? <DeFiSkeleton /> : null}

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 ${loading ? 'hidden' : ''}`}>
        {/* Top chains */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-100 mb-3">Top Chains by TVL</h3>
          <div className="flex flex-col gap-2">
            {topChains.map((chain) => (
              <div key={chain.name} className="flex items-center gap-2">
                <span className="text-xs w-20 truncate text-gray-100">{chain.name}</span>
                <div className="flex-1 bg-gray-100/10 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-cyan"
                    style={{ width: `${(chain.tvl / maxChainTvl) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold w-16 text-right">
                  ${formatCompact(chain.tvl)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top protocols */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-100 mb-3">Top Protocols</h3>
          <div className="flex flex-col gap-1.5">
            {topProtocols.map((protocol) => {
              const change = protocol.change_1d
              const isUp = change != null && change >= 0
              return (
                <div key={protocol.name} className="flex items-center gap-2">
                  {protocol.logo && (
                    <img
                      src={protocol.logo}
                      alt={protocol.name}
                      className="w-5 h-5 rounded-full object-contain"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                  <span className="text-xs flex-1 truncate">{protocol.name}</span>
                  <span className="text-xs text-gray-100">{protocol.category}</span>
                  <span className="text-xs font-semibold w-16 text-right">
                    ${formatCompact(protocol.tvl)}
                  </span>
                  {change != null && (
                    <span className={`text-xs flex items-center gap-0.5 w-14 justify-end ${isUp ? 'text-green' : 'text-red'}`}>
                      {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {formatPercent(change)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* 90-day TVL chart */}
      {chartData.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-100 mb-3">90-Day Global TVL</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="tvlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                interval={14}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={(v: number) => `$${formatCompact(v)}`}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip
                formatter={(v: number) => [`$${formatCompact(v)}`, 'TVL']}
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Area
                type="monotone"
                dataKey="tvl"
                stroke="#00d4ff"
                strokeWidth={2}
                fill="url(#tvlGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}

export default DeFiTVL
