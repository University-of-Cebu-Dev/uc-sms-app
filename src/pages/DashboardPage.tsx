import { useAuth } from '@/hooks/useAuth'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/Card'

export function DashboardPage() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Dashboard" breadcrumbs={[{ label: 'Dashboard' }]} />

      <Card className="bg-gradient-to-r from-gh-accent/10 to-transparent border-gh-accent/20">
        <h2 className="text-lg font-semibold text-gh-fg">
          {greeting}, {user?.name.split(' ')[0] ?? 'there'}!
        </h2>
        <p className="mt-1 text-sm text-gh-fg-muted">
          Welcome to the University of Cebu student portal.
        </p>
      </Card>
    </div>
  )
}
