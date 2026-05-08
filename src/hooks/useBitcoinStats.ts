import { useQuery } from '@tanstack/react-query'
import type { BitcoinStats } from '@/types/coingecko'
import { apiFetch } from '@/lib/fetch'
import { withFallback } from '@/lib/fetchWithFallback'
import { fetchBitcoinStatsViaBlockchair } from '@/api/blockchair'

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
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}
