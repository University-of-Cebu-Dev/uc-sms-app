import { RolePermissionsManager } from '@/features/settings/RolePermissionsManager'

export function RolesSettings() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-gh-fg">Roles & Permissions</h2>
        <p className="mt-1 text-sm text-gh-fg-muted">
          Configure which portal modules each user type can access. Changes are stored in UC Identity
          Service.
        </p>
      </div>
      <RolePermissionsManager />
    </div>
  )
}
