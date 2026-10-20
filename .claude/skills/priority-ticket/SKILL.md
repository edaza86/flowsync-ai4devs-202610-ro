---
name: priority-ticket
description: Trae de Jira el ticket de mayor prioridad asignado al usuario en «Por hacer», resume sus criterios de aceptación, entra en plan mode para proponer cómo implementarlo y, cuando el plan se aprueba, mueve el ticket a «En curso». Úsala cuando el usuario invoque /priority-ticket o pida "coger el siguiente ticket".
argument-hint: "[CLAVE_PROYECTO]"
---

# /priority-ticket

Flujo: **buscar → resumir → planificar → (aprobación) → mover a «En curso»**. No escribas código en esta skill: termina cuando el ticket está en «En curso» y el plan aprobado; la implementación viene después.

Usa las herramientas del MCP `atlassian` (configurado en `.mcp.json`). Si no conecta, dilo y para.

## 1. Localizar el ticket

1. `cloudId`: llama a `getAccessibleAtlassianResources` una vez y reutilízalo (el sitio de este proyecto es `https://eduska.atlassian.net`).
2. Busca con `searchJiraIssuesUsingJql`, `maxResults: 5`, `fields: ["summary","status","priority","issuetype","project"]`:

   ```
   assignee = currentUser() AND statusCategory = "To Do" [AND project = <ARG>] ORDER BY priority DESC, rank ASC, created ASC
   ```

   - Filtra por **categoría** de estado (`statusCategory = "To Do"`), no por nombre: en este Jira la columna «Por hacer» corresponde al estado «Tareas por hacer».
   - Si se pasó un argumento, úsalo como clave de proyecto.
   - Si `rank` da error de JQL, quítalo del `ORDER BY` y reintenta.
3. Toma el primero. Si hay empate de prioridad con el segundo, menciónalo en una línea.
4. Si no hay resultados, dilo (indicando el JQL usado) y termina. No elijas tickets sin asignar ni de otras personas.

## 2. Leer y resumir

Llama a `getJiraIssue` con `view: "evidence"` para tener descripción, subtareas, enlaces y campos personalizados.

Muestra al usuario, en español y de forma breve:

- **Ticket**: `CLAVE — título` · tipo · prioridad · enlace (`https://<sitio>/browse/<CLAVE>`).
- **Objetivo**: 1–2 frases.
- **Criterios de aceptación**: lista numerada. Búscalos en una sección «Criterios de aceptación» / «Acceptance criteria», en formato Given/When/Then, en checklists o en un campo personalizado. Si no hay criterios explícitos, dedúcelos de la descripción y márcalos como **(inferido)**.
- **Dudas / huecos**: ambigüedades o contradicciones con el código (p. ej. reglas de validación del backend más estrictas que el ticket, ver `CLAUDE.md`).

## 3. Plan mode

Llama a `EnterPlanMode`. Dentro de plan mode:

1. Explora el código relevante (recuerda: en este ejercicio el backend **no se modifica**; el trabajo es en `frontend/`).
2. Si una decisión es del usuario y bloquea el plan, pregúntala con `AskUserQuestion`.
3. Escribe el plan en el fichero de plan con:
   - Título con la clave del ticket.
   - Criterios de aceptación → cómo se cumple cada uno (trazabilidad 1:1).
   - Ficheros a crear/modificar y pasos ordenados.
   - Verificación: `npm run build` y `npm run lint` en `frontend/`, más la prueba manual de cada criterio contra el backend en `http://localhost:3333`.
   - Una nota final: «Al aprobar este plan, `<CLAVE>` se moverá a «En curso» en Jira».
4. Llama a `ExitPlanMode`.

## 4. Al aprobar: mover a «En curso»

**Solo si el usuario aprueba el plan.** Si lo rechaza o pide cambios, revisa el plan y vuelve a `ExitPlanMode`; el ticket no se toca hasta que haya aprobación.

1. Obtén las transiciones disponibles del ticket (`listJiraIssueTransitions`; si no está entre tus herramientas, búscala con `discover` y ejecútala con `executeRead`).
2. Elige la transición cuyo **estado destino** sea «En curso» (o, si no existe con ese nombre, la de categoría «In Progress»). El nombre de la transición puede diferir del estado destino.
3. Ejecuta `transitionJiraIssue` con ese `transitionId`.
4. Confirma con el estado que devuelve la llamada: `CLAVE` → «En curso». Si falla o no hay transición válida, informa del error y de las transiciones disponibles; no lo reintentes con otra transición distinta sin preguntar.

No añadas comentarios, no reasignes y no cambies otros campos del ticket.
