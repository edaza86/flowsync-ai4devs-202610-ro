import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { AuthCard } from '@/components/AuthCard'
import { FormField } from '@/components/FormField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/lib/api'
import {
  generalErrorMessage,
  validateEmail,
  type FieldErrors,
} from '@/lib/validation'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    const errors: FieldErrors = {
      email: validateEmail(email.trim()),
      password: password ? undefined : 'Introduce tu contraseña',
    }
    setFieldErrors(errors)
    setFormError(null)
    if (errors.email || errors.password) return

    setSubmitting(true)
    try {
      await login({ email: email.trim(), password })
      navigate('/profile', { replace: true })
    } catch (error) {
      // 400 = credenciales inválidas (E_INVALID_CREDENTIALS); 422 = formato
      if (error instanceof ApiError && [400, 401, 422].includes(error.status)) {
        setFormError('Email o contraseña incorrectos.')
      } else {
        setFormError(generalErrorMessage(error))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Iniciar sesión"
      description="Accede con tu email y tu contraseña."
      footer={
        <p>
          ¿No tienes cuenta?{' '}
          <Link to="/signup" className="font-medium text-primary underline">
            Regístrate
          </Link>
        </p>
      }
    >
      <form noValidate onSubmit={handleSubmit} className="grid gap-4">
        {formError && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
        />
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
        />
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </AuthCard>
  )
}
