import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '@/hooks/useTheme'
import { useUIStore } from '@/store/uiStore'

describe('useTheme', () => {
  beforeEach(() => {
    useUIStore.setState({ theme: 'dark' })
    document.documentElement.classList.remove('dark', 'light')
  })

  it('applies the dark class to <html> on mount when theme is dark', () => {
    renderHook(() => useTheme())
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
  })

  it('toggles the html class when toggleTheme is called', () => {
    const { result } = renderHook(() => useTheme())
    act(() => {
      result.current.toggleTheme()
    })
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('returns the current theme value', () => {
    useUIStore.setState({ theme: 'light' })
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })
})
