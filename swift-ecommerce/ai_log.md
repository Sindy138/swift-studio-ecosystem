# AI Log — Swift Studio 360

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
