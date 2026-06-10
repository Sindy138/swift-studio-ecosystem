# Architecture Decision Records — Swift Studio 360

Registro de decisiones técnicas significativas tomadas durante el desarrollo. Cada ADR documenta el contexto, la decisión, el razonamiento y las consecuencias asumidas.

> Formato: Contexto → Decisión → Por qué → Consecuencias

---

## ADR-001 — Node.js + Express v5 en lugar de Python + FastAPI

**Contexto:**
El brief del bootcamp mencionaba Python + FastAPI como stack de backend recomendado.

**Decisión:**
Usar Node.js con Express.js v5 y CommonJS.

**Por qué:**
- El ecosistema LangChain/LangGraph tiene soporte de primera clase en JavaScript (`@langchain/langgraph`, `@langchain/groq`) con paridad casi total respecto a Python.
- Una sola plataforma (Node.js) para backend y tooling reduce la fricción operativa.
- Express v5 incorpora manejo nativo de async/await en middlewares y rutas, eliminando la necesidad de `express-async-errors`.
- El brief permitía cambios de stack con justificación previa.

**Consecuencias:**
- No se dispone del ecosistema de tipado estático de Python/Pydantic; se compensa con Zod.
- CommonJS en lugar de ESM: decisión de compatibilidad con Prisma v7 y las dependencias de LangChain en el momento del desarrollo.

---

## ADR-002 — Arquitectura feature-based en lugar de MVC por capas

**Contexto:**
Los patrones más comunes en Express son MVC (models/controllers/routes en carpetas separadas) o arquitecturas por capas (presentation/domain/infrastructure).

**Decisión:**
Organizar el código por dominio funcional: `features/{auth,users,services,orders,chat}/`.

**Por qué:**
- Cada feature es autocontenida (`controller + routes + schema`): se puede leer, modificar o eliminar sin saltar entre carpetas.
- Escala mejor cuando el equipo crece — los módulos tienen fronteras explícitas.
- Principio SRP a nivel de módulo: cada carpeta tiene una sola razón para cambiar.

**Consecuencias:**
- Algo de duplicación de importaciones entre features (cada una importa `prisma`, `asyncHandler`, `validate`). Aceptable dado el tamaño del proyecto.

---

## ADR-003 — JWT en localStorage en lugar de httpOnly cookies

**Contexto:**
Almacenar el token JWT en `localStorage` expone el token a scripts de la página (XSS). La alternativa segura es una cookie `httpOnly` gestionada por el servidor, inaccesible desde JavaScript.

**Decisión:**
JWT en `localStorage` con TTL de 1 hora.

**Por qué:**
- El frontend y el backend se despliegan en dominios distintos (Netlify/Vercel + Render). Configurar cookies cross-domain con `SameSite`, `Secure` y CORS correctamente requiere infraestructura adicional (proxy o subdominios compartidos).
- Para el alcance del bootcamp, el riesgo se mitiga con: TTL corto (1h), `dangerouslySetInnerHTML` prohibido, DOMPurify disponible, `robots.txt Disallow: /`.
- Documentado explícitamente en la auditoría de seguridad como riesgo aceptado.

**Consecuencias:**
- Vulnerabilidad residual a XSS. En producción real la migración a cookies `httpOnly` es el siguiente paso obligatorio.

---

## ADR-004 — TTL del JWT reducido de 7 días a 1 hora

**Contexto:**
El JWT se emitía inicialmente con `expiresIn: '7d'`. Combinado con la ausencia de mecanismo de revocación, un token robado permanecía válido una semana entera.

**Decisión:**
Reducir el TTL a `1h`. Sin refresh token.

**Por qué:**
- 1 hora es el compromiso razonable entre seguridad (ventana de exposición acotada) y UX (el usuario típico de una sesión de trabajo termina antes de una hora).
- Implementar un refresh token requiere un endpoint adicional, gestión de rotación y, en producción, almacenamiento de tokens de refresco en BD o Redis — fuera del alcance del proyecto.
- El impacto en UX es manejable: el axios interceptor redirige a `/login` con `401` de forma transparente.

**Consecuencias:**
- Sin revocación activa en logout — el token sigue siendo válido hasta expiración. Ventana máxima de exposición: 1 hora.

---

## ADR-005 — Verificación del rol en BD en cada petición admin

**Contexto:**
El rol (`USER | ADMIN`) estaba embebido en el payload del JWT. El middleware `isAdmin()` original leía el rol directamente del token sin consultar la base de datos. Un cambio de rol no tenía efecto hasta que el token expirara.

**Decisión:**
`isAdmin()` hace un `prisma.user.findUnique()` en cada petición a una ruta de administración.

**Por qué:**
- La revocación de privilegios debe ser inmediata. Si un administrador es despromovido, no debe seguir teniendo acceso durante el tiempo de vida del token.
- El coste de la consulta adicional es despreciable para rutas admin (baja frecuencia de uso).
- Resuelve la vulnerabilidad API2 de la auditoría de seguridad sin necesidad de implementar blacklist de tokens.

**Consecuencias:**
- +1 query a BD por cada petición admin. Aceptable.
- `isAdmin()` es ahora `async` — incompatible con el uso síncrono, pero Express maneja correctamente middlewares async con try/catch interno.

---

## ADR-006 — Soft delete para servicios en lugar de hard delete

**Contexto:**
Los pedidos tienen una FK a `Service` con `onDelete: Restrict`. Eliminar físicamente un servicio que tiene pedidos asociados lanzaría un error de constraint.

**Decisión:**
El campo `isActive: Boolean @default(true)` en el modelo `Service` actúa como flag de eliminación lógica. `DELETE /services/:id` hace `update({ isActive: false })`.

**Por qué:**
- Preserva la integridad referencial: los pedidos históricos siguen apuntando a un servicio existente.
- Permite recuperar un servicio desactivado sin pérdida de datos.
- El historial de pedidos mantiene su contexto completo (nombre del servicio, precio en el momento de la contratación).

**Consecuencias:**
- Todas las queries públicas deben filtrar por `isActive: true` — un olvido expone servicios desactivados. Mitigado con la convención de pasar siempre `where: { isActive: true }` en `listServices` y `getService`.

---

## ADR-007 — PostgreSQL para el historial de conversaciones en lugar de Redis

**Contexto:**
El historial conversacional del chatbot necesita persistencia entre sesiones. Las opciones eran Redis (clave-valor con TTL), una colección MongoDB o la misma base de datos PostgreSQL ya en uso.

**Decisión:**
Modelo `ConversationMessage` en PostgreSQL con índices en `conversationId` y `userId`.

**Por qué:**
- Reutiliza la infraestructura existente — no añade un servicio externo al stack.
- Permite ownership checks con una sola query: `findFirst({ where: { conversationId, userId } })`.
- El `traceId` de LangFuse se almacena en el mismo registro, permitiendo correlacionar mensajes con trazas sin joins adicionales.
- El volumen de mensajes en un chatbot B2B con base de usuarios pequeña no justifica la complejidad de Redis.

**Consecuencias:**
- Sin TTL automático de conversaciones antiguas. En producción se necesitaría un job de limpieza para conversaciones más antiguas de N días.

---

## ADR-008 — LangGraph `createReactAgent` en lugar de una cadena LCEL personalizada

**Contexto:**
LangChain permite construir agentes de dos formas principales: cadenas LCEL (más control, más código) o el prebuilt `createReactAgent` de LangGraph (menos código, patrón ReAct opinionado).

**Decisión:**
`createReactAgent({ llm, tools })` de `@langchain/langgraph/prebuilt`.

**Por qué:**
- El patrón ReAct (Reason + Act) es exactamente lo que se necesita: el agente decide qué herramienta usar basándose en el mensaje, observa el resultado y genera la respuesta.
- `createReactAgent` gestiona el bucle de invocación de herramientas automáticamente — sin lógica de routing manual.
- Reduce el boilerplate significativamente manteniendo toda la observabilidad de LangFuse sobre los mensajes del grafo.
- Cumple el requisito del brief de "agente LangGraph con al menos 2 tools".

**Consecuencias:**
- Menos control sobre el flujo interno del agente. Si se necesitara lógica de routing condicional compleja (p.ej. escalar a un humano), habría que migrar a un grafo personalizado con nodos explícitos.

---

## ADR-009 — Groq como proveedor LLM en lugar de OpenAI o Anthropic

**Contexto:**
El agente necesita un LLM. Las opciones principales eran OpenAI (GPT-4o), Anthropic (Claude) o Groq (LLaMA 3.1).

**Decisión:**
Groq API con el modelo `llama-3.1-8b-instant`.

**Por qué:**
- Groq ofrece un tier gratuito generoso para proyectos de desarrollo, sin coste por tokens en los límites del proyecto.
- La latencia de Groq es notablemente menor que OpenAI/Anthropic gracias a su hardware especializado (LPU) — mejora la experiencia del chat en demo en vivo.
- LLaMA 3.1 8B es suficiente para un chatbot de soporte de ventas con contexto RAG acotado.

**Consecuencias:**
- LLaMA 3.1 8B tiene menor capacidad de razonamiento complejo que GPT-4o o Claude. Para consultas ambiguas o muy largas puede ser menos preciso.
- Dependencia de la disponibilidad del servicio Groq. Mitigado con el fallback explícito que responde con mensaje controlado si `GROQ_API_KEY` no está definida.

---

## ADR-010 — Validación de la respuesta del LLM con Zod (OWASP API10)

**Contexto:**
La respuesta del agente (`answer`, `sources`, `traceId`) se persiste en BD y se envía al cliente. Sin validación, una respuesta malformada del LLM podría causar errores en cascada o datos corruptos.

**Decisión:**
`AgentResponseSchema` (Zod) valida la respuesta de `runAgent()` antes de cualquier operación posterior. Si falla → `502 Bad Gateway`.

**Por qué:**
- OWASP API10 (Unsafe Consumption of APIs): tratar las respuestas de APIs externas — incluyendo LLMs — como entradas no confiables que deben validarse.
- Previene que un `sources: undefined` o `answer: null` cause un `P2002` o un crash en el cliente.
- Hace explícito el contrato entre el agente y el controlador.

**Consecuencias:**
- Si el LLM devuelve una estructura inesperada (poco común pero posible), el usuario recibe un `502` con mensaje genérico en lugar de una respuesta útil. El error queda registrado en LangFuse para diagnóstico.

---

## ADR-011 — Backend sirve el frontend estático en producción

**Contexto:**
En producción existen dos opciones: desplegar frontend y backend en servicios separados (Netlify + Render) o compilar el frontend y servirlo como archivos estáticos desde el mismo servidor Express.

**Decisión:**
El frontend compilado (`dist/`) se copia a `backend/public/` y se sirve con `express.static`. Un único despliegue en Render.

**Por qué:**
- Elimina los problemas de CORS en producción — frontend y API comparten el mismo dominio.
- Un solo servicio en Render simplifica el despliegue y reduce costes.
- La ruta SPA fallback (`app.get("/*splat", ...)`) garantiza que React Router funcione correctamente con rutas anidadas.

**Consecuencias:**
- El proceso de despliegue requiere un paso adicional: compilar el frontend y copiar `dist/` a `backend/public/` antes de hacer push.
- Frontend y backend comparten el mismo proceso — un crash del servidor también sirve el frontend. En un sistema productivo con tráfico real, la separación sería preferible.

---

## ADR-012 — CSS Modules + CSS Custom Properties en lugar de Tailwind

**Contexto:**
Las opciones para los estilos del frontend eran Tailwind CSS, styled-components, CSS Modules puros o una combinación.

**Decisión:**
CSS Modules co-localizados con cada componente + CSS Custom Properties globales como design tokens en `tokens.css`.

**Por qué:**
- CSS Modules garantizan aislamiento de estilos sin runtime overhead (sin CSS-in-JS).
- Las CSS Custom Properties (`var(--color-brand)`) crean un sistema de diseño coherente que un diseñador puede ajustar desde un único archivo.
- La paleta (coral `#FE8C7C` + malva `#8A52F7`) y todos los tokens de espaciado, sombras y transiciones viven en `tokens.css` — fuente única de verdad.
- No añade dependencias de compilación adicionales más allá de Vite.

**Consecuencias:**
- Más verboso que Tailwind para estilos de layout repetitivos. Compensado con la legibilidad y el control total sobre el diseño final.
