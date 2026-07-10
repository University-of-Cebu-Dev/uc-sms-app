import { portalModules } from '@/data/modulePermissions'

const ALWAYS_ALLOWED_PREFIXES = ['/profile']

export function getModuleForPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/'

  const matches = portalModules.filter((module) => {
    if (module.path === normalized) return true
    return normalized.startsWith(`${module.path}/`)
  })

  return matches.sort((a, b) => b.path.length - a.path.length)[0]
}

export function canAccessPath(
  pathname: string,
  permissions: ReadonlySet<string>,
  isSuperAdmin: boolean,
) {
  if (isSuperAdmin) return true

  if (pathname.startsWith('/settings/accounts')) {
    return false
  }

  if (ALWAYS_ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true
  }

  const module = getModuleForPath(pathname)
  if (!module) return true

  return permissions.has(module.accessPermission)
}

export function getAccessibleModules(permissions: ReadonlySet<string>, isSuperAdmin: boolean) {
  if (isSuperAdmin) return portalModules

  return portalModules.filter((module) => permissions.has(module.accessPermission))
}
