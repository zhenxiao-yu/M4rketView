import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { useGlobalData } from '@/hooks/useGlobalData'
import { makeQueryWrapper } from '@/test/helpers/queryWrapper'

describe('useGlobalData', () => {
  it('returns global market data on success', async () => {
    const { result } = renderHook(() => useGlobalData(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data.active_cryptocurrencies).toBe(13000)
    expect(result.current.data?.data.total_market_cap.usd).toBe(1800000000000)
    expect(result.current.data?.data.market_cap_percentage.btc).toBeCloseTo(52.4)
  })

  it('surfaces error when /global fails', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/global', () =>
        HttpResponse.json({ error: 'down' }, { status: 500 }),
      ),
    )
    const { result } = renderHook(() => useGlobalData(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
