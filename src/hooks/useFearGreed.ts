import { useQuery } from '@tanstack/react-query'
import { fetchFearGreed } from '@/api/coinGecko'
import { STALE_1HOUR } from '@/lib/queryTimings'

export function useFearGreed() {
  return useQuery({
    queryKey: ['feargreed'],
    queryFn: fetchFearGreed,
    staleTime: STALE_1HOUR,
  })
}
