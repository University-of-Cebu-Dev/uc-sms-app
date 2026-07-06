import type { Notification, SchoolPeriod, Student, User } from '@/types'
import { createLevelConfig } from '@/utils/schoolPeriodLevels'

export const currentUser: User = {
  id: '1',
  name: 'Publio Sumalinog',
  email: 'psumalinog@gmail.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  role: 'Admin',
  status: 'active',
  joinedAt: '2024-01-15',
}

export const currentStudent: Student = {
  completeName: 'Publio Sumalinog',
  id: '12554499',
  course: 'BSIT',
}

export const notifications: Notification[] = [
  { id: '1', title: 'Deployment successful', message: 'v2.4.1 deployed to production', read: false, timestamp: '2026-07-06T10:00:00Z', type: 'success' },
  { id: '2', title: 'New team member', message: 'Emily Brown joined the QA team', read: false, timestamp: '2026-07-06T08:30:00Z', type: 'info' },
  { id: '3', title: 'Security alert', message: 'Unusual login attempt detected', read: true, timestamp: '2026-07-05T22:15:00Z', type: 'warning' },
  { id: '4', title: 'Build failed', message: 'CI pipeline failed on main branch', read: true, timestamp: '2026-07-05T18:00:00Z', type: 'error' },
  { id: '5', title: 'Milestone reached', message: 'Platform Core reached 75% completion', read: true, timestamp: '2026-07-05T12:00:00Z', type: 'success' },
]

export const schoolPeriods: SchoolPeriod[] = [
  {
    id: '1',
    name: '2nd Semester, SY 2025–2026',
    term: '2nd Semester',
    status: 'upcoming',
    startDate: '2026-01-06',
    endDate: '2026-05-31',
    levelConfigs: [
      createLevelConfig('basic-education', ['new-student', 'old-student', 'transferee']),
      createLevelConfig('senior-high-school', ['new-student', 'old-student', 'shiftee', 'returnee']),
      createLevelConfig('college', ['new-student', 'old-student', 'shiftee', 'cross-enrollee', 'returnee', 'transferee']),
    ],
  },
  {
    id: '2',
    name: '1st Semester, SY 2025–2026',
    term: '1st Semester',
    status: 'active',
    startDate: '2025-08-01',
    endDate: '2025-12-20',
    levelConfigs: [
      createLevelConfig('senior-high-school', ['new-student', 'old-student', 'returnee']),
      createLevelConfig('college', ['new-student', 'old-student', 'shiftee', 'cross-enrollee', 'returnee', 'transferee']),
    ],
  },
  {
    id: '3',
    name: 'Summer Term 2025',
    term: 'Summer',
    status: 'completed',
    startDate: '2025-06-01',
    endDate: '2025-07-15',
    levelConfigs: [
      createLevelConfig('college', ['old-student', 'shiftee', 'cross-enrollee', 'returnee']),
    ],
  },
]
