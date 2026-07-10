import { Outlet } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'

export function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <PageHeader
        title="Settings"
        description="Manage campus branding, enrollment periods, programs, and portal appearance."
        breadcrumbs={[{ label: 'Settings' }]}
      />

      <Outlet />
    </div>
  )
}
