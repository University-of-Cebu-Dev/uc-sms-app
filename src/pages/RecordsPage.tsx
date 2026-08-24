import { Outlet } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'

export function RecordsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Records"
        description="Manage student and parent person records."
        breadcrumbs={[{ label: 'Records' }]}
      />

      <Outlet />
    </div>
  )
}
