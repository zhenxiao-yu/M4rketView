import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCompareCharts } from '@/hooks/useCompareCharts'
import { makeQueryWrapper } from '@/test/helpers/queryWrapper'

describe('useCompareCharts', () => {
  it('is disabled with fewer than 2 coin ids', () => {
    const { result } = renderHook(() => useCompareCharts(['bitcoin'], 'usd'), {
      wrapper: makeQueryWrapper(),
    })
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('returns a price map keyed by coin id when 2+ coins are provided', async () => {
    const { result } = renderHook(
      () => useCompareCharts(['bitcoin', 'ethereum'], 'usd'),
      { wrapper: makeQueryWrapper() },
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(Object.keys(result.current.data ?? {})).toEqual(['bitcoin', 'ethereum'])
    expect(result.current.data?.bitcoin.length).toBeGreaterThan(0)
  })
})
