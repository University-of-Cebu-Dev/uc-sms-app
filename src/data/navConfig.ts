import { LayoutDashboard, Settings, type LucideIcon } from 'lucide-react'

export interface MainNavItem {
  label: string
  path: string
  icon: LucideIcon
}

export const mainNavItems: MainNavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Settings', path: '/settings', icon: Settings },
]
