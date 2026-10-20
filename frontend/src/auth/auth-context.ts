import { createContext } from 'react'
import type { LoginInput, SignupInput } from '@/lib/api'

export type AuthContextValue = {
  token: string | null
  login: (input: LoginInput) => Promise<void>
  signup: (input: SignupInput) => Promise<void>
  logout: () => Promise<void>
  /** Borra la sesión local sin llamar al backend (p. ej. tras un 401). */
  clearSession: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
