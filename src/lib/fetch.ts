import { RateLimitError } from '@/lib/errors'

/**
 * Shared fetch wrapper used by all API modules except coinGecko.ts
 * (which has its own fetchJSON for JSON error body parsing).
 * - AbortController timeout, skipped in test mode (MSW + AbortSignal conflict)
 * - Throws RateLimitError on 429 with the API source name
 * - Throws descriptive Error on timeout or non-OK status
 */
export async function apiFetch<T>(
  url: string,
  source: string,
  timeoutMs = 15_000,
): Promise<T> {
  const useTimeout = import.meta.env.MODE !== 'test'
  const controller = useTimeout ? new AbortController() : null
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null
  try {
    const res = await fetch(url, controller ? { signal: controller.signal } : undefined)
    if (res.status === 429) throw new RateLimitError(source)
    if (!res.ok) throw new Error(`${source}: ${res.statusText || String(res.status)}`)
    return res.json() as Promise<T>
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(`${source} request timed out after ${timeoutMs / 1000}s`)
    }
    throw err
  } finally {
    if (timer) clearTimeout(timer)
  }
}
