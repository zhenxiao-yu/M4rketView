import { isRateLimitError } from '@/lib/errors'

export type DataStatus = 'loading' | 'fresh' | 'cached' | 'rate-limited' | 'error'

export function deriveDataStatus(opts: {
  isLoading: boolean
  isError: boolean
  error: unknown
  dataUpdatedAt: number
  cachedThresholdMs?: number
}): DataStatus {
  const { isLoading, isError, error, dataUpdatedAt, cachedThresholdMs = 10 * 60 * 1000 } = opts
  if (isLoading && !dataUpdatedAt) return 'loading'
  if (isError) {
    if (isRateLimitError(error)) return 'rate-limited'
    return dataUpdatedAt ? 'cached' : 'error'
  }
  if (!dataUpdatedAt) return 'loading'
  return Date.now() - dataUpdatedAt > cachedThresholdMs ? 'cached' : 'fresh'
}

export function formatDataAge(dataUpdatedAt: number): string {
  if (!dataUpdatedAt) return ''
  const diffMs = Date.now() - dataUpdatedAt
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}
