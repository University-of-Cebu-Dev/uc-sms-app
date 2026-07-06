import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface SidebarContextValue {
  isOpen: boolean
  isCollapsed: boolean
  toggle: () => void
  open: () => void
  close: () => void
  toggleCollapse: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggle = useCallback(() => setIsOpen((v) => !v), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggleCollapse = useCallback(() => setIsCollapsed((v) => !v), [])

  return (
    <SidebarContext.Provider
      value={{ isOpen, isCollapsed, toggle, open, close, toggleCollapse }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}
