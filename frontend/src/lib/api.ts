const API_URL: string =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api/v1'

export type User = {
  id: number
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string | null
  initials: string
}

export type AuthResponse = {
  user: User
  token: string
}

export type FieldError = {
  message: string
  rule?: string
  field?: string
}

export type SignupInput = {
  fullName: string | null
  email: string
  password: string
  passwordConfirmation: string
}

export type LoginInput = {
  email: string
  password: string
}

/**
 * Error de la API. `status` es 0 cuando no se ha podido contactar con el
 * servidor; `errors` es el array que devuelve el backend (VineJS, auth).
 */
export class ApiError extends Error {
  readonly status: number
  readonly errors: FieldError[]

  constructor(status: number, errors: FieldError[]) {
    super(errors[0]?.message ?? `HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }

  fieldError(field: string): FieldError | undefined {
    return this.errors.find((error) => error.field === field)
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  token?: string | null
}

async function request<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, [])
  }

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const errors =
      payload && typeof payload === 'object' && 'errors' in payload
        ? (payload.errors as FieldError[])
        : []
    throw new ApiError(response.status, errors)
  }

  // El backend envuelve las respuestas en { data } (ctx.serialize)
  return (payload as { data: T }).data
}

export const api = {
  signup: (input: SignupInput) =>
    request<AuthResponse>('/auth/signup', { method: 'POST', body: input }),
  login: (input: LoginInput) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: input }),
  profile: (token: string) => request<User>('/account/profile', { token }),
  logout: (token: string) =>
    request<unknown>('/account/logout', { method: 'POST', token }),
}
