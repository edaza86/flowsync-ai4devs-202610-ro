import { ApiError } from './api'

/** Reglas de backend/app/validators/user.ts, para avisar antes de enviar. */
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 32
export const EMAIL_MAX = 254

// Exige un dominio de nivel superior de al menos 2 letras, como isEmail de VineJS
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i

export type FieldErrors = Partial<Record<string, string>>

/**
 * El backend compara el email distinguiendo mayúsculas: se normaliza aquí
 * para que «Ana@X.com» y «ana@x.com» sean la misma cuenta.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Lleva el foco al primer campo con error (el orden es el del objeto). */
export function focusFirstInvalid(errors: FieldErrors) {
  const field = Object.keys(errors).find((key) => errors[key])
  if (field) document.getElementById(field)?.focus()
}

export function validateEmail(email: string): string | undefined {
  if (!email) return 'Introduce tu email'
  if (email.length > EMAIL_MAX)
    return `El email no puede tener más de ${EMAIL_MAX} caracteres`
  if (!EMAIL_PATTERN.test(email)) return 'Introduce un email válido'
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Introduce una contraseña'
  if (password.length < PASSWORD_MIN)
    return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`
  if (password.length > PASSWORD_MAX)
    return `La contraseña no puede tener más de ${PASSWORD_MAX} caracteres`
}

const RULE_MESSAGES: Record<string, string> = {
  'email:database.unique': 'Este email ya está registrado',
  'email:email': 'Introduce un email válido',
  'email:maxLength': `El email no puede tener más de ${EMAIL_MAX} caracteres`,
  'password:minLength': `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres`,
  'password:maxLength': `La contraseña no puede tener más de ${PASSWORD_MAX} caracteres`,
  'passwordConfirmation:sameAs': 'Las contraseñas no coinciden',
}

/** Traduce los errores 422 de VineJS a mensajes por campo. */
export function fieldErrorsFrom(error: ApiError): FieldErrors {
  const result: FieldErrors = {}
  for (const { field, rule } of error.errors) {
    if (!field || result[field]) continue
    result[field] = RULE_MESSAGES[`${field}:${rule}`] ?? 'Revisa este campo'
  }
  return result
}

/** Mensaje general para errores que no son de un campo concreto. */
export function generalErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 0)
    return 'No se puede conectar con el servidor. Inténtalo de nuevo en unos segundos.'
  return 'Ha ocurrido un error inesperado. Inténtalo de nuevo.'
}
