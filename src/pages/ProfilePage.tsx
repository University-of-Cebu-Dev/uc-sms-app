import { useAuth } from '@/hooks/useAuth'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/utils/format'
import { Mail, Calendar, Shield } from 'lucide-react'

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <PageHeader
        title="Profile"
        description="View and manage your personal information."
        breadcrumbs={[{ label: 'Profile' }]}
        actions={<Button variant="outline">Edit Profile</Button>}
      />

      <Card>
        <div className="flex items-center gap-6">
          <Avatar src={user.avatar} alt={user.name} size="xl" />
          <div>
            <h2 className="text-xl font-semibold text-gh-fg">{user.name}</h2>
            <p className="text-sm text-gh-fg-muted mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="info">{user.role}</Badge>
              <Badge variant="success">{user.status}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-gh-fg mb-4">Details</h3>
        <dl className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-gh-fg-muted" />
            <div>
              <dt className="text-xs text-gh-fg-subtle">Email</dt>
              <dd className="text-sm text-gh-fg">{user.email}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-gh-fg-muted" />
            <div>
              <dt className="text-xs text-gh-fg-subtle">Role</dt>
              <dd className="text-sm text-gh-fg">{user.role}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-gh-fg-muted" />
            <div>
              <dt className="text-xs text-gh-fg-subtle">Member since</dt>
              <dd className="text-sm text-gh-fg">{formatDate(user.joinedAt)}</dd>
            </div>
          </div>
        </dl>
      </Card>
    </div>
  )
}
