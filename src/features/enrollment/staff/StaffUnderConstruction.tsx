import type { LucideIcon } from 'lucide-react'
import { Construction } from 'lucide-react'
import { StaffPanel, StaffEmptyState } from '@/features/enrollment/staff/staffUi'

interface StaffUnderConstructionProps {
  icon: LucideIcon
  title: string
  description: string
}

export function StaffUnderConstruction({
  icon,
  title,
  description,
}: StaffUnderConstructionProps) {
  return (
    <StaffPanel icon={icon} title={title} description={description}>
      <StaffEmptyState
        icon={Construction}
        title="Under construction"
        description="This section is being prepared. Check back soon for student enrollment tools here."
      />
    </StaffPanel>
  )
}
