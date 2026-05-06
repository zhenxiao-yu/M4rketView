import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { type DataStatus, formatDataAge } from '@/lib/dataStatus'

interface Props {
  status: DataStatus
  dataUpdatedAt?: number
  source?: string
  className?: string
}

type VisibleStatus = Exclude<DataStatus, 'loading'>

const CONFIG: Record<VisibleStatus, { icon: typeof CheckCircle2; label: string; color: string }> = {
  fresh:          { icon: CheckCircle2, label: 'Live',         color: 'text-green' },
  cached:         { icon: Clock,        label: 'Cached',       color: 'text-yellow-400' },
  'rate-limited': { icon: Clock,        label: 'Rate limited', color: 'text-yellow-400' },
  error:          { icon: AlertCircle,  label: 'Unavailable',  color: 'text-red' },
}

const DataStatusBadge = ({ status, dataUpdatedAt, source, className = '' }: Props) => {
  if (status === 'loading') return null
  const { icon: Icon, label, color } = CONFIG[status]
  const age = dataUpdatedAt ? formatDataAge(dataUpdatedAt) : ''
  const title = [
    source ? `Source: ${source}` : '',
    age ? `Last updated ${age}` : '',
  ].filter(Boolean).join(' · ')

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${color} ${className}`}
      title={title || undefined}
    >
      <Icon size={11} />
      <span>{label}</span>
      {age && (
        <span className="text-gray-100/50">· {age}</span>
      )}
    </span>
  )
}

export default DataStatusBadge
