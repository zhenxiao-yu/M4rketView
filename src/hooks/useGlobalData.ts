import { useQuery } from '@tanstack/react-query'
import { fetchGlobalData } from '@/api/coinGecko'
import { STALE_5MIN } from '@/lib/queryTimings'

export function useGlobalData() {
  return useQuery({
    queryKey: ['global'],
    queryFn: fetchGlobalData,
    staleTime: STALE_5MIN,
  })
}
