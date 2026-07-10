import { Navigate, useLocation } from 'react-router-dom'
import { usePermissions } from '@/hooks/usePermissions'

interface ModuleProtectedRouteProps {
  children: React.ReactNode
  path?: string
}

export function ModuleProtectedRoute({ children, path }: ModuleProtectedRouteProps) {
  const location = useLocation()
  const { canAccessPath } = usePermissions()
  const targetPath = path ?? location.pathname

  if (!canAccessPath(targetPath)) {
    return <Navigate to="/dashboard" replace state={{ from: targetPath }} />
  }

  return children
}
