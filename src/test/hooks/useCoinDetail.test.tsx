import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { useCoinDetail } from '@/hooks/useCoinDetail'

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  return function TestWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe('useCoinDetail', () => {
  it('returns coin detail data on success', async () => {
    const { result } = renderHook(() => useCoinDetail('bitcoin'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.id).toBe('bitcoin')
    expect(result.current.data?.market_data.current_price.usd).toBe(45000)
  })

  it('is disabled when id is undefined', () => {
    const { result } = renderHook(() => useCoinDetail(undefined), { wrapper: makeWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.data).toBeUndefined()
  })

  it('surfaces error on 404', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/:id', () =>
        HttpResponse.json({ error: 'coin not found' }, { status: 404 }),
      ),
    )
    const { result } = renderHook(() => useCoinDetail('not-a-real-coin'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeInstanceOf(Error)
  })
})
