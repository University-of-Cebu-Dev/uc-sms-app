import { ApiError } from '@/lib/api'

export interface LoginErrorDetails {
  title: string
  message: string
  hint?: string
}

export class LoginError extends Error {
  details: LoginErrorDetails

  constructor(details: LoginErrorDetails) {
    super(details.message)
    this.name = 'LoginError'
    this.details = details
  }
}

const LOGIN_ERROR_MAP: Record<string, LoginErrorDetails> = {
  USER_NOT_FOUND: {
    title: 'Account not found',
    message: 'No account matches that email or ID number.',
    hint: 'Check your credentials or contact the registrar if you need help.',
  },
  INVALID_PASSWORD: {
    title: 'Incorrect password',
    message: 'The password you entered is not correct.',
    hint: 'Try again or use Forgot password if you need to reset it.',
  },
  ACCOUNT_LOCKED: {
    title: 'Account temporarily locked',
    message: 'Too many failed sign-in attempts. Your account is locked for 15 minutes.',
    hint: 'Wait a few minutes before trying again.',
  },
  RATE_LIMITED: {
    title: 'Too many attempts',
    message: 'You have made too many sign-in requests.',
    hint: 'Please wait about a minute, then try again.',
  },
  SERVICE_UNAVAILABLE: {
    title: 'Sign-in service unavailable',
    message: 'We could not reach the University of Cebu sign-in service.',
    hint: 'Make sure the identity service is running, then try again.',
  },
  PROFILE_LOAD_FAILED: {
    title: 'Profile could not be loaded',
    message: 'You signed in, but we could not load your portal profile.',
    hint: 'Try again. If the problem continues, contact support.',
  },
}

function normalizeLoginCode(raw: string): string {
  return raw
    .replace(/^LOGIN_FAILED\s+/i, '')
    .replace(/^Exception:\s*/i, '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')
}

function mapStatusAndBody(status: number, raw: string): LoginErrorDetails | null {
  const code = normalizeLoginCode(raw)

  if (LOGIN_ERROR_MAP[code]) {
    return LOGIN_ERROR_MAP[code]
  }

  const lower = raw.toLowerCase()

  if (lower.includes('locked')) {
    return LOGIN_ERROR_MAP.ACCOUNT_LOCKED
  }

  if (status === 429 || lower.includes('rate limit')) {
    return LOGIN_ERROR_MAP.RATE_LIMITED
  }

  if (status === 401 || code.includes('INVALID') || code.includes('UNAUTHORIZED')) {
    return {
      title: 'Sign in failed',
      message: 'Your email, ID number, or password is incorrect.',
      hint: 'Double-check your credentials and try again.',
    }
  }

  if (status >= 500) {
    if (code.includes('USER_NOT_FOUND')) return LOGIN_ERROR_MAP.USER_NOT_FOUND
    if (code.includes('INVALID_PASSWORD')) return LOGIN_ERROR_MAP.INVALID_PASSWORD

    return {
      title: 'Sign-in service error',
      message: 'The sign-in service returned an unexpected error.',
      hint: 'Please try again in a moment.',
    }
  }

  if (raw && raw !== 'Request failed' && raw !== 'Internal Server Error') {
    return {
      title: 'Sign in failed',
      message: raw.replace(/^LOGIN_FAILED\s+/i, '').trim(),
    }
  }

  return null
}

export function getLoginErrorDetails(error: unknown): LoginErrorDetails {
  if (error instanceof LoginError) {
    return error.details
  }

  if (error instanceof ApiError) {
    const mapped = mapStatusAndBody(error.status, error.message)
    if (mapped) return mapped
  }

  if (error instanceof TypeError) {
    return LOGIN_ERROR_MAP.SERVICE_UNAVAILABLE
  }

  if (error instanceof Error && error.message) {
    const mapped = mapStatusAndBody(0, error.message)
    if (mapped) return mapped
  }

  return {
    title: 'Sign in failed',
    message: 'Something went wrong while signing you in.',
    hint: 'Please try again.',
  }
}

export function getProfileLoadError(): LoginErrorDetails {
  return LOGIN_ERROR_MAP.PROFILE_LOAD_FAILED
}
