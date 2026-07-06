export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  joinedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  progress: number
  members: number
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignee: string
  dueDate: string
}

export interface Activity {
  id: string
  user: string
  action: string
  target: string
  timestamp: string
  type: 'commit' | 'issue' | 'pr' | 'comment' | 'deploy'
}

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export interface Transaction {
  id: string
  description: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: string
  category: string
}

export interface StatCard {
  id: string
  label: string
  value: string
  change: number
  changeLabel: string
  icon: string
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

export type Theme = 'light' | 'dark' | 'system'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}
