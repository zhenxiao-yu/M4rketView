import { useQuery } from '@tanstack/react-query'
import { fetchDeFiProtocols, fetchDeFiChains, fetchGlobalTvlHistory } from '@/api/defiLlama'

const OPTIONS = { staleTime: 15 * 60 * 1000, gcTime: 30 * 60 * 1000 }

export function useDeFiProtocols() {
  return useQuery({ queryKey: ['defi', 'protocols'], queryFn: fetchDeFiProtocols, ...OPTIONS })
}

export function useDeFiChains() {
  return useQuery({ queryKey: ['defi', 'chains'], queryFn: fetchDeFiChains, ...OPTIONS })
}

export function useGlobalTvlHistory() {
  return useQuery({ queryKey: ['defi', 'tvlHistory'], queryFn: fetchGlobalTvlHistory, ...OPTIONS })
}
