import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import Logo from '@/components/Logo'
import Navigation from '@/components/Navigation'
import SearchCommand from '@/components/SearchCommand'
import { useTheme } from '@/hooks/useTheme'
import { useCryptoMarkets } from '@/hooks/useCryptoMarkets'
import { useAlertStore } from '@/store/alertStore'
import { useMarketStore } from '@/store/marketStore'

const pageVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
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
        if (Notification.permission === 'granted') {
          new Notification(`Price Alert: ${alert.coinName}`, {
            body: `Price ${alert.direction === 'above' ? 'crossed above' : 'dropped below'} ${alert.targetPrice} ${currency.toUpperCase()}`,
            icon: alert.coinImage,
          })
        }
      }
    })
  }, [data, alerts, markTriggered, currency])

  return null
}

const Home = () => {
  useTheme()
  const location = useLocation()

  return (
    <main className="w-full min-h-screen flex flex-col items-center font-nunito text-white">
      <div className="fixed inset-0 bg-gray-300 -z-10" />
      <AlertChecker />
      <SearchCommand />
      <Logo />
      <Navigation />
      <div className="w-full max-w-7xl px-4">
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
      </div>
    </main>
  )
}

export default Home
