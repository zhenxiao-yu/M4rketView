import { isRateLimitError, isNetworkError, isTimeoutError } from '@/lib/errors'

export interface FallbackOptions {
  /** Override which errors trigger a fallback. Default: rate-limit + network + timeout + 5xx. */
  shouldFallback?: (err: unknown) => boolean
  /** Called when the fallback is invoked. Useful for logging / telemetry. */
  onFallback?: (err: unknown, attempt: number) => void
}

const defaultShouldFallback = (err: unknown): boolean => {
  if (isRateLimitError(err)) return true
  if (isTimeoutError(err)) return true
  if (isNetworkError(err)) return true
  if (err instanceof Error) {
    const msg = err.message.toLowerCase()
    if (msg.includes('500') || msg.includes('502') || msg.includes('503') || msg.includes('504')) return true
  }
  return false
}

/**
 * Try `primary`; on a recoverable error try each fallback in order until one succeeds.
 * If every source fails, the **first** error is rethrown — that's the one users care about
 * because it points at the canonical source.
 */
export async function withFallback<T>(
  primary: () => Promise<T>,
  fallbacks: Array<() => Promise<T>>,
  opts: FallbackOptions = {},
): Promise<T> {
  const { shouldFallback = defaultShouldFallback, onFallback } = opts

  let firstError: unknown
  try {
    return await primary()
  } catch (err) {
    if (!shouldFallback(err)) throw err
    firstError = err
    onFallback?.(err, 0)
  }

  for (let i = 0; i < fallbacks.length; i++) {
    try {
      return await fallbacks[i]()
    } catch (err) {
      onFallback?.(err, i + 1)
      // continue to next fallback
    }
  }

  throw firstError
}
