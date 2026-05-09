import { useQuery } from '@tanstack/react-query'
import { fetchCoinDetail } from '@/api/coinGecko'
import { STALE_3MIN } from '@/lib/queryTimings'

export function useCoinDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['coin', id],
    queryFn: () => fetchCoinDetail(id!),
    enabled: !!id,
    staleTime: STALE_3MIN,
  })
}
