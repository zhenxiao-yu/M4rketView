import type { DeFiProtocol, DeFiChain, DeFiTvlPoint } from '@/types/defiLlama'

const BASE = 'https://api.llama.fi'

export async function fetchDeFiProtocols(): Promise<DeFiProtocol[]> {
  const res = await fetch(`${BASE}/protocols`)
  if (!res.ok) throw new Error('DeFiLlama protocols fetch failed')
  const data = await res.json()
  return (data as DeFiProtocol[])
    .filter((p) => p.tvl > 0)
    .sort((a, b) => b.tvl - a.tvl)
    .slice(0, 25)
}

export async function fetchDeFiChains(): Promise<DeFiChain[]> {
  const res = await fetch(`${BASE}/chains`)
  if (!res.ok) throw new Error('DeFiLlama chains fetch failed')
  const data = await res.json()
  return (data as DeFiChain[])
    .sort((a, b) => b.tvl - a.tvl)
    .slice(0, 10)
}

export async function fetchGlobalTvlHistory(): Promise<DeFiTvlPoint[]> {
  const res = await fetch(`${BASE}/v2/historicalChainTvl`)
  if (!res.ok) throw new Error('DeFiLlama TVL history fetch failed')
  const data = await res.json()
  const points = data as DeFiTvlPoint[]
  // return last 90 days
  return points.slice(-90)
}
