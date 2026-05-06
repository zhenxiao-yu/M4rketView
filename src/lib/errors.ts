export class RateLimitError extends Error {
  readonly status = 429
  readonly source: string
  constructor(source: string) {
    super(`Rate limited by ${source}. Showing cached data — will refresh automatically.`)
    this.name = 'RateLimitError'
    this.source = source
  }
}

export function isRateLimitError(err: unknown): err is RateLimitError {
  return err instanceof RateLimitError
}

export function isTimeoutError(err: unknown): err is Error {
  return err instanceof Error && err.message.includes('timed out after')
}

export function isNetworkError(err: unknown): err is Error {
  return err instanceof Error && err.message.toLowerCase().includes('failed to fetch')
}
