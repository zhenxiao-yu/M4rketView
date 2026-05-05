import type { DeFiProtocol, DeFiChain, DeFiTvlPoint } from '@/types/defiLlama'
import { RateLimitError } from '@/lib/errors'

const BASE = 'https://api.llama.fi'

async function llamaFetch<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (res.status === 429) throw new RateLimitError('DeFiLlama')
  if (!res.ok) throw new Error(`DeFiLlama fetch failed: ${res.statusText}`)
  return res.json() as Promise<T>
}

export async function fetchDeFiProtocols(): Promise<DeFiProtocol[]> {
  const data = await llamaFetch<DeFiProtocol[]>(`${BASE}/protocols`)
  return data.filter((p) => p.tvl > 0).sort((a, b) => b.tvl - a.tvl).slice(0, 25)
}

export async function fetchDeFiChains(): Promise<DeFiChain[]> {
  const data = await llamaFetch<DeFiChain[]>(`${BASE}/chains`)
  return data.sort((a, b) => b.tvl - a.tvl).slice(0, 10)
}

export async function fetchGlobalTvlHistory(): Promise<DeFiTvlPoint[]> {
  const points = await llamaFetch<DeFiTvlPoint[]>(`${BASE}/v2/historicalChainTvl`)
  return points.slice(-90)
}
