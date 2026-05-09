import { Link } from 'react-router-dom'
import logo from '@/assets/logo.svg'

const Logo = () => (
  <Link
    to="/"
    aria-label="M4rketView home"
    className="flex items-center gap-2.5 mt-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-lg"
  >
    <img
      src={logo}
      alt=""
      aria-hidden="true"
      className="w-9 h-9 transition-transform duration-200 group-hover:scale-105"
    />
    <span className="text-base font-semibold text-foreground tracking-tight">
      M4rket<span className="text-accent">View</span>
    </span>
  </Link>
)

export default Logo
