import { Link } from 'react-router-dom'
import logo from '@/assets/logo.svg'

const Logo = () => (
  <Link
    to="/"
    aria-label="M4rketView home"
    className="inline-flex items-center gap-2.5 mt-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-lg"
  >
    {/* Icon and wordmark share the same 32px box height for a clean baseline. */}
    <img
      src={logo}
      alt=""
      aria-hidden="true"
      className="h-8 w-8 transition-transform duration-200 group-hover:scale-105"
    />
    <span
      className="font-display font-bold uppercase tracking-[0.08em] text-[20px] leading-none flex items-center h-8"
      style={{ fontFeatureSettings: '"ss01"' }}
    >
      <span className="text-foreground">M4RKET</span>
      <span className="text-accent">VIEW</span>
    </span>
  </Link>
)

export default Logo
