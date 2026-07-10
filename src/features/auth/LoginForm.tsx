import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginFormData } from './schemas'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import { AppBrand } from '@/components/common/AppBrand'
import { useAuth } from '@/hooks/useAuth'
import { getLoginErrorDetails } from '@/utils/loginErrors'

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState<{
    title: string
    message: string
    hint?: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setLoginError(null)

    try {
      await login(data.email, data.password, data.rememberMe)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setLoginError(getLoginErrorDetails(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      className={cn(
        'w-full rounded-2xl border-white/30 bg-white/96 shadow-2xl shadow-black/30',
        'backdrop-blur-xl backdrop-saturate-150 overflow-hidden',
      )}
      padding="none"
    >
      <div className="h-1 bg-gradient-to-r from-[#003087] via-[#00a8e8] to-[#ffc20e]" aria-hidden="true" />

      <div className="p-6 sm:p-8">
        <div className="mb-7 flex flex-col items-center text-center">
          <AppBrand
            variant="featured"
            className="flex-col items-center gap-4"
            logoClassName="h-14 sm:h-16"
            titleClassName="text-xl sm:text-2xl font-bold text-center tracking-tight whitespace-normal text-[#003087]"
          />
          <p className="mt-4 text-sm text-gh-fg-muted max-w-xs">
            Student portal — sign in to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {loginError && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-gh-danger/25 bg-gh-danger-subtle/80 px-4 py-3"
            >
              <div className="flex gap-3">
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-gh-danger"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gh-danger">{loginError.title}</p>
                  <p className="mt-1 text-sm text-gh-fg">{loginError.message}</p>
                  {loginError.hint && (
                    <p className="mt-1.5 text-xs text-gh-fg-muted">{loginError.hint}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <Input
            label="Email or ID number"
            type="text"
            placeholder="you@example.com or student ID"
            autoComplete="username"
            error={errors.email?.message}
            {...register('email', {
              onChange: () => setLoginError(null),
            })}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              className="pr-10"
              {...register('password', {
                onChange: () => setLoginError(null),
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={cn(
                'absolute right-3 top-[34px] p-0.5 text-gh-fg-muted',
                'hover:text-gh-fg transition-colors',
              )}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gh-border text-gh-accent focus:ring-gh-accent"
                {...register('rememberMe')}
              />
              <span className="text-sm text-gh-fg">Remember me</span>
            </label>
            <a
              href="#"
              className="text-sm text-gh-accent hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          </div>

          <Button type="submit" fullWidth loading={loading} size="lg" className="shadow-md shadow-gh-accent/20">
            Sign In
          </Button>
        </form>
      </div>
    </Card>
  )
}
