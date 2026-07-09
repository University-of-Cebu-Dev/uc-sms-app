export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  joinedAt: string
  firstName: string
  lastName: string
  idNumber: string
}

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'error'
}



export interface NavItem {
  label: string
  path: string
  icon: string
}

export interface BreadcrumbItem {
  label: string
  path?: string
}

export type EducationLevelId = 'basic-education' | 'senior-high-school' | 'college'

export type StudentTypeId =
  | 'new-student'
  | 'old-student'
  | 'shiftee'
  | 'cross-enrollee'
  | 'returnee'
  | 'transferee'

export interface LevelEnrollmentConfig {
  levelId: EducationLevelId
  studentTypes: StudentTypeId[]
}

export interface SchoolPeriod {
  id: string
  activeTerm?: string | null
  name: string
  term: string
  status: 'active' | 'upcoming' | 'completed'
  startDate: string
  endDate: string
  levelConfigs: LevelEnrollmentConfig[]
}

export interface ProgramEnrollment {
  id: number
  code: string
  name: string
  abbr: string
  isActive: boolean
  openForEnroll: boolean
}

export interface Student {
  completeName: string
  id: string
  course: string
}

export type Theme = 'light' | 'dark' | 'system' | 'uc' | 'custom'

export interface CustomThemeColors {
  accent: string
  accentEmphasis: string
  sidebar: string
  attention: string
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}
