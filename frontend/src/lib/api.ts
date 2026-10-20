const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

const TOKEN_KEY = 'flowsync.token'

export type User = {
  id: number
  fullName: string | null
  email: string
  initials: string
  createdAt: string
  updatedAt: string
}

type AuthResponse = { token: string; user: User }

/**
 * Error item as returned by the backend:
 * `{ errors: [{ message, field?, rule? }] }`.
 */
export type ApiFieldError = { message: string; field?: string; rule?: string }

export class ApiError extends Error {
  readonly status: number
  readonly errors: ApiFieldError[]

  constructor(status: number, errors: ApiFieldError[]) {
    super(errors[0]?.message ?? `Request failed with status ${status}`)
    this.status = status
    this.errors = errors
  }
}

/**
 * Thrown when the backend cannot be reached at all.
 */
export class NetworkError extends Error {}

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body) headers.set('Content-Type', 'application/json')

  const token = tokenStore.get()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, { ...init, headers })
  } catch {
    throw new NetworkError('No se pudo conectar con el servidor.')
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, body?.errors ?? [])
  }

  return body?.data ?? body
}

export type SignupInput = {
  fullName: string | null
  email: string
  password: string
  passwordConfirmation: string
}

export async function signup(input: SignupInput) {
  const result = await request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  tokenStore.set(result.token)
  return result.user
}

export async function login(email: string, password: string) {
  const result = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  tokenStore.set(result.token)
  return result.user
}

export function getProfile() {
  return request<User>('/account/profile')
}

export async function logout() {
  try {
    await request('/account/logout', { method: 'POST' })
  } finally {
    tokenStore.clear()
  }
}
