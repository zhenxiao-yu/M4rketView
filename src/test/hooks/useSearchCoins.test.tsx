import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSearchCoins } from '@/hooks/useSearchCoins'
import { makeQueryWrapper } from '@/test/helpers/queryWrapper'

describe('useSearchCoins', () => {
  it('is disabled for queries shorter than 2 chars', () => {
    const { result } = renderHook(() => useSearchCoins('b'), { wrapper: makeQueryWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.data).toBeUndefined()
  })

  it('is disabled for whitespace-only input', () => {
    const { result } = renderHook(() => useSearchCoins('   '), { wrapper: makeQueryWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('runs and returns matches for >=2 char queries', async () => {
    const { result } = renderHook(() => useSearchCoins('btc'), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.[0].id).toBe('bitcoin')
  })
})
