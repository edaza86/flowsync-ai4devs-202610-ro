import { ApiError, NetworkError, type ApiFieldError } from '@/lib/api'

export type FormErrors = {
  /** Message shown at the top of the form. */
  form?: string
  /** Messages shown under each input, keyed by backend field name. */
  fields: Record<string, string>
  /** Signup failed because the email already has an account. */
  emailTaken?: boolean
}

/**
 * Spanish copy for the VineJS rules the auth validators can trigger.
 */
function fieldMessage({ field, rule, message }: ApiFieldError): string {
  switch (rule) {
    case 'database.unique':
      return field === 'email' ? 'Ya existe una cuenta con este email.' : message
    case 'required':
      return 'Este campo es obligatorio.'
    case 'email':
      return 'Introduce un email válido.'
    case 'minLength':
      return 'Debe tener al menos 8 caracteres.'
    case 'maxLength':
      return field === 'email'
        ? 'El email es demasiado largo.'
        : 'Debe tener como máximo 32 caracteres.'
    case 'sameAs':
      return 'Las contraseñas no coinciden.'
    default:
      return message
  }
}

export function toFormErrors(error: unknown, context: 'login' | 'signup'): FormErrors {
  if (error instanceof NetworkError) {
    return { form: 'No se pudo conectar con el servidor. Inténtalo de nuevo en unos segundos.', fields: {} }
  }

  if (error instanceof ApiError) {
    // Login with wrong email/password answers 400 "Invalid user credentials".
    if (context === 'login' && error.status === 400) {
      return { form: 'Email o contraseña incorrectos.', fields: {} }
    }

    if (error.status === 422) {
      const fields: Record<string, string> = {}
      for (const item of error.errors) {
        if (item.field && !fields[item.field]) fields[item.field] = fieldMessage(item)
      }
      const emailTaken = error.errors.some((e) => e.field === 'email' && e.rule === 'database.unique')
      const form = emailTaken
        ? 'Ese email ya está registrado. ¿Quieres iniciar sesión?'
        : 'Revisa los campos marcados.'
      return { form, fields, emailTaken }
    }
  }

  return { form: 'Algo ha ido mal. Inténtalo de nuevo.', fields: {} }
}
