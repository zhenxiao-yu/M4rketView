import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Zap, ArrowRightLeft, DollarSign } from 'lucide-react'
import { useBitcoinStats } from '@/hooks/useBitcoinStats'
import { formatCompact } from '@/lib/utils'
import ErrorCard from '@/components/ui/ErrorCard'

const StatCard = ({
  icon, label, value, sub, delay = 0,
}: {
  icon: ReactNode
  label: string
  value: string
  sub?: string
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay } }}
    className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20 flex flex-col gap-2"
  >
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-100">{label}</span>
      <span className="text-cyan">{icon}</span>
    </div>
    <span className="text-2xl font-bold">{value}</span>
    {sub && <span className="text-xs text-gray-100">{sub}</span>}
  </motion.div>
)

const SkeletonCard = () => (
  <div className="bg-gray-200/40 rounded-xl p-5 border border-gray-100/20 animate-pulse flex flex-col gap-3">
    <div className="flex justify-between">
      <div className="h-3 bg-gray-100/20 rounded w-20" />
      <div className="h-4 w-4 bg-gray-100/20 rounded" />
    </div>
    <div className="h-7 bg-gray-100/20 rounded w-28" />
    <div className="h-3 bg-gray-100/20 rounded w-16" />
  </div>
)

const BitcoinStats = () => {
  const { data, isLoading, error, refetch } = useBitcoinStats()

  const hashRate  = data?.hash_rate != null ? `${(data.hash_rate / 1e18).toFixed(2)} EH/s` : '—'
  const difficulty = data ? formatCompact(data.difficulty) : '—'
  const txToday    = data ? formatCompact(data.n_tx) : '—'
  const minerRev   = data ? `$${formatCompact(data.miners_revenue_usd)}` : '—'

  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Cpu size={16} className="text-cyan" />
        Bitcoin Network
      </h2>
      {error ? (
        <ErrorCard error={error as Error} onRetry={() => refetch()} compact />
      ) : isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard delay={0}    icon={<Zap size={18} />}            label="Hash Rate"     value={hashRate}   sub="Network security" />
          <StatCard delay={0.07} icon={<Cpu size={18} />}            label="Difficulty"    value={difficulty} sub="Mining difficulty" />
          <StatCard delay={0.14} icon={<ArrowRightLeft size={18} />} label="Transactions"  value={txToday}    sub="Today" />
          <StatCard delay={0.21} icon={<DollarSign size={18} />}     label="Miner Revenue" value={minerRev}   sub="24H earnings" />
        </div>
      )}
    </div>
  )
}

export default BitcoinStats
