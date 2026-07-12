import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { EnrollmentPage } from '@/pages/EnrollmentPage'
import { SettingsPage } from '@/pages/SettingsPage'
import {
  ParentEnrollment,
  StudentEnrollment,
} from '@/features/enrollment'
import { StaffEnrollmentLayout } from '@/features/enrollment/staff/StaffEnrollmentLayout'
import { StaffRoleOverview } from '@/features/enrollment/staff/StaffRoleOverview'
import { StaffSectionPlaceholder } from '@/features/enrollment/staff/StaffSectionPlaceholder'
import { StaffRegistration } from '@/features/enrollment/staff/StaffRegistration'
import { StaffEnrolledSubjects } from '@/features/enrollment/staff/StaffEnrolledSubjects'
import { StaffPromissory } from '@/features/enrollment/staff/StaffPromissory'
import { StaffAdjustments } from '@/features/enrollment/staff/StaffAdjustments'
import { StaffTracker } from '@/features/enrollment/staff/StaffTracker'
import { EnrollmentSettings } from '@/features/settings/EnrollmentSettings'
import { GeneralSettings } from '@/features/settings/GeneralSettings'
import { ProgramsSettings } from '@/features/settings/ProgramsSettings'
import { ThemesSettings } from '@/features/settings/ThemesSettings'
import { RolesSettings } from '@/features/settings/RolesSettings'
import { AccountsSettings } from '@/features/settings/AccountsSettings'
import { ModulePlaceholderPage } from '@/pages/ModulePlaceholderPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { moduleNavItems } from '@/data/navConfig'
import { ProtectedRoute, GuestRoute } from '@/components/auth/ProtectedRoute'
import { ModuleProtectedRoute } from '@/components/auth/ModuleProtectedRoute'

const moduleRoutes = moduleNavItems.map((item) => ({
  path: item.path,
  element: (
    <ModuleProtectedRoute path={item.path}>
      <ModulePlaceholderPage />
    </ModuleProtectedRoute>
  ),
}))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: (
        <ModuleProtectedRoute path="/dashboard">
          <DashboardPage />
        </ModuleProtectedRoute>
      ) },
      { path: '/profile', element: <ProfilePage /> },
      {
        path: '/enrollment',
        element: (
          <ModuleProtectedRoute path="/enrollment">
            <EnrollmentPage />
          </ModuleProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/enrollment/student" replace /> },
          { path: 'parent', element: <ParentEnrollment /> },
          { path: 'student', element: <StudentEnrollment /> },
          {
            path: 'staff',
            element: <StaffEnrollmentLayout />,
            children: [
              { index: true, element: <Navigate to="/enrollment/staff/overview" replace /> },
              { path: 'overview', element: <StaffRoleOverview /> },
              { path: 'payments', element: <StaffSectionPlaceholder /> },
              { path: 'fee-assessment', element: <StaffSectionPlaceholder /> },
              { path: 'billing', element: <StaffSectionPlaceholder /> },
              { path: 'student-services', element: <StaffSectionPlaceholder /> },
              { path: 'approvals', element: <StaffSectionPlaceholder /> },
              { path: 'reports', element: <StaffSectionPlaceholder /> },
              { path: 'registration', element: <StaffRegistration /> },
              { path: 'enrolled-subjects', element: <StaffEnrolledSubjects /> },
              { path: 'promissory', element: <StaffPromissory /> },
              { path: 'adjustments', element: <StaffAdjustments /> },
              { path: 'tracker', element: <StaffTracker /> },
            ],
          },
        ],
      },
      ...moduleRoutes,
      {
        path: '/settings',
        element: (
          <ModuleProtectedRoute path="/settings">
            <SettingsPage />
          </ModuleProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/settings/general" replace /> },
          { path: 'general', element: (
            <ModuleProtectedRoute path="/settings/general">
              <GeneralSettings />
            </ModuleProtectedRoute>
          ) },
          { path: 'enrollment', element: (
            <ModuleProtectedRoute path="/settings/enrollment">
              <EnrollmentSettings />
            </ModuleProtectedRoute>
          ) },
          { path: 'programs', element: (
            <ModuleProtectedRoute path="/settings/programs">
              <ProgramsSettings />
            </ModuleProtectedRoute>
          ) },
          { path: 'themes', element: (
            <ModuleProtectedRoute path="/settings/themes">
              <ThemesSettings />
            </ModuleProtectedRoute>
          ) },
          { path: 'roles-permissions', element: (
            <ModuleProtectedRoute path="/settings/roles-permissions">
              <RolesSettings />
            </ModuleProtectedRoute>
          ) },
          { path: 'accounts', element: (
            <ModuleProtectedRoute path="/settings/accounts">
              <AccountsSettings />
            </ModuleProtectedRoute>
          ) },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
