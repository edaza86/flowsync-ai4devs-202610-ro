import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ApiError, getProfile, logout, tokenStore, type User } from '@/lib/api'

export function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getProfile()
      .then((profile) => {
        if (!cancelled) setUser(profile)
      })
      .catch((err) => {
        if (cancelled) return
        // Expired or revoked token: drop it and send the user back to login.
        if (err instanceof ApiError && err.status === 401) {
          tokenStore.clear()
          navigate('/login', { replace: true })
          return
        }
        setError('No se pudo cargar tu perfil. Inténtalo de nuevo.')
      })
    return () => {
      cancelled = true
    }
  }, [navigate])

  async function handleLogout() {
    await logout().catch(() => {})
    navigate('/login', { replace: true })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Tu perfil</CardTitle>
        <CardDescription>Datos de tu cuenta en FlowSync.</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : !user ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted font-medium">
              {user.initials}
            </div>
            <dl className="grid gap-1 text-sm">
              <dt className="sr-only">Nombre</dt>
              <dd className="font-medium">{user.fullName ?? 'Sin nombre'}</dd>
              <dt className="sr-only">Email</dt>
              <dd className="text-muted-foreground">{user.email}</dd>
            </dl>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </CardFooter>
    </Card>
  )
}
