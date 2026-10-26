# Alcance del MVP de FlowSync

## 1. El terreno que ya existe

- **Lo que está construido es solo la gestión de cuentas:** registro con email, contraseña y nombre opcional; inicio y cierre de sesión con token; y una pantalla de perfil protegida que muestra los datos del usuario y sus iniciales. Todavía no hay nada del producto en sí: ni tareas, ni estados, ni listas, ni nada que se actualice en tiempo real.
- **El modelo de datos solo tiene usuarios y sus credenciales de sesión.** Un usuario tiene nombre (opcional), email único y contraseña. Cada usuario puede tener varias sesiones abiertas, y cada una caduca o se revoca por separado. No hay entidad equipo ni espacio, ni ninguna relación entre usuarios.
- **Consecuencias para el alcance:** el "responsable" de una tarea puede ser directamente un usuario que ya existe, y el "espacio único compartido" encaja con lo que hay, porque todo usuario registrado entra en el mismo sitio. La autenticación ya está hecha y no hay que volver a especificarla. Todo lo relacionado con tareas sale de cero.

## 2. Respuestas al interrogatorio y contraste con la ficha

| # | Respuesta recibida | Contraste con la ficha | Cómo queda |
|---|---|---|---|
| 1 | Puede haber tareas sin responsable; cualquiera crea tareas. (En la primera versión de la respuesta: "para sí mismo o para otra persona".) | Coherente con la ficha ("roles planos: todos ven y editan lo mismo"). La respuesta final dice solo "por sí mismo" y omite "para otra persona"; esa duda se resuelve con la ficha (**S11**). | Cualquiera crea tareas y elige el responsable, sea él mismo u otra persona (S11). "Libre" = sin responsable. |
| 2 | Estados: Por hacer, En curso, Revisión, Hecho, Bloqueado, Eliminada. | No contradice la ficha, pero hay una **tensión**: la ficha dice que la parte de bloqueos de la daily "sigue, y este MVP no la resuelve". | Se aceptan los seis estados. "Bloqueado" solo **hace visible** el bloqueo; no promete resolverlo ni sustituye esa parte de la daily. "Eliminada" saca la tarea de la vista normal. Que "Eliminada" se oculte por defecto y que se pueda pasar de cualquier estado a cualquiera son decisiones propias (**S12**). |
| 3 | Destacar los últimos cambios de estado dentro de la lista actualizada, no en una vista aparte. | Coherente con "resumen que espera, no aviso que interrumpe" y con "veo qué se ha movido". | Los cambios se destacan dentro de la propia lista. No hay notificaciones. |
| 4 | Debe haber una entidad equipo para que cada tarea solo la vea su equipo. | **CONTRADICE la ficha**: "un espacio único compartido, sin entidad equipo. Varios equipos separados […] queda FUERA del MVP: se anota como supuesto en el PRD, no se construye". | **Se mantiene la ficha.** La necesidad de fondo (que gente ajena no vea las tareas) se cubre con un supuesto: el espacio sirve a un único equipo y solo acceden las personas que ese equipo autorice (ver S2). La entidad equipo va a NO-alcance. |
| 5 | Debe haber un método para importar tareas con su estado, para conservar las terminadas y las que están en curso en otros gestores. | **Tensión con la ficha**: "FlowSync crea las tareas, no lee las de otro sitio". Una importación única no es convivir (no hay doble actualización), así que no es una contradicción frontal. Pero conservar las terminadas no sirve a la decisión central, y la ficha renuncia a los informes. | Se pasa por el recorte de la Fase 3 y queda **fuera de P0**: P1 si el arranque a mano resulta inviable. Las terminadas no se migran. |

## 3. Definición del producto (Fase 2)

### 3.1 Problema

- **Hecho:** nadie ve el estado del equipo sin interrumpir a alguien. Se pregunta "¿en qué estás?" por chat de forma constante y en una ronda de la daily que ocupa la mitad de sus 15 minutos.
- **Hecho (episodio):** dos personas tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Se perdieron dos días.
- **Afecta a:** los pares de un equipo remoto pequeño (3–10 personas), no a un lead. Afecta al que descubre tarde que duplicó trabajo y al que interrumpe (o es interrumpido) para preguntar.
- **Cómo se resuelve hoy:** con un gestor de tareas pesado, que no se mantiene al día lo bastante como para fiarse de él (**inferencia**: si se fiaran, no haría falta la ronda), más la ronda de la daily y mensajes de chat.
- **Consecuencia de no resolverlo:** trabajo duplicado, interrupciones y 7–8 minutos diarios de reunión por persona dedicados solo a sincronizar.
- **Por qué ahora:** **inferencia sin evidencia**: en el caso de estudio (3 husos horarios) la daily síncrona es cara de cuadrar. No hay dato que lo cuantifique.

### 3.2 Usuarios

- **Usuario principal:** cada miembro de un equipo remoto pequeño y plano que **hace** tareas, y que usa la lista a la vez como cola de trabajo propia y como vista del equipo.
- **Necesidades:** (a) saber antes de empezar algo si otra persona ya lo está tocando; (b) elegir lo siguiente viendo qué está libre; (c) al llegar o volver de una reunión, ver qué se ha movido sin preguntar; (d) dejar de recibir preguntas sobre cómo va lo suyo.
- **Contexto de uso:** **inferencia** (la lista es su cola de trabajo, según la ficha): la lista está abierta durante la jornada. Se mira al empezar el día, al volver de una reunión y al terminar una tarea. En el caso de estudio hay 3 husos horarios, así que una parte del equipo trabaja mientras otra duerme.
- **Problemas del proceso actual:** **inferencia**: actualizar el gestor pesado cuesta (campos, sprint, estimación) y por eso no se hace; la información llega por interrupción o una vez al día.
- **Usuarios secundarios:** ninguno imprescindible. No hay manager ni lead consumidor (ficha).

### 3.3 Propuesta de valor

- **Tarea principal que permite completar:** "antes de coger trabajo, ver qué está libre y qué está tocando cada uno, y dejar constancia de lo que cojo en dos clics".
- **Mejora frente a la alternativa actual:** el estado de las tareas está al día sin preguntar ni refrescar, porque actualizarlo cuesta menos que contestar a un "¿en qué estás?".
- **Beneficio central:** no se duplica trabajo y desaparece la ronda de "¿en qué estás?".
- **Frase:** *FlowSync es la lista de tareas del equipo donde cada persona cambia el estado de lo suyo en dos clics y todos ven, sin preguntar ni refrescar, qué está libre, qué está tocando cada uno y qué se ha movido desde la última vez que miraron.*
- **Hipótesis de valor sin validar:**
  - H1: la gente mantiene el estado al día si cuesta dos clics y la lista es su cola de trabajo (riesgo #1 según la ficha).
  - H2: el trabajo que se duplica está representado como tarea en la lista (el episodio fue "el mismo módulo", no "la misma tarea").
  - H3: ver la lista sustituye a la ronda de la daily sin que nadie la eche de menos.

### 3.4 Alcance (propuesta inicial, antes del recorte)

**P0**
1. Lista única compartida con todas las tareas.
2. Crear una tarea (título, responsable opcional, fecha de vencimiento opcional) y editarla.
3. Asignarse una tarea libre / reasignar / dejarla libre.
4. Cambiar de estado entre los seis estados en ≤ 2 clics desde la lista.
5. Ver los cambios de otros sin refrescar.
6. Destacar en la lista las tareas que han cambiado de estado desde mi última visita, con quién lo cambió, de qué a qué y cuándo.
7. Filtrar por estado.
8. Marcar las tareas vencidas.
9. Importar tareas desde un fichero (CSV) con su estado.
10. Entidad equipo: crear un equipo, invitar miembros, y que cada tarea pertenezca a un equipo.

**P1**
- Filtro por responsable / vista "mis tareas".
- Historial completo de cambios de cada tarea.
- Restaurar tareas eliminadas.
- Aviso al pasar a "En curso" una tarea parecida a otra que ya está en curso.
- Búsqueda por texto.

**P2**
- Comentarios, notificaciones, integración con Slack, derivar el estado de Git/CI, roles y permisos, informes.

Para cada P0 de la propuesta recortada, la necesidad, el resultado, por qué entra y cómo se mide están en la sección 4.2.

### 3.5 NO-alcance (inicial)

Lo marcado como fuera en la ficha, más P2. Se detalla, ya recortado, en la sección 5.12.

## 4. Recorte agresivo (Fase 3)

### 4.1 Qué se elimina o aplaza y por qué

| Funcionalidad | Decisión | Razón |
|---|---|---|
| Entidad equipo + invitaciones (P0 #10) | **Fuera → NO-alcance** | Contradice la ficha. La necesidad real (privacidad frente a terceros) se cubre restringiendo el acceso al espacio único a las personas del equipo (S2). Construir equipos implica membresías, invitaciones y pertenencia múltiple: es andamiaje, no valor central. |
| Importación desde CSV (P0 #9) | **P0 → P1** | Se puede sustituir por un proceso manual: un equipo de 6 personas teclea su trabajo abierto en una sesión corta (**S5**), y con el alta en segundos ese coste es asumible. Las terminadas no sirven a la decisión "qué está libre / qué toca otro", y la ficha renuncia a los informes. Se reconsidera si en el arranque el volumen de tareas abiertas hace que el alta manual se abandone. |
| Filtro por responsable / "mis tareas" | P1 (se mantiene) | El filtro por estado más el responsable visible en cada fila bastan para decidir. Es útil, pero no es necesario para el flujo. |
| Historial completo por tarea | **P1 → P2** | La necesidad es "qué se ha movido", y la cubre el último cambio destacado. El historial completo es auditoría o informe, y la ficha renuncia a eso. |
| Restaurar eliminadas | **P1 → P2** | Se resuelve volviendo a cambiar el estado desde el filtro "Eliminada", que ya existe en P0. No es una funcionalidad aparte. |
| Aviso de tarea parecida en curso | **P1 → P2** | Es una automatización que depende de que H1 y H2 se cumplan primero. Sin un estado fiable, el aviso es ruido. |
| Búsqueda por texto | **P1 → P2** | Con 3–10 personas y el filtro por estado, la lista activa se recorre a ojo. |
| Marcar vencidas (P0 #8) | **Se mantiene, mínimo** | La ficha decide que la fecha existe "para ver de un vistazo qué se ha pasado de plazo". Se reduce a una marca visual, sin orden, alertas ni recordatorios. |
| Editar tarea (P0 #2) | **Se mantiene, fusionado con "crear"** | Con roles planos (ficha), cualquiera corrige título, responsable o fecha. Sin edición, un error obliga a eliminar y recrear, y eso ensucia lo de "qué se ha movido". |

### 4.2 Propuesta recortada (recomendación)

**P0, cuatro capacidades:**

| P0 | Necesidad que resuelve | Resultado observable | Por qué en la v1 | Cómo sabremos si funciona |
|---|---|---|---|---|
| **A. Lista compartida = cola de trabajo** (crear con solo el título; responsable y fecha opcionales; editar; asignarse una tarea libre en 1 clic; dejarla libre o reasignarla) | Saber qué está libre y quién toca qué | Cualquiera ve todas las tareas del espacio con su responsable o "libre", y puede tomar una | Sin esto no hay producto | 100 % de las tareas "En curso" tienen responsable |
| **B. Cambio de estado en ≤ 2 clics, visible a todos sin refrescar** (6 estados) | No empezar algo que otro ya toca | El cambio aparece en la pantalla de los demás sin acción por su parte | Es la definición de "tiempo real" de la ficha y la decisión que justifica el producto | Frescura: % de tareas "En curso" con un cambio reciente; tiempo hasta que otro ve el cambio |
| **C. Qué se ha movido desde mi última visita**, destacado dentro de la lista | Al llegar o volver de una reunión, ponerse al día sin preguntar | Las tareas cambiadas desde mi última visita aparecen marcadas, con quién lo cambió, de qué estado a cuál y cuándo; la marca desaparece en la siguiente visita | Es el caso de uso explícito de la ficha ("llego por la mañana y veo qué se ha movido") en un equipo con 3 husos horarios | El equipo cancela la ronda de "¿en qué estás?" y nadie pide que vuelva |
| **D. Filtro por estado + marca de vencidas** | Centrarse en lo pendiente; ver qué se ha pasado de plazo | La lista muestra solo los estados elegidos; las tareas con fecha pasada y sin terminar se ven marcadas | La ficha define que la lista "se consume filtrando por estado" y que la fecha está para eso | Se observa que el equipo usa el filtro durante la primera semana |

**P1:** importación única desde CSV (condicionada, ver arriba) y filtro por responsable.
**P2:** historial completo, búsqueda, aviso de duplicado, restaurar como acción propia y todo lo de la sección 5.12.

## 5. PRD — FlowSync MVP (Fase 4)

### 5.1 Resumen
FlowSync es la lista de tareas compartida de un equipo remoto pequeño y plano. Cada persona cambia el estado de lo suyo en dos clics y todos ven al momento qué está libre, quién está en qué y qué se ha movido. Resuelve el "¿en qué estás?" constante y el trabajo duplicado. Sustituye al gestor de tareas del equipo, no convive con él.

### 5.2 Contexto y problema
Ver sección 3.1. La oportunidad está en eliminar la ronda de estado de la daily (la mitad de sus 15 minutos; la daily no desaparece y los bloqueos siguen) y evitar episodios como el de los dos días perdidos, con una herramienta cuyo coste de actualización sea menor que el de la interrupción que evita.

### 5.3 Usuarios objetivo
Miembros de un equipo remoto de 3–10 personas, sin jerarquía de permisos y repartidos en varios husos horarios. Caso de estudio de referencia: un equipo de 6 personas de producto SaaS, en 3 husos horarios. Es un caso de estudio, **no un cliente real**. Ver sección 3.2.

### 5.4 Propuesta de valor
Ver la frase de la sección 3.3. Se diferencia de los gestores pesados porque no hay campos obligatorios salvo el título, ni sprint, ni estimación, ni configuración de flujos, y porque los cambios llegan solos. Se diferencia del chat porque es una señal que espera, no una que interrumpe.

### 5.5 Objetivos
- O1. El equipo deja de hacer la ronda de "¿en qué estás?" de la daily.
- O2. Nadie empieza una tarea que otra persona ya tiene "En curso".
- O3. El estado de las tareas se mantiene al día sin obligar a nadie.

### 5.6 No objetivos
- No sustituir la parte de bloqueos de la daily. El estado "Bloqueado" lo hace visible, pero no lo resuelve.
- No informar hacia arriba ni medir el rendimiento de las personas.
- No mostrar presencia ni actividad de las personas (quién está conectado, cuándo entró).
- No planificar (sprints, estimaciones, épicas, backlog priorizado).
- No servir a varios equipos en el mismo espacio.

### 5.7 Alcance funcional (P0)

**RF-A. Lista y tareas**
- RF-A1. Todas las personas con acceso ven la misma lista con todas las tareas del espacio.
- RF-A2. Crear una tarea solo exige el título. El responsable y la fecha de vencimiento son opcionales. El estado inicial es "Por hacer".
- RF-A3. Cada fila muestra el título, el estado, el responsable (o "Libre") y la fecha de vencimiento si la hay.
- RF-A4. Cualquier persona puede editar el título, el responsable y la fecha de cualquier tarea.
- RF-A5. Una tarea libre se asigna a uno mismo con 1 clic desde la lista.

**RF-B. Estados y frescura**
- RF-B1. Estados: Por hacer, En curso, Revisión, Hecho, Bloqueado y Eliminada. Se puede pasar de cualquiera a cualquiera.
- RF-B2. Cambiar el estado de una tarea desde la lista requiere como máximo 2 clics.
- RF-B3. Un cambio hecho por una persona (alta, edición o estado) aparece en la lista abierta de las demás sin que recarguen la página, en ≤ 5 s (umbral **supuesto S6**).

**RF-C. Qué se ha movido**
- RF-C1. Las tareas cuyo estado ha cambiado desde la última visita de la persona aparecen destacadas en la lista. Una visita es abrir la lista (S9); los cambios que llegan con la lista ya abierta también se destacan.
- RF-C2. Cada tarea destacada muestra quién hizo el último cambio de estado, el estado anterior y el nuevo, y cuándo (en la hora local de quien mira). Si hubo varios cambios, solo se muestra el último: de cada tarea se conserva su último cambio, no un historial.
- RF-C3. Las tareas creadas desde la última visita también se destacan como nuevas.
- RF-C4. Lo que no ha cambiado no se destaca. La marca desaparece en la siguiente visita.
- RF-C5. La última visita de una persona solo se usa para su propia vista. No se muestra a nadie.

**RF-D. Filtro y vencidas** (entra en P0 porque lo fija la ficha, no porque sea imprescindible para el valor central)
- RF-D1. La lista se filtra por uno o varios estados.
- RF-D2. Por defecto, "Eliminada" queda oculta. Si se filtra por "Eliminada", esas tareas se ven y se puede cambiar su estado de nuevo.
- RF-D3. Una tarea con fecha de vencimiento pasada y estado distinto de Hecho o Eliminada se ve marcada como vencida.

**P1 (fuera de la v1):** importación única desde CSV, solo si el alta manual del primer equipo no se completa; filtro por responsable.

### 5.8 Historias de usuario

**HU1. Ver qué está libre y quién toca qué.** Como miembro del equipo, quiero ver en una sola lista todas las tareas, con su responsable y su estado, para no empezar algo que otra persona ya está haciendo.
- Dada una tarea "En curso" asignada a Ana, cuando Luis abre la lista, ve la tarea con estado "En curso" y responsable "Ana".
- Una tarea sin responsable aparece como "Libre".

**HU2. Coger una tarea libre.** Como miembro del equipo, quiero asignarme una tarea libre y pasarla a "En curso" en pocos clics, para que los demás sepan que la he cogido.
- Desde la lista, asignarse una tarea libre cuesta 1 clic y pasarla a "En curso" cuesta ≤ 2 clics más.
- Si otra persona tiene la lista abierta, ve el nuevo responsable y el nuevo estado en ≤ 5 s sin recargar.

**HU3. Crear una tarea rápido.** Como miembro del equipo, quiero crear una tarea escribiendo solo el título, para registrar trabajo sin rellenar formularios.
- Con solo el título, la tarea se crea en "Por hacer", sin responsable y sin fecha.
- Opcionalmente puedo indicar un responsable (yo u otra persona) y una fecha.
- Sin título, la tarea no se crea y se indica el motivo.

**HU4. Actualizar el estado.** Como responsable de una tarea, quiero cambiar su estado en dos clics desde la lista, para que nadie tenga que preguntarme cómo va.
- Cualquier transición entre los seis estados se hace en ≤ 2 clics desde la fila.
- El cambio queda registrado con quién lo hizo y cuándo, y es visible para todos.

**HU5. Ponerme al día.** Como miembro del equipo que vuelve después de horas fuera, quiero ver destacadas las tareas que se han movido desde mi última visita, para ponerme al día sin preguntar.
- Si María pasó la tarea X de "En curso" a "Revisión" después de mi última visita, X aparece destacada con "María · En curso → Revisión · hace 3 h".
- Las tareas sin cambios desde mi última visita no se destacan.
- En mi siguiente visita, X deja de estar destacada si no ha vuelto a cambiar.

**HU6. Centrarme en lo pendiente.** Como miembro del equipo, quiero filtrar la lista por estado, para ver solo lo que me interesa decidir.
- Al seleccionar "Por hacer" y "Bloqueado", solo se ven tareas en esos estados.
- Por defecto no se ven las eliminadas. Filtrando por "Eliminada", sí.

**HU7. Ver lo vencido.** Como miembro del equipo, quiero ver qué tareas se han pasado de plazo, para detectarlas de un vistazo.
- Una tarea con fecha de ayer en "En curso" aparece marcada como vencida. La misma tarea en "Hecho", no.

**HU8. Corregir una tarea.** Como miembro del equipo, quiero editar el título, el responsable o la fecha de cualquier tarea, para corregir errores sin borrarla.
- Los cambios se guardan y los demás los ven sin recargar.

### 5.9 Flujo principal
1. La persona abre FlowSync (ya autenticada).
2. Ve la lista filtrada por defecto (todo menos "Eliminada"), con lo cambiado desde su última visita destacado.
3. Revisa lo destacado: qué se ha movido y quién lo movió.
4. Para elegir lo siguiente, mira "Por hacer" libre y lo que está "En curso" y de quién.
5. Se asigna una tarea libre y la pasa a "En curso" (≤ 3 clics en total).
6. Los demás lo ven en su lista sin recargar.
7. Al terminar, la pasa a "Revisión" o "Hecho" (≤ 2 clics) y vuelve al paso 4.

### 5.10 Requisitos no funcionales
- RNF1 (ficha). Sin campos obligatorios salvo el título (**S3**: la ficha dice "sin campos obligatorios"; el título se interpreta como el mínimo para que una tarea exista).
- RNF2 (ficha). No se muestra presencia ni actividad de las personas. Se registra quién hizo el último cambio de cada tarea y cuándo, y la última visita de cada persona solo para su propia vista (RF-C5, S9); ninguno de los dos se usa como indicador de actividad.
- RNF3 (**S6**). Los cambios se propagan a las listas abiertas en ≤ 5 s.
- RNF4 (**S7**). Fechas y horas en la zona horaria local de quien mira (3 husos horarios en el caso de estudio).
- RNF5 (**S2**). Solo acceden las personas que el equipo autorice: alguien de fuera no puede ver ninguna tarea. El mecanismo concreto se decide en diseño, fuera de este PRD.
- RNF6 (**S8**). Navegador de escritorio. Interfaz en castellano.

### 5.11 Métricas de éxito
Los umbrales son propuestas y deben validarse con el primer equipo. No hay datos históricos.

| Métrica | Qué evalúa | Umbral propuesto |
|---|---|---|
| **Ronda de "¿en qué estás?" cancelada a la semana y nadie pide que vuelva** (ficha) | O1, métrica principal | Sí / no |
| Tareas "En curso" con un cambio de estado en los últimos 2 días laborables | O3, frescura (riesgo #1) | ≥ 80 % |
| El equipo deja de usar su gestor anterior durante la semana | O3, adopción (a nivel de equipo, no por persona) | Sí / no |
| Casos de trabajo duplicado reportados por el equipo en la semana (autoinforme) | O2 | 0; con un solo equipo y una semana es una señal, no una prueba |
| Preguntas "¿en qué estás?" por chat, contadas por el equipo | O1 | Menos que en la semana anterior al MVP |

### 5.12 NO-alcance

| Excluido | Por qué ahora no | Qué evita | Qué haría reconsiderarlo |
|---|---|---|---|
| Entidad equipo, varios equipos, pertenencia múltiple | La ficha lo deja fuera: un único espacio compartido | Membresías, invitaciones, permisos por equipo | Un segundo equipo real quiere usarlo y una instancia por equipo no basta |
| Importación desde otros gestores (CSV u otro formato), **P1 fuera de la v1** | Se sustituye por un alta manual del trabajo abierto; las terminadas no sirven a la decisión central | Mapeo de formatos y estados, limpieza de datos | P1: el alta manual del primer equipo no se completa o se abandona |
| Sincronización o integración con otros gestores | Convivir exige doble actualización, "que es como muere esta categoría" (ficha) | Integraciones y OAuth de terceros | No se reconsidera: es otro producto |
| Derivar el estado de Git/PRs, CI o calendario | Ficha: otro producto | Integraciones y OAuth | H1 falla aunque actualizar cueste dos clics |
| Notificaciones push / integración con Slack | Ficha: resumen que espera, no aviso que interrumpe | Ruido, más interrupciones | Evidencia de que se pierden cambios críticos que no pueden esperar |
| Presencia, "quién está conectado", indicadores de actividad | Rechazado a propósito: es vigilancia | Pérdida de confianza | No se reconsidera |
| Comentarios en tareas | Ficha | Que se convierta en un chat paralelo | Las conversaciones sobre una tarea se pierden en el chat y eso causa errores |
| Roles y permisos | Ficha: roles planos | Configuración y gestión de permisos | Ediciones indebidas recurrentes |
| Sprints, estimaciones, épicas, backlog priorizado, informes, analítica | Ficha: "un equipo que necesite eso no es nuestro usuario" | Convertirse en otro gestor pesado | No se reconsidera para este usuario |
| Historial completo por tarea, búsqueda, aviso de posible duplicado | No hacen falta para la decisión central; el aviso depende de H1/H2 | Complejidad y ruido | Lista activa demasiado grande para recorrer a ojo; H1 validada y siguen ocurriendo duplicados |
| Resolver bloqueos | Ficha: esa parte de la daily sigue | — | — |

### 5.13 Riesgos e hipótesis

| Riesgo / hipótesis | Cómo validarlo |
|---|---|
| **H1. La información se queda vieja** (riesgo #1 de la ficha) | Medir la frescura durante la primera semana. Si cae por debajo del umbral, entrevistar sobre por qué no se actualiza antes de añadir nada. |
| H2. El trabajo que se duplica no está como tarea (el episodio fue "el mismo módulo") | Revisar con el equipo si cada duplicado de la semana tenía su tarea en la lista. |
| H3. Ver la lista no sustituye la ronda: se sigue haciendo por costumbre | Es el criterio de la ficha: a una semana, ¿se ha cancelado y nadie pide que vuelva? |
| El arranque sin importación desanima la adopción | Observar si el alta manual del trabajo abierto se completa el primer día. |
| Un único espacio sin entidad equipo filtra tareas a terceros | S2 y criterio de salida 7: comprobar que alguien de fuera no ve ninguna tarea. |

### 5.14 Dependencias y restricciones
- **Confirmado:** ya existen el registro, el inicio y cierre de sesión y el perfil de usuario. El responsable de una tarea es una de esas personas.
- **Confirmado (ficha):** un único espacio compartido, sin entidad equipo.
- **Restricción detectada:** hoy cualquiera que se registre entraría en el espacio único. Bajo S2 hay que restringir quién accede antes de usarlo con un equipo real (criterio de salida 7).
- **Supuesto:** el primer equipo acepta dejar de usar su gestor actual durante la prueba (sustituir, no convivir).

### 5.15 Criterios de salida de la v1
1. Un equipo puede completar el flujo principal (5.9) de punta a punta sin ayuda.
2. Todas las historias HU1–HU8 cumplen sus criterios de aceptación.
3. Un cambio de estado hecho por una persona aparece en la lista abierta de otra en ≤ 5 s sin recargar (umbral S6, medido con el equipo de referencia conectado a la vez).
4. Ninguna tarea requiere más que el título para crearse, y ningún cambio de estado requiere más de 2 clics.
5. No existe ningún indicador de presencia ni de actividad de las personas.
7. Una persona que no forma parte del equipo no puede ver ninguna tarea.

**Criterio de éxito del producto (no de entrega):** tras una semana de uso real, el equipo ha cancelado la ronda de "¿en qué estás?" y nadie pide que vuelva (criterio de éxito del producto, no de entrega técnica).

## 6. Auditoría final (Fase 5)

### 6.A Registro de supuestos (por impacto y riesgo)

| # | Supuesto | Por qué fue necesario | Impacto si es falso | Validación más sencilla |
|---|---|---|---|---|
| S1 | Basta con el estado de la tarea para evitar duplicados: el trabajo relevante está como tarea en la lista | El episodio fue "el mismo módulo"; la ficha no dice cómo de granulares son las tareas | Alto: el producto no evita el problema central aunque se use bien | Revisar los duplicados de la primera semana: ¿tenían su tarea? |
| S2 | El espacio único sirve a un único equipo y solo acceden las personas que ese equipo autorice (sin construir equipos ni invitaciones) | La respuesta 4 pide privacidad por equipo, pero la ficha excluye la entidad equipo | Alto: si no se restringe, cualquiera que se registre ve las tareas | Confirmar con el primer equipo que un espacio propio y cerrado les basta |
| S3 | El título es el único campo obligatorio | La ficha dice "sin campos obligatorios", pero una tarea sin título no se puede identificar | Bajo | Observar si alguien intenta crear tareas sin título |
| S4 | No migrar las tareas terminadas no frena la adopción | La respuesta 5 pide conservarlas; el recorte las excluye | Medio: el equipo podría negarse a cambiar de herramienta | Preguntar al primer equipo si consulta las terminadas del gestor actual y para qué |
| S5 | El trabajo abierto de un equipo de 6 personas se puede dar de alta a mano en una sesión corta | Justifica aplazar la importación | Medio: el arranque se hace pesado | Contar las tareas abiertas en el gestor actual del equipo |
| S6 | "Sin refrescar" significa que los cambios llegan en ≤ 5 s | La ficha no fija un umbral | Bajo-medio: si el retraso es mayor, dos personas pueden coger la misma tarea casi a la vez | Preguntar al equipo qué retraso notan como "no al día" |
| S7 | Fechas y horas en la zona horaria de quien mira | 3 husos horarios; la ficha no lo especifica | Bajo | Observación directa |
| S8 | Navegador de escritorio, interfaz en castellano | La ficha no lo especifica | Bajo | Preguntar al primer equipo |
| S9 | "Última visita" = la última vez que la persona abrió la lista. Solo se usa para su propia vista y no cuenta como vigilancia | Necesario para RF-C; la ficha rechaza la vigilancia | Medio: si se percibe como seguimiento, mina la confianza | Explicarlo al equipo y preguntar si les incomoda |
| S11 | Cualquiera puede asignar una tarea a otra persona | La última respuesta dice "por sí mismo"; la primera y la ficha (roles planos) dicen que sí | Bajo: bastaría con limitar la asignación a uno mismo | Preguntarlo al equipo |
| S12 | "Eliminada" oculta la tarea por defecto y se puede pasar de cualquier estado a cualquiera | La respuesta da los estados pero no las reglas entre ellos | Bajo | Observar si alguien echa de menos alguna restricción |
| S10 | El primer equipo acepta sustituir su gestor durante la prueba | La ficha exige sustituir, no convivir | Alto para la prueba: con doble actualización, H1 falla por diseño | Acordarlo explícitamente antes de la semana de prueba |

### 6.B Coherencia del PRD
- **El alcance responde al problema:** sí. A, B y C atacan el "¿en qué estás?" y los duplicados. D es lo mínimo que fija la ficha.
- **Los P0 sirven al usuario principal:** sí. No hay ningún P0 pensado para un lead ni para terceros.
- **Criterios de aceptación verificables:** sí, con clics, tiempos y estados concretos. El umbral de 5 s está marcado como supuesto.
- **Las métricas permiten evaluar los objetivos:** O1 → ronda cancelada; O2 → duplicados; O3 → frescura y adopción.
- **NO-objetivos coherentes con el alcance:** sí. "Bloqueado" es visible, pero se declara que no resuelve bloqueos.
- **Sin funcionalidades nuevas injustificadas:** la marca de "nueva" (RF-C3) es una extensión mínima de "qué se ha movido". La edición (RF-A4) está justificada por los roles planos.
- **Supuestos no convertidos en hechos:** marcados como S1–S12; las inferencias de 3.1 y 3.2 van etiquetadas como tales.
- **Contradicciones con la ficha:** la respuesta 4 (entidad equipo) contradice la ficha y se resuelve a favor de la ficha. La respuesta 5 (importación) está en tensión con la ficha y queda fuera de P0.
- **Sin decisiones técnicas prematuras:** no se define el mecanismo de propagación, ni el de acceso, ni la API. La sección 1 describe lo ya construido solo como punto de partida.

### 6.C Veredicto
- **Producto en una frase:** la lista de tareas del equipo donde cambiar el estado de lo tuyo cuesta dos clics y todos ven, sin preguntar ni refrescar, qué está libre, quién está en qué y qué se ha movido.
- **Usuario prioritario:** cada miembro de un equipo remoto pequeño y plano que hace las tareas.
- **Problema principal:** nadie ve el estado del equipo sin interrumpir a alguien, y eso causa trabajo duplicado y una ronda diaria de sincronización.
- **Capacidades imprescindibles:**
  1. Lista compartida que hace de cola de trabajo: ver qué está libre y de quién es cada cosa, y asignarse una tarea en 1 clic.
  2. Cambio de estado en ≤ 2 clics, visible a todos sin refrescar.
  3. Qué se ha movido desde mi última visita, destacado dentro de la lista.

  (El filtro por estado y la marca de vencidas están en P0 por decisión de la ficha, pero no son imprescindibles.)
- **Exclusiones más importantes:**
  1. Entidad equipo / varios equipos.
  2. Integraciones con otras herramientas (sincronizar con otros gestores, derivar el estado de Git/CI, Slack).
  3. Notificaciones e indicadores de presencia.
- **Supuesto más peligroso:** S1, que el trabajo que se duplica está representado como tarea en la lista. Si no lo está, el producto puede usarse bien y aun así no evitar el episodio que lo motiva.
- **Principal razón por la que el MVP podría fracasar:** que el estado se quede viejo (H1). Si la lista no está al día, la ronda de la daily vuelve y el producto pierde el sentido.
