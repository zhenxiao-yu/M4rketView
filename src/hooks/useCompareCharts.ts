import { useQuery } from '@tanstack/react-query'
import { fetchMarketChart } from '@/api/coinGecko'

export function useCompareCharts(coinIds: string[], currency: string) {
  return useQuery({
    queryKey: ['compare-charts', coinIds, currency],
    queryFn: async () => {
      const results = await Promise.all(
        coinIds.map((id) => fetchMarketChart(id, currency, 30))
      )
      return coinIds.reduce<Record<string, [number, number][]>>((acc, id, i) => {
        acc[id] = results[i].prices
        return acc
      }, {})
    },
    enabled: coinIds.length >= 2,
    staleTime: 5 * 60 * 1000,
  })
}
