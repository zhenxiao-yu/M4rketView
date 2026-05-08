import { AlertCircle, Clock, RefreshCw, Timer, WifiOff } from 'lucide-react'
import { isRateLimitError, isTimeoutError, isNetworkError } from '@/lib/errors'
import { Button } from '@/components/ui/Button'

interface Props {
  error?: Error | null
  onRetry?: () => void
  compact?: boolean
  minHeight?: string
}

const ErrorCard = ({ error, onRetry, compact = false, minHeight = 'min-h-[40vh]' }: Props) => {
  const isRateLimit = isRateLimitError(error)
  const isTimeout   = isTimeoutError(error)
  const isNetwork   = isNetworkError(error)

  const Icon = isRateLimit ? Clock
    : isTimeout  ? Timer
    : isNetwork  ? WifiOff
    : AlertCircle

  const iconColor = isRateLimit || isTimeout ? 'text-yellow-400' : 'text-red'

  const title = isRateLimit ? 'Rate limit reached'
    : isTimeout  ? 'Request timed out'
    : isNetwork  ? 'Network error'
    : 'Failed to load'

  const source = isRateLimitError(error) ? error.source : null
  const canRetry = !isRateLimit && !!onRetry

  const fallbackMsg = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
  const detail = isRateLimit
    ? `${source ? `${source} is` : 'API is'} rate-limiting requests. Showing cached data — will retry automatically.`
    : isTimeout
    ? `The ${source ?? 'API'} server took too long to respond. Check your connection or try again.`
    : isNetwork
    ? 'Could not reach the server. Check your internet connection.'
    : fallbackMsg

  if (compact) {
    return (
      <div className="flex items-center gap-2 py-3 px-4 rounded-lg bg-gray-200/30 border border-gray-100/20 text-sm">
        <Icon size={14} className={iconColor} />
        <span className="text-gray-100 flex-1 truncate">{title}{source ? ` — ${source}` : ''}</span>
        {canRetry && (
          <Button variant="link" size="sm" onClick={onRetry} className="shrink-0">Retry</Button>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-5 text-center ${minHeight}`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isRateLimit || isTimeout ? 'bg-yellow-400/10' : 'bg-red/10'}`}>
        <Icon size={28} className={iconColor} />
      </div>
      <div className="max-w-sm">
        <p className="font-semibold">{title}{source ? <span className="font-normal text-gray-100"> — {source}</span> : null}</p>
        <p className="text-sm text-gray-100 mt-1">{detail}</p>
      </div>
      {canRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw size={13} /> Try again
        </Button>
      )}
    </div>
  )
}

export default ErrorCard
