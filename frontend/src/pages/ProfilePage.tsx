import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { api, ApiError, type User } from '@/lib/api'
import { generalErrorMessage } from '@/lib/validation'

export function ProfilePage() {
  const { token, logout, clearSession } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  // Se incrementa para volver a pedir el perfil tras un error
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    api
      .profile(token)
      .then((profile) => {
        if (!cancelled) setUser(profile)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          // Token caducado o revocado: ProtectedRoute redirige a /login
          clearSession()
        } else {
          setError(generalErrorMessage(err))
        }
      })
    return () => {
      cancelled = true
    }
  }, [token, clearSession, attempt])

  function handleRetry() {
    setError(null)
    setAttempt((value) => value + 1)
  }

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Tu perfil</CardTitle>
          <CardDescription>
            Datos de la cuenta con la que has entrado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="grid gap-3">
              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button variant="secondary" onClick={handleRetry}>
                Reintentar
              </Button>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
              >
                {user.initials}
              </div>
              <dl className="grid min-w-0 gap-1">
                <dt className="sr-only">Nombre</dt>
                <dd className="truncate font-medium">
                  {user.fullName ?? 'Sin nombre'}
                </dd>
                <dt className="sr-only">Email</dt>
                <dd className="truncate text-sm text-muted-foreground">
                  {user.email}
                </dd>
              </dl>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Cargando perfil…
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            disabled={loggingOut}
            onClick={handleLogout}
          >
            {loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
