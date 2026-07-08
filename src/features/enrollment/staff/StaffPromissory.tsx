import { FileText } from 'lucide-react'
import { StaffUnderConstruction } from '@/features/enrollment/staff/StaffUnderConstruction'

export function StaffPromissory() {
  return (
    <StaffUnderConstruction
      icon={FileText}
      title="Promissory"
      description="Handle promissory notes and related enrollment payment arrangements."
    />
  )
}
