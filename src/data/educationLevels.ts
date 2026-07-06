import type { LucideIcon } from 'lucide-react'
import { BookOpen, GraduationCap, School } from 'lucide-react'
import type { EducationLevelId } from '@/types'

export const EDUCATION_LEVELS: {
  id: EducationLevelId
  label: string
  shortLabel: string
  icon: LucideIcon
  accent: string
}[] = [
  {
    id: 'basic-education',
    label: 'Basic Education',
    shortLabel: 'Basic Ed',
    icon: BookOpen,
    accent: 'from-sky-500/15 to-sky-500/5 text-sky-600',
  },
  {
    id: 'senior-high-school',
    label: 'Senior High School',
    shortLabel: 'SHS',
    icon: School,
    accent: 'from-violet-500/15 to-violet-500/5 text-violet-600',
  },
  {
    id: 'college',
    label: 'College',
    shortLabel: 'College',
    icon: GraduationCap,
    accent: 'from-gh-accent/15 to-gh-accent/5 text-gh-accent',
  },
]

export const getEducationLevelLabel = (id: EducationLevelId) =>
  EDUCATION_LEVELS.find((level) => level.id === id)?.label ?? id

export const getEducationLevel = (id: EducationLevelId) =>
  EDUCATION_LEVELS.find((level) => level.id === id)
