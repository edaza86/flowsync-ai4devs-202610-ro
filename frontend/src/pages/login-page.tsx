import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/form-field'
import { login } from '@/lib/api'
import { toFormErrors, type FormErrors } from '@/lib/errors'

export function LoginPage() {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<FormErrors>({ fields: {} })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    setSubmitting(true)
    setErrors({ fields: {} })
    try {
      await login(String(data.get('email')), String(data.get('password')))
      navigate('/profile', { replace: true })
    } catch (error) {
      setErrors(toFormErrors(error, 'login'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>Entra con tu email y contraseña.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          {errors.form && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{errors.form}</AlertDescription>
            </Alert>
          )}
          <FormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            error={errors.fields.email}
          />
          <FormField
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            required
            error={errors.fields.password}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Entrando…' : 'Entrar'}
          </Button>
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link to="/signup" className="text-foreground underline underline-offset-4">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
