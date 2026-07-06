import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gh-canvas-subtle p-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gh-border">404</p>
        <EmptyState
          title="Page not found"
          description="The page you're looking for doesn't exist or has been moved."
          action={{
            label: 'Go to Dashboard',
            onClick: () => {},
          }}
        />
        <div className="flex items-center justify-center gap-3 -mt-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
          <Link to="/dashboard">
            <Button>
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
