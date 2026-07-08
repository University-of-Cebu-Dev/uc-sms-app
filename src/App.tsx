import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { ToastProvider } from '@/hooks/useToast'
import { AuthProvider } from '@/hooks/useAuth'
import { RoleSwitcherProvider } from '@/hooks/useRoleSwitcher'
import { ToastContainer } from '@/components/ui/Toast'
import { router } from '@/routes'

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <RoleSwitcherProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </RoleSwitcherProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
