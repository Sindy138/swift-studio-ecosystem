# Swift Studio 360

Plataforma B2B privada de contratación de servicios de marketing digital y contenido audiovisual. Los clientes acceden a un panel privado donde configuran y contratan servicios, hacen seguimiento de sus pedidos con un stepper visual, consultan entregables y conversan con un agente de IA especializado en los servicios de la agencia.

> Proyecto final del Bootcamp Ironhack · Fullstack + IA integrada · Deadline: 15 junio 2026

---

## ¿Qué es este producto?

Swift Studio 360 es un e-commerce de **servicios productizados**: el cliente no compra un producto físico, sino que contrata un servicio configurable (SEO, contenidos, fotografía, automatización) a través de un formulario dinámico que se adapta a cada tipo de servicio. Una vez contratado, el equipo de la agencia gestiona el pedido desde el panel de administración y publica los entregables finales directamente en el dashboard del cliente.

El agente IA actúa como consultor de ventas y soporte: responde preguntas sobre la agencia, los servicios y los precios con información en tiempo real desde la base de datos y documentación interna recuperada por RAG.

---

## Arquitectura del sistema

```mermaid
graph LR
  subgraph Cliente
    BROWSER["Navegador\nReact 19 + Vite"]
  end

  subgraph Backend ["Backend · Express.js v5 · :3000"]
    API["API REST\n/api/*"]
    MW["Middlewares\nJWT · Zod · Helmet\nRate Limit · CORS"]
    AGENT["Agente IA\nLangGraph ReAct"]
  end

  subgraph Datos
    DB[("PostgreSQL\nPrisma ORM")]
    CHROMA[("ChromaDB\nRAG · :8000")]
  end

  subgraph Servicios Externos
    GROQ["Groq API\nLLaMA 3.1 8B"]
    LF["LangFuse\nObservabilidad LLM"]
  end

  BROWSER -->|"REST · Bearer JWT"| API
  API --> MW --> DB
  API -->|"POST /api/chat"| AGENT
  AGENT -->|"search_agency_docs"| CHROMA
  AGENT -->|"search_services"| DB
  AGENT -->|"completion"| GROQ
  AGENT -->|"trazas · tokens · feedback"| LF
```

---

## Flujo del usuario (end-to-end)

```mermaid
sequenceDiagram
  actor U as Cliente
  participant FE as Frontend
  participant API as Backend API
  participant DB as PostgreSQL

  U->>FE: Accede a la URL
  FE-->>U: Redirect → /login

  U->>FE: Registra cuenta (email + password)
  FE->>API: POST /auth/register
  API->>DB: Crea User + Profile
  API-->>FE: { user, token JWT 1h }
  FE-->>U: Redirect → /dashboard

  U->>FE: Navega al catálogo
  FE->>API: GET /services
  API-->>FE: 8 servicios activos
  FE-->>U: Grid de servicios con filtros por categoría

  U->>FE: Selecciona "Auditoría SEO · 299€"
  FE-->>U: Formulario dinámico (campos del servicio)
  U->>FE: Rellena configuración + confirma
  FE->>API: POST /orders { serviceId, configData }
  API->>DB: Crea Order PENDING · total = precio servicio
  API-->>FE: 201 Created
  FE-->>U: Redirect → /orders · Banner de éxito

  U->>FE: Consulta detalle del pedido
  FE->>API: GET /orders/:id
  API-->>FE: Order + stepper PENDING→PROGRESS→DONE
  FE-->>U: Vista de estado + entregables (cuando DONE)
```

---

## Flujo del administrador

```mermaid
sequenceDiagram
  actor A as Administrador
  participant FE as Frontend
  participant API as Backend API
  participant DB as PostgreSQL

  A->>FE: Login con cuenta ADMIN
  FE->>API: POST /auth/login
  API->>DB: Verifica rol desde BD
  API-->>FE: Token JWT con role ADMIN
  FE-->>A: Acceso a /admin (sidebar ampliado)

  A->>FE: Panel /admin/orders
  FE->>API: GET /orders (todos) + GET /users
  FE-->>A: Tabla de pedidos con datos de clientes

  A->>FE: Cambia estado a PROGRESS
  FE->>API: PUT /orders/:id/status { status: "PROGRESS" }
  API-->>FE: 200 · estado actualizado
  FE-->>A: Badge animado PROGRESS (amarillo)

  note over A,DB: El cliente ve el cambio en su dashboard

  A->>FE: Sube entregable final
  FE->>API: POST /orders/:id/deliverables { label, url }
  API->>DB: Crea Deliverable vinculado al pedido
  A->>FE: Cambia estado a DONE
  FE->>API: PUT /orders/:id/status { status: "DONE" }
  FE-->>A: Pedido cerrado · Badge verde DONE

  note over A,DB: El cliente ve entregables como enlaces en /orders/:id
```

---

## Ciclo de vida de un pedido

```mermaid
stateDiagram-v2
  direction LR
  [*] --> PENDING : Cliente contrata\nPOST /orders

  PENDING --> PROGRESS : Admin inicia trabajo\nPUT status

  PROGRESS --> DONE : Admin entrega\nPUT status + POST deliverable

  DONE --> [*]

  note right of PENDING
    Total calculado automáticamente
    desde el precio del servicio.
    Cliente recibe confirmación.
  end note

  note right of PROGRESS
    Cliente ve badge animado.
    Admin gestiona desde panel.
  end note

  note right of DONE
    Entregables disponibles como
    enlaces externos (Drive, Notion…)
    Pedido archivado e inmutable.
  end note
```

---

## Flujo del chatbot IA

```mermaid
sequenceDiagram
  actor U as Cliente
  participant W as Chat Widget
  participant API as Backend API
  participant AG as LangGraph Agent
  participant CR as ChromaDB
  participant DB as PostgreSQL
  participant LF as LangFuse

  U->>W: Abre widget · escribe mensaje
  W->>W: Validación: max 2000 chars\ndetección prompt injection
  W->>API: POST /chat { message, conversationId }
  API->>API: authenticate · rateLimit 30/min\nvalidate · detectPromptInjection
  API->>DB: Guarda mensaje USER\nRecupera historial (últimos 10 turnos)

  API->>AG: runAgent(message, history, userId)
  AG->>LF: trace.start({ userId, input })

  alt Pregunta sobre agencia / FAQs
    AG->>CR: search_agency_docs(query) · top-3 chunks
    CR-->>AG: docs + sources
  else Pregunta sobre servicios / precios
    AG->>DB: search_services({ category, name })
    DB-->>AG: servicios activos
  end

  AG->>AG: LLM Groq · llama-3.1-8b-instant\ntemp 0.3 · respuesta con fuentes
  AG->>LF: generation.end({ tokens, output })
  AG-->>API: { answer, sources, traceId }

  API->>API: AgentResponseSchema (Zod · OWASP API10)
  API->>DB: Guarda mensaje ASSISTANT + sources + traceId
  API-->>W: { conversationId, message }
  W-->>U: Respuesta + pills de fuentes + botones 👍/👎

  opt Feedback del usuario
    U->>W: Pulsa 👍 o 👎
    W->>API: POST /chat/:traceId/feedback { score }
    API->>LF: score({ name: "user-feedback", value })
  end
```

---

## Mapa de navegación

```mermaid
flowchart TD
  START(["Acceso a la app"]) --> LOGIN["/login\nFormulario de acceso"]
  LOGIN -->|"Sin cuenta"| REGISTER["/register\nRegistro con validación"]
  REGISTER --> DASH
  LOGIN -->|"Autenticado"| DASH["/dashboard\nResumen de actividad"]

  DASH --> SVC["/services\nCatálogo filtrable"]
  DASH --> ORD["/orders\nMis pedidos"]
  DASH --> PROF["/profile\nPerfil y empresa"]
  DASH --> CHAT["Chat IA\nWidget flotante · todas las páginas"]

  SVC --> SVCDET["/services/:id\nDetalle + formulario dinámico"]
  SVCDET -->|"Confirma pedido"| ORD

  ORD --> ORDDET["/orders/:id\nStepper + entregables"]

  DASH -->|"role = ADMIN"| ADMIN["/admin\nPanel de resumen"]
  ADMIN --> AORD["/admin/orders\nTodos los pedidos"]
  ADMIN --> AUSR["/admin/users\nGestión de usuarios"]
  ADMIN --> ASVC["/admin/services\nCRUD catálogo"]

  style LOGIN fill:#FE8C7C,color:#fff
  style REGISTER fill:#FE8C7C,color:#fff
  style ADMIN fill:#8A52F7,color:#fff
  style AORD fill:#8A52F7,color:#fff
  style AUSR fill:#8A52F7,color:#fff
  style ASVC fill:#8A52F7,color:#fff
  style CHAT fill:#0FD39E,color:#fff
```

---

## Stack tecnológico

### Backend

| Capa          | Tecnología                                               |
| ------------- | -------------------------------------------------------- |
| Framework     | Express.js v5 · Node.js v18+ (CommonJS)                  |
| Base de datos | PostgreSQL · Prisma ORM v7                               |
| Autenticación | JWT HS256 · TTL 1h · bcryptjs salt 10                    |
| Validación    | Zod (inputs + respuesta del LLM)                         |
| Seguridad     | Helmet · CORS estricto · express-rate-limit (6 limiters) |
| Testing       | Vitest · Supertest · 14 tests de integración             |

### Frontend

| Capa          | Tecnología                                           |
| ------------- | ---------------------------------------------------- |
| UI            | React 19 · Vite 8                                    |
| Routing       | React Router DOM v7 · lazy loading + Suspense        |
| Estado global | Context API (AuthContext)                            |
| HTTP          | Axios · interceptor JWT · redirect 401 automático    |
| Estilos       | CSS Modules + CSS Custom Properties (design tokens)  |
| Seguridad     | DOMPurify · ErrorBoundary · robots.txt `Disallow: /` |

### Inteligencia Artificial

| Componente     | Tecnología                          | Rol                                               |
| -------------- | ----------------------------------- | ------------------------------------------------- |
| Orquestación   | LangGraph `createReactAgent`        | Ciclo razonamiento → herramienta → respuesta      |
| LLM            | Groq API · LLaMA 3.1 8B Instant     | Generación de texto · temp 0.3                    |
| RAG            | ChromaDB · DefaultEmbeddingFunction | Recuperación de documentación interna             |
| Tool 1         | `search_agency_docs`                | Consulta ChromaDB — agencia, FAQs, portfolio      |
| Tool 2         | `search_services`                   | Consulta PostgreSQL — servicios y precios en vivo |
| Memoria        | PostgreSQL (`ConversationMessage`)  | Historial persistente entre sesiones              |
| Observabilidad | LangFuse                            | Trazas · tokens · coste · feedback 👍/👎          |

---

## Modelo de datos

```mermaid
erDiagram
  User {
    String id PK
    String email UK
    String password
    Role role
    DateTime createdAt
  }
  Profile {
    String id PK
    String fullName
    String phone
    String companyName
    String userId FK
  }
  Service {
    String id PK
    String name
    Float price
    String category
    Json formConfig
    Boolean isActive
  }
  Order {
    String id PK
    OrderStatus status
    Json configData
    Float total
    String userId FK
    String serviceId FK
    DateTime createdAt
  }
  Deliverable {
    String id PK
    String label
    String url
    String orderId FK
  }
  ConversationMessage {
    String id PK
    String conversationId
    MessageRole role
    String content
    Json sources
    String traceId
    String userId FK
  }

  User ||--o| Profile : "1:1 cascade"
  User ||--o{ Order : "1:N restrict"
  Service ||--o{ Order : "1:N restrict"
  Order ||--o{ Deliverable : "1:N cascade"
  User ||--o{ ConversationMessage : "1:N cascade"
```

---

## Seguridad — puntos clave

| Control          | Implementación                                                                          |
| ---------------- | --------------------------------------------------------------------------------------- |
| Autenticación    | JWT HS256 · TTL 1h · bcrypt salt 10                                                     |
| RBAC             | `isAdmin()` consulta BD en cada petición — sin caché de rol                             |
| Ownership        | Orders, deliverables y chat verifican `userId === req.user.id`                          |
| Inputs           | Zod en todos los endpoints · también valida respuesta del LLM (OWASP API10)             |
| XSS              | `dangerouslySetInnerHTML` prohibido · DOMPurify disponible · JSX escapa automáticamente |
| Prompt injection | 14 patrones regex backend + detección frontend + system prompt anti-jailbreak           |
| CORS             | Sin wildcard · `CORS_ORIGIN` obligatoria en producción · falla en startup si falta      |
| Rate limiting    | 6 limiters: global · login · register · chat · orders · users                           |
| Headers          | Helmet (X-Frame-Options, HSTS, nosniff, Referrer-Policy)                                |
| Privacidad       | `robots.txt Disallow: /` · `noindex, nofollow` · Swagger deshabilitado en producción    |
| Errores          | 5xx genéricos al cliente · detalles solo en logs de servidor                            |

---

## Puesta en marcha completa

**Requisitos previos:** Node.js v18+, PostgreSQL, ChromaDB en `:8000`.

### 1 — Backend

```bash
cd backend
cp .env.example .env      # configurar DATABASE_URL, JWT_SECRET, GROQ_API_KEY…
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev               # → http://localhost:3000
```

### 2 — Frontend

```bash
cd frontend
npm install
npm run dev               # → http://localhost:5173
```

El proxy de Vite redirige `/api/*` al backend automáticamente — no se necesita ninguna variable de entorno adicional en el frontend.

### 3 — Verificación end-to-end

| Paso | Acción                                | Resultado esperado                       |
| ---- | ------------------------------------- | ---------------------------------------- |
| 1    | Acceder a `localhost:5173`            | Redirect a `/login`                      |
| 2    | Registrar cuenta                      | Token JWT · redirect a `/dashboard`      |
| 3    | Navegar a `/services`                 | 8 servicios del catálogo                 |
| 4    | Contratar un servicio                 | Pedido en `/orders` · estado PENDING     |
| 5    | Abrir chat · preguntar por servicios  | Respuesta del agente con fuentes citadas |
| 6    | Login como ADMIN → `/admin/orders`    | Ver todos los pedidos · cambiar estado   |
| 7    | Añadir entregable · poner estado DONE | Cliente ve entregable en `/orders/:id`   |
| 8    | Logout                                | Token eliminado · redirect a `/login`    |

---

## Estructura del repositorio

```
swift-ecommerce/
├── backend/               # API REST + Agente IA
│   ├── src/
│   │   ├── features/      # auth · users · services · orders · chat
│   │   ├── middlewares/   # JWT · Zod · Helmet · promptSecurity · errorHandler
│   │   └── lib/           # Prisma · ChromaDB · LangFuse (singletons)
│   ├── prisma/            # schema · migrations · seed
│   └── README.md          # Documentación técnica completa del backend
├── frontend/              # SPA React 19
│   ├── src/
│   │   ├── pages/         # Auth · Dashboard · Services · Orders · Profile · Admin
│   │   ├── components/    # layout · ui kit · chat · forms
│   │   ├── hooks/         # useOrders · useServices · useChat
│   │   └── api/           # Axios client + módulos por dominio
│   └── README.md          # Documentación técnica completa del frontend
├── documents/
│   ├── auditoria-seguridad.md   # Auditoría OWASP API Top 10
│   └── *.md                     # Documentación de seguridad, SOLID, buenas prácticas
├── ai_log.md              # Registro de uso de IA durante el desarrollo
└── BRIEF.md               # Requisitos del bootcamp
```

---

## Despliegue

**Render** Ver: [Demo](https://swift-studio-ecosystem.onrender.com)

---

## Documentación

| Recurso                   | Ubicación                                                            |
| ------------------------- | -------------------------------------------------------------------- |
| README Backend (técnico)  | [backend/README.md](backend/README.md)                               |
| README Frontend (técnico) | [frontend/README.md](frontend/README.md)                             |
| Auditoría de seguridad    | [documents/auditoria-seguridad.md](documents/auditoria-seguridad.md) |
| API Swagger (desarrollo)  | `http://localhost:3000/api/docs`                                     |
| Observabilidad LLM        | `https://cloud.langfuse.com`                                         |
| Log de uso de IA          | [ai_log.md](ai_log.md)                                               |
