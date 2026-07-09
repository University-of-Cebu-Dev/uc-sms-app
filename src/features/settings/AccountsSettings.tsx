import { AccountManager } from '@/features/settings/AccountManager'

export function AccountsSettings() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-gh-fg">Account Management</h2>
        <p className="mt-1 text-sm text-gh-fg-muted">
          Manage non-student Identity Service accounts — active status, roles, and resignation
          dates.
        </p>
      </div>
      <AccountManager />
    </div>
  )
}
