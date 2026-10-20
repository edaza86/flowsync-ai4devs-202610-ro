---
name: commit
description: Crea un commit convencional (tipo(scope): descripción) a partir de los cambios ya preparados (staged) en git. Úsala cuando el usuario invoque /commit o pida "haz commit de lo preparado".
argument-hint: "[pista opcional sobre el tipo, scope o intención]"
---

# /commit

Crea **un** commit con lo que ya está en el índice (`git add` hecho por el usuario). No prepares, quites ni modifiques ficheros por tu cuenta.

## 1. Revisar lo preparado

Ejecuta en paralelo:

```bash
git diff --cached --stat
git diff --cached
git status --short
git log --format=%s -15
```

- Si **no hay nada preparado**, dilo, muestra `git status --short` y termina. No hagas `git add`.
- Si hay cambios sin preparar, ignóralos (no van en el commit); menciónalos en una línea al final.
- Si lo preparado parece contener secretos (`.env`, claves, tokens) o artefactos generados (`node_modules/`, `dist/`, `backend/tmp/`, `.adonisjs/`), avisa y **para** antes de hacer commit.
- Si los cambios mezclan cosas sin relación (p. ej. una feature y un arreglo aparte), sugiere dividirlos y pregunta antes de seguir.

## 2. Redactar el mensaje

Formato [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(scope): descripción

[cuerpo opcional]

[pies opcionales]
```

- **tipo**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Elige según el efecto del cambio, no según los ficheros tocados.
- **scope**: la zona afectada, siguiendo lo que ya se usa en `git log` de este repo: `frontend`, `backend`, `s1`, `slides`… Si el cambio toca varias zonas sin una dominante, omite el scope (`tipo: descripción`).
- **descripción**: en **español** (como el historial del repo), en minúscula, presente/imperativo, sin punto final, ≤ 72 caracteres en total en la primera línea. Describe el *qué* para quien lea el log.
- **cuerpo** (solo si aporta): el *por qué* y lo no evidente, líneas de ≤ 72 caracteres. No repitas el diff.
- **breaking change**: `tipo(scope)!: …` y un pie `BREAKING CHANGE: …`.
- **ticket**: si la rama o el contexto de la conversación nombran un ticket de Jira (p. ej. `KAN-12`, quizá traído con `/priority-ticket`), añade el pie `Refs: KAN-12`.
- Si el usuario pasó una pista como argumento, respétala (tipo, scope o intención).
- Añade al final las líneas de atribución que indique el entorno para los commits, si las hay.

## 3. Hacer el commit

Usa un heredoc para conservar los saltos de línea:

```bash
git commit -F - <<'EOF'
tipo(scope): descripción

cuerpo
EOF
```

- Nunca uses `--no-verify`, `--amend` ni `-a`, salvo que el usuario lo pida.
- Si un hook de pre-commit falla, muestra el error, no lo saltes y no reintentes con otro commit hasta que el usuario decida (o el hook haya corregido ficheros que haya que volver a preparar: dilo).
- No hagas `push`.

## 4. Informar

Muestra el resultado de `git log -1 --stat --format='%h %s'`: el hash, el mensaje y los ficheros incluidos. Si quedaron cambios sin preparar, menciónalo en una línea.
