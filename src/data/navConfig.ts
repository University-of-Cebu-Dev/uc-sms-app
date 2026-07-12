import {
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Settings,
  Star,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface MainNavItem {
  label: string
  path: string
  icon: LucideIcon
}

export interface ModuleNavItem extends MainNavItem {
  description: string
}

export const mainNavPrefixPaths = ['/enrollment', '/settings']

export const moduleNavItems: ModuleNavItem[] = [
  {
    label: 'Schedules',
    path: '/schedules',
    icon: CalendarDays,
    description: 'View and manage class schedules for the selected school period.',
  },
  {
    label: 'Assessment',
    path: '/assessment',
    icon: ClipboardCheck,
    description: 'Student assessments, fees, and billing-related enrollment data.',
  },
  {
    label: 'Study Load',
    path: '/study-load',
    icon: BookOpen,
    description: 'Generate and review student study loads.',
  },
  {
    label: "Teacher's Evaluation",
    path: '/teachers-evaluation',
    icon: Star,
    description: 'Faculty evaluation workflows and student feedback.',
  },
  {
    label: 'Room Management',
    path: '/room-management',
    icon: Building2,
    description: 'Assign and manage classrooms and learning spaces.',
  },
  {
    label: 'E Grade',
    path: '/e-grade',
    icon: GraduationCap,
    description: 'Electronic grading and grade submission tools.',
  },
  {
    label: 'Class Lists',
    path: '/class-lists',
    icon: ListChecks,
    description: 'Official class lists by section, subject, and school period.',
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: BarChart3,
    description: 'Enrollment and academic reports for staff and administrators.',
  },
]

export const mainNavItems: MainNavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Enrollment', path: '/enrollment', icon: UserPlus },
  ...moduleNavItems,
  { label: 'Settings', path: '/settings', icon: Settings },
]

export type EnrollmentAudience = 'student' | 'parent' | 'staff'

export interface EnrollmentTabItem {
  label: string
  path: string
  audience: EnrollmentAudience
  icon: LucideIcon
  description: string
}

export const enrollmentTabs: EnrollmentTabItem[] = [
  {
    label: 'Student',
    path: '/enrollment/student',
    audience: 'student',
    icon: GraduationCap,
    description: 'Student enrollment applications and registration.',
  },
  {
    label: 'Parent',
    path: '/enrollment/parent',
    audience: 'parent',
    icon: Users,
    description: 'Parent-linked student enrollment and guardianship.',
  },
  {
    label: 'Staff',
    path: '/enrollment/staff',
    audience: 'staff',
    icon: Briefcase,
    description: 'Staff access to review and manage student enrollments.',
  },
]
