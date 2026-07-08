import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { EnrollmentPage } from '@/pages/EnrollmentPage'
import { SettingsPage } from '@/pages/SettingsPage'
import {
  FacultyEnrollment,
  ParentEnrollment,
  StudentEnrollment,
} from '@/features/enrollment'
import { StaffEnrollmentLayout } from '@/features/enrollment/staff/StaffEnrollmentLayout'
import { StaffRegistration } from '@/features/enrollment/staff/StaffRegistration'
import { StaffEnrolledSubjects } from '@/features/enrollment/staff/StaffEnrolledSubjects'
import { StaffPromissory } from '@/features/enrollment/staff/StaffPromissory'
import { StaffAdjustments } from '@/features/enrollment/staff/StaffAdjustments'
import { StaffTracker } from '@/features/enrollment/staff/StaffTracker'
import { EnrollmentSettings } from '@/features/settings/EnrollmentSettings'
import { ProgramsSettings } from '@/features/settings/ProgramsSettings'
import { ThemesSettings } from '@/features/settings/ThemesSettings'
import { RolesSettings } from '@/features/settings/RolesSettings'
import { ModulePlaceholderPage } from '@/pages/ModulePlaceholderPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { moduleNavItems } from '@/data/navConfig'
import { ProtectedRoute, GuestRoute } from '@/components/auth/ProtectedRoute'

const moduleRoutes = moduleNavItems.map((item) => ({
  path: item.path,
  element: <ModulePlaceholderPage />,
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
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/profile', element: <ProfilePage /> },
      {
        path: '/enrollment',
        element: <EnrollmentPage />,
        children: [
          { index: true, element: <Navigate to="/enrollment/student" replace /> },
          { path: 'parent', element: <ParentEnrollment /> },
          { path: 'student', element: <StudentEnrollment /> },
          {
            path: 'staff',
            element: <StaffEnrollmentLayout />,
            children: [
              { index: true, element: <Navigate to="/enrollment/staff/registration" replace /> },
              { path: 'registration', element: <StaffRegistration /> },
              { path: 'enrolled-subjects', element: <StaffEnrolledSubjects /> },
              { path: 'promissory', element: <StaffPromissory /> },
              { path: 'adjustments', element: <StaffAdjustments /> },
              { path: 'tracker', element: <StaffTracker /> },
            ],
          },
          { path: 'faculty', element: <FacultyEnrollment /> },
          
        ],
      },
      ...moduleRoutes,
      {
        path: '/settings',
        element: <SettingsPage />,
        children: [
          { index: true, element: <Navigate to="/settings/enrollment" replace /> },
          { path: 'enrollment', element: <EnrollmentSettings /> },
          { path: 'programs', element: <ProgramsSettings /> },
          { path: 'themes', element: <ThemesSettings /> },
          { path: 'roles-permissions', element: <RolesSettings /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
