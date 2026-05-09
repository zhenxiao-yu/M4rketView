import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import {
  useDeFiProtocols,
  useDeFiChains,
  useGlobalTvlHistory,
} from '@/hooks/useDeFiTVL'
import { makeQueryWrapper } from '@/test/helpers/queryWrapper'

const PROTOCOLS = [
  { name: 'Lido',     tvl: 30_000_000_000, change_1d: 0.5, category: 'Liquid Staking', symbol: 'LDO', chains: ['Ethereum'], logo: 'lido.png' },
  { name: 'Aave',     tvl: 12_000_000_000, change_1d: 1.2, category: 'Lending',         symbol: 'AAVE', chains: ['Ethereum'], logo: 'aave.png' },
  { name: 'ZeroTVL',  tvl: 0,              change_1d: 0,   category: 'X',               symbol: 'X',    chains: ['x'],        logo: 'x.png' },
]

const CHAINS = [
  { gecko_id: 'ethereum', tvl: 50_000_000_000, tokenSymbol: 'ETH', name: 'Ethereum' },
  { gecko_id: 'tron',     tvl:  5_000_000_000, tokenSymbol: 'TRX', name: 'Tron' },
]

describe('useDeFiTVL hooks', () => {
  describe('useDeFiProtocols', () => {
    it('filters out zero-TVL protocols and sorts desc', async () => {
      server.use(
        http.get('https://api.llama.fi/protocols', () => HttpResponse.json(PROTOCOLS)),
      )
      const { result } = renderHook(() => useDeFiProtocols(), { wrapper: makeQueryWrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toHaveLength(2)
      expect(result.current.data?.[0].name).toBe('Lido')
      expect(result.current.data?.[1].name).toBe('Aave')
    })
  })

  describe('useDeFiChains', () => {
    it('returns top chains sorted by TVL', async () => {
      server.use(
        http.get('https://api.llama.fi/chains', () => HttpResponse.json(CHAINS)),
      )
      const { result } = renderHook(() => useDeFiChains(), { wrapper: makeQueryWrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.[0].name).toBe('Ethereum')
    })
  })

  describe('useGlobalTvlHistory', () => {
    it('returns the last 90 days of TVL points', async () => {
      const points = Array.from({ length: 200 }, (_, i) => ({
        date: 1_700_000_000 + i * 86400,
        tvl: 1_000_000_000 + i * 1000,
      }))
      server.use(
        http.get('https://api.llama.fi/v2/historicalChainTvl', () => HttpResponse.json(points)),
      )
      const { result } = renderHook(() => useGlobalTvlHistory(), { wrapper: makeQueryWrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data).toHaveLength(90)
      expect(result.current.data?.[89].tvl).toBe(points[199].tvl)
    })
  })
})
