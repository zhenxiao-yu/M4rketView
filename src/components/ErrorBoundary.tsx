import { Component, type ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red/10 flex items-center justify-center">
          <AlertCircle size={32} className="text-red" />
        </div>
        <div>
          <p className="font-bold text-lg">Something went wrong</p>
          <p className="text-sm text-gray-100 mt-2 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-gray-200/40 border border-gray-100/20 rounded-xl text-sm hover:border-cyan/50 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={14} /> Reload page
        </button>
      </div>
    )
  }
}

export default ErrorBoundary
