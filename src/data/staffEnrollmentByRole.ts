import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { SectionNavItem } from '@/components/layout/SectionNav'
import { normalizeIdentityRole } from '@/data/identityRoles'

export interface StaffRoleEnrollmentConfig {
  roleId: string
  sidebarTitle: string
  sidebarDescription: string
  sections: SectionNavItem[]
}

export const dedicatedStaffEnrollmentRoleIds = [
  'CASHIER',
  'EDP',
  'REGISTRAR',
  'ACCOUNTING',
  'SAO',
  'DEAN_PRINCIPAL',
] as const

export type DedicatedStaffEnrollmentRoleId = (typeof dedicatedStaffEnrollmentRoleIds)[number]

export const STAFF_OVERVIEW_PATH = '/enrollment/staff/overview'

export const genericStaffEnrollmentSections: SectionNavItem[] = [
  {
    label: 'Registration',
    path: '/enrollment/staff/registration',
    icon: ClipboardList,
    description: 'Student registration',
  },
  {
    label: 'Enrolled Subjects',
    path: '/enrollment/staff/enrolled-subjects',
    icon: BookOpen,
    description: 'Subject enrollments',
  },
  {
    label: 'Promissory',
    path: '/enrollment/staff/promissory',
    icon: FileText,
    description: 'Promissory notes',
  },
  {
    label: 'Adjustments',
    path: '/enrollment/staff/adjustments',
    icon: SlidersHorizontal,
    description: 'Enrollment changes',
  },
  {
    label: 'Tracker',
    path: '/enrollment/staff/tracker',
    icon: Route,
    description: 'Status tracking',
  },
]

const overviewSection: SectionNavItem = {
  label: 'Overview',
  path: STAFF_OVERVIEW_PATH,
  icon: LayoutDashboard,
  description: 'Role dashboard',
  end: true,
}

export const staffEnrollmentByRole: Record<DedicatedStaffEnrollmentRoleId, StaffRoleEnrollmentConfig> =
  {
    CASHIER: {
      roleId: 'CASHIER',
      sidebarTitle: 'Cashier enrollment',
      sidebarDescription: 'Payment processing and fee review for enrolled students.',
      sections: [
        overviewSection,
        {
          label: 'Payments',
          path: '/enrollment/staff/payments',
          icon: Wallet,
          description: 'Process student payments',
        },
        {
          label: 'Fee assessment',
          path: '/enrollment/staff/fee-assessment',
          icon: ClipboardCheck,
          description: 'Review assessment records',
        },
      ],
    },
    EDP: {
      roleId: 'EDP',
      sidebarTitle: 'EDP enrollment',
      sidebarDescription: 'Registration, subject encoding, and enrollment tracking.',
      sections: [
        overviewSection,
        {
          label: 'Registration',
          path: '/enrollment/staff/registration',
          icon: ClipboardList,
          description: 'Student registration',
        },
        {
          label: 'Enrolled subjects',
          path: '/enrollment/staff/enrolled-subjects',
          icon: BookOpen,
          description: 'Subject enrollments',
        },
        {
          label: 'Tracker',
          path: '/enrollment/staff/tracker',
          icon: Route,
          description: 'Status tracking',
        },
      ],
    },
    REGISTRAR: {
      roleId: 'REGISTRAR',
      sidebarTitle: 'Registrar enrollment',
      sidebarDescription: 'Official enrollment validation and academic record updates.',
      sections: [
        overviewSection,
        {
          label: 'Registration',
          path: '/enrollment/staff/registration',
          icon: ClipboardList,
          description: 'Student registration',
        },
        {
          label: 'Enrolled subjects',
          path: '/enrollment/staff/enrolled-subjects',
          icon: BookOpen,
          description: 'Subject enrollments',
        },
        {
          label: 'Adjustments',
          path: '/enrollment/staff/adjustments',
          icon: SlidersHorizontal,
          description: 'Enrollment changes',
        },
        {
          label: 'Tracker',
          path: '/enrollment/staff/tracker',
          icon: Route,
          description: 'Status tracking',
        },
        {
          label: 'Promissory',
          path: '/enrollment/staff/promissory',
          icon: FileText,
          description: 'Promissory notes',
        },
      ],
    },
    ACCOUNTING: {
      roleId: 'ACCOUNTING',
      sidebarTitle: 'Accounting enrollment',
      sidebarDescription: 'Billing, assessments, and financial enrollment records.',
      sections: [
        overviewSection,
        {
          label: 'Fee assessment',
          path: '/enrollment/staff/fee-assessment',
          icon: ClipboardCheck,
          description: 'Student fee review',
        },
        {
          label: 'Billing',
          path: '/enrollment/staff/billing',
          icon: FileText,
          description: 'Billing records',
        },
        {
          label: 'Promissory',
          path: '/enrollment/staff/promissory',
          icon: FileText,
          description: 'Promissory notes',
        },
      ],
    },
    SAO: {
      roleId: 'SAO',
      sidebarTitle: 'SAO enrollment',
      sidebarDescription: 'Student affairs support during enrollment.',
      sections: [
        overviewSection,
        {
          label: 'Student services',
          path: '/enrollment/staff/student-services',
          icon: HeartHandshake,
          description: 'Student affairs cases',
        },
        {
          label: 'Promissory',
          path: '/enrollment/staff/promissory',
          icon: FileText,
          description: 'Promissory notes',
        },
      ],
    },
    DEAN_PRINCIPAL: {
      roleId: 'DEAN_PRINCIPAL',
      sidebarTitle: 'Dean / Principal enrollment',
      sidebarDescription: 'Academic leadership review and enrollment oversight.',
      sections: [
        overviewSection,
        {
          label: 'Approvals',
          path: '/enrollment/staff/approvals',
          icon: ShieldCheck,
          description: 'Enrollment approvals',
        },
        {
          label: 'Enrolled subjects',
          path: '/enrollment/staff/enrolled-subjects',
          icon: BookOpen,
          description: 'Subject enrollments',
        },
        {
          label: 'Reports',
          path: '/enrollment/staff/reports',
          icon: BarChart3,
          description: 'Enrollment summaries',
        },
      ],
    },
  }

export interface StaffSectionPageMeta {
  icon: LucideIcon
  title: string
  description: string
}

export const staffSectionPageMetaByPath: Record<string, StaffSectionPageMeta> = {
  '/enrollment/staff/payments': {
    icon: Wallet,
    title: 'Payments',
    description: 'Process and verify student payments during enrollment.',
  },
  '/enrollment/staff/fee-assessment': {
    icon: ClipboardCheck,
    title: 'Fee assessment',
    description: 'Review student fee assessments for the selected school period.',
  },
  '/enrollment/staff/billing': {
    icon: FileText,
    title: 'Billing',
    description: 'Manage billing records tied to student enrollment.',
  },
  '/enrollment/staff/student-services': {
    icon: HeartHandshake,
    title: 'Student services',
    description: 'Coordinate student affairs cases during enrollment.',
  },
  '/enrollment/staff/approvals': {
    icon: ShieldCheck,
    title: 'Approvals',
    description: 'Review and approve enrollment requests requiring leadership sign-off.',
  },
  '/enrollment/staff/reports': {
    icon: BarChart3,
    title: 'Reports',
    description: 'Enrollment summaries and academic oversight reports.',
  },
}

export function isDedicatedStaffEnrollmentRole(roleId: string) {
  return dedicatedStaffEnrollmentRoleIds.includes(
    normalizeIdentityRole(roleId) as DedicatedStaffEnrollmentRoleId,
  )
}

export function getStaffEnrollmentConfig(roleId: string) {
  const normalized = normalizeIdentityRole(roleId)
  return staffEnrollmentByRole[normalized as DedicatedStaffEnrollmentRoleId] ?? null
}

export function getStaffSidebarSections(roleId: string) {
  const config = getStaffEnrollmentConfig(roleId)
  if (config) {
    return config.sections
  }

  return [overviewSection, ...genericStaffEnrollmentSections]
}

export function getAllStaffSectionLabelsByPath() {
  const entries = new Map<string, string>()

  for (const config of Object.values(staffEnrollmentByRole)) {
    for (const section of config.sections) {
      entries.set(section.path, section.label)
    }
  }

  for (const section of genericStaffEnrollmentSections) {
    entries.set(section.path, section.label)
  }

  entries.set(STAFF_OVERVIEW_PATH, 'Overview')

  return Object.fromEntries(entries)
}

export function isStaffSectionAllowedForRole(pathname: string, roleId: string) {
  return getStaffSidebarSections(roleId).some((section) => section.path === pathname)
}
