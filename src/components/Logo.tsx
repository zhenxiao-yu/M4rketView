import { Link } from 'react-router-dom'
import logo from '@/assets/logo.svg'

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 mt-6">
    <img src={logo} alt="M4rketView logo" className="w-10 h-10" />
    <span className="text-lg font-bold text-cyan font-nunito tracking-wide">M4rketView</span>
  </Link>
)

export default Logo
