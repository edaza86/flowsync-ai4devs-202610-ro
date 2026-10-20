import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/form-field'
import { signup } from '@/lib/api'
import { toFormErrors, type FormErrors } from '@/lib/errors'

export function SignupPage() {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<FormErrors>({ fields: {} })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const fullName = String(data.get('fullName')).trim()
    const password = String(data.get('password'))
    const passwordConfirmation = String(data.get('passwordConfirmation'))

    if (password !== passwordConfirmation) {
      setErrors({ fields: { passwordConfirmation: 'Las contraseñas no coinciden.' } })
      return
    }

    setSubmitting(true)
    setErrors({ fields: {} })
    try {
      // The backend requires `fullName` to be present, but accepts null.
      await signup({
        fullName: fullName || null,
        email: String(data.get('email')),
        password,
        passwordConfirmation,
      })
      navigate('/profile', { replace: true })
    } catch (error) {
      setErrors(toFormErrors(error, 'signup'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>Regístrate con tu email y una contraseña.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          {errors.form && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>
                <p>
                  {errors.form}{' '}
                  {errors.emailTaken && (
                    <Link to="/login" className="font-medium underline underline-offset-4">
                      Ir a iniciar sesión
                    </Link>
                  )}
                </p>
              </AlertDescription>
            </Alert>
          )}
          <FormField
            id="fullName"
            label="Nombre (opcional)"
            autoComplete="name"
            error={errors.fields.fullName}
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            error={errors.fields.email}
          />
          <FormField
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={32}
            required
            hint="Entre 8 y 32 caracteres."
            error={errors.fields.password}
          />
          <FormField
            id="passwordConfirmation"
            label="Repite la contraseña"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={32}
            required
            error={errors.fields.passwordConfirmation}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-foreground underline underline-offset-4">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
