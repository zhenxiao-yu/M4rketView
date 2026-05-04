import { NavLink } from 'react-router-dom'
import { Sun, Moon, BarChart3, GitCompare } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useUIStore } from '@/store/uiStore'
import { useAlertStore } from '@/store/alertStore'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `w-full text-base text-center font-nunito m-2.5 border-0 cursor-pointer rounded capitalize font-semibold transition-all duration-200 ${
    isActive
      ? 'bg-cyan text-gray-300'
      : 'bg-gray-200 text-gray-100 hover:text-cyan'
  }`

const Navigation = () => {
  const { theme, toggleTheme } = useTheme()
  const { compareCoins } = useUIStore()
  const { activeCount } = useAlertStore()
  const alertCount = activeCount()

  return (
    <nav className="w-full max-w-4xl mt-8 px-4">
      <div className="flex items-center justify-between border border-cyan rounded-xl p-1 bg-gray-200/30 backdrop-blur-sm">
        <div className="flex flex-1">
          <NavLink to="/" end className={navLinkClass}>
            Crypto
          </NavLink>
          <NavLink to="/trending" className={navLinkClass}>
            Trending
          </NavLink>
          <NavLink to="/saved" className={navLinkClass}>
            Saved
          </NavLink>
          <NavLink to="/portfolio" className={navLinkClass}>
            <span className="flex items-center justify-center gap-1">
              <BarChart3 size={14} />
              Portfolio
            </span>
          </NavLink>
          <NavLink to="/compare" className={navLinkClass}>
            <span className="flex items-center justify-center gap-1">
              <GitCompare size={14} />
              Compare
              {compareCoins.length > 0 && (
                <span className="bg-cyan text-gray-300 rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold">
                  {compareCoins.length}
                </span>
              )}
            </span>
          </NavLink>
        </div>

        <div className="flex items-center gap-2 ml-2 mr-1">
          {alertCount > 0 && (
            <NavLink
              to="/alerts"
              className="relative text-gray-100 hover:text-cyan transition-colors"
            >
              <span className="absolute -top-1 -right-1 bg-red text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {alertCount}
              </span>
              🔔
            </NavLink>
          )}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-gray-200 text-gray-100 hover:text-cyan transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
