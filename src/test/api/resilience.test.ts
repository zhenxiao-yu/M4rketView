import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import { RateLimitError, isRateLimitError, isTimeoutError, isNetworkError } from '@/lib/errors'
import { deriveDataStatus, formatDataAge } from '@/lib/dataStatus'
import { apiFetch } from '@/lib/fetch'

// ── RateLimitError ───────────────────────────────────────────────────────────

describe('RateLimitError', () => {
  it('has correct status, name, and source', () => {
    const err = new RateLimitError('CoinGecko')
    expect(err.status).toBe(429)
    expect(err.name).toBe('RateLimitError')
    expect(err.source).toBe('CoinGecko')
    expect(err.message).toContain('CoinGecko')
  })

  it('isRateLimitError identifies correctly', () => {
    expect(isRateLimitError(new RateLimitError('X'))).toBe(true)
    expect(isRateLimitError(new Error('429'))).toBe(false)
    expect(isRateLimitError(null)).toBe(false)
    expect(isRateLimitError('string')).toBe(false)
  })

  it('isTimeoutError identifies timeout messages', () => {
    expect(isTimeoutError(new Error('CoinGecko request timed out after 15s'))).toBe(true)
    expect(isTimeoutError(new Error('some other error'))).toBe(false)
    expect(isTimeoutError(null)).toBe(false)
  })

  it('isNetworkError identifies fetch failures', () => {
    expect(isNetworkError(new Error('Failed to fetch'))).toBe(true)
    expect(isNetworkError(new Error('failed to fetch: connection refused'))).toBe(true)
    expect(isNetworkError(new Error('server error'))).toBe(false)
  })
})

// ── apiFetch ─────────────────────────────────────────────────────────────────

describe('apiFetch', () => {
  const TEST_URL = 'https://test-api.example.com/data'

  it('resolves with parsed JSON on 200', async () => {
    server.use(http.get(TEST_URL, () => HttpResponse.json({ value: 42 })))
    const result = await apiFetch<{ value: number }>(TEST_URL, 'TestAPI')
    expect(result).toEqual({ value: 42 })
  })

  it('throws RateLimitError on 429', async () => {
    server.use(http.get(TEST_URL, () => new HttpResponse(null, { status: 429 })))
    await expect(apiFetch(TEST_URL, 'TestAPI')).rejects.toBeInstanceOf(RateLimitError)
  })

  it('RateLimitError from apiFetch has correct source', async () => {
    server.use(http.get(TEST_URL, () => new HttpResponse(null, { status: 429 })))
    try {
      await apiFetch(TEST_URL, 'MySource')
      expect.fail('should have thrown')
    } catch (err) {
      expect(isRateLimitError(err)).toBe(true)
      if (isRateLimitError(err)) expect(err.source).toBe('MySource')
    }
  })

  it('throws Error with source name on non-ok response', async () => {
    server.use(http.get(TEST_URL, () => new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' })))
    await expect(apiFetch(TEST_URL, 'TestAPI')).rejects.toThrow('TestAPI')
  })

  it('resolves empty array on 200', async () => {
    server.use(http.get(TEST_URL, () => HttpResponse.json([])))
    await expect(apiFetch<unknown[]>(TEST_URL, 'TestAPI')).resolves.toEqual([])
  })
})

// ── deriveDataStatus ─────────────────────────────────────────────────────────

describe('deriveDataStatus', () => {
  const now = Date.now()

  it('returns loading when no data and isLoading', () => {
    expect(deriveDataStatus({ isLoading: true, isError: false, error: null, dataUpdatedAt: 0 })).toBe('loading')
  })

  it('returns fresh when recently updated', () => {
    expect(deriveDataStatus({ isLoading: false, isError: false, error: null, dataUpdatedAt: now - 60_000 })).toBe('fresh')
  })

  it('returns cached when data is older than threshold', () => {
    const old = now - 15 * 60 * 1000
    expect(deriveDataStatus({ isLoading: false, isError: false, error: null, dataUpdatedAt: old })).toBe('cached')
  })

  it('returns rate-limited when error is RateLimitError', () => {
    const err = new RateLimitError('CoinGecko')
    expect(deriveDataStatus({ isLoading: false, isError: true, error: err, dataUpdatedAt: 0 })).toBe('rate-limited')
  })

  it('returns error when isError and no prior data', () => {
    expect(deriveDataStatus({ isLoading: false, isError: true, error: new Error('fail'), dataUpdatedAt: 0 })).toBe('error')
  })

  it('returns cached when isError but has prior data', () => {
    expect(deriveDataStatus({ isLoading: false, isError: true, error: new Error('fail'), dataUpdatedAt: now - 60_000 })).toBe('cached')
  })
})

// ── formatDataAge ─────────────────────────────────────────────────────────────

describe('formatDataAge', () => {
  it('returns just now for under 1 min', () => {
    expect(formatDataAge(Date.now() - 30_000)).toBe('just now')
  })

  it('returns Xm ago for under 60 min', () => {
    expect(formatDataAge(Date.now() - 5 * 60_000)).toBe('5m ago')
  })

  it('returns Xh ago for under 24 h', () => {
    expect(formatDataAge(Date.now() - 3 * 60 * 60_000)).toBe('3h ago')
  })

  it('returns empty string for 0', () => {
    expect(formatDataAge(0)).toBe('')
  })
})
