import { Navigate, Outlet } from 'react-router'
import { useAuth } from './useAuth'

export function ProtectedRoute() {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}

/** Para /login y /signup: si ya hay sesión, va directo al perfil. */
export function GuestRoute() {
  const { token } = useAuth()
  if (token) return <Navigate to="/profile" replace />
  return <Outlet />
}
