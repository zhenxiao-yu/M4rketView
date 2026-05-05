import { Cpu, Zap, ArrowRightLeft, DollarSign } from 'lucide-react'
import { useBitcoinStats } from '@/hooks/useBitcoinStats'
import { formatCompact } from '@/lib/utils'
import ErrorCard from '@/components/ui/ErrorCard'

const StatCard = ({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}) => (
  <div className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-100">{label}</span>
      <span className="text-cyan">{icon}</span>
    </div>
    <span className="text-2xl font-bold">{value}</span>
    {sub && <span className="text-xs text-gray-100">{sub}</span>}
  </div>
)

const BitcoinStats = () => {
  const { data, isLoading, error, refetch } = useBitcoinStats()

  const fmt = (loading: boolean, val: string) => isLoading && loading ? '...' : val

  const hashRate  = data ? `${(data.hash_rate / 1e18).toFixed(2)} EH/s` : fmt(!data, '—')
  const difficulty = data ? formatCompact(data.difficulty)                : fmt(!data, '—')
  const txToday    = data ? formatCompact(data.n_tx)                      : fmt(!data, '—')
  const minerRev   = data ? `$${formatCompact(data.miners_revenue_usd)}`  : fmt(!data, '—')

  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Cpu size={16} className="text-cyan" />
        Bitcoin Network
      </h2>
      {error ? (
        <ErrorCard error={error as Error} onRetry={() => refetch()} compact />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Zap size={18} />}             label="Hash Rate"    value={hashRate}   sub="Network security" />
          <StatCard icon={<Cpu size={18} />}             label="Difficulty"   value={difficulty} sub="Mining difficulty" />
          <StatCard icon={<ArrowRightLeft size={18} />}  label="Transactions" value={txToday}    sub="Today" />
          <StatCard icon={<DollarSign size={18} />}      label="Miner Revenue" value={minerRev}  sub="24H earnings" />
        </div>
      )}
    </div>
  )
}

export default BitcoinStats
