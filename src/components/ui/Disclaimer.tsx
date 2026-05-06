import { ShieldAlert } from 'lucide-react'

interface Props {
  className?: string
}

const Disclaimer = ({ className = '' }: Props) => (
  <p className={`flex items-start gap-1.5 text-xs text-gray-100/50 leading-relaxed ${className}`}>
    <ShieldAlert size={11} className="mt-0.5 shrink-0" />
    Market data is for informational purposes only and may be delayed or cached.
    Not financial advice — always verify before making financial decisions.
  </p>
)

export default Disclaimer
