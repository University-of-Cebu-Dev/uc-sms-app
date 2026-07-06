import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface DropdownItem {
  label: string
  onClick?: () => void
  icon?: ReactNode
  danger?: boolean
  divider?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
  hideChevron?: boolean
}

export function Dropdown({ trigger, items, align = 'right', className, hideChevron = false }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 cursor-pointer"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {trigger}
        {!hideChevron && (
          <ChevronDown
            className={cn('h-4 w-4 text-gh-fg-muted transition-transform', open && 'rotate-180')}
          />
        )}
      </button>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-48 rounded-md border border-gh-border bg-gh-canvas py-1 shadow-lg animate-fade-in',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          role="menu"
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="my-1 border-t border-gh-border" role="separator" />
            ) : (
              <button
                key={i}
                type="button"
                role="menuitem"
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
                  item.danger
                    ? 'text-gh-danger hover:bg-gh-danger-subtle'
                    : 'text-gh-fg hover:bg-gh-canvas-subtle',
                )}
                onClick={() => {
                  item.onClick?.()
                  setOpen(false)
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
