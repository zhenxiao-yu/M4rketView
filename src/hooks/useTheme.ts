import { useEffect } from 'react'
import { useUIStore } from '@/store/uiStore'

export function useTheme() {
  const { theme, toggleTheme } = useUIStore()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [theme])

  return { theme, toggleTheme }
}
