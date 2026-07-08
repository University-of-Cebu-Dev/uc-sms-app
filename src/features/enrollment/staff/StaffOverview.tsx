import { useMemo } from 'react'
import {
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Clock,
  GraduationCap,
  Users,
} from 'lucide-react'
import { useSchoolPeriod } from '@/hooks/useSchoolPeriod'
import { studentEnrollments } from '@/features/enrollment/staff/staffStudentData'
import {
  getInitials,
  StaffEmptyState,
  StaffPanel,
  StaffStatCard,
  StudentEnrollmentStatusBadge,
} from '@/features/enrollment/staff/staffUi'
import { Card } from '@/components/ui/Card'

export function StaffOverview() {
  const { selectedPeriod, isLoading } = useSchoolPeriod()

  const pendingCount = useMemo(
    () =>
      studentEnrollments.filter(
        (record) => record.status === 'pending' || record.status === 'under_review',
      ).length,
    [],
  )

  const approvedCount = useMemo(
    () => studentEnrollments.filter((record) => record.status === 'approved').length,
    [],
  )

  const enrolledCount = useMemo(
    () => studentEnrollments.filter((record) => record.status === 'enrolled').length,
    [],
  )

  if (isLoading) {
    return <Card className="!p-6 text-sm text-gh-fg-muted">Loading school period...</Card>
  }

  if (!selectedPeriod) {
    return (
      <StaffPanel
        icon={Briefcase}
        title="Student enrollments"
        description="Select a school period from the sidebar to manage student enrollments."
      >
        <StaffEmptyState
          icon={GraduationCap}
          title="No school period selected"
          description="Use Reselect school period in the sidebar to choose an active term."
        />
      </StaffPanel>
    )
  }

  const recentEnrollments = [...studentEnrollments]
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .slice(0, 5)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StaffStatCard
          label="Pending review"
          value={pendingCount}
          icon={Clock}
          tone="warning"
        />
        <StaffStatCard
          label="Approved"
          value={approvedCount}
          icon={CheckCircle2}
          tone="success"
        />
        <StaffStatCard
          label="Enrolled students"
          value={enrolledCount}
          icon={Users}
          tone="info"
        />
      </div>

      <StaffPanel
        icon={ClipboardList}
        accent="sky"
        title="Recent student enrollments"
        description={`Latest student enrollment activity for ${selectedPeriod.name}.`}
      >
        {recentEnrollments.length === 0 ? (
          <StaffEmptyState
            icon={GraduationCap}
            title="No student enrollments yet"
            description="Student enrollment requests will appear here once submitted."
          />
        ) : (
          <ul className="divide-y divide-gh-border">
            {recentEnrollments.map((record) => (
              <li
                key={record.id}
                className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-gh-canvas-subtle/50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gh-accent/15 to-gh-accent/5 text-xs font-semibold text-gh-accent ring-1 ring-gh-accent/15">
                    {getInitials(record.studentName)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gh-fg">{record.studentName}</p>
                    <p className="text-xs text-gh-fg-muted">
                      {record.studentId} · {record.program}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:justify-end">
                  <span className="text-xs tabular-nums text-gh-fg-subtle">
                    {record.submittedAt}
                  </span>
                  <StudentEnrollmentStatusBadge status={record.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </StaffPanel>

      {pendingCount > 0 && (
        <Card className="overflow-hidden border-amber-500/25 bg-gradient-to-r from-amber-500/[0.06] to-transparent !p-0">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gh-fg">
                  {pendingCount} student enrollment{pendingCount === 1 ? '' : 's'} awaiting review
                </p>
                <p className="mt-1 text-sm text-gh-fg-muted">
                  Review pending student enrollments for {selectedPeriod.name}.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
