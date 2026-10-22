import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, type LoginInput, type SignupInput } from '@/lib/api'
import { AuthContext, type AuthContextValue } from './auth-context'

const TOKEN_KEY = 'flowsync.token'

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function writeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Sin almacenamiento disponible la sesión vive solo en memoria
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken)

  // Login o logout en otra pestaña: se refleja aquí
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === TOKEN_KEY || event.key === null) setToken(readToken())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const saveToken = useCallback((next: string | null) => {
    writeToken(next)
    setToken(next)
  }, [])

  const login = useCallback(
    async (input: LoginInput) => {
      const { token } = await api.login(input)
      saveToken(token)
    },
    [saveToken],
  )

  const signup = useCallback(
    async (input: SignupInput) => {
      const { token } = await api.signup(input)
      saveToken(token)
    },
    [saveToken],
  )

  const clearSession = useCallback(() => saveToken(null), [saveToken])

  const logout = useCallback(async () => {
    if (token) {
      // Si la revocación falla, la sesión local se cierra igualmente
      await api.logout(token).catch(() => undefined)
    }
    saveToken(null)
  }, [token, saveToken])

  const value = useMemo<AuthContextValue>(
    () => ({ token, login, signup, logout, clearSession }),
    [token, login, signup, logout, clearSession],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
