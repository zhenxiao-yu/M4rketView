import { useQuery } from '@tanstack/react-query'
import { fetchCoinDetail } from '@/api/coinGecko'

export function useCoinDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['coin', id],
    queryFn: () => fetchCoinDetail(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
  })
}
