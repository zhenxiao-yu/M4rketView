export class RateLimitError extends Error {
  readonly status = 429
  constructor(source: string) {
    super(`Rate limited by ${source}. Showing cached data — will refresh automatically.`)
    this.name = 'RateLimitError'
  }
}

export function isRateLimitError(err: unknown): err is RateLimitError {
  return err instanceof RateLimitError
}
