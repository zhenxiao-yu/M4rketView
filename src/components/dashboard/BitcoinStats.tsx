import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Zap, ArrowRightLeft, DollarSign } from 'lucide-react'
import { useBitcoinStats } from '@/hooks/useBitcoinStats'
import { formatCompact } from '@/lib/utils'
import ErrorCard from '@/components/ui/ErrorCard'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { staggerContainer, staggerChild } from '@/lib/motion'

const StatCard = ({
  icon, label, value, sub,
}: {
  icon: ReactNode
  label: string
  value: string
  sub?: string
}) => (
  <motion.div variants={staggerChild}>
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-100">{label}</span>
        <span className="text-cyan">{icon}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
      {sub && <span className="text-xs text-gray-100">{sub}</span>}
    </Card>
  </motion.div>
)

const StatSkeleton = () => (
  <Card className="flex flex-col gap-3">
    <div className="flex justify-between">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-4 rounded" />
    </div>
    <Skeleton className="h-7 w-28" />
    <Skeleton className="h-3 w-16" />
  </Card>
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
          {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard icon={<Zap size={18} />}            label="Hash Rate"     value={hashRate}   sub="Network security" />
          <StatCard icon={<Cpu size={18} />}            label="Difficulty"    value={difficulty} sub="Mining difficulty" />
          <StatCard icon={<ArrowRightLeft size={18} />} label="Transactions"  value={txToday}    sub="Today" />
          <StatCard icon={<DollarSign size={18} />}     label="Miner Revenue" value={minerRev}   sub="24H earnings" />
        </motion.div>
      )}
    </div>
  )
}

export default BitcoinStats
