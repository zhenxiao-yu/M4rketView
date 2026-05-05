import { NavLink } from 'react-router-dom'
import { Sun, Moon, BarChart3, GitCompare, Bell, LayoutDashboard, TrendingUp, Bookmark, Search } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useUIStore } from '@/store/uiStore'
import { useAlertStore } from '@/store/alertStore'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center justify-center gap-1 text-sm text-center font-nunito m-1 px-3 py-1.5 border-0 cursor-pointer rounded-lg capitalize font-semibold transition-all duration-200 ${
    isActive
      ? 'bg-cyan text-gray-300'
      : 'bg-transparent text-gray-100 hover:text-cyan hover:bg-gray-200/40'
  }`

const Navigation = () => {
  const { theme, toggleTheme } = useTheme()
  const { compareCoins, setSearchOpen } = useUIStore()
  const { activeCount } = useAlertStore()
  const alertCount = activeCount()

  return (
    <nav className="w-full max-w-5xl mt-6 px-4">
      <div className="flex items-center justify-between border border-cyan/30 rounded-xl p-1 bg-gray-200/30 backdrop-blur-sm">
        <div className="flex flex-1 flex-wrap gap-0.5">
          <NavLink to="/" end className={navLinkClass}>
            <LayoutDashboard size={13} />
            Dashboard
          </NavLink>
          <NavLink to="/markets" className={navLinkClass}>
            <TrendingUp size={13} />
            Markets
          </NavLink>
          <NavLink to="/trending" className={navLinkClass}>
            Trending
          </NavLink>
          <NavLink to="/saved" className={navLinkClass}>
            <Bookmark size={13} />
            Saved
          </NavLink>
          <NavLink to="/portfolio" className={navLinkClass}>
            <BarChart3 size={13} />
            Portfolio
          </NavLink>
          <NavLink to="/compare" className={navLinkClass}>
            <GitCompare size={13} />
            Compare
            {compareCoins.length > 0 && (
              <span className="bg-cyan text-gray-300 rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold ml-0.5">
                {compareCoins.length}
              </span>
            )}
          </NavLink>
        </div>

        <div className="flex items-center gap-1 ml-2 mr-1">
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
              title="Price alerts"
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
      </div>
    </nav>
  )
}

export default Navigation
