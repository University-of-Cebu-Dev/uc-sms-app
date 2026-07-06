import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { EnrollmentSettings } from '@/features/settings/EnrollmentSettings'
import { ProgramsSettings } from '@/features/settings/ProgramsSettings'
import { ThemesSettings } from '@/features/settings/ThemesSettings'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProtectedRoute, GuestRoute } from '@/components/auth/ProtectedRoute'

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
        path: '/settings',
        element: <SettingsPage />,
        children: [
          { index: true, element: <Navigate to="/settings/enrollment" replace /> },
          { path: 'enrollment', element: <EnrollmentSettings /> },
          { path: 'programs', element: <ProgramsSettings /> },
          { path: 'themes', element: <ThemesSettings /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
