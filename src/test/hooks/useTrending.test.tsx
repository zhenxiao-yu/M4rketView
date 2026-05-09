import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { useTrending } from '@/hooks/useTrending'
import { makeQueryWrapper } from '@/test/helpers/queryWrapper'

describe('useTrending', () => {
  it('returns trending coins on success', async () => {
    const { result } = renderHook(() => useTrending(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].item.id).toBe('bitcoin')
  })

  it('surfaces error when CoinGecko fails', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/search/trending', () =>
        HttpResponse.json({ error: 'down' }, { status: 500 }),
      ),
    )
    const { result } = renderHook(() => useTrending(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
