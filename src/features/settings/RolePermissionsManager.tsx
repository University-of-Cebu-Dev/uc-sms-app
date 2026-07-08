import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  LayoutGrid,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { rolesApi, type RoleRecord } from '@/services/roles'
import { getIdentityRoleMeta } from '@/data/identityRoles'
import {
  getModulePermissionIds,
  portalModules,
  rolesPermissionsManage,
} from '@/data/modulePermissions'
import { useToast } from '@/hooks/useToast'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/utils/cn'
import { ApiError } from '@/lib/api'

interface ModuleToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}

function ModuleToggle({ checked, onChange, label, disabled = false }: ModuleToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative mx-auto block h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-gh-accent' : 'bg-gh-border',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
          checked && 'translate-x-5',
        )}
      />
    </button>
  )
}

export function RolePermissionsManager() {
  const { addToast } = useToast()
  const [roles, setRoles] = useState<RoleRecord[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [draftPermissions, setDraftPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [roleSearch, setRoleSearch] = useState('')
  const [moduleSearch, setModuleSearch] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)

  const getLoadErrorMessage = (error: unknown) => {
    if (error instanceof TypeError) {
      return 'Cannot reach Identity Service. Start UCIdentityService and try again.'
    }

    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) {
        return 'You are not authorized. Sign in as SuperAdmin to manage roles.'
      }
      if (error.status === 404) {
        return 'Roles API not found. Restart and update UCIdentityService.'
      }
      return `Identity Service returned ${error.status}: ${error.message}`
    }

    return 'Could not load roles from the identity service.'
  }

  const loadRoles = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await rolesApi.list()
      setRoles(data)
      setSelectedRoleId((current) => current ?? data[0]?.name ?? null)
    } catch (error) {
      const message = getLoadErrorMessage(error)
      setLoadError(message)
      addToast('error', 'Load failed', message)
      setRoles([])
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    void loadRoles()
  }, [loadRoles])

  const selectedRole = useMemo(
    () => roles.find((role) => role.name === selectedRoleId) ?? null,
    [roles, selectedRoleId],
  )

  useEffect(() => {
    if (!selectedRole) {
      setDraftPermissions([])
      return
    }

    setDraftPermissions(getModulePermissionIds(selectedRole.permissions))
  }, [selectedRole])

  const filteredRoles = useMemo(() => {
    const query = roleSearch.trim().toLowerCase()
    if (!query) return roles

    return roles.filter((role) => {
      const meta = getIdentityRoleMeta(role.name)
      return (
        role.name.toLowerCase().includes(query) ||
        meta.label.toLowerCase().includes(query) ||
        meta.description.toLowerCase().includes(query)
      )
    })
  }, [roles, roleSearch])

  const filteredModules = useMemo(() => {
    const query = moduleSearch.trim().toLowerCase()
    if (!query) return portalModules

    return portalModules.filter(
      (module) =>
        module.label.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query),
    )
  }, [moduleSearch])

  const enabledCount = draftPermissions.length
  const totalModules = portalModules.length
  const hasChanges = useMemo(() => {
    if (!selectedRole) return false
    const current = getModulePermissionIds(selectedRole.permissions).sort().join('|')
    const draft = [...draftPermissions].sort().join('|')
    return current !== draft
  }, [draftPermissions, selectedRole])

  const handleToggleModule = (permission: string, enabled: boolean) => {
    setDraftPermissions((current) => {
      if (enabled) {
        return current.includes(permission) ? current : [...current, permission]
      }
      return current.filter((item) => item !== permission)
    })
  }

  const handleSelectAll = () => {
    setDraftPermissions(portalModules.map((module) => module.accessPermission))
  }

  const handleClearAll = () => {
    setDraftPermissions([])
  }

  const handleSave = async () => {
    if (!selectedRole) return

    setIsSaving(true)
    try {
      const canManage = draftPermissions.includes('UCSMS.Modules.RolesPermissions.Access')
      const payload = canManage
        ? [...draftPermissions, rolesPermissionsManage]
        : draftPermissions.filter((permission) => permission !== rolesPermissionsManage)

      const updated = await rolesApi.updatePermissions(selectedRole.name, payload)
      setRoles((current) =>
        current.map((role) => (role.name === updated.name ? updated : role)),
      )
      addToast('success', 'Permissions saved', `${getIdentityRoleMeta(updated.name).label} module access updated.`)
    } catch {
      addToast('error', 'Save failed', 'Could not update role permissions.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner label="Loading roles and permissions" />
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <Card className="p-8 text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-gh-fg-muted" aria-hidden="true" />
        <h3 className="mt-4 text-base font-semibold text-gh-fg">No roles available</h3>
        <p className="mt-2 text-sm text-gh-fg-muted max-w-md mx-auto">
          {loadError ??
            'Sign in as SuperAdmin and ensure UC Identity Service is running. Roles are seeded on identity service startup.'}
        </p>
        <Button className="mt-4" variant="outline" onClick={() => void loadRoles()}>
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </Card>
    )
  }

  const selectedMeta = selectedRole ? getIdentityRoleMeta(selectedRole.name) : null
  const SelectedIcon = selectedMeta?.icon

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="border-gh-border/80 bg-gradient-to-br from-gh-canvas to-gh-canvas-subtle p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gh-accent/10 text-gh-accent">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gh-fg-subtle">User types</p>
              <p className="text-2xl font-semibold text-gh-fg">{roles.length}</p>
            </div>
          </div>
        </Card>

        <Card className="border-gh-border/80 bg-gradient-to-br from-gh-canvas to-gh-canvas-subtle p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <LayoutGrid className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gh-fg-subtle">Portal modules</p>
              <p className="text-2xl font-semibold text-gh-fg">{totalModules}</p>
            </div>
          </div>
        </Card>

        <Card className="border-gh-border/80 bg-gradient-to-br from-gh-canvas to-gh-canvas-subtle p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gh-fg-subtle">Enabled for role</p>
              <p className="text-2xl font-semibold text-gh-fg">
                {enabledCount}
                <span className="text-sm font-normal text-gh-fg-muted"> / {totalModules}</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(260px,320px)_1fr]">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-gh-border bg-gradient-to-r from-gh-canvas-subtle to-gh-canvas px-4 py-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-gh-fg">User types</h3>
                <p className="text-xs text-gh-fg-muted">Identity roles from UC Identity Service</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => void loadRoles()} aria-label="Refresh roles">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative mt-3">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gh-fg-subtle"
                aria-hidden="true"
              />
              <Input
                value={roleSearch}
                onChange={(event) => setRoleSearch(event.target.value)}
                placeholder="Search roles..."
                className="pl-9"
              />
            </div>
          </div>

          <ul className="max-h-[32rem] overflow-y-auto p-2">
            {filteredRoles.map((role) => {
              const meta = getIdentityRoleMeta(role.name)
              const Icon = meta.icon
              const isActive = role.name === selectedRoleId
              const enabledModules = getModulePermissionIds(role.permissions).length

              return (
                <li key={role.name}>
                  <button
                    type="button"
                    onClick={() => setSelectedRoleId(role.name)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all',
                      isActive
                        ? 'bg-gh-accent/10 ring-1 ring-gh-accent/25 shadow-sm'
                        : 'hover:bg-gh-canvas-subtle',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1',
                        meta.accentBg,
                        meta.accentRing,
                      )}
                    >
                      <Icon className={cn('h-4 w-4', meta.accent)} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gh-fg">{meta.label}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {enabledModules}
                        </Badge>
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-gh-fg-muted">
                        {meta.description}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-gh-border bg-gradient-to-r from-gh-canvas-subtle to-gh-canvas px-4 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                {selectedMeta && SelectedIcon ? (
                  <span
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1',
                      selectedMeta.accentBg,
                      selectedMeta.accentRing,
                    )}
                  >
                    <SelectedIcon className={cn('h-5 w-5', selectedMeta.accent)} aria-hidden="true" />
                  </span>
                ) : null}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gh-fg">
                      {selectedMeta?.label ?? 'Select a role'}
                    </h3>
                    {hasChanges ? (
                      <Badge variant="warning" className="text-[10px]">
                        Unsaved
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-sm text-gh-fg-muted">
                    {selectedMeta?.description ?? 'Choose a user type to configure module access.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleClearAll} disabled={!selectedRole}>
                  Clear all
                </Button>
                <Button variant="outline" size="sm" onClick={handleSelectAll} disabled={!selectedRole}>
                  Enable all
                </Button>
                <Button
                  size="sm"
                  onClick={() => void handleSave()}
                  disabled={!selectedRole || !hasChanges || isSaving}
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </div>

            <div className="relative mt-4">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gh-fg-subtle"
                aria-hidden="true"
              />
              <Input
                value={moduleSearch}
                onChange={(event) => setModuleSearch(event.target.value)}
                placeholder="Search modules..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="divide-y divide-gh-border">
            {filteredModules.map((module) => {
              const Icon = module.icon
              const isEnabled = draftPermissions.includes(module.accessPermission)

              return (
                <div
                  key={module.id}
                  className={cn(
                    'flex items-center gap-4 px-4 py-4 transition-colors',
                    isEnabled && 'bg-gh-accent/[0.03]',
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gh-canvas-subtle ring-1 ring-gh-border">
                    <Icon className="h-5 w-5 text-gh-fg-muted" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-gh-fg">{module.label}</p>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {module.group}
                      </Badge>
                      {isEnabled ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gh-accent">
                          <Sparkles className="h-3 w-3" aria-hidden="true" />
                          Access granted
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-gh-fg-muted">{module.description}</p>
                  </div>

                  <ModuleToggle
                    checked={isEnabled}
                    onChange={(checked) => handleToggleModule(module.accessPermission, checked)}
                    label={`Toggle ${module.label} access`}
                    disabled={!selectedRole}
                  />
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
