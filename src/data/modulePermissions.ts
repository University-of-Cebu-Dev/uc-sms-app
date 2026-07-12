import {
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Settings,
  Shield,
  Star,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'

export const MODULE_PERMISSION_PREFIX = 'UCSMS.Modules.'

export interface PortalModule {
  id: string
  label: string
  description: string
  icon: LucideIcon
  path: string
  accessPermission: string
  group: 'core' | 'academic' | 'admin'
}

export const portalModules: PortalModule[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Overview and quick links for the selected school period.',
    icon: LayoutDashboard,
    path: '/dashboard',
    accessPermission: 'UCSMS.Modules.Dashboard.Access',
    group: 'core',
  },
  {
    id: 'enrollment',
    label: 'Enrollment',
    description: 'Student, parent, staff, and faculty enrollment workflows.',
    icon: UserPlus,
    path: '/enrollment',
    accessPermission: 'UCSMS.Modules.Enrollment.Access',
    group: 'core',
  },
  {
    id: 'schedules',
    label: 'Schedules',
    description: 'Class schedules and room assignments.',
    icon: CalendarDays,
    path: '/schedules',
    accessPermission: 'UCSMS.Modules.Schedules.Access',
    group: 'academic',
  },
  {
    id: 'assessment',
    label: 'Assessment',
    description: 'Fees, billing, and assessment records.',
    icon: ClipboardCheck,
    path: '/assessment',
    accessPermission: 'UCSMS.Modules.Assessment.Access',
    group: 'academic',
  },
  {
    id: 'study-load',
    label: 'Study Load',
    description: 'Study load generation and review.',
    icon: BookOpen,
    path: '/study-load',
    accessPermission: 'UCSMS.Modules.StudyLoad.Access',
    group: 'academic',
  },
  {
    id: 'teachers-evaluation',
    label: "Teacher's Evaluation",
    description: 'Faculty evaluation and student feedback.',
    icon: Star,
    path: '/teachers-evaluation',
    accessPermission: 'UCSMS.Modules.TeachersEvaluation.Access',
    group: 'academic',
  },
  {
    id: 'room-management',
    label: 'Room Management',
    description: 'Classrooms and learning spaces.',
    icon: Building2,
    path: '/room-management',
    accessPermission: 'UCSMS.Modules.RoomManagement.Access',
    group: 'academic',
  },
  {
    id: 'e-grade',
    label: 'E Grade',
    description: 'Electronic grading and grade submission.',
    icon: GraduationCap,
    path: '/e-grade',
    accessPermission: 'UCSMS.Modules.EGrade.Access',
    group: 'academic',
  },
  {
    id: 'class-lists',
    label: 'Class Lists',
    description: 'Official class lists by section and subject.',
    icon: ListChecks,
    path: '/class-lists',
    accessPermission: 'UCSMS.Modules.ClassLists.Access',
    group: 'academic',
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'Enrollment and academic reports.',
    icon: BarChart3,
    path: '/reports',
    accessPermission: 'UCSMS.Modules.Reports.Access',
    group: 'academic',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Portal configuration and school period setup.',
    icon: Settings,
    path: '/settings',
    accessPermission: 'UCSMS.Modules.Settings.Access',
    group: 'admin',
  },
  {
    id: 'roles-permissions',
    label: 'Roles & Permissions',
    description: 'Manage module access by user type.',
    icon: Shield,
    path: '/settings/roles-permissions',
    accessPermission: 'UCSMS.Modules.RolesPermissions.Access',
    group: 'admin',
  },
]

export const rolesPermissionsManage = 'UCSMS.Modules.RolesPermissions.Manage'

export const dashboardModulePermission =
  portalModules.find((module) => module.id === 'dashboard')?.accessPermission ??
  'UCSMS.Modules.Dashboard.Access'

export function getDashboardOnlyPermissions() {
  return new Set([dashboardModulePermission])
}

export function isModulePermission(permission: string) {
  return permission.startsWith(MODULE_PERMISSION_PREFIX)
}

export function getModulePermissionIds(permissions: string[]) {
  const modulePermissionSet = new Set(portalModules.map((module) => module.accessPermission))
  return permissions.filter((permission) => modulePermissionSet.has(permission))
}
