# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Implementar la autenticación en el frontend, consumiendo el backend de auth ya existente (`POST /api/v1/auth/signup`, `POST /api/v1/auth/login`). Usar shadcn/ui para los componentes.
## Criterios de aceptación
- Pantalla de registro (email+password) que llama a `POST /api/v1/auth/signup`.
- Pantalla de login (email+password) que llama a `POST /api/v1/auth/login` y guarda el token recibido.
- Tras login exitoso: redirige a una vista protegida (p. ej. perfil) que consuma `GET /api/v1/account/profile`.
- Credenciales inválidas en login, o email ya registrado en signup, muestran un mensaje claro — no un error genérico ni de consola.
- Enlace de navegación entre login y registro.
```

**Qué salió:** lo implementó directamente, sin plan mode. Leyó el validador del backend y probó la API con curl antes de escribir código, así que detectó los campos que el ticket no menciona. Lo verificó con Playwright de punta a punta. Por el camino descubrió que el `:5173` era el frontend de la otra copia y levantó esta en otro puerto.

**Salida:**

La autenticación está implementada en `frontend/` con shadcn/ui y cumple los cinco criterios. La probé en un navegador real (Playwright, en modo headless) contra el backend en `:3333` y pasaron los 9 pasos, sin errores en consola salvo las líneas que el navegador escribe solo cuando el servidor responde 4xx.

**Lo que el ticket no decía y el backend exige.** Lo saqué de `backend/app/validators/user.ts` y lo confirmé con peticiones a la API:
- El signup pide también `passwordConfirmation`, y `fullName` tiene que venir (puede ser `null`). El formulario tiene "Repite la contraseña" y un "Nombre (opcional)"; si el nombre va vacío, se envía `null`.
- La contraseña debe tener entre 8 y 32 caracteres. El formulario lo valida y lo indica bajo el campo.
- Las respuestas vienen dentro de `{ data }`. Los errores llegan como `{ errors: [{ message, field, rule }] }`: un 422 si falla la validación y un 400 si las credenciales son incorrectas.

**Qué hace ahora:**
- **`/signup`:** al registrarse se guarda el token que devuelve el backend y se va directo a `/profile`. Si el email ya existe, aparece "Ese email ya está registrado" con un enlace a iniciar sesión, y el campo email se marca en rojo.
- **`/login`:** el token se guarda en `localStorage` (clave `flowsync.token`) y lleva a `/profile`. Con credenciales incorrectas se ve "Email o contraseña incorrectos.".
- **`/profile`:** es la vista protegida y carga `GET /api/v1/account/profile`. Si el token no es válido (401), se borra y vuelve a `/login`. Tiene un botón para cerrar sesión.
- Login y registro se enlazan entre sí. Si no hay sesión, `/profile` manda a `/login`; si ya la hay, `/login` y `/signup` mandan a `/profile`.

**Configuración que añadí:** Tailwind v4, el alias `@/`, shadcn (preset Nova, con los componentes button, card, input, label y alert) y `react-router`. Quité la página de ejemplo de Vite. El CLI de shadcn instaló un paquete `cn`; lo revisé y es el oficial de shadcn, que sustituye a clsx + tailwind-merge. La URL del backend se puede cambiar con `VITE_API_URL` y por defecto es `http://localhost:3333`.

El código está en `src/lib/api.ts`, `src/lib/errors.ts`, `src/components/form-field.tsx`, `src/pages/` y `src/App.tsx`. El build pasa; el lint da un solo aviso, en el `button.tsx` que genera shadcn.

**Cosas que conviene que sepas:**
- **El servidor que corre en `:5173` es de tu otra copia** (`flowsync-ai4devs-202610-ro`), y el backend de `:3333` también. Para no tocarlos, levanté esta copia en el puerto 5199 y lo paré al terminar. Las pruebas crearon algunos usuarios `e2e…@example.com` y `probe…@example.com` en la base de datos SQLite de esa otra copia.
- No he hecho commit. El `README.md` ya aparecía borrado antes de que empezara y no lo he tocado.
- Para tu comparación: este encargo pedía implementar, así que implementé. El enunciado del ejercicio dice que en las dos copias solo se genera el plan, sin aplicarlo, así que este resultado no es comparable con un plan de la otra copia.

---

## Prompt 2

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
haz commit de los cambios a otra rama, que se llame feat/FLOW-2-login-frontend
```

**Qué salió:** funcionó a la primera. Solo metió en el commit lo de `frontend/` y dejó fuera el `README.md` borrado de antes.

**Salida:**

He creado la rama `feat/FLOW-2-login-frontend` a partir de `s1/start` y he hecho el commit `d7acb47 feat(frontend): login, registro y perfil con shadcn/ui`.

- Solo entra lo de `frontend/`. El `README.md` ya aparecía borrado antes de empezar, así que lo he dejado fuera y sigue sin preparar para commit.
- No he hecho push. Si quieres subir la rama, dímelo.

---

## Prompt 3

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
haz push de la rama
```

**Qué salió:** el push por SSH falló (`Permission denied (publickey)`: la clave tiene passphrase y no había agente SSH). Lo subió por HTTPS con la sesión de `gh`.

**Salida:**

La rama `feat/FLOW-2-login-frontend` ya está en tu fork (`edaza86/flowsync-ai4devs-202610-ro`) y tu rama local sigue a `origin/feat/FLOW-2-login-frontend`.

Puedes abrir el PR aquí: https://github.com/edaza86/flowsync-ai4devs-202610-ro/pull/new/feat/FLOW-2-login-frontend

El push por SSH falló con `Permission denied (publickey)`: tu clave pide passphrase y aquí no hay un agente SSH que la guarde. Así que lo subí por HTTPS con tu sesión de `gh`, sin cambiar la configuración del remoto.

Para que los próximos `git push` funcionen por SSH sin este rodeo, carga la clave en el agente desde esta sesión:

    ! eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519

---

## Prompt 4

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
exportame todos los prompts con sus salidas de esta sesión a prompts.md
```

**Qué salió:** este archivo.
