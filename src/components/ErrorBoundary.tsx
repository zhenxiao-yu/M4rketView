import { Component, type ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

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
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
          <AlertCircle size={32} className="text-danger" />
        </div>
        <div>
          <p className="font-bold text-lg">Something went wrong</p>
          <p className="text-sm text-muted mt-2 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
        </div>
        <Button variant="secondary" size="lg" onClick={() => window.location.reload()}>
          <RefreshCw size={14} /> Reload page
        </Button>
      </div>
    )
  }
}

export default ErrorBoundary
