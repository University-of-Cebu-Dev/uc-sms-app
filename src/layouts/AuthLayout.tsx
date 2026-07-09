import { Outlet } from 'react-router-dom'
import ucLoginBg from '@/assets/uc-login-bg.jpg'
import { APP_NAME } from '@/components/common/AppBrand'

export function AuthLayout() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${ucLoginBg})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#003087]/90 via-[#004799]/80 to-[#001f5c]/95"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.14),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <Outlet />

        <p className="mt-6 text-center text-xs text-white/65">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  )
}
