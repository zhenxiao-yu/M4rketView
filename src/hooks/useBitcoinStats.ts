import { useQuery } from '@tanstack/react-query'
import type { BitcoinStats } from '@/types/coingecko'
import { apiFetch } from '@/lib/fetch'
import { withFallback } from '@/lib/fetchWithFallback'
import { fetchBitcoinStatsViaBlockchair } from '@/api/blockchair'
import { STALE_5MIN, CACHE_15MIN } from '@/lib/queryTimings'

function fetchBitcoinStats(): Promise<BitcoinStats> {
  return withFallback(
    () => apiFetch<BitcoinStats>('https://api.blockchain.info/stats', 'blockchain.info'),
    [() => fetchBitcoinStatsViaBlockchair()],
  )
}

export function useBitcoinStats() {
  return useQuery({
    queryKey: ['bitcoin', 'stats'],
    queryFn: fetchBitcoinStats,
    staleTime: STALE_5MIN,
    gcTime: CACHE_15MIN,
  })
}
