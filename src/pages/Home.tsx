import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import Logo from '@/components/Logo'
import Navigation from '@/components/Navigation'
import BottomNav from '@/components/BottomNav'
import Footer from '@/components/Footer'
import SearchCommand from '@/components/SearchCommand'
import ErrorBoundary from '@/components/ErrorBoundary'
import ScrollToTop from '@/components/ScrollToTop'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { useTheme } from '@/hooks/useTheme'
import { useCryptoMarkets } from '@/hooks/useCryptoMarkets'
import { useAlertStore } from '@/store/alertStore'
import { useMarketStore } from '@/store/marketStore'

const pageVariants: Variants = {
  initial: { opacity: 0, y: 14, filter: 'blur(3px)' },
  animate: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0, y: -6, filter: 'blur(2px)',
    transition: { duration: 0.15, ease: 'easeIn' },
  },
}

const AlertChecker = () => {
  const { data } = useCryptoMarkets()
  const { alerts, markTriggered } = useAlertStore()
  const { currency } = useMarketStore()

  useEffect(() => {
    if (!data) return
    alerts.forEach((alert) => {
      if (alert.triggered) return
      const coin = data.find((c) => c.id === alert.coinId)
      if (!coin) return
      const price = coin.current_price
      const triggered =
        alert.direction === 'above' ? price >= alert.targetPrice : price <= alert.targetPrice
      if (triggered) {
        markTriggered(alert.id)
        toast.success(
          `${alert.coinName} price ${alert.direction === 'above' ? 'crossed above' : 'dropped below'} ${alert.targetPrice} ${currency.toUpperCase()}`,
          { duration: 6000, icon: '🔔' }
        )
      }
    })
  }, [data, alerts, markTriggered, currency])

  return null
}

const Home = () => {
  useTheme()
  const location = useLocation()

  return (
    <main className="w-full min-h-screen min-h-[100dvh] flex flex-col items-center text-white">
      <div className="fixed inset-0 bg-background -z-10" />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', fontSize: '14px' },
        }}
      />
      <AlertChecker />
      <ScrollToTop />
      <SearchCommand />
      <Logo />
      <Navigation />
      <div className="w-full max-w-7xl px-4 flex-1 pb-20 md:pb-0">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </div>
      <Footer />
      <ScrollToTopButton />
      <BottomNav />
    </main>
  )
}

export default Home
