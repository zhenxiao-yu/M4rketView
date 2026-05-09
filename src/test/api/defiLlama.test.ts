import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import {
  fetchDeFiProtocols,
  fetchDeFiChains,
  fetchGlobalTvlHistory,
} from '@/api/defiLlama'

describe('defiLlama API', () => {
  describe('fetchDeFiProtocols', () => {
    it('drops zero-TVL entries, sorts desc, caps at 25', async () => {
      const protocols = [
        ...Array.from({ length: 30 }, (_, i) => ({
          name: `P${i}`,
          tvl: (30 - i) * 100_000_000,
          change_1d: 0,
          category: 'X',
          symbol: `P${i}`,
          chains: ['Ethereum'],
          logo: '',
        })),
        { name: 'Zero', tvl: 0, change_1d: 0, category: 'X', symbol: 'Z', chains: [], logo: '' },
      ]
      server.use(http.get('https://api.llama.fi/protocols', () => HttpResponse.json(protocols)))

      const out = await fetchDeFiProtocols()
      expect(out).toHaveLength(25)
      expect(out[0].name).toBe('P0')
      expect(out.find((p) => p.name === 'Zero')).toBeUndefined()
    })

    it('throws on upstream failure', async () => {
      server.use(
        http.get('https://api.llama.fi/protocols', () =>
          HttpResponse.json({ error: 'down' }, { status: 500 }),
        ),
      )
      await expect(fetchDeFiProtocols()).rejects.toThrow()
    })
  })

  describe('fetchDeFiChains', () => {
    it('sorts desc and caps at 10', async () => {
      const chains = Array.from({ length: 20 }, (_, i) => ({
        gecko_id: `c${i}`,
        tvl: (20 - i) * 1_000_000_000,
        tokenSymbol: 'X',
        name: `Chain ${i}`,
      }))
      server.use(http.get('https://api.llama.fi/chains', () => HttpResponse.json(chains)))

      const out = await fetchDeFiChains()
      expect(out).toHaveLength(10)
      expect(out[0].name).toBe('Chain 0')
    })
  })

  describe('fetchGlobalTvlHistory', () => {
    it('returns the trailing 90 entries', async () => {
      const points = Array.from({ length: 200 }, (_, i) => ({
        date: 1_700_000_000 + i * 86400,
        tvl: 1_000_000_000 + i,
      }))
      server.use(
        http.get('https://api.llama.fi/v2/historicalChainTvl', () => HttpResponse.json(points)),
      )

      const out = await fetchGlobalTvlHistory()
      expect(out).toHaveLength(90)
      expect(out[0].tvl).toBe(points[110].tvl)
      expect(out[89].tvl).toBe(points[199].tvl)
    })
  })
})
