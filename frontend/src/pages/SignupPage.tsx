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
  fieldErrorsFrom,
  generalErrorMessage,
  PASSWORD_MAX,
  PASSWORD_MIN,
  validateEmail,
  validatePassword,
  type FieldErrors,
} from '@/lib/validation'

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    const errors: FieldErrors = {
      email: validateEmail(email.trim()),
      password: validatePassword(password),
      passwordConfirmation:
        password === passwordConfirmation
          ? undefined
          : 'Las contraseñas no coinciden',
    }
    setFieldErrors(errors)
    setFormError(null)
    if (Object.values(errors).some(Boolean)) return

    setSubmitting(true)
    try {
      await signup({
        fullName: fullName.trim() || null,
        email: email.trim(),
        password,
        passwordConfirmation,
      })
      navigate('/profile', { replace: true })
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) {
        const serverErrors = fieldErrorsFrom(error)
        setFieldErrors(serverErrors)
        if (Object.keys(serverErrors).length === 0)
          setFormError('Revisa los datos del formulario.')
      } else {
        setFormError(generalErrorMessage(error))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Crear cuenta"
      description="Regístrate con tu email y una contraseña."
      footer={
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-primary underline">
            Inicia sesión
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
          id="fullName"
          label="Nombre (opcional)"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          error={fieldErrors.fullName}
        />
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
          label={`Contraseña (${PASSWORD_MIN}–${PASSWORD_MAX} caracteres)`}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
        />
        <FormField
          id="passwordConfirmation"
          label="Repite la contraseña"
          type="password"
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={(event) => setPasswordConfirmation(event.target.value)}
          error={fieldErrors.passwordConfirmation}
        />
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthCard>
  )
}
