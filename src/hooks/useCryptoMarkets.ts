import { useQuery } from '@tanstack/react-query'
import { fetchCryptoMarkets } from '@/api/coinGecko'
import { useMarketStore } from '@/store/marketStore'

export function useCryptoMarkets() {
  const { currency, sortBy, page, perPage, coinSearch, category } = useMarketStore()

  return useQuery({
    queryKey: ['markets', currency, sortBy, page, perPage, coinSearch, category],
    queryFn: () =>
      fetchCryptoMarkets({ currency, sortBy, page, perPage, ids: coinSearch, category }),
    placeholderData: (prev) => prev,
  })
}
