import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, TrendingUp, Bookmark, BarChart3,
  MoreHorizontal, GitCompare, Newspaper, Grid2X2,
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

const PRIMARY = [
  { to: '/',           label: 'Home',      icon: LayoutDashboard, end: true },
  { to: '/markets',    label: 'Markets',   icon: TrendingUp },
  { to: '/trending',   label: 'Trending',  icon: TrendingUp },
  { to: '/saved',      label: 'Saved',     icon: Bookmark },
  { to: '/portfolio',  label: 'Portfolio', icon: BarChart3 },
]

const SECONDARY = [
  { to: '/compare', label: 'Compare', icon: GitCompare },
  { to: '/news',    label: 'News',    icon: Newspaper },
  { to: '/heatmap', label: 'Heatmap', icon: Grid2X2 },
]

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[52px] px-1 py-1 text-[10px] font-semibold transition-colors ${
    isActive ? 'text-accent' : 'text-muted hover:text-accent'
  }`

const BottomNav = () => {
  const { compareCoins } = useUIStore()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      {/* More-menu sheet */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              key="more-overlay"
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              key="more-sheet"
              className="md:hidden fixed left-0 right-0 z-50 bg-surface border-t border-accent/30 rounded-t-2xl"
              style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="grid grid-cols-3 gap-2 p-4">
                {SECONDARY.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      `relative flex flex-col items-center gap-1.5 py-3 rounded-xl border ${
                        isActive
                          ? 'bg-accent/10 border-accent text-accent'
                          : 'border-border/20 text-muted'
                      }`
                    }
                  >
                    <div className="relative">
                      <Icon size={20} />
                      {label === 'Compare' && compareCoins.length > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 bg-accent text-accent-foreground rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                          {compareCoins.length}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold">{label}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-md border-t border-accent/20"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Primary mobile navigation"
      >
        <div className="flex items-stretch">
          {PRIMARY.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={itemClass}
              onClick={() => setMoreOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[52px] px-1 py-1 text-[10px] font-semibold transition-colors ${
              moreOpen ? 'text-accent' : 'text-muted hover:text-accent'
            }`}
            aria-expanded={moreOpen}
            aria-label="More menu"
          >
            <div className="relative">
              <MoreHorizontal size={18} />
              {compareCoins.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-accent text-accent-foreground rounded-full text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold">
                  {compareCoins.length}
                </span>
              )}
            </div>
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  )
}

export default BottomNav
