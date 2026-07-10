import {
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  ClipboardList,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Landmark,
  Link2,
  Shield,
  Stethoscope,
  UserCheck,
  UserCog,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export interface IdentityRoleMeta {
  id: string
  label: string
  description: string
  icon: LucideIcon
  accent: string
  accentBg: string
  accentRing: string
  enrollmentPath?: string
}

export const identityRoleCatalog: IdentityRoleMeta[] = [
  {
    id: 'STUDENT',
    label: 'Student',
    description: 'Enrolled learners using student-facing enrollment tools.',
    icon: GraduationCap,
    accent: 'text-sky-600 dark:text-sky-400',
    accentBg: 'bg-sky-500/10',
    accentRing: 'ring-sky-500/25',
    enrollmentPath: '/enrollment/student',
  },
  {
    id: 'GUARDIAN',
    label: 'Guardian',
    description: 'Parents or guardians managing linked student enrollment.',
    icon: Users,
    accent: 'text-violet-600 dark:text-violet-400',
    accentBg: 'bg-violet-500/10',
    accentRing: 'ring-violet-500/25',
    enrollmentPath: '/enrollment/parent',
  },
  {
    id: 'FACULTY',
    label: 'Faculty',
    description: 'Instructors with class, grading, and evaluation access.',
    icon: BookOpen,
    accent: 'text-emerald-600 dark:text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    accentRing: 'ring-emerald-500/25',
  },
  {
    id: 'CHAIRPERSON',
    label: 'Chairperson',
    description: 'Department chair with academic oversight permissions.',
    icon: UserCog,
    accent: 'text-teal-600 dark:text-teal-400',
    accentBg: 'bg-teal-500/10',
    accentRing: 'ring-teal-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'DEAN_PRINCIPAL',
    label: 'Dean / Principal',
    description: 'Academic leadership across colleges and departments.',
    icon: Landmark,
    accent: 'text-indigo-600 dark:text-indigo-400',
    accentBg: 'bg-indigo-500/10',
    accentRing: 'ring-indigo-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'EDP',
    label: 'EDP',
    description: 'Electronic data processing and ID capture workflows.',
    icon: Briefcase,
    accent: 'text-amber-600 dark:text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentRing: 'ring-amber-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'REGISTRAR',
    label: 'Registrar',
    description: 'Official enrollment validation and academic records.',
    icon: ClipboardList,
    accent: 'text-orange-600 dark:text-orange-400',
    accentBg: 'bg-orange-500/10',
    accentRing: 'ring-orange-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'ENCODER',
    label: 'Encoder',
    description: 'Data entry for enrollment and student records.',
    icon: UserCheck,
    accent: 'text-cyan-600 dark:text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentRing: 'ring-cyan-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'CHECKER',
    label: 'Checker',
    description: 'Review and verify encoded enrollment information.',
    icon: UserCheck,
    accent: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500/10',
    accentRing: 'ring-blue-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'SAO',
    label: 'SAO',
    description: 'Student affairs and student services coordination.',
    icon: Building2,
    accent: 'text-fuchsia-600 dark:text-fuchsia-400',
    accentBg: 'bg-fuchsia-500/10',
    accentRing: 'ring-fuchsia-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'ACCOUNTING',
    label: 'Accounting',
    description: 'Assessment, billing, and financial records.',
    icon: Calculator,
    accent: 'text-lime-600 dark:text-lime-400',
    accentBg: 'bg-lime-500/10',
    accentRing: 'ring-lime-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'CASHIER',
    label: 'Cashier',
    description: 'Payment processing and cashiering workflows.',
    icon: Wallet,
    accent: 'text-yellow-600 dark:text-yellow-400',
    accentBg: 'bg-yellow-500/10',
    accentRing: 'ring-yellow-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'ACAD',
    label: 'Academic Affairs',
    description: 'Academic operations and cross-department coordination.',
    icon: BookOpen,
    accent: 'text-rose-600 dark:text-rose-400',
    accentBg: 'bg-rose-500/10',
    accentRing: 'ring-rose-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'HR',
    label: 'HR',
    description: 'Human resources and staff administration.',
    icon: Users,
    accent: 'text-pink-600 dark:text-pink-400',
    accentBg: 'bg-pink-500/10',
    accentRing: 'ring-pink-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'GUIDANCE',
    label: 'Guidance',
    description: 'Student guidance and counseling support.',
    icon: HeartPulse,
    accent: 'text-red-600 dark:text-red-400',
    accentBg: 'bg-red-500/10',
    accentRing: 'ring-red-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'NURSE',
    label: 'Nurse',
    description: 'Clinic and student health-related services.',
    icon: Stethoscope,
    accent: 'text-green-600 dark:text-green-400',
    accentBg: 'bg-green-500/10',
    accentRing: 'ring-green-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'NSTP_COORDINATOR',
    label: 'NSTP Coordinator',
    description: 'NSTP program coordination and class lists.',
    icon: Shield,
    accent: 'text-stone-600 dark:text-stone-400',
    accentBg: 'bg-stone-500/10',
    accentRing: 'ring-stone-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'GENED_COORDINATOR',
    label: 'GenEd Coordinator',
    description: 'General education curriculum and scheduling.',
    icon: GraduationCap,
    accent: 'text-purple-600 dark:text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentRing: 'ring-purple-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'LINKAGE',
    label: 'Linkage',
    description: 'Industry linkages and external program coordination.',
    icon: Link2,
    accent: 'text-slate-600 dark:text-slate-400',
    accentBg: 'bg-slate-500/10',
    accentRing: 'ring-slate-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'SCHOLARSHIP',
    label: 'Scholarship',
    description: 'Scholarship evaluation and beneficiary tracking.',
    icon: GraduationCap,
    accent: 'text-amber-700 dark:text-amber-300',
    accentBg: 'bg-amber-500/10',
    accentRing: 'ring-amber-500/25',
    enrollmentPath: '/enrollment/staff',
  },
  {
    id: 'RESEARCH',
    label: 'Research',
    description: 'Research reporting and academic outputs.',
    icon: FlaskConical,
    accent: 'text-emerald-700 dark:text-emerald-300',
    accentBg: 'bg-emerald-500/10',
    accentRing: 'ring-emerald-500/25',
    enrollmentPath: '/enrollment/staff',
  },
]

const roleMetaById = new Map(identityRoleCatalog.map((role) => [role.id, role]))

export function getIdentityRoleMeta(roleId: string): IdentityRoleMeta {
  const normalized = roleId.trim().toUpperCase().replace(/\s+/g, '_').replace('/', '_')

  return (
    roleMetaById.get(normalized) ?? {
      id: normalized,
      label: normalized.replaceAll('_', ' '),
      description: 'Portal user type',
      icon: Shield,
      accent: 'text-gh-fg-muted',
      accentBg: 'bg-gh-canvas-subtle',
      accentRing: 'ring-gh-border',
    }
  )
}

export function normalizeIdentityRole(role?: string | null): string {
  if (!role) return 'STUDENT'
  return role.trim().toUpperCase().replace(/\s+/g, '_').replace('/', '_')
}

export const staffAssignableRoleIds = identityRoleCatalog
  .map((role) => role.id)
  .filter((id) => id !== 'STUDENT' && id !== 'GUARDIAN')

export const STAFF_ENROLLMENT_PATH = '/enrollment/staff'

export function getStaffEnrollmentTabLabel(role: IdentityRoleMeta) {
  return role.enrollmentPath === STAFF_ENROLLMENT_PATH ? role.label : 'Staff'
}
