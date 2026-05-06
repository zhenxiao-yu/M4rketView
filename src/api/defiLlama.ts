import type { DeFiProtocol, DeFiChain, DeFiTvlPoint } from '@/types/defiLlama'
import { apiFetch } from '@/lib/fetch'

const BASE = 'https://api.llama.fi'
const SRC = 'DeFiLlama'

export async function fetchDeFiProtocols(): Promise<DeFiProtocol[]> {
  const data = await apiFetch<DeFiProtocol[]>(`${BASE}/protocols`, SRC)
  return data.filter((p) => p.tvl > 0).sort((a, b) => b.tvl - a.tvl).slice(0, 25)
}

export async function fetchDeFiChains(): Promise<DeFiChain[]> {
  const data = await apiFetch<DeFiChain[]>(`${BASE}/chains`, SRC)
  return data.sort((a, b) => b.tvl - a.tvl).slice(0, 10)
}

export async function fetchGlobalTvlHistory(): Promise<DeFiTvlPoint[]> {
  const points = await apiFetch<DeFiTvlPoint[]>(`${BASE}/v2/historicalChainTvl`, SRC)
  return points.slice(-90)
}
