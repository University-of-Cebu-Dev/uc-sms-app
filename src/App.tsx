import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { PortalBrandingProvider } from '@/hooks/usePortalBranding'
import { ToastProvider } from '@/hooks/useToast'
import { AuthProvider } from '@/hooks/useAuth'
import { RoleSwitcherProvider } from '@/hooks/useRoleSwitcher'
import { ToastContainer } from '@/components/ui/Toast'
import { router } from '@/routes'

export default function App() {
  return (
    <AuthProvider>
      <PortalBrandingProvider>
        <ThemeProvider>
          <ToastProvider>
            <RoleSwitcherProvider>
              <RouterProvider router={router} />
              <ToastContainer />
            </RoleSwitcherProvider>
          </ToastProvider>
        </ThemeProvider>
      </PortalBrandingProvider>
    </AuthProvider>
  )
}
