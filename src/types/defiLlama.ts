export interface DeFiProtocol {
  name: string
  slug: string
  tvl: number
  change_1h: number | null
  change_1d: number | null
  change_7d: number | null
  category: string
  logo: string
  chains: string[]
  gecko_id: string | null
  mcap: number | null
}

export interface DeFiChain {
  name: string
  tvl: number
  gecko_id: string | null
}

export interface DeFiTvlPoint {
  date: number
  tvl: number
}
