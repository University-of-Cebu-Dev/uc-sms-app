import { rolesPermissionsManage } from '@/data/modulePermissions'
import { normalizeIdentityRole } from '@/data/identityRoles'

const dashboard = 'UCSMS.Modules.Dashboard.Access'
const enrollment = 'UCSMS.Modules.Enrollment.Access'
const schedules = 'UCSMS.Modules.Schedules.Access'
const assessment = 'UCSMS.Modules.Assessment.Access'
const studyLoad = 'UCSMS.Modules.StudyLoad.Access'
const teachersEvaluation = 'UCSMS.Modules.TeachersEvaluation.Access'
const roomManagement = 'UCSMS.Modules.RoomManagement.Access'
const eGrade = 'UCSMS.Modules.EGrade.Access'
const classLists = 'UCSMS.Modules.ClassLists.Access'
const reports = 'UCSMS.Modules.Reports.Access'
const settings = 'UCSMS.Modules.Settings.Access'
const rolesPermissions = 'UCSMS.Modules.RolesPermissions.Access'

const dashboardOnly = [dashboard]

const studentPortal = [dashboard, enrollment, schedules, studyLoad, teachersEvaluation]

const guardianPortal = [dashboard, enrollment, assessment, studyLoad]

const enrollmentStaff = [dashboard, enrollment, classLists, reports]

const facultyPortal = [
  dashboard,
  enrollment,
  schedules,
  classLists,
  eGrade,
  teachersEvaluation,
]

const financePortal = [dashboard, enrollment, assessment, reports]

const academicLeadership = [
  dashboard,
  enrollment,
  schedules,
  assessment,
  studyLoad,
  teachersEvaluation,
  roomManagement,
  eGrade,
  classLists,
  reports,
]

const supportServices = [dashboard, enrollment, reports]

export const rolePermissionDefaults: Record<string, string[]> = {
  STUDENT: studentPortal,
  GUARDIAN: guardianPortal,
  FACULTY: facultyPortal,
  CHAIRPERSON: facultyPortal,
  EDP: enrollmentStaff,
  REGISTRAR: [...enrollmentStaff, assessment, settings],
  ENCODER: enrollmentStaff,
  CHECKER: enrollmentStaff,
  SAO: supportServices,
  ACCOUNTING: financePortal,
  CASHIER: financePortal,
  ACAD: academicLeadership,
  DEAN_PRINCIPAL: academicLeadership,
  HR: [dashboard, settings, rolesPermissions, rolesPermissionsManage],
  GUIDANCE: supportServices,
  NURSE: supportServices,
  NSTP_COORDINATOR: [dashboard, enrollment, classLists],
  GENED_COORDINATOR: [dashboard, enrollment, schedules, classLists],
  LINKAGE: supportServices,
  SCHOLARSHIP: [dashboard, enrollment, assessment, reports],
  RESEARCH: [dashboard, reports],
}

export function getDefaultPermissionsForRole(role?: string | null) {
  const normalized = normalizeIdentityRole(role)
  return rolePermissionDefaults[normalized] ?? dashboardOnly
}

export function isSuperAdminRole(role?: string | null) {
  return normalizeIdentityRole(role).toLowerCase() === 'superadmin'
}
