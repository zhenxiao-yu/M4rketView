/**
 * Centralized cache and refresh timings for TanStack Query.
 * Pick the bucket that matches data freshness, not arbitrary numbers.
 */

const MIN = 60 * 1000
const HOUR = 60 * MIN

// staleTime — how long until React Query considers data stale and refetches on mount/focus
export const STALE_1MIN  = 1 * MIN
export const STALE_3MIN  = 3 * MIN
export const STALE_5MIN  = 5 * MIN
export const STALE_10MIN = 10 * MIN
export const STALE_15MIN = 15 * MIN
export const STALE_1HOUR = 1 * HOUR

// gcTime — how long unobserved data stays in cache before being garbage collected
export const CACHE_15MIN = 15 * MIN
export const CACHE_30MIN = 30 * MIN

// UI timings (non-query but related to perceived freshness)
export const PRICE_FLASH_MS = 800
export const SEARCH_DEBOUNCE_MS = 300
