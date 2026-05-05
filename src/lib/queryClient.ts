import { QueryClient } from '@tanstack/react-query'
import { isRateLimitError } from '@/lib/errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 min default — was 1 min
      gcTime: 15 * 60 * 1000,          // 15 min in-memory cache
      refetchOnWindowFocus: false,      // stop API spam on tab switch
      refetchOnReconnect: true,
      retry: (failCount, error) => {
        if (isRateLimitError(error)) return false   // never retry 429
        return failCount < 2
      },
      retryDelay: (attempt) => Math.min(2 ** attempt * 1000, 30_000),
    },
  },
})
