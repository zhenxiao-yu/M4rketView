import { describe, it, expect, vi } from 'vitest'
import { withFallback } from '@/lib/fetchWithFallback'
import { RateLimitError } from '@/lib/errors'

describe('withFallback', () => {
  it('returns the primary result when primary succeeds', async () => {
    const primary = vi.fn().mockResolvedValue('primary')
    const fallback = vi.fn().mockResolvedValue('fallback')

    const result = await withFallback(primary, [fallback])

    expect(result).toBe('primary')
    expect(primary).toHaveBeenCalledTimes(1)
    expect(fallback).not.toHaveBeenCalled()
  })

  it('falls back on RateLimitError', async () => {
    const primary = vi.fn().mockRejectedValue(new RateLimitError('CoinGecko'))
    const fallback = vi.fn().mockResolvedValue('fallback')

    const result = await withFallback(primary, [fallback])

    expect(result).toBe('fallback')
    expect(fallback).toHaveBeenCalledTimes(1)
  })

  it('falls back on timeout error', async () => {
    const primary = vi.fn().mockRejectedValue(new Error('CoinGecko request timed out after 15s'))
    const fallback = vi.fn().mockResolvedValue('fallback')

    const result = await withFallback(primary, [fallback])

    expect(result).toBe('fallback')
  })

  it('falls back on network error', async () => {
    const primary = vi.fn().mockRejectedValue(new Error('Failed to fetch'))
    const fallback = vi.fn().mockResolvedValue('fallback')

    const result = await withFallback(primary, [fallback])

    expect(result).toBe('fallback')
  })

  it('falls back on 5xx', async () => {
    const primary = vi.fn().mockRejectedValue(new Error('CoinGecko: 503 Service Unavailable'))
    const fallback = vi.fn().mockResolvedValue('fallback')

    const result = await withFallback(primary, [fallback])

    expect(result).toBe('fallback')
  })

  it('does NOT fall back on 4xx (other than 429)', async () => {
    const primary = vi.fn().mockRejectedValue(new Error('CoinGecko: 404 Not Found'))
    const fallback = vi.fn().mockResolvedValue('fallback')

    await expect(withFallback(primary, [fallback])).rejects.toThrow('404')
    expect(fallback).not.toHaveBeenCalled()
  })

  it('tries fallbacks in order, stopping at first success', async () => {
    const primary = vi.fn().mockRejectedValue(new RateLimitError('CoinGecko'))
    const fallback1 = vi.fn().mockRejectedValue(new RateLimitError('CoinPaprika'))
    const fallback2 = vi.fn().mockResolvedValue('fallback2')
    const fallback3 = vi.fn().mockResolvedValue('fallback3')

    const result = await withFallback(primary, [fallback1, fallback2, fallback3])

    expect(result).toBe('fallback2')
    expect(fallback1).toHaveBeenCalledTimes(1)
    expect(fallback2).toHaveBeenCalledTimes(1)
    expect(fallback3).not.toHaveBeenCalled()
  })

  it('rethrows the primary error when every source fails', async () => {
    const primary = vi.fn().mockRejectedValue(new RateLimitError('CoinGecko'))
    const fallback = vi.fn().mockRejectedValue(new Error('CoinPaprika offline'))

    await expect(withFallback(primary, [fallback])).rejects.toBeInstanceOf(RateLimitError)
  })

  it('calls onFallback for each fallback attempt', async () => {
    const onFallback = vi.fn()
    const primary = vi.fn().mockRejectedValue(new RateLimitError('CoinGecko'))
    const fallback1 = vi.fn().mockRejectedValue(new Error('CoinPaprika offline'))
    const fallback2 = vi.fn().mockResolvedValue('fallback2')

    await withFallback(primary, [fallback1, fallback2], { onFallback })

    expect(onFallback).toHaveBeenCalledTimes(2)
    expect(onFallback).toHaveBeenNthCalledWith(1, expect.any(RateLimitError), 0)
    expect(onFallback).toHaveBeenNthCalledWith(2, expect.any(Error), 1)
  })

  it('respects custom shouldFallback', async () => {
    const primary = vi.fn().mockRejectedValue(new Error('weird error'))
    const fallback = vi.fn().mockResolvedValue('fallback')

    const result = await withFallback(primary, [fallback], {
      shouldFallback: () => true,
    })

    expect(result).toBe('fallback')
  })
})
