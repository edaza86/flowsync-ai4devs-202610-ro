# CLAUDE.md

Este fichero orienta a Claude Code (claude.ai/code) cuando trabaja con el código de este repositorio.

## Proyecto

FlowSync es un monorepo en TypeScript que se usa como ejercicio del curso AI4Devs: una API en AdonisJS 7 en `backend/` y una app en React 19 + Vite en `frontend/`. No hay `package.json` en la raíz; cada app se instala y se ejecuta desde su propio directorio. Requiere **Node.js 24+** (con Node 20 el backend falla con `Unknown file extension ".ts"`).

El `README.md` de la raíz es el enunciado del ejercicio (generado, no se edita a mano) y `prompts.md` es una plantilla que el alumno rellena con los prompts que ha lanzado. **El backend ya existe y no se debe modificar en este ejercicio**; el trabajo se hace en `frontend/`.

## Comandos

Backend (`cd backend`), servido en http://localhost:3333:

```bash
npm install && cp .env.example .env && node ace generate:key   # primera instalación
node ace migration:run      # crea tmp/db.sqlite3 y regenera database/schema.ts
npm run dev                 # node ace serve --hmr
npm test                    # node ace test (Japa); suites: unit, functional
node ace test functional    # una suite
node ace test --files tests/functional/auth.spec.ts   # un fichero
node ace test --tests "título del test"               # un test por título
npm run lint                # eslint (@adonisjs/eslint-config)
npm run typecheck           # tsc --noEmit
npm run format              # prettier (@adonisjs/prettier-config)
```

Todavía no hay ficheros de test; las suites esperan `tests/unit/**/*.spec.ts` y `tests/functional/**/*.spec.ts` (la suite funcional arranca el servidor HTTP; `.env.test` usa `SESSION_DRIVER=memory`).

Frontend (`cd frontend`), servido en http://localhost:5173:

```bash
npm install
npm run dev           # vite
npm run build         # tsc -b && vite build (esto es el typecheck)
npm run lint          # oxlint
npm run format        # prettier --write src
npm run format:check  # prettier --check src
```

El formato lo da Prettier (configuración en `frontend/.prettierrc.json`); un hook PostToolUse (`.claude/hooks/format-frontend.sh`) formatea automáticamente cada fichero que se edita dentro de `frontend/src/`. No hay test runner configurado.

## Arquitectura del backend

- **Rutas** (`start/routes.ts`): referencian los controladores con `controllers.X` desde `#generated/controllers`. Ese fichero y todo lo que hay en `.adonisjs/` lo generan los hooks `indexEntities` / Tuyau `generateRegistry` de `adonisrc.ts` cuando se ejecuta el servidor de desarrollo o ace: no se editan a mano.
- **Los modelos extienden clases de esquema generadas**: `migration:run` regenera `database/schema.ts` a partir de la BD, y `app/models/user.ts` extiende `UserSchema`. Las columnas se añaden con una migración nueva, no declarándolas en el modelo.
- **Envoltorio de respuesta**: `providers/api_provider.ts` añade `ctx.serialize()`, que envuelve las respuestas en `{ data: ... }`. Los transformers (`app/transformers/`) eligen los campos expuestos (el hash de la contraseña nunca se expone).
- **JSON en todo**: `force_json_response_middleware` fuerza `Accept: application/json`, así que los errores (validación de VineJS → 422 con un array `errors`, credenciales incorrectas, 401 de auth) llegan como JSON.
- **Auth**: el guard por defecto es `api` (tokens de acceso opacos con prefijo `oat_`, guardados en `auth_access_tokens`). Los clientes envían `Authorization: Bearer <token>`. Hay un guard de sesión `web` configurado, pero ninguna ruta lo usa.
- **CORS**: en desarrollo admite cualquier origen (`config/cors.ts`), así que el frontend llama directamente a `http://localhost:3333` (no hay proxy de Vite configurado).
- **BD**: SQLite con better-sqlite3 en `backend/tmp/db.sqlite3`.
- Los imports usan alias de subruta de Node (`#models/*`, `#validators/*`, etc., definidos en `backend/package.json`) con destinos `.js`.

### Contrato de la API (todo bajo `/api/v1`)

| Método | Ruta | Auth | Cuerpo / respuesta |
|---|---|---|---|
| POST | `/auth/signup` | – | `{ fullName, email, password, passwordConfirmation }` → `{ data: { user, token } }` |
| POST | `/auth/login` | – | `{ email, password }` → `{ data: { user, token } }` |
| GET | `/account/profile` | Bearer | → `{ data: user }` |
| POST | `/account/logout` | Bearer | revoca el token actual |

Las reglas de validación están en `app/validators/user.ts` y son más estrictas de lo que suele decir un ticket de producto: en el registro, `fullName` debe estar presente (admite null), `email` es único y de ≤254 caracteres, `password` tiene entre 8 y 32 caracteres y `passwordConfirmation` debe coincidir con `password`. El objeto `user` contiene `id, fullName, email, createdAt, updatedAt, initials`.

## Frontend

Sigue siendo la plantilla de Vite + React sin tocar (`src/App.tsx`): no hay router, ni cliente de API, ni Tailwind/shadcn instalados todavía. La librería de UI prevista es **shadcn/ui** (los componentes se copian al repo, no es una dependencia). La configuración de TS es estricta con variables y parámetros sin usar y usa `verbatimModuleSyntax` (usa `import type` para los tipos).

## Reglas de proceso

Síguelas en cada cambio de código, en este orden:

1. **Rama nueva antes de tocar código.** Nunca se trabaja en `main` ni en la rama de partida: crea antes una rama (`git switch -c <tipo>/<descripcion-corta>`, p. ej. `feat/login-form`; incluye la clave de Jira si la hay, p. ej. `feat/KAN-12-login-form`).
2. **Al cerrar, commit con `/commit`.** Prepara los cambios y ejecuta la skill `/commit` (Conventional Commits). No escribas los mensajes de commit a mano.
3. **Abre el pull request con `gh pr create`** contra `main`: sube la rama (`git push -u origin HEAD`) y crea el PR con un título en el mismo formato convencional y un cuerpo que resuma el cambio y cómo se ha verificado.
4. **Después, lanza el subagente `adversarial-reviewer` sobre ese pull request** (pásale el número del PR). Si encuentra fallos, corrígelos en la misma rama (nuevo `/commit` y push) antes de dar el trabajo por terminado.
5. **En el chat, responde solo con la URL del pull request.** Sin resumen, sin el informe de revisión, sin texto adicional.
6. **Al mergear el pull request, mueve el ticket de Jira a «Listo».** La clave sale del nombre de la rama o del pie `Refs:` de los commits. Usa la transición cuyo estado destino sea «Listo» (categoría «Done»), y solo cuando el PR esté mergeado, no al abrirlo. Si no hay ticket, no hagas nada.
