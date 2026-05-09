import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { useFearGreed } from '@/hooks/useFearGreed'
import { makeQueryWrapper } from '@/test/helpers/queryWrapper'

describe('useFearGreed', () => {
  it('returns the latest sentiment value', async () => {
    const { result } = renderHook(() => useFearGreed(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.value).toBe('65')
    expect(result.current.data?.value_classification).toBe('Greed')
  })

  it('surfaces error when alternative.me fails', async () => {
    server.use(
      http.get('https://api.alternative.me/fng/', () =>
        HttpResponse.json({ error: 'down' }, { status: 500 }),
      ),
    )
    const { result } = renderHook(() => useFearGreed(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
