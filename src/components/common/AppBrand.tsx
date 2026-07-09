import ucLogo from '@/assets/uc-logo.png'
import { cn } from '@/utils/cn'

export const APP_NAME = 'University of Cebu'

interface AppBrandProps {
  showTitle?: boolean
  logoClassName?: string
  titleClassName?: string
  className?: string
}

export function AppBrand({
  showTitle = true,
  logoClassName,
  titleClassName,
  className,
}: AppBrandProps) {
  return (
    <div className={cn('flex items-center gap-2.5 min-w-0', className)}>
      <img
        src={ucLogo}
        alt={APP_NAME}
        className={cn('h-8 w-auto shrink-0 object-contain', logoClassName)}
      />
      {showTitle && (
        <span
          className={cn(
            'font-brand font-semibold text-gh-fg text-sm leading-tight',
            titleClassName,
          )}
        >
          {APP_NAME}
        </span>
      )}
    </div>
  )
}
