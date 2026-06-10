# AI Log — Swift Studio 360

---

## 2026-06-10 — Frontend Fase 8: Polish, Accesibilidad y QA

- **Herramienta:** Claude Sonnet 4.6 (Claude Code)
- **Contexto:** Phase final de polish: ErrorBoundary, ARIA fixes, RegisterPage rediseño a light mode, robots.txt, limpieza de meta tags.
- **Prompt usado:** "ok, fase 8"
- **Qué obtuvo:**
  - `ErrorBoundary.jsx` — class component con `getDerivedStateFromError` + botones "Recargar" y "Intentar de nuevo". Montado en `App.jsx` envolviendo `<AuthProvider>` + `<RouterProvider>`.
  - `RegisterPage.module.css` — reescrito completo: eliminados `rgba(18,18,30,0.75)`, `rgba(0,212,255,...)` del modo oscuro anterior. Nuevo fondo `var(--color-bg)` con orbs coral+malva, card blanca con borde, logo con `filter: brightness(0)` para fondo claro.
  - `public/robots.txt` — `Disallow: /` (plataforma privada, no indexable).
  - `Modal.jsx` ARIA fix: `role="dialog" aria-modal="true"` movido del overlay al `.dialog`; añadido `aria-labelledby="modal-title"` + `id="modal-title"` en el `<h3>` del título.
  - `index.html` — `theme-color` corregido de `#080810` (dark) a `#f4f4f9` (light). `meta robots="noindex,nofollow"` ya estaba.
  - Auditoría `console.log` — ninguno encontrado en toda la carpeta `src/`.
  - Build final: ✓ 149 módulos, 2.29s, cero errores.
- **Qué modificó o descartó:** Se valoraron loading skeletons para listas (Spinner ya implementado cumple el requisito). Se descartó añadir `aria-live` a todas las páginas ya que los mensajes de error críticos ya tienen `role="alert"` y los formularios tienen `aria-live="polite"` en el password strength.
- **Tiempo con IA:** ~15 min | **Tiempo sin IA (estimado):** ~1.5h
- **Aprendizaje:** `role="dialog"` debe ir en el elemento focusable del modal (`.dialog`), no en el overlay — el overlay es decorativo y debe llevar `aria-hidden`. Sin `aria-labelledby`, los screen readers no anuncian el título del modal al enfocar.

---

## 2026-06-10 — Frontend Fase 7: Panel de Administración

- **Herramienta:** Claude Sonnet 4.6 (Claude Code)
- **Contexto:** Panel admin completo: dashboard con stats, gestión de pedidos con cambio de estado y entregables, tabla de usuarios con borrado, CRUD de servicios.
- **Prompt usado:** "sí" (aprobación tras propuesta de Fase 7)
- **Qué obtuvo:**
  - `AdminDashboardPage.jsx` — 6 stat cards (usuarios, pedidos totales, por estado, facturación), quick links a sub-secciones, tabla de 6 pedidos recientes.
  - `AdminOrdersPage.jsx` — tabla de todos los pedidos con join por `userId→email` (fetch paralelo users+orders), filtros por estado como pills, `<select>` inline para cambiar estado (llamada `updateOrderStatus` en cada cambio), modal para añadir entregable (label + URL).
  - `AdminUsersPage.jsx` — tabla de usuarios con buscador, delete con Modal de confirmación, auto-bloqueo si intenta eliminarse a sí mismo.
  - `AdminServicesPage.jsx` — listado de servicios + Modal crear/editar (nombre, descripción, precio, categoría, formConfig como textarea JSON), delete con Modal.
  - Sidebar actualizado: 4 links admin (Resumen, Pedidos, Usuarios, Servicios).
  - Router actualizado: nueva ruta `/admin/orders`.
  - Build verificado: ✓ 147 módulos, sin errores.
- **Qué modificó o descartó:** Se valoró un AdminOrderDetailPage por pedido, pero se mantuvo la gestión inline en la tabla para mayor agilidad en la demo. El join userId→email en frontend es suficiente para el demo (no se añadió `include: { user }` al backend para no modificarlo).
- **Tiempo con IA:** ~30 min | **Tiempo sin IA (estimado):** ~4h
- **Aprendizaje:** Para el join frontend de `userId → email`, `useMemo` con un `Map` construido desde `getUsers()` en `useEffect` es más eficiente que buscar en array por cada fila. El `Promise.all([getOrders(), getUsers()])` paralelo reduce el tiempo de carga de dos peticiones secuenciales a una sola espera.

---

## 2026-06-10 — Frontend Fase 6: Chat Widget IA

- **Herramienta:** Claude Sonnet 4.6 (Claude Code)
- **Contexto:** Construcción del chat widget flotante completo: FAB + panel + mensajes + input + feedback, conectado a `POST /api/chat` del agente LangGraph.
- **Prompt usado:** "Continua con la fase 6 del plan del frontend"
- **Qué obtuvo:**
  - `useChat.js` — hook de estado: mensajes[], conversationId (sessionStorage), sending, send(), submitFeedback(), clearConversation(). Mensaje optimista del usuario + rollback si falla. Rate limit → ERRORS.rateLimit.
  - `ChatWidget.jsx` — FAB 56px fijo bottom-right, panel 380×520px con animación spring (cubic-bezier(0.34, 1.56)), header gradient animado, Escape para cerrar, unread dot coral cuando hay mensajes sin ver, lazy-loaded desde AppShell.
  - `ChatMessage.jsx` — burbuja USER (derecha, malva) vs ASSISTANT (izquierda, surface con borde), white-space pre-wrap, source pills con gradient brand-subtle, botones 👍/👎 que deshabilitan tras votar.
  - `ChatInput.jsx` — textarea auto-resize (max 120px), throttle 1.5s con `useRef`, detección de prompt injection antes del envío (sin llamada al backend), counter visible al 80% del límite, Enter envía / Shift+Enter salto de línea.
  - Typing indicator: 3 puntos con animación bounce escalonada (delays 0/0.18/0.36s).
  - `AppShell.jsx` actualizado: `<ChatWidget />` lazy dentro de `<Suspense fallback={null}>` — no bloquea carga inicial.
- **Qué modificó o descartó:** Se valoró `dangerouslySetInnerHTML` + DOMPurify pero se optó por render de texto plano con `white-space: pre-wrap` (el agente devuelve texto, no HTML). El sanitizeHtml del util queda disponible si en el futuro el agente devuelve markdown renderizado.
- **Tiempo con IA:** ~20 min | **Tiempo sin IA (estimado):** ~2.5h
- **Aprendizaje:** `cubic-bezier(0.34, 1.56, 0.64, 1)` — curva spring que supera el valor 1 momentáneamente, crea efecto "pop" sin librería de animación. `position: fixed` en el panel dentro de un root `position: fixed` en mobile requiere sobreescribir las coordenadas con `left/right/bottom` explícitos, ya que el panel no puede ser relativo al botón en pantallas pequeñas.

---

## 2026-06-10 — Frontend Fase 5: Perfil de Usuario

- **Herramienta:** Claude Sonnet 4.6 (Claude Code)
- **Contexto:** Página de perfil con edición inline, avatar generado y sincronización del email con AuthContext.
- **Prompt usado:** "si" (aprobación tras propuesta de Fase 5)
- **Qué obtuvo:**
  - `ProfilePage.jsx` — layout two-col: aside sticky (avatar gradient, nombre, rol badge, fecha alta) + formCard (2 fieldRows con 4 inputs).
  - `isDirty = JSON.stringify(form) !== JSON.stringify(original)` — evita falsas detecciones de cambio.
  - Botón Guardar deshabilitado si `!isDirty`. Botón "Descartar cambios" solo visible cuando hay cambios.
  - Si el email cambia, llama a `login({ ...user, email: data.email }, token)` para sincronizar AuthContext sin re-login.
  - Build verificado: ✓ 132 módulos, sin errores.
- **Tiempo con IA:** ~15 min | **Tiempo sin IA (estimado):** ~1.5h
- **Aprendizaje:** `JSON.stringify` como dirty-check es simple y fiable para objetos planos de formulario, evita comparar campo por campo. El patrón `login(updatedUser, token)` para actualizar el contexto sin disparar un nuevo JWT es más limpio que invalidar y re-autenticar.

---

## 2026-06-10 — Frontend Fase 4: Panel de Pedidos

- **Herramienta:** Claude Sonnet 4.6 (Claude Code)
- **Contexto:** Lista de pedidos con badges animados y detalle con stepper visual de estado.
- **Prompt usado:** "sí" (aprobación tras propuesta de Fase 4)
- **Qué obtuvo:**
  - `OrdersPage.jsx` — lista de pedidos con category pills, status Badge (warning/info/success + pulse en PROGRESS), banner de éxito cuando viene de checkout (`location.state?.success`).
  - `OrderDetailPage.jsx` — stepper 3 pasos (PENDING/PROGRESS/DONE) con nodos circulares y líneas conectoras; stepDone (verde + checkmark), stepActive (malva + glow), default (gris). Grid de configData con `formatConfigKey` (camelCase → legible). Deliverables como `<a target="_blank">` con hover brand.
  - Build verificado: ✓ sin errores.
- **Tiempo con IA:** ~15 min | **Tiempo sin IA (estimado):** ~2h
- **Aprendizaje:** El stepper con líneas conectoras requiere `position: relative` en el wrapper y `position: absolute; left: 50%; width: 100%` en la línea para que conecte el nodo actual con el siguiente sin depender del ancho real del contenedor.

---

## 2026-06-09 — Backend: Tests módulo chat (integración)

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** El módulo chat estaba implementado pero sin cobertura de tests. Había que añadir 4 tests de integración al archivo `tests/api.test.js` existente (que ya tenía 10 tests para auth, services y orders).
- **Prompt usado:** "continuamos con la tarea 8 tests"
- **Qué obtuvo:**
  - Test 11: `POST /api/chat` sin token → 401 (middleware `authenticate` rechaza)
  - Test 12: `POST /api/chat` con token válido y mensaje → 200, `role: ASSISTANT`, `content` no vacío; `convId` guardado para los siguientes tests; timeout explícito de 30s por si Groq tarda (en la práctica tardó 1s)
  - Test 13: `GET /api/chat/history/:conversationId` del propio usuario → 200 con array de mensajes y `conversationId` correcto
  - Test 14: `GET /api/chat/history/:conversationId` con token de otro usuario (admin) → 403 (ownership check del controller)
  - Resultado: **14/14 tests passing en 2.49s**
- **Qué modificó o descartó:** Se valoró mockear el agente para que el test 12 no llame a Groq, pero el proyecto sigue el patrón de integración real (los tests de BD tampoco mockean Prisma). El agente tiene fallback cuando `GROQ_API_KEY` no está → el test 12 pasa en cualquier entorno. No se añadió cleanup explícito de `ConversationMessage` en `afterAll` porque la relación tiene `onDelete: Cascade` en User — al eliminar los usuarios de test, sus mensajes se borran en cascada.
- **Tiempo con IA:** ~10 min | **Tiempo sin IA (estimado):** ~30 min
- **Aprendizaje:** El tercer argumento de `it()` en Vitest es el timeout en milisegundos — útil para tests que llaman a APIs externas reales. El `onDelete: Cascade` de Prisma simplifica el cleanup de tests: basta con eliminar el recurso padre y las relaciones se limpian solas. El `convId` como variable compartida entre describes funciona en Vitest porque los describes del mismo archivo comparten el scope del módulo.

---

## 2026-06-09 — Backend: Swagger / Documentación API

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** El backend tenía todos los endpoints implementados pero sin documentación API. El BRIEF exige Swagger UI. Había que crear la configuración base y añadir JSDoc `@openapi` a los 5 route files (16 endpoints en total).
- **Prompt usado:** "vamos a terminar con el backend, comenzamos [después de LangFuse] con la tarea 5 Swagger"
- **Qué obtuvo:**
  - `npm install swagger-jsdoc swagger-ui-express` — las dos dependencias necesarias
  - `src/config/swagger.js` — spec OpenAPI 3.0 con `swaggerJsdoc`: título, versión, servidor base `/api`, `securitySchemes` con `bearerAuth` (JWT Bearer); glob `./src/features/**/*.routes.js` para recoger automáticamente todos los JSDoc
  - JSDoc `@openapi` añadido en los 5 route files: `auth` (2), `services` (5), `orders` (6), `users` (4), `chat` (3) — con tags, summary, parameters, requestBody, responses y ejemplos inline
  - `app.js` actualizado: `GET /api/docs/swagger.json` expone la spec como JSON; `app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec))` sirve la UI
  - `redoc-express` instalado y probado, pero descartado: carga su bundle desde `cdn.jsdelivr.net` y la CSP de Helmet (`default-src 'self'`) bloquea el script externo. Relajar la CSP no es aceptable → se eliminó de `app.js`
- **Qué modificó o descartó:** Redoc eliminado del código final — intentamos configurar Helmet para permitir `cdn.jsdelivr.net` pero la decisión fue priorizar la seguridad. Swagger UI cubre completamente el requisito del BRIEF. Los JSDoc usan schemas inline en lugar de `$ref` a componentes compartidos (KISS — no justifica abstracción para 16 endpoints).
- **Tiempo con IA:** ~20 min | **Tiempo sin IA (estimado):** ~2 horas
- **Aprendizaje:** `swagger-jsdoc` resuelve el glob de rutas en relación al `process.cwd()` (directorio desde donde se lanza Node), no al directorio del fichero de configuración — importante tenerlo en cuenta si el servidor se lanza desde un subdirectorio. `redoc-express` sirve una shell HTML mínima que carga el bundle de Redoc desde CDN, lo cual lo hace incompatible con CSP estricta sin configuración adicional de Helmet. Para producción, la alternativa sería servir el bundle localmente, pero excede el scope del MVP.

---

## 2026-06-09 — Backend: LangFuse — Observabilidad LLM

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** El agente LangGraph devolvía siempre `traceId: null` y el endpoint de feedback tenía `recorded: false` como placeholder. Había que conectar LangFuse para tener observabilidad real: trazas por petición, conteo de tokens y puntuaciones 👍/👎 vinculadas a cada respuesta.
- **Prompt usado:** "vamos a terminar con el backend, comenzamos por la tarea 4 LangFuse. Recuerda que tenemos variable de entorno y si necesitas que instale los frameworks, dimelo."
- **Qué obtuvo:**
  - `src/lib/langfuse.js` — singleton con `getLangfuse()`: si `LANGFUSE_SECRET_KEY` o `LANGFUSE_PUBLIC_KEY` no están en el entorno devuelve `null` en vez de crashear; el resto del código usa optional chaining (`langfuse?.trace(...)`) para degradarse con gracia
  - `agent.js` — `runAgent` recibe ahora `userId` como tercer parámetro; antes de invocar al agente crea un `trace` y un `generation` en LangFuse; tras la respuesta actualiza la `generation` con output y `usage_metadata` de Groq (tokens de entrada/salida); llama a `flushAsync()` para garantizar el envío antes de resolver la petición HTTP; el `trace.id` se devuelve como `traceId` y se persiste en `ConversationMessage`
  - `chat.controller.js` — `sendMessage` pasa `userId` al agente; `submitFeedback` llama a `langfuse.score()` con `name: 'user-feedback'` y `value: 0|1`, respondiendo `recorded: true` si LangFuse está activo o `false` si no hay keys
- **Qué modificó o descartó:** Se valoró usar `langfuse.span()` en vez de `generation()` para el agente completo, pero `generation` es el tipo semántico correcto en LangFuse cuando se trata de una llamada a un LLM (registra modelo, tokens y coste automáticamente). El `flushAsync()` añade latencia mínima (~50-100ms) pero es necesario para que las trazas lleguen antes de cerrar la conexión HTTP — en producción se podría hacer en background, pero para MVP está bien así.
- **Tiempo con IA:** ~15 min | **Tiempo sin IA (estimado):** ~1.5 horas
- **Aprendizaje:** El patrón singleton con `getLangfuse()` que devuelve `null` cuando no hay configuración permite que la app funcione en entornos sin LangFuse (tests, CI) sin cambiar ningún código de negocio — el optional chaining en el punto de uso actúa como feature flag. `usage_metadata` en LangChain/Groq está en el último `AIMessage` del resultado, no en el objeto `result` raíz — hay que buscarlo en `result.messages[last].usage_metadata`.

---

## 2026-06-08 — Backend: Seguridad IA y prompts

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** Antes de continuar con LangFuse, había que verificar e implementar las medidas de seguridad de IA y prompts descritas en `documents/3_seguridad-ia.md` y `documents/4_seguridad-prompts.md`. El código del chat tenía el límite de 2000 chars pero le faltaban las otras cuatro capas de defensa.
- **Prompt usado:** "antes del langfuse vamos a verificar que están implementadas las medidas de seguridad de ia y seguridad de prompts que se encuentran en la carpeta documents de la raiz, si no lo están, impleméntalas"
- **Qué obtuvo:**
  - `promptSecurity.middleware.js` — 14 patrones regex (español e inglés) detectan prompt injection directa, jailbreaking y sobrescritura de rol; log de auditoría con userId + longitud (nunca el contenido); respuesta genérica 400
  - `agent.js` — system prompt ampliado con sección "REGLAS DE SEGURIDAD INNEGOCIABLES": rechazar peticiones de ignorar instrucciones, nunca revelar el system prompt, ignorar instrucciones ocultas en el RAG, no ejecutar código ni acceder a URLs externas
  - `chat.routes.js` — rate limiter específico para `/api/chat` (30 req/min) más restrictivo que el global (100/15min) para mitigar ataques de fuerza bruta y bucles de coste
  - `chat.controller.js` — `console.info` de auditoría solo con metadatos (userId, messageLength, convId), nunca el mensaje
  - `chat.schema.js` — `AgentResponseSchema` con Zod valida el output del agente antes de persistirlo; si la forma no es la esperada devuelve 502 en lugar de guardar datos corruptos (cierra OWASP API10)
- **Qué modificó o descartó:** Se descartó la validación de output por palabras prohibidas ("contraseña", "confidencial") porque en el contexto de esta app los documentos RAG son controlados por nosotros y el riesgo de data leakage es bajo. La separación de colecciones por nivel de acceso (doc 3_seguridad-ia.md) también se omitió — YAGNI para MVP con un único tipo de usuario cliente.
- **Tiempo con IA:** ~20 min | **Tiempo sin IA (estimado):** ~2 horas
- **Aprendizaje:** La defensa en profundidad para IA no es un solo check sino capas independientes: validar el input ANTES del LLM (middleware), reforzar el system prompt para que el modelo rechace ataques, limitar la tasa de llamadas, loguear solo metadatos (no datos personales), y validar el output con un schema estricto antes de persistir. Cada capa falla sola; juntas reducen el riesgo significativamente.

---

## 2026-06-08 — Backend: ChromaDB RAG (indexación de documentos)

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** El agente tenía el stub RAG que devolvía resultados vacíos. Había que conectar ChromaDB real: crear el cliente singleton, los 5 documentos de la agencia, el script de indexación y actualizar la tool para que busque en la colección real.
- **Prompt usado:** "sí (al final, en el ai_log añade un prompt completo)"
- **Qué obtuvo:**
  - `npm install chromadb @chroma-core/default-embed` — cliente v2 con función de embeddings local
  - `src/lib/chroma.js` — singleton con `host`/`port` (API v2), `DefaultEmbeddingFunction`, helper `searchDocs(query, nResults)`
  - 5 documentos en `backend/data/docs/`: `about-agency.md`, `services-seo.md`, `services-content.md`, `services-automation.md`, `faq.md`
  - `scripts/indexDocs.js` — borra y re-crea la colección, chunking por párrafos/oraciones (máx 600 chars), añade metadato `source` a cada fragmento
  - `tools.js` actualizado — `searchAgencyDocs` llama a `searchDocs`, extrae `sources` únicos, captura errores de red sin crashear el agente
- **Qué modificó o descartó:** La primera versión usaba `path` en el constructor de `ChromaClient` (API v1) — en v2 hay que usar `host` y `port` por separado. También fallaba por falta del paquete de embeddings: chromadb v2 requiere `@chroma-core/default-embed` explícitamente. Se detectó en el primer intento de ejecución del script y se corrigió. La indexación real queda pendiente de `docker run -p 8000:8000 chromadb/chroma` por parte del usuario.
- **Tiempo con IA:** ~25 min | **Tiempo sin IA (estimado):** ~2 horas
- **Aprendizaje:** En `chromadb` v2 el constructor cambió de `{ path: 'http://...' }` a `{ host, port }`. Además ya no crea una `DefaultEmbeddingFunction` automáticamente — hay que instalar `@chroma-core/default-embed` y pasarla explícitamente al crear/obtener la colección. El manejo de error en la tool RAG es crítico: si ChromaDB no está corriendo, el agente no debe crashear sino degradarse con gracia devolviendo `sources: []`.

---

## 2026-06-08 — Backend: Agente LangGraph + tools

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** El módulo chat tenía un stub como agente. Había que implementar el agente real con LangGraph usando dos tools (RAG y consulta a BD) y Groq como LLM, sin romper los tests existentes.
- **Prompt usado:** continua con la tarea B2 del TASK.md
- **Qué obtuvo:**
  - Paquetes instalados: `@langchain/langgraph`, `@langchain/core`, `@langchain/groq`, `langchain`
  - `tools.js` con dos tools: `search_agency_docs` (stub RAG con la firma correcta para ChromaDB en B3) y `search_services` (consulta real a Prisma con filtros opcionales por categoría y nombre)
  - `agent.js` reemplazado: `createReactAgent` de LangGraph + `ChatGroq` leyendo `GROQ_MODEL` del entorno + system prompt en español + conversión del historial de BD a mensajes LangChain + extracción de fuentes de los `ToolMessage` + manejo de error con respuesta amigable
  - `.env.example` actualizado con todas las variables de IA
- **Qué modificó o descartó:** La `search_agency_docs` es un stub que devuelve resultados vacíos hasta que ChromaDB esté listo (Tarea B3) — así el agente ya funciona con la tool de servicios real y se puede probar end-to-end. Se limitó el historial a los últimos 10 mensajes para no saturar el contexto del LLM. Se eligió `createReactAgent` en lugar de un `StateGraph` manual porque es suficiente para el BRIEF y más simple de mantener (KISS).
- **Cómo funciona el routing:** no hay código de routing explícito — el LLM decide qué tool usar basándose en el system prompt y las descripciones de cada tool. Si el usuario pregunta por precios → search_services; si pregunta por la agencia → search_agency_docs. Eso cumple el requisito del BRIEF de "routing condicional".
- **Tiempo con IA:** ~20 min | **Tiempo sin IA (estimado):** ~3-4 horas
- **Aprendizaje:** `createReactAgent` gestiona automáticamente el ciclo tool-call → tool-result → respuesta final. El routing condicional entre tools lo hace el propio LLM según el system prompt y las descripciones de cada tool — no hace falta código de routing explícito. Para CommonJS, los paquetes `@langchain/*` publican CJS builds así que `require()` funciona directamente sin `import()` dinámico.

---

## 2026-06-08 — Backend: Módulo Chat (endpoints + modelo BD)

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** El backend tenía implementados auth, services, orders y users, pero faltaban los dos endpoints de chat obligatorios del BRIEF (`POST /api/chat` y `GET /api/chat/history/:id`), el modelo de BD para persistir conversaciones, y las rutas de feedback para LangFuse.
- **Prompt usado:** "vamos a continuar por el backend, tareas pendientes 1. Modulo Chat"
- **Qué obtuvo:**
  - Nuevo enum `MessageRole` (USER / ASSISTANT) y modelo `ConversationMessage` en `schema.prisma` con índices en `conversationId` y `userId`, relación con `User` en cascade delete
  - Migración `20260608180135_add_chat` aplicada y en sync con la BD
  - `chat.schema.js` — validación Zod para `SendMessageSchema` y `FeedbackSchema`
  - `agent/agent.js` — stub con la firma contractual que respetará la implementación real de LangGraph (Tarea 2)
  - `chat.controller.js` — lógica completa: ownership check del `conversationId`, generación de UUID si es conversación nueva, guardado de mensajes usuario/asistente, llamada al agente, endpoint de feedback
  - `chat.routes.js` — tres rutas: `POST /`, `GET /history/:conversationId`, `POST /:traceId/feedback`, todas protegidas con `authenticate`
  - `app.js` actualizado con `app.use("/api/chat", chatRoutes)`
- **Qué modificó o descartó:** Se decidió usar `crypto.randomUUID()` nativo de Node.js en vez de instalar un paquete externo (KISS). El `conversationId` no es un modelo separado sino un string agrupador en `ConversationMessage` — suficiente para el MVP. El endpoint de feedback devuelve `recorded: false` hasta que LangFuse se integre en Tarea 4.
- **Tiempo con IA:** ~15 min | **Tiempo sin IA (estimado):** ~90 min
- **Aprendizaje:** El `conversationId` como campo indexado en lugar de tabla propia es un patrón válido cuando no necesitas metadatos propios de la conversación (título, estado, etc.). `randomUUID()` está en Node.js core desde v14.17 — no hace falta `uuid` ni `cuid` como dependencia. En Express v5 el router no expone `_router` hasta recibir la primera petición, por eso el introspect de rutas falló y se validó con los tests existentes en su lugar.

---

## 2026-06-03 — Seguridad: rate limiting global y por endpoint

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** El CLAUDE.md tenía marcado OWASP API4 como ⚠️ (rate limit solo en login). Se necesitaba extender la protección al resto de endpoints para tener una seguridad robusta antes de empezar el frontend.
- **Prompt usado:** "Hay que fortalecer la seguridad de los endpoints. Agrega los limiters donde sea conveniente para que quede una seguridad robusta."
- **Qué obtuvo:**
  - La estrategia:
    - **Global limiter en app.js** — cubre todos los endpoints (OWASP API4)
    - **registerLimiter en auth.routes.js** — previene creación masiva de cuentas
    - **createOrderLimiter en orders.routes.js** — previene spam de pedidos
    - Los endpoints de admin ya están protegidos por isAdmin, el global limiter es suficiente para ellos.

- Análisis de los 4 archivos de rutas + app.js. Propuesta de 3 niveles de limitación y implementación directa:
  - `globalLimiter` (100 req/15min) en `app.js` — cubre todos los endpoints
  - `registerLimiter` (5 req/hora) en `auth.routes.js` — previene creación masiva de cuentas
  - `createOrderLimiter` (20 req/15min) en `orders.routes.js` — previene spam de pedidos
- **Qué modificó o descartó:** Se decidió no crear un archivo central `limiters.js` (KISS/YAGNI — solo 3 limiters en 3 archivos distintos, no justifica la abstracción). Los endpoints de admin no recibieron limiter específico porque ya están bloqueados por `isAdmin`.
- **Tiempo con IA:** ~10 min | **Tiempo sin IA (estimado):** ~30 min
- **Aprendizaje:** El `rateLimit()` es una función fábrica — cada vez que la llamas crea un middleware independiente con su propio contador. Por eso `loginLimiter` y `registerLimiter` son instancias separadas aunque vengan del mismo `require`. El global en `app.use()` actúa antes de cualquier ruta.

---

## 2026-06-09 — Frontend Fase 0: Setup y Scaffolding

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** El frontend era un scaffold vacío de Vite + React. Había que construir toda la infraestructura base antes de implementar páginas: sistema de tokens, capa API, contexto de auth, router con lazy loading y utilidades.
- **Prompt usado:** "Actúa como un Ingeniero de Software Frontend Senior y Master UX/UI Designer. Analiza el backend, docs de seguridad y logo, y construye el frontend premium B2B por fases pidiendo permiso antes de cada una."
- **Qué obtuvo:**
  - `vite.config.js` — alias `@` + proxy `/api → localhost:3000` (evita CORS en dev)
  - `index.html` — lang="es", Google Fonts (Space Grotesk, Inter, JetBrains Mono), noindex/nofollow
  - `src/styles/tokens.css` — sistema de design tokens completo (colores, tipografía, espaciado, radios, sombras, transiciones)
  - `src/styles/global.css` — reset CSS, tipografía base, scrollbar custom, `.sr-only`
  - `src/config/content.js` — arquitectura White-Label: todo el texto de marca en un único archivo
  - `src/api/client.js` — Axios con interceptores: inyecta JWT en cada request, redirige a `/login` en 401
  - `src/api/` — 5 módulos API (auth, services, orders, users, chat)
  - `src/context/AuthContext.jsx` — estado global auth con verificación de expiración JWT via `atob`
  - `src/router.jsx` — `createBrowserRouter` con lazy loading en todas las páginas
  - `src/utils/` — validators, formatters (Intl EUR), sanitize (DOMPurify + 7 patrones prompt injection)
- **Qué modificó o descartó:** Se rechazó la primera propuesta de estructura (estilos globales) y se adoptó CSS Modules co-localizados con cada componente — más fácil de mantener y editar diseño por componente. Se eligió Axios sobre fetch nativo por sus interceptores (JWT automático + redirect 401).
- **Tiempo con IA:** ~40 min | **Tiempo sin IA (estimado):** ~4 horas
- **Aprendizaje:** El proxy de Vite (`server.proxy`) oculta el origen del backend y elimina CORS completamente en desarrollo sin tocar el servidor. La arquitectura White-Label con `content.js` centralizado permite reutilizar toda la plataforma para otro cliente editando un solo archivo.

---

## 2026-06-09 — Frontend Fase 1: Autenticación (Login + Register + Context)

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** Con el scaffolding listo, había que implementar el flujo completo de autenticación: páginas de login y registro funcionales conectadas al backend JWT, componentes UI base reutilizables y guards de ruta.
- **Prompt usado:** "si" (aprobación de continuar con Fase 1 del plan)
- **Qué obtuvo:**
  - `LoginPage.jsx` — formulario con validación cliente, llamada a `POST /api/auth/login`, manejo de error 401
  - `RegisterPage.jsx` — mismo patrón + confirmación de contraseña + indicador de fortaleza (3 niveles con CSS)
  - Componentes UI base: `Button` (shimmer gradient en hover), `Input` (glow en focus), `Card`, `Badge` (pulse en PROGRESS), `Spinner`, `EmptyState`
  - `AuthContext` — `login()`, `logout()`, `isAuthenticated`, `isAdmin`, persistencia en localStorage
  - `ProtectedRoute` — guard de auth + guard de admin (redirect a `/dashboard` si no es admin)
- **Qué modificó o descartó:** El diseño inicial (frosted glass dark) fue rechazado en una sesión posterior y sustituido por light mode (ver entrada de Rediseño Visual).
- **Tiempo con IA:** ~30 min | **Tiempo sin IA (estimado):** ~3 horas
- **Aprendizaje:** El componente `PasswordStrength` puede implementarse puramente con CSS usando clases condicionales y `--delay` como CSS custom property para animar cada barra de forma escalonada sin JavaScript adicional.

---

## 2026-06-09 — Frontend Fase 2: Layout del Dashboard

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** Las páginas de auth funcionaban. Había que construir el shell de la aplicación autenticada: layout persistente con sidebar, topbar y área de contenido, más el dashboard con datos reales del backend.
- **Prompt usado:** "si" (aprobación de continuar con Fase 2 del plan)
- **Qué obtuvo:**
  - `AppShell.jsx` — layout flex con sidebar fijo + área principal (topbar + `<Outlet />`), overlay de backdrop en móvil
  - `Sidebar.jsx` — NavLinks con estado activo via gradient, iconos SVG inline, sección admin condicional, avatar con iniciales, logout
  - `Topbar.jsx` — sticky con glassmorphism, títulos dinámicos por ruta via mapa `ROUTE_TITLES`, botón hamburger en móvil
  - `DashboardPage.jsx` — 3 StatCards (total/activos/completados), lista de 5 pedidos recientes, CTA vacío, animaciones escalonadas con `--delay`
  - `useOrders.js` + `useServices.js` — hooks custom con loading/error/data/refetch
  - Build verificado: ✓ 707ms, cero errores
- **Qué modificó o descartó:** Stubs de páginas pendientes creados (`return null`) para que el router no crashee mientras se implementan las fases siguientes.
- **Tiempo con IA:** ~35 min | **Tiempo sin IA (estimado):** ~4 horas
- **Aprendizaje:** El patrón `style={{ '--delay': '${i * 60}ms' }}` para animaciones escalonadas en CSS es más limpio que JS: el CSS Module lo lee como custom property y lo usa en `animation-delay`, sin un solo `setTimeout`.

---

## 2026-06-10 — Frontend: Rediseño Visual (light mode coral/malva)

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** El diseño dark mode (fondo #080810, brand purple+cyan) no convenció. El usuario aportó un `token.css` de referencia (light mode, coral #FE8C7C + malva #8A52F7) y un componente `auth.jsx` de referencia como guía visual para la página de login.
- **Prompt usado:** "Te paso los archivos token.css con la paleta y fuentes que quiero, y te paso el auth para que lo adecues al nuestro. Procura adecuar lo nuevo a la estructura actual, sin dañar nada."
- **Qué obtuvo:**
  - `tokens.css` — paleta completa reemplazada a light mode manteniendo los mismos nombres de variables (`--color-bg`, `--color-brand`, etc.) para no romper ningún componente existente
  - 5 fixes de rgba hardcodeados que no heredaban del token: Topbar fondo dark, Sidebar navLink activo, Input focus glow, Button shadow primary
  - `LoginPage` — rediseñada con split-panel: brand panel izquierdo (gradient coral-malva, orbs decorativos, stats de agencia) + form panel derecho (fondo blanco, form centrado). Mobile: panel brand oculto, solo form
  - `global.css` — ::selection actualizado a malva
- **Qué modificó o descartó:** Se mantuvo el naming de variables CSS exactamente igual (solo cambiaron los valores) para que todos los componentes ya construidos heredaran el nuevo diseño sin editar ningún archivo de componente. Esto validó la arquitectura de tokens.
- **Tiempo con IA:** ~20 min | **Tiempo sin IA (estimado):** ~2 horas
- **Aprendizaje:** Mantener nombres de variables CSS estables y cambiar solo los valores es la técnica correcta para un rediseño de paleta sin rotura. Los rgba hardcodeados son la única deuda técnica de un sistema de tokens: hay que auditarlos antes de dar un diseño por cerrado.

---

## 2026-06-10 — Frontend Fase 3: Catálogo de Servicios + Checkout

- **Herramienta:** Claude Code (claude-sonnet-4-6)
- **Contexto:** Con el shell y las páginas de auth funcionando, había que implementar el flujo de compra completo: catálogo de los 8 servicios del backend con filtro por categoría, detalle de cada servicio con formulario dinámico generado desde `formConfig.fields`, y creación de pedido con confirmación modal.
- **Prompt usado:** "SÍ, continuamos con Fase 3"
- **Qué obtuvo:**
  - `Modal.jsx` + `.module.css` — portal React con `createPortal`, overlay con `backdrop-filter: blur`, cierre con Escape/clic-fuera/botón X, animación `scaleIn`
  - `DynamicServiceForm.jsx` + `.module.css` — renderiza `formConfig.fields` del backend; soporta type `text`, `number`, `textarea` y `select` (con flecha SVG custom en CSS); valida campos required; select con `appearance: none` + background-image SVG inline para cross-browser
  - `ServicesPage.jsx` + `.module.css` — grid responsive 4→3→2→1 cols, filtro por categoría con pills (gradient activo), `ServiceCard` con stripe de color por categoría, tilt 3D CSS via `perspective(700px) rotateX(2deg) rotateY(-3deg)` en hover, badge de categoría con color propio
  - `ServiceDetailPage.jsx` + `.module.css` — two-col layout (info sticky + form card), precio con gradient-text, lista de highlights con checkmarks, modal de confirmación que muestra nombre + precio antes de hacer el POST
  - Flujo completo: rellenar form → "Revisar pedido" → modal con resumen → "Confirmar y contratar" → `POST /api/orders` → redirect a `/orders`
  - Error 409: mensaje `ERRORS.duplicateOrder` sin romper la UI
  - Build verificado: ✓ 128 módulos, 1.16s, sin errores
- **Qué modificó o descartó:** El tilt 3D es CSS puro (dirección fija), no JS con `mousemove` — suficiente para el efecto visual deseado y sin complejidad. La confirmación modal muestra solo nombre y precio (no todo el configData) para mantener el modal limpio.
- **Tiempo con IA:** ~45 min | **Tiempo sin IA (estimado):** ~5 horas
- **Aprendizaje:** `createPortal(children, document.body)` para modales es esencial: evita problemas de `z-index` y `overflow: hidden` en componentes padre. El `select` nativo con `appearance: none` + SVG como `background-image` en CSS es la forma más robusta de estilizarlo sin librerías externas — funciona en todos los navegadores modernos.
