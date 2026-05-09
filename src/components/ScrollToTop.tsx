import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to the top of the page on route change.
 * React Router doesn't do this by default — without it, navigating
 * from a long page (e.g. /markets page 5) into /coin/btc lands the
 * user mid-page on the new route. Respects prefers-reduced-motion.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'auto' : 'smooth' })
  }, [pathname])

  return null
}

export default ScrollToTop
