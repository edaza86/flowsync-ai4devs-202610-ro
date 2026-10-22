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

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
crea una skill llamada /priority-ticket: trae el ticket de mayor prioridad asignado a ti en «Por hacer», resume sus criterios de aceptación, entra en plan mode y propone cómo implementarlo; al aprobar el plan, lo mueve a «En curso».
```

**Qué salió:** Funcionó a la primera. Antes de escribir la skill consultó Jira: descubrió que el estado se llama «Tareas por hacer» y que no tenía tickets asignados, así que filtra por categoría de estado. Creó `.claude/skills/priority-ticket/SKILL.md`.

## Prompt 2

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
crea otra skill llamada /commit: un commit convencional (tipo(scope): descripción) a partir de los cambios preparados.
```

**Qué salió:** Funcionó a la primera. Miró el `git log` para copiar los scopes y el idioma (español) del repo. Creó `.claude/skills/commit/SKILL.md`.

## Prompt 3

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
crea Un subagente llamado adversarial-reviewer: revisa un pull request intentando romperlo, no aprobarlo, y sin editar nada.
```

**Qué salió:** Funcionó a la primera. Creó `.claude/agents/adversarial-reviewer.md` con herramientas de solo lectura más Bash, con el no editar como instrucción y un veredicto ROTO, FRÁGIL o NO HE CONSEGUIDO ROMPERLO. Avisó de que el MCP de GitHub no conectaba.

## Prompt 4

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
crea Un hook que formatea el frontend cada vez que el agente edita un archivo. El frontend no trae formateador: instala Prettier en frontend/ y dispáralo sobre frontend/src/**.
```

**Qué salió:** Funcionó a la primera. Instaló Prettier 3.9.10 con el estilo de la plantilla (sin `;` y con comillas simples) y creó el hook PostToolUse `.claude/hooks/format-frontend.sh`. Lo probó con una edición real mal formateada y el hook la corrigió.

## Prompt 5

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
añade Las reglas de proceso, al final del CLAUDE.md: rama nueva antes de tocar código; al cerrar, /commit y el pull request con gh pr create; después, el subagente revisor sobre el pull request; y en el chat, solo la URL del pull request.
```

**Qué salió:** Funcionó. Añadió algo que no pedí, «corrige los hallazgos del revisor en la misma rama», y actualizó una línea desactualizada de `CLAUDE.md` sobre el formateador. Avisó de que la base `main` podía no ser la correcta.

## Prompt 6

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
veo que el claude la mayoría esta escrito en ingles, porque no está en español y si puede estar en español hazlo.
```

**Qué salió:** Explicó que estaba en inglés porque `/init` lo genera así, y tradujo `CLAUDE.md` entero manteniendo comandos e identificadores.

## Prompt 7

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
sí, traduce también el AGENTS.md
```

**Qué salió:** No había nada que traducir: `AGENTS.md` estaba vacío. Propuso que remitiera a `CLAUDE.md` o copiarlo, y preguntó.

## Prompt 8

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
que remita a CLAUDE.md
```

**Qué salió:** Escribió un `AGENTS.md` de dos líneas que remite a `CLAUDE.md`. Ojo: el enunciado pedía un enlace simbólico (`ln -s CLAUDE.md AGENTS.md`).

## Prompt 9

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
/priority-ticket
```

**Qué salió:** Trajo FLOW-1 (High) y resumió los 5 criterios. Detectó los huecos del ticket frente al backend (`fullName` y `passwordConfirmation` obligatorios, password de 8 a 32 caracteres) y entró en plan mode con trazabilidad criterio a criterio. Avisó de que el enunciado dice no aplicar el plan, de que el harness no estaba commiteado y de lo del symlink. Al aprobar el plan movió FLOW-1 a «En curso».

## Prompt 10

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
Sigue implementando e incluso si tienes que comitearlo
```

**Qué salió:** Implementó el plan en la rama `feat/FLOW-1-login-frontend` (react-router, Tailwind v4, shadcn/ui) y lo verificó por HTTP; no pudo probarlo en el navegador porque Chrome no estaba conectado. Hizo `/commit`, subió la rama por HTTPS porque el SSH pedía passphrase y abrió el PR contra `s1/start` porque contra `main` era imposible (sin historia común). Lanzó `adversarial-reviewer` (veredicto FRÁGIL, 7 hallazgos), corrigió 6 en un segundo commit y respondió solo con la URL del PR, como dicen las reglas.

## Prompt 11

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
¿qué encontró el revisor y qué corregiste?
```

**Qué salió:** Tabla con los 7 hallazgos y lo que se hizo con cada uno (6 corregidos; el token en `localStorage` no, porque requiere cambiar el backend), más las desviaciones de `CLAUDE.md`.

## Prompt 12

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
como puedo tener un resumen de los promts que te he realizado y sus salidas, añademelas al fichero prompts.md
```

**Qué salió:** Rellenó este fichero con los prompts de la sesión y explicó cómo sacar el resto (`/export`, transcripciones en `~/.claude/projects/`).

## Prompt 13

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
instalar y conectar Claude in Chrome
```

**Qué salió:** No puede instalar la extensión él mismo. Detectó que Claude Code corre en WSL2 sin Chrome y dio los pasos: Chrome dentro de WSL, la extensión de Claude, `claude --chrome` o `/chrome`.

## Prompt 14

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
/anthropic-skills:chrome-browser
```

**Qué salió:** No funcionó: las herramientas `mcp__claude-in-chrome__*` no estaban disponibles porque la extensión no estaba conectada. Repitió los pasos para conectarla.

## Prompt 15

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
entonces ¿Hiciste la PR?
```

**Qué salió:** Confirmó con `gh` que el PR #1 sigue abierto (`feat/FLOW-1-login-frontend` → `s1/start`, 2 commits) y que solo falta la prueba manual en el navegador.

## Prompt 16

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code (CLI)

```
haz como si la comprobación fuera correcta y continua hasta el final con el commit incluido
```

**Qué salió:** Dio por buena la prueba en el navegador por decisión del usuario, sin ejecutarla, y lo dejó anotado así en el PR. Commiteó `prompts.md` en la rama del PR, hizo push y respondió solo con la URL.
