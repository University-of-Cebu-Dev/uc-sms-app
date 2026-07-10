import { usePortalBranding } from '@/hooks/usePortalBranding'
import { formatPortalBrandLabel } from '@/data/portalBrandingDefaults'
import { cn } from '@/utils/cn'

interface AppBrandProps {
  showTitle?: boolean
  variant?: 'default' | 'featured'
  logoClassName?: string
  titleClassName?: string
  campusClassName?: string
  className?: string
}

export function AppBrand({
  showTitle = true,
  variant = 'default',
  logoClassName,
  titleClassName,
  campusClassName,
  className,
}: AppBrandProps) {
  const { schoolName, campusName, logoUrl } = usePortalBranding()
  const brandLabel = formatPortalBrandLabel(schoolName, campusName)
  const isFeatured = variant === 'featured'

  return (
    <div className={cn('flex items-center gap-2.5 min-w-0', className)}>
      <img
        src={logoUrl}
        alt={brandLabel}
        className={cn('h-8 w-auto shrink-0 object-contain', logoClassName)}
      />
      {showTitle && (
        <div className={cn('min-w-0', isFeatured && 'text-center')}>
          <span
            className={cn(
              'block font-brand font-semibold text-gh-fg text-sm leading-tight',
              !isFeatured && 'truncate',
              titleClassName,
            )}
          >
            {schoolName}
          </span>
          {campusName ? (
            isFeatured ? (
              <span
                className={cn(
                  'mt-2 inline-flex max-w-full items-center justify-center rounded-lg',
                  'bg-[#00a8e8]/12 px-3 py-1.5 text-sm sm:text-base font-semibold leading-snug',
                  'text-[#003087] ring-1 ring-[#00a8e8]/30 whitespace-normal',
                  campusClassName,
                )}
              >
                {campusName}
              </span>
            ) : (
              <span
                className={cn(
                  'block text-[11px] leading-snug text-gh-fg-muted truncate',
                  campusClassName,
                )}
              >
                {campusName}
              </span>
            )
          ) : null}
        </div>
      )}
    </div>
  )
}
