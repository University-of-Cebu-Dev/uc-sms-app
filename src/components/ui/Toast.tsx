import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import type { ToastType } from '@/types'
import { cn } from '@/utils/cn'

const icons: Record<ToastType, typeof Info> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles: Record<ToastType, string> = {
  success: 'border-gh-success/30 bg-gh-success-subtle text-gh-success',
  error: 'border-gh-danger/30 bg-gh-danger-subtle text-gh-danger',
  warning: 'border-gh-warning/30 bg-gh-warning-subtle text-gh-warning',
  info: 'border-gh-accent/30 bg-gh-canvas-subtle text-gh-accent',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-slide-up',
              styles[toast.type],
            )}
            role="alert"
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.message && (
                <p className="text-xs mt-0.5 opacity-80">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
