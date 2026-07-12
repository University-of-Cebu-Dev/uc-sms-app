import { LayoutDashboard } from 'lucide-react'
import { useRoleSwitcher } from '@/hooks/useRoleSwitcher'
import { StaffEmptyState, StaffPanel } from '@/features/enrollment/staff/staffUi'

export function StaffRoleOverview() {
  const { activeRoleOption } = useRoleSwitcher()
  const RoleIcon = activeRoleOption.icon

  return (
    <StaffPanel
      icon={RoleIcon}
      title={`Overview`}
      description={`${activeRoleOption.label} enrollment workspace for the selected school period.`}
    >
      <StaffEmptyState
        icon={LayoutDashboard}
        title={`${activeRoleOption.label} overview`}
        description="This page is ready for role-specific enrollment tools. Use the sidebar to open the sections available for your role."
      />
    </StaffPanel>
  )
}
