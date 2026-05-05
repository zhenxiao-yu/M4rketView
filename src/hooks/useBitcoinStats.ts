import { useQuery } from '@tanstack/react-query'
import type { BitcoinStats } from '@/types/coingecko'

async function fetchBitcoinStats(): Promise<BitcoinStats> {
  const res = await fetch('https://api.blockchain.info/stats')
  if (!res.ok) throw new Error('blockchain.info stats fetch failed')
  return res.json() as Promise<BitcoinStats>
}

export function useBitcoinStats() {
  return useQuery({
    queryKey: ['bitcoin', 'stats'],
    queryFn: fetchBitcoinStats,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}
