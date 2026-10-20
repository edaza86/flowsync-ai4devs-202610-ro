import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { tokenStore } from '@/lib/api'
import { LoginPage } from '@/pages/login-page'
import { ProfilePage } from '@/pages/profile-page'
import { SignupPage } from '@/pages/signup-page'

function RequireAuth({ children }: { children: ReactNode }) {
  return tokenStore.get() ? children : <Navigate to="/login" replace />
}

function GuestOnly({ children }: { children: ReactNode }) {
  return tokenStore.get() ? <Navigate to="/profile" replace /> : children
}

function App() {
  return (
    <BrowserRouter>
      <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
        <Routes>
          <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
          <Route path="/signup" element={<GuestOnly><SignupPage /></GuestOnly>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
