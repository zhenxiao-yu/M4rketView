import { useLocation, NavLink } from 'react-router-dom'
import {
  BarChart3, GitCompare, Bell, LayoutDashboard,
  TrendingUp, Bookmark, Search, Newspaper, Grid2X2,
} from 'lucide-react'
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

const Navigation = () => {
  const { compareCoins, setSearchOpen } = useUIStore()
  const { activeCount } = useAlertStore()
  const alertCount = activeCount()
  const location = useLocation()

  const currentLabel =
    NAV_ITEMS.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))?.label ??
    'M4rketView'

  const actions = (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setSearchOpen(true)}
        className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-gray-200/50 text-gray-100 hover:text-cyan transition-colors"
        aria-label="Search (Ctrl+K)"
        title="Search (Ctrl+K)"
      >
        <Search size={18} />
      </button>
      <div className="relative">
        <button
          className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-gray-200/50 text-gray-100 hover:text-cyan transition-colors"
          aria-label="Price alerts"
        >
          <Bell size={18} />
        </button>
        {alertCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold pointer-events-none">
            {alertCount}
          </span>
        )}
      </div>
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

      {/* Mobile top bar — current page + actions; primary nav lives in BottomNav */}
      <div className="md:hidden border border-cyan/30 rounded-xl bg-gray-200/30 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <span
            className="text-sm font-semibold text-cyan truncate flex-1 min-w-0"
            aria-live="polite"
          >
            {currentLabel}
          </span>
          {actions}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
