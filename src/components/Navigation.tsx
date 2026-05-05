import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Sun, Moon, BarChart3, GitCompare, Bell, LayoutDashboard,
  TrendingUp, Bookmark, Search, Newspaper, Grid2X2, Menu, X,
} from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useUIStore } from '@/store/uiStore'
import { useAlertStore } from '@/store/alertStore'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={14} />, end: true },
  { to: '/markets', label: 'Markets', icon: <TrendingUp size={14} /> },
  { to: '/trending', label: 'Trending', icon: <TrendingUp size={14} /> },
  { to: '/saved', label: 'Saved', icon: <Bookmark size={14} /> },
  { to: '/portfolio', label: 'Portfolio', icon: <BarChart3 size={14} /> },
  { to: '/compare', label: 'Compare', icon: <GitCompare size={14} /> },
  { to: '/news', label: 'News', icon: <Newspaper size={14} /> },
  { to: '/heatmap', label: 'Heatmap', icon: <Grid2X2 size={14} /> },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap ${
    isActive
      ? 'bg-cyan text-gray-300'
      : 'text-gray-100 hover:text-cyan hover:bg-gray-200/40'
  }`

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all duration-150 ${
    isActive
      ? 'bg-cyan text-gray-300'
      : 'text-gray-100 hover:text-cyan hover:bg-gray-200/40'
  }`

const Navigation = () => {
  const { theme, toggleTheme } = useTheme()
  const { compareCoins, setSearchOpen } = useUIStore()
  const { activeCount } = useAlertStore()
  const alertCount = activeCount()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const actions = (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setSearchOpen(true)}
        className="p-1.5 rounded-lg bg-gray-200/50 text-gray-100 hover:text-cyan transition-colors"
        aria-label="Search (Ctrl+K)"
        title="Search (Ctrl+K)"
      >
        <Search size={15} />
      </button>
      <div className="relative">
        <button
          className="p-1.5 rounded-lg bg-gray-200/50 text-gray-100 hover:text-cyan transition-colors"
          aria-label="Price alerts"
        >
          <Bell size={15} />
        </button>
        {alertCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold pointer-events-none">
            {alertCount}
          </span>
        )}
      </div>
      <button
        onClick={toggleTheme}
        className="p-1.5 rounded-lg bg-gray-200/50 text-gray-100 hover:text-cyan transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </div>
  )

  return (
    <nav className="w-full max-w-5xl mt-6 px-4">
      {/* Desktop nav */}
      <div className="hidden md:flex items-center justify-between border border-cyan/30 rounded-xl p-1 bg-gray-200/30 backdrop-blur-sm">
        <div className="flex flex-1 flex-wrap gap-0.5">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {icon}
              {label}
              {label === 'Compare' && compareCoins.length > 0 && (
                <span className="bg-cyan text-gray-300 rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold">
                  {compareCoins.length}
                </span>
              )}
            </NavLink>
          ))}
        </div>
        <div className="ml-2 mr-1">{actions}</div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border border-cyan/30 rounded-xl bg-gray-200/30 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Current route label */}
          <span className="text-sm font-semibold text-cyan capitalize">
            {NAV_ITEMS.find((n) => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to))?.label ?? 'M4rketView'}
          </span>
          <div className="flex items-center gap-1">
            {actions}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="p-1.5 rounded-lg bg-gray-200/50 text-gray-100 hover:text-cyan transition-colors ml-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="grid grid-cols-2 gap-1 p-2 pt-0 border-t border-cyan/20">
                {NAV_ITEMS.map(({ to, label, icon, end }) => (
                  <NavLink key={to} to={to} end={end} className={mobileLinkClass}>
                    {icon}
                    {label}
                    {label === 'Compare' && compareCoins.length > 0 && (
                      <span className="bg-cyan text-gray-300 rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold ml-auto">
                        {compareCoins.length}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navigation
