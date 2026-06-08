# Fullstack MVP — Lista de Tareas Pendientes

> Estado al 8 de junio de 2026 | Deadline: 15 junio 2026 18:00
>
> Las tareas marcadas con ✅ están implementadas y verificadas en el código.
> Las marcadas con `[ ]` son lo que falta para el MVP.

---

# BACKEND

---

## Lo que ya está hecho ✅

- Express v5 + Helmet + CORS + Morgan + rate limiter global (100 req/15 min)
- JWT auth (register / login) + bcryptjs + RBAC (USER / ADMIN)
- Middlewares: `authenticate`, `isAdmin`, `validate(schema)`, `errorHandler`
- Prisma schema + migraciones + seed (5 tablas, 8 servicios)
- CRUD completo: Services, Orders, Deliverables, Users
- Zod en todos los endpoints (incluida validación de URL en deliverables)
- 10 tests de integración con Vitest + Supertest
- **Módulo Chat** — `ConversationMessage` en BD, `POST /api/chat`, `GET /api/chat/history/:conversationId`, `POST /api/chat/:traceId/feedback` ✅ _(2026-06-08)_
- **Agente LangGraph** — `createReactAgent` con 2 tools (`search_agency_docs` + `search_services`), `ChatGroq`, historial de conversación, extracción de fuentes, manejo de errores ✅ _(2026-06-08)_

---

## Tareas Pendientes

### ~~1. Módulo Chat — Endpoints obligatorios del BRIEF~~ ✅ Completado 2026-06-08

- [x] **1.1** Modelo `ConversationMessage` + enum `MessageRole` en `schema.prisma` — migración `20260608180135_add_chat` aplicada
- [x] **1.2** `chat.schema.js`, `chat.controller.js`, `chat.routes.js`, `agent/agent.js` (stub) creados en `backend/src/features/chat/`
- [x] **1.3** Rutas registradas en `app.js` — 10/10 tests anteriores siguen en verde

---

### ~~2. Agente LangGraph — Requisito BRIEF (≥2 tools)~~ ✅ Completado 2026-06-08

- [x] **2.1** Dependencias instaladas: `@langchain/langgraph`, `@langchain/core`, `@langchain/groq`, `langchain`
- [x] **2.2** `tools.js` — `searchAgencyDocs` (stub RAG, listo para B3) + `searchServices` (Prisma real)
- [x] **2.3** Tool 1 `search_agency_docs` — stub con la firma correcta para ChromaDB (Tarea B3)
- [x] **2.4** Tool 2 `search_services` — consulta Prisma filtrando por `category` y/o `name`, devuelve nombre/descripción/precio
- [x] **2.5** `agent.js` — `createReactAgent` (LangGraph) + `ChatGroq` (`GROQ_MODEL` desde env) + sistema de extracción de fuentes + manejo de errores + historial de conversación limitado a 10 turnos
- [x] `.env.example` actualizado con todas las variables de IA

---

### 3. ChromaDB / RAG — Requisito BRIEF (≥5 docs, cita fuentes)

- [ ] **3.1** Instalar cliente ChromaDB
  ```bash
  npm install chromadb
  ```

- [ ] **3.2** Crear `backend/src/lib/chroma.js` — singleton del cliente y helper de búsqueda

- [ ] **3.3** Crear script `backend/scripts/indexDocs.js` para indexar documentos

- [ ] **3.4** Preparar y indexar ≥5 documentos en `backend/data/docs/`
  - `about-agency.md` — quiénes somos, misión, clientes tipo
  - `services-seo.md` — servicios SEO con descripción detallada
  - `services-content.md` — servicios de contenido y fotografía
  - `services-automation.md` — servicios de automatización con N8N
  - `faq.md` — preguntas frecuentes, plazos, revisiones, proceso de trabajo

- [ ] **3.5** Verificar que las respuestas del agente incluyen el campo `sources` con la referencia al doc

---

### 4. LangFuse — Observabilidad LLM

- [ ] **4.1** Instalar SDK
  ```bash
  npm install langfuse
  ```

- [ ] **4.2** Añadir variables de entorno al `.env`:
  ```env
  LANGFUSE_SECRET_KEY="sk-lf-..."
  LANGFUSE_PUBLIC_KEY="pk-lf-..."
  LANGFUSE_HOST="https://cloud.langfuse.com"
  ```

- [ ] **4.3** Crear `backend/src/lib/langfuse.js` — singleton del cliente

- [ ] **4.4** Instrumentar el agente: traza por petición con `trace → span → generation`
  - Loguear: prompt enviado, respuesta, tokens de entrada/salida, modelo, latencia

- [ ] **4.5** Añadir endpoint `POST /api/chat/:traceId/feedback` (authenticate)
  - Payload: `{ score: 1 | 0 }` → registra puntuación 👍/👎 en LangFuse

---

### 5. Swagger / Documentación API — Requisito BRIEF

- [ ] **5.1** Instalar dependencias
  ```bash
  npm install swagger-jsdoc swagger-ui-express redoc-express
  ```

- [ ] **5.2** Crear `backend/src/config/swagger.js` con la definición base (info, servers, securitySchemes)

- [ ] **5.3** Añadir comentarios JSDoc con `@openapi` a todos los routes existentes
  - `auth.routes.js` — POST /register, POST /login
  - `services.routes.js` — GET /, GET /:id, POST /, PUT /:id, DELETE /:id
  - `orders.routes.js` — POST /, GET /, GET /:id, PUT /:id/status
  - `orders.routes.js` — POST /:id/deliverables, GET /:id/deliverables
  - `users.routes.js` — GET /, GET /:id, PUT /:id, DELETE /:id
  - `chat.routes.js` — POST /chat, GET /chat/history/:id, POST /chat/:id/feedback

- [ ] **5.4** Montar las rutas de documentación en `app.js`
  ```js
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec))
  app.use('/api/redoc', redoc({ specUrl: '/api/docs/swagger.json' }))
  ```

---

### 6. Variables de Entorno y Configuración

- [ ] **6.1** Añadir al `.env` todas las variables de IA que faltan:
  ```env
  GROQ_API_KEY="gsk_..."
  CHROMA_HOST="localhost"
  CHROMA_PORT=8000
  ```

- [ ] **6.2** Crear `.env.example` con todas las variables (sin valores reales) para el repositorio

---

### 7. Seguridad — OWASP gaps pendientes

- [ ] **7.1** API10 — Validar respuestas del agente IA con Zod antes de guardar en BD
  - Schema: `AgentResponseSchema` con `answer` (string), `sources` (array de strings), `conversationId`

---

### 8. Tests

- [ ] **8.1** Añadir tests para el módulo chat en `api.test.js`
  - Test: POST /api/chat sin auth → 401
  - Test: POST /api/chat con auth y mensaje válido → 200 con `answer`
  - Test: GET /api/chat/history/:id con auth y ownership → 200 con array de mensajes
  - Test: GET /api/chat/history de otro usuario → 403

---

### 9. Preparación para Despliegue

- [ ] **9.1** Verificar que no hay referencias a `localhost` hardcodeadas en el código (usar `process.env`)
- [ ] **9.2** Añadir script `"start": "node src/server.js"` en `package.json` (ya existe, confirmar funciona en prod)
- [ ] **9.3** Asegurarse de que `prisma generate` se ejecuta en el build step de Render
- [ ] **9.4** Configurar `DATABASE_URL` apuntando a la BD cloud de Render en las variables de entorno del hosting

---

---

# FRONTEND

> El directorio `frontend/` no existe todavía — crear desde cero con Vite.

## Lo que ya está hecho ✅

- Nada. El frontend se crea desde cero.

---

## Tareas Pendientes

### F1. Scaffolding y configuración inicial

- [ ] **F1.1** Crear el proyecto con Vite
  ```bash
  npm create vite@latest frontend -- --template react
  cd frontend && npm install
  ```

- [ ] **F1.2** Instalar dependencias necesarias
  ```bash
  npm install react-router-dom axios
  ```

- [ ] **F1.3** Crear `frontend/.env` y `frontend/.env.example`
  ```env
  VITE_API_URL=http://localhost:3000/api
  ```

- [ ] **F1.4** Definir la estructura de carpetas
  ```
  frontend/src/
  ├── api/           # clientes HTTP por módulo
  ├── components/    # UI reutilizable
  ├── context/       # Context API
  ├── hooks/         # custom hooks
  ├── pages/         # una carpeta por ruta
  └── router/        # definición de rutas
  ```

---

### F2. Context API — Estado global de auth (BRIEF obligatorio)

- [ ] **F2.1** Crear `src/context/AuthContext.jsx`
  - Estado: `user`, `token`, `isAuthenticated`, `isLoading`
  - Acciones: `login(email, password)`, `register(email, password)`, `logout()`
  - Al montar: leer token de `localStorage` y validar que no está expirado (decode del JWT)
  - Persistir `token` en `localStorage` en login, eliminarlo en logout

- [ ] **F2.2** Envolver `<App>` con `<AuthProvider>` en `main.jsx`

---

### F3. Router y rutas protegidas (BRIEF: mínimo 3 rutas)

- [ ] **F3.1** Crear `src/router/index.jsx` con React Router v6
  ```
  /              → redirige a /dashboard si auth, a /login si no
  /login         → LoginPage (pública)
  /register      → RegisterPage (pública)
  /dashboard     → DashboardPage (protegida)
  /services      → ServicesPage (protegida)
  /orders/:id    → OrderDetailPage (protegida)
  /profile       → ProfilePage (protegida)
  ```

- [ ] **F3.2** Crear `src/router/ProtectedRoute.jsx`
  - Si no hay token → redirige a `/login`
  - Si hay token → renderiza `<Outlet />`

---

### F4. Capa de API — clientes HTTP

- [ ] **F4.1** Crear `src/api/client.js` — instancia de axios con `baseURL` desde `VITE_API_URL` e interceptor que añade `Authorization: Bearer <token>` a cada request

- [ ] **F4.2** Crear `src/api/auth.js` — `postRegister`, `postLogin`

- [ ] **F4.3** Crear `src/api/services.js` — `getServices`, `getServiceById`

- [ ] **F4.4** Crear `src/api/orders.js` — `createOrder`, `getOrders`, `getOrderById`

- [ ] **F4.5** Crear `src/api/chat.js` — `sendMessage`, `getChatHistory`

- [ ] **F4.6** Crear `src/api/profile.js` — `getUser`, `updateUser`

---

### F5. Páginas — Auth

- [ ] **F5.1** `src/pages/Login/LoginPage.jsx`
  - Formulario: email + password
  - Validación cliente: email válido, password ≥ 8 caracteres (BRIEF: formularios con validación)
  - Muestra error de API si credenciales incorrectas
  - Al hacer login exitoso → redirige a `/dashboard`
  - Link a `/register`

- [ ] **F5.2** `src/pages/Register/RegisterPage.jsx`
  - Formulario: email + password + confirmación de password
  - Validación cliente: mismos campos + passwords deben coincidir
  - Al registrar exitoso → redirige a `/dashboard`
  - Link a `/login`

---

### F6. Páginas — Usuario

- [ ] **F6.1** `src/pages/Dashboard/DashboardPage.jsx`
  - Saludo con nombre del usuario (o email si no tiene perfil)
  - Lista de los últimos 5 pedidos con estado (PENDING / PROGRESS / DONE) con badge de color
  - Botón "Ver catálogo" → `/services`
  - Estado vacío si no tiene pedidos

- [ ] **F6.2** `src/pages/Services/ServicesPage.jsx`
  - Grid de tarjetas de servicios (nombre, categoría, precio, descripción corta)
  - Botón "Contratar" por tarjeta → abre modal o navega al formulario de contratación
  - Estado de carga con skeleton o spinner
  - Estado vacío si no hay servicios activos

- [ ] **F6.3** `src/pages/Services/OrderFormModal.jsx` (o subpágina)
  - Renderiza el formulario dinámico a partir del campo `formConfig` del servicio
  - Validación de campos requeridos según `formConfig`
  - Al enviar → llama a `createOrder`, muestra confirmación y redirige a `/dashboard`

- [ ] **F6.4** `src/pages/Orders/OrderDetailPage.jsx`
  - Muestra detalle del pedido: servicio, estado, fecha, total, `configData`
  - Lista de entregables (label + link) si los hay
  - Botón "Volver al dashboard"

- [ ] **F6.5** `src/pages/Profile/ProfilePage.jsx`
  - Muestra y permite editar: `fullName`, `phone`, `companyName`
  - Formulario con validación cliente (phone: solo números/guiones)
  - Feedback visual al guardar (success / error)

---

### F7. Chat widget — IA (BRIEF obligatorio)

- [ ] **F7.1** Crear `src/components/ChatWidget/ChatWidget.jsx`
  - Botón flotante fijo en esquina inferior derecha, visible en todas las páginas protegidas
  - Al hacer clic, abre/cierra un panel de chat

- [ ] **F7.2** Panel de chat
  - Historial de mensajes (burbujas usuario / agente)
  - Campo de texto + botón enviar
  - Al abrir: carga historial del usuario vía `GET /api/chat/history/:conversationId`
  - Al enviar: llama a `POST /api/chat`, añade respuesta del agente al hilo

- [ ] **F7.3** Estados del chat
  - Cargando (typing indicator mientras el agente responde)
  - Error de red (mensaje inline, no toast)
  - Historial vacío ("Hola, ¿en qué puedo ayudarte?")

- [ ] **F7.4** Cita de fuentes
  - Si la respuesta incluye `sources`, mostrarlos como lista bajo el mensaje del agente

- [ ] **F7.5** Botones de feedback 👍 / 👎 bajo cada respuesta del agente
  - Llama a `POST /api/chat/:traceId/feedback`

---

### F8. Componentes transversales

- [ ] **F8.1** `src/components/Navbar.jsx` — logo, links según rol, botón logout

- [ ] **F8.2** `src/components/ProtectedLayout.jsx` — wrapper que incluye `<Navbar>` y `<ChatWidget>` para todas las páginas protegidas

- [ ] **F8.3** Estados de UI reutilizables (BRIEF: loading / error / vacío)
  - `<Spinner />` — indicador de carga
  - `<ErrorMessage message />` — bloque de error inline
  - `<EmptyState message />` — estado vacío con texto configurable

---

### F9. Diseño responsive (BRIEF obligatorio)

- [ ] **F9.1** Definir breakpoints en CSS: mobile-first (`< 768px`, `≥ 768px`, `≥ 1024px`)
- [ ] **F9.2** Navbar: menú hamburguesa en mobile, horizontal en desktop
- [ ] **F9.3** Grid de servicios: 1 columna en mobile, 2 en tablet, 3 en desktop
- [ ] **F9.4** Chat widget: ocupa pantalla completa en mobile, panel lateral en desktop
- [ ] **F9.5** Formularios: ancho completo en mobile, máximo 480px centrado en desktop

---

### F10. Variables de entorno y configuración de despliegue

- [ ] **F10.1** Crear `frontend/.env.example`
  ```env
  VITE_API_URL=https://tu-backend.render.com/api
  ```
- [ ] **F10.2** Configurar `vite.config.js` con proxy al backend para desarrollo local (evita CORS en dev)
- [ ] **F10.3** Añadir `_redirects` para Netlify (SPA routing)
  ```
  /*  /index.html  200
  ```

---

# AUTOMATIZACIÓN N8N

## Tareas Pendientes

### N1. Workflow obligatorio del BRIEF (1 workflow activo con lógica condicional)

- [ ] **N1.1** Diseñar el flujo — propuesta: notificación al crear un pedido
  - Trigger: webhook `POST /webhook/order-created` llamado desde `orders.controller.js` tras crear un pedido
  - Nodo IF: si `order.total >= 800` → rama "pedido premium", si no → rama "pedido estándar"
  - Rama premium: enviar email de bienvenida personalizado al cliente (via Gmail node o SMTP)
  - Rama estándar: registrar el pedido en una hoja de Google Sheets o log interno

- [ ] **N1.2** Implementar la llamada al webhook desde el backend
  - En `orders.controller.js`, tras el `prisma.order.create`, hacer un `fetch` al webhook de N8N con los datos del pedido
  - Hacerlo en background (no bloquear la respuesta al cliente)

- [ ] **N1.3** Exportar el workflow como JSON en `n8n-workflows/order-notification.json`

---

# DESPLIEGUE

## Tareas Pendientes

### D1. Backend — Render

- [ ] **D1.1** Crear servicio web en Render apuntando al repo (rama `main`, directorio `backend/`)
- [ ] **D1.2** Configurar build command: `npm install && npx prisma generate && npx prisma migrate deploy`
- [ ] **D1.3** Añadir todas las variables de entorno en el panel de Render
- [ ] **D1.4** Conectar a la BD PostgreSQL de Render (o Neon) y verificar que el seed se ejecuta

### D2. Frontend — Netlify o Vercel

- [ ] **D2.1** Crear proyecto apuntando al directorio `frontend/`
- [ ] **D2.2** Configurar build command: `npm run build`, publish dir: `dist`
- [ ] **D2.3** Añadir `VITE_API_URL` con la URL del backend en Render
- [ ] **D2.4** Verificar que el login y el chat funcionan end-to-end en producción

### D3. Verificación final

- [ ] **D3.1** Las dos apps se comunican en producción (CORS configurado con la URL de Netlify/Vercel)
- [ ] **D3.2** El agente IA responde en producción (ChromaDB accesible, Groq API key activa)
- [ ] **D3.3** LangFuse recibe trazas del entorno de producción

---

# ORDEN DE EJECUCIÓN RECOMENDADO (Fullstack)

```
Backend primero:
  B1 (chat endpoints + BD) → B6.1 (env vars) → B2 (LangGraph) → B3 (ChromaDB)
  → B4 (LangFuse) → B5 (Swagger) → B7 (Zod AI) → B8 (tests chat)

Frontend en paralelo desde B1 terminado:
  F1 (scaffold) → F2 (AuthContext) → F3 (Router) → F4 (API clients)
  → F5 (auth pages) → F6 (user pages) → F7 (chat widget) → F8 (layout)
  → F9 (responsive) → F10 (deploy config)

Automatización cuando el backend esté estable:
  N1 (N8N workflow + webhook en orders.controller)

Despliegue al final:
  D1 (Render backend) → D2 (Netlify frontend) → D3 (verificación)
```

**Hito crítico:** el módulo chat del backend (B1) desbloquea tanto el agente (B2) como el widget del frontend (F7). Priorizar.

---

# RESUMEN DE DEPENDENCIAS A INSTALAR

**Backend:**
```bash
npm install @langchain/langgraph @langchain/core @langchain/groq langchain \
            chromadb langfuse \
            swagger-jsdoc swagger-ui-express redoc-express
```

**Frontend:**
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install react-router-dom axios
```
