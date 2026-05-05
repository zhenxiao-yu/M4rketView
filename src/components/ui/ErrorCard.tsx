import { AlertCircle, Clock, RefreshCw, WifiOff } from 'lucide-react'
import { isRateLimitError } from '@/lib/errors'

interface Props {
  error?: Error | null
  onRetry?: () => void
  compact?: boolean
  minHeight?: string
}

const ErrorCard = ({ error, onRetry, compact = false, minHeight = 'min-h-[40vh]' }: Props) => {
  const isRateLimit = isRateLimitError(error)
  const isNetwork = error?.message?.toLowerCase().includes('failed to fetch')

  const Icon = isRateLimit ? Clock : isNetwork ? WifiOff : AlertCircle
  const iconColor = isRateLimit ? 'text-yellow-400' : 'text-red'
  const title = isRateLimit
    ? 'Rate limit reached'
    : isNetwork
    ? 'Network error'
    : 'Failed to load'
  const message = error?.message ?? 'Something went wrong. Please try again.'

  if (compact) {
    return (
      <div className="flex items-center gap-2 py-3 px-4 rounded-lg bg-gray-200/30 border border-gray-100/20 text-sm">
        <Icon size={14} className={iconColor} />
        <span className="text-gray-100 flex-1">{title}</span>
        {onRetry && !isRateLimit && (
          <button onClick={onRetry} className="text-cyan hover:underline text-xs">Retry</button>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-5 text-center ${minHeight}`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isRateLimit ? 'bg-yellow-400/10' : 'bg-red/10'}`}>
        <Icon size={28} className={iconColor} />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-100 mt-1 max-w-sm">{message}</p>
      </div>
      {onRetry && !isRateLimit && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-gray-200/40 border border-gray-100/20 rounded-xl text-sm hover:border-cyan/50 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={13} /> Try again
        </button>
      )}
    </div>
  )
}

export default ErrorCard
