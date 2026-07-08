import { useLocation } from 'react-router-dom'
import { moduleNavItems } from '@/data/navConfig'
import { UnderConstructionPage } from '@/pages/UnderConstructionPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function ModulePlaceholderPage() {
  const { pathname } = useLocation()
  const module = moduleNavItems.find((item) => item.path === pathname)

  if (!module) {
    return <NotFoundPage />
  }

  return (
    <UnderConstructionPage
      title={module.label}
      description={module.description}
      icon={module.icon}
    />
  )
}
