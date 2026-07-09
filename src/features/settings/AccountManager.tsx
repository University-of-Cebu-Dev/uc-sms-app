import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Pencil,
  Plus,
  RefreshCw,
  Search,
  UserCog,
  Users,
} from 'lucide-react'
import {
  identityUsersApi,
  formatAccountName,
  type CreateStaffAccountPayload,
  type IdentityUserAccount,
  type UpdateAccountPayload,
} from '@/services/identityUsers'
import { getIdentityRoleMeta, staffAssignableRoleIds } from '@/data/identityRoles'
import { useToast } from '@/hooks/useToast'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Modal } from '@/components/ui/Modal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { cn } from '@/utils/cn'
import { ApiError } from '@/lib/api'
import { formatDate } from '@/utils/format'

type AccountFormMode = 'edit' | 'create'

interface AccountFormState {
  username: string
  email: string
  idNumber: string
  firstName: string
  lastName: string
  middleName: string
  password: string
  isActive: boolean
  dateResigned: string
  roles: string[]
}

const emptyForm: AccountFormState = {
  username: '',
  email: '',
  idNumber: '',
  firstName: '',
  lastName: '',
  middleName: '',
  password: '',
  isActive: true,
  dateResigned: '',
  roles: [],
}

function StatusToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative block h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
        checked ? 'bg-gh-success' : 'bg-gh-border',
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

function toDateInputValue(value: string | null) {
  if (!value) return ''
  return value.slice(0, 10)
}

export function AccountManager() {
  const { addToast } = useToast()
  const [accounts, setAccounts] = useState<IdentityUserAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<AccountFormMode>('edit')
  const [editingAccount, setEditingAccount] = useState<IdentityUserAccount | null>(null)
  const [form, setForm] = useState<AccountFormState>(emptyForm)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadAccounts = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await identityUsersApi.listStaff()
      setAccounts(data)
    } catch (error) {
      const message =
        error instanceof ApiError && (error.status === 401 || error.status === 403)
          ? 'Sign in as SuperAdmin to manage accounts.'
          : error instanceof ApiError && error.status === 400
            ? error.message || 'Invalid request to Identity Service.'
          : error instanceof TypeError
            ? 'Cannot reach Identity Service. Start UCIdentityService and try again.'
            : error instanceof ApiError
              ? error.message
              : 'Could not load staff accounts.'
      setLoadError(message)
      setAccounts([])
      addToast('error', 'Load failed', message)
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    void loadAccounts()
  }, [loadAccounts])

  const filteredAccounts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return accounts

    return accounts.filter((account) => {
      const roleLabels = account.roles.map((role) => getIdentityRoleMeta(role).label).join(' ')
      const fullName = formatAccountName(account)
      return (
        fullName.toLowerCase().includes(query) ||
        account.username.toLowerCase().includes(query) ||
        account.email.toLowerCase().includes(query) ||
        account.idNumber.toLowerCase().includes(query) ||
        roleLabels.toLowerCase().includes(query)
      )
    })
  }, [accounts, search])

  const activeCount = accounts.filter((account) => account.isActive).length
  const inactiveCount = accounts.length - activeCount

  const openCreateModal = () => {
    setFormMode('create')
    setEditingAccount(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const openEditModal = (account: IdentityUserAccount) => {
    setFormMode('edit')
    setEditingAccount(account)
    setForm({
      username: account.username,
      email: account.email,
      idNumber: account.idNumber,
      firstName: account.firstName,
      lastName: account.lastName,
      middleName: account.middleName,
      password: '',
      isActive: account.isActive,
      dateResigned: toDateInputValue(account.dateResigned),
      roles: [...account.roles],
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAccount(null)
    setForm(emptyForm)
  }

  const toggleRole = (roleId: string) => {
    setForm((current) => ({
      ...current,
      roles: current.roles.includes(roleId)
        ? current.roles.filter((role) => role !== roleId)
        : [...current.roles, roleId],
    }))
  }

  const handleActiveChange = (isActive: boolean) => {
    setForm((current) => ({
      ...current,
      isActive,
      dateResigned: isActive ? '' : current.dateResigned || new Date().toISOString().slice(0, 10),
    }))
  }

  const handleSave = async () => {
    if (form.roles.length === 0) {
      addToast('warning', 'Roles required', 'Assign at least one role to this account.')
      return
    }

    setIsSaving(true)
    try {
      if (formMode === 'create') {
        const payload: CreateStaffAccountPayload = {
          username: form.username.trim(),
          email: form.email.trim(),
          idNumber: form.idNumber.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          middleName: form.middleName.trim(),
          password: form.password,
          roles: form.roles,
        }
        const created = await identityUsersApi.createStaff(payload)
        if (!form.isActive || form.dateResigned) {
          await identityUsersApi.updateAccount(created.id, {
            email: form.email.trim(),
            idNumber: form.idNumber.trim(),
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            middleName: form.middleName.trim(),
            isActive: form.isActive,
            dateResigned: form.isActive ? null : form.dateResigned || null,
            roles: form.roles,
          })
        }
        addToast('success', 'Account created', `${formatAccountName(form)} was added successfully.`)
      } else if (editingAccount) {
        const payload: UpdateAccountPayload = {
          email: form.email.trim(),
          idNumber: form.idNumber.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          middleName: form.middleName.trim(),
          isActive: form.isActive,
          dateResigned: form.isActive ? null : form.dateResigned || null,
          roles: form.roles,
        }
        await identityUsersApi.updateAccount(editingAccount.id, payload)
        addToast('success', 'Account updated', `${formatAccountName(form)} was saved successfully.`)
      }

      closeModal()
      await loadAccounts()
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Could not save the account.'
      addToast('error', 'Save failed', message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner label="Loading staff accounts" />
      </div>
    )
  }

  if (accounts.length === 0 && loadError) {
    return (
      <Card className="p-8 text-center">
        <UserCog className="mx-auto h-10 w-10 text-gh-fg-muted" aria-hidden="true" />
        <h3 className="mt-4 text-base font-semibold text-gh-fg">Unable to load accounts</h3>
        <p className="mt-2 text-sm text-gh-fg-muted max-w-md mx-auto">{loadError}</p>
        <Button className="mt-4" variant="outline" onClick={() => void loadAccounts()}>
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="border-gh-border/80 bg-gradient-to-br from-gh-canvas to-gh-canvas-subtle p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gh-accent/10 text-gh-accent">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gh-fg-subtle">
                Staff accounts
              </p>
              <p className="text-2xl font-semibold text-gh-fg">{accounts.length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-gh-border/80 bg-gradient-to-br from-gh-canvas to-gh-canvas-subtle p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gh-fg-subtle">Active</p>
          <p className="mt-1 text-2xl font-semibold text-gh-success">{activeCount}</p>
        </Card>
        <Card className="border-gh-border/80 bg-gradient-to-br from-gh-canvas to-gh-canvas-subtle p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gh-fg-subtle">Inactive</p>
          <p className="mt-1 text-2xl font-semibold text-gh-fg-muted">{inactiveCount}</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-gh-border bg-gradient-to-r from-gh-canvas-subtle to-gh-canvas px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1 max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gh-fg-subtle"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, ID, or role..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void loadAccounts()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={openCreateModal}>
              <Plus className="h-4 w-4" />
              Add account
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date resigned</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-gh-fg">{formatAccountName(account)}</p>
                    <p className="text-xs text-gh-fg-muted">@{account.username}</p>
                    <p className="text-xs text-gh-fg-muted">{account.email}</p>
                    <p className="text-[11px] font-mono text-gh-fg-subtle">ID {account.idNumber}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {account.roles.map((role) => (
                      <Badge key={role} variant="outline" className="text-[10px]">
                        {getIdentityRoleMeta(role).label}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={account.isActive ? 'success' : 'warning'}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gh-fg-muted">
                  {account.dateResigned ? formatDate(account.dateResigned) : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => openEditModal(account)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAccounts.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-gh-fg-muted">No accounts match your search.</p>
        ) : null}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={formMode === 'create' ? 'Add staff account' : 'Edit account'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} loading={isSaving}>
              {formMode === 'create' ? 'Create account' : 'Save changes'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {formMode === 'create' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Username"
                value={form.username}
                onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                placeholder="e.g. publio.sumalinog"
              />
              <Input
                label="Temporary password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />
            </div>
          ) : (
            <Input label="Username" value={form.username} disabled />
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="First name"
              value={form.firstName}
              onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            />
            <Input
              label="Middle name"
              value={form.middleName}
              onChange={(event) => setForm((current) => ({ ...current, middleName: event.target.value }))}
            />
            <Input
              label="Last name"
              value={form.lastName}
              onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
            <Input
              label="ID number"
              value={form.idNumber}
              onChange={(event) => setForm((current) => ({ ...current, idNumber: event.target.value }))}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gh-border bg-gh-canvas-subtle/50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gh-fg">Account status</p>
              <p className="text-xs text-gh-fg-muted">
                Inactive accounts cannot sign in to the portal.
              </p>
            </div>
            <StatusToggle
              checked={form.isActive}
              onChange={handleActiveChange}
              label="Toggle account active status"
            />
          </div>

          {!form.isActive ? (
            <Input
              label="Date resigned"
              type="date"
              value={form.dateResigned}
              onChange={(event) =>
                setForm((current) => ({ ...current, dateResigned: event.target.value }))
              }
            />
          ) : null}

          <div>
            <p className="text-sm font-medium text-gh-fg">Roles</p>
            <p className="mt-0.5 text-xs text-gh-fg-muted">Assign one or more portal roles.</p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {staffAssignableRoleIds.map((roleId) => {
                const meta = getIdentityRoleMeta(roleId)
                const Icon = meta.icon
                const selected = form.roles.includes(roleId)

                return (
                  <button
                    key={roleId}
                    type="button"
                    onClick={() => toggleRole(roleId)}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
                      selected
                        ? 'border-gh-accent/40 bg-gh-accent/8 ring-1 ring-gh-accent/20'
                        : 'border-gh-border hover:bg-gh-canvas-subtle',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1',
                        meta.accentBg,
                        meta.accentRing,
                      )}
                    >
                      <Icon className={cn('h-4 w-4', meta.accent)} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-gh-fg">{meta.label}</span>
                      <span className="mt-0.5 block text-[11px] text-gh-fg-muted">{meta.description}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
