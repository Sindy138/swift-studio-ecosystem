# Swift Studio 360 — Contexto de Proyecto para Claude

> Documento de referencia para sesiones de trabajo con Claude Code.  
> Fecha de creación: 1 de junio de 2026 | Deadline: Lunes 15 de junio 18:00 (hora canaria)

---

## ¿Qué es este proyecto?

Se trata de un proyecto que contiene dos entornos, una web de capitalización sin backend, total mente dirigida a SEO y manejo de leads; y otra web ecommerce para clientes, privada, donde se gestionas la contratacion de servicios con dashboard, chatbot, perfil entre otros.

**Dos entornos integrados:**

| Entorno                            | Propósito                                              |
| ---------------------------------- | ------------------------------------------------------ |
| Página pública (swiftstudio.com)   | SEO, captación, catálogo, lead magnets vía N8N         |
| Panel privado (swiftstudio360.com) | Registro, configurador dinámico, dashboard, chatbot IA |

> En este archivo se describe unicamente el entorno, arquitenctura, stack, etc de la **ecommerce**.

## Swift studio 360 e-commerce

**Swift Studio 360** es una plataforma de e-commerce de servicios productizados para una agencia de marketing digital y contenido audiovisual. Es el proyecto final del bootcamp de Ironhack.

**Proyecto individual. Deadline: 15 junio 2026.**

---

## Stack Técnico

### Backend — implementado ✅

- **Express.js v5** + Node.js (CommonJS)
- **PostgreSQL** + Prisma ORM v7
- **JWT** (7d) + bcryptjs (salt 10) + RBAC (USER/ADMIN)
- **Zod** para validación de inputs
- **Helmet** + CORS + express-rate-limit + morgan
- **Vitest** + Supertest (10 integration tests)

### Frontend — crear desde cero ❌

- React 18 + Vite
- React Router v6
- Context API (estado auth global)
- Chat widget para el agente IA
- Diseño responsive (mobile + desktop)

### IA — pendiente ❌

- **LangGraph** (agente minimal, ≥2 tools — requisito BRIEF)
  - Tool 1: recuperar contexto del RAG (ChromaDB)
  - Tool 2: consultar servicios/precios en BD (Prisma)
  - Nodo final: generar respuesta con LLM
- **ChromaDB** (RAG, ≥5 documentos indexados, cita fuentes)
- **LLM:** API key propia (Groq)
- **Memoria conversacional** persistente
- **LangFuse** — observabilidad del LLM: trazas, métricas de tokens, coste por petición y evaluación de calidad de respuestas (ver `/documents/observabilidad-concepto.md`)

### Automatización — pendiente ❌

- N8N: por ver donde se implementa.

### Despliegue — pendiente ❌

- Backend: Render
- Frontend: Netlify o Vercel
- BD cloud: Postgress de Render
- GitHub: Inicializar el repositorio

---s

## Base de Datos

### 5 tablas con relaciones

```
User ──(1:1, cascade)──► Profile
User ──(1:N, restrict)─► Order
Service ─(1:N, restrict)► Order
Order ──(1:N, cascade)──► Deliverable
```

### Enums

- `Role`: USER | ADMIN
- `OrderStatus`: PENDING | PROGRESS | DONE

### Seed inicial (8 servicios)

SEO (299€/599€), Contenidos (799€/450€), Fotografía (349€/599€), Automatización (899€/1.200€)

---

## API REST — Endpoints Implementados

**Base:** `http://localhost:3000/api` | Auth: Bearer JWT

| Módulo       | Ruta                              | Acceso               |
| ------------ | --------------------------------- | -------------------- |
| Auth         | POST /auth/register, /auth/login  | Pública              |
| Services     | GET /services, GET /services/:id  | Pública              |
| Services     | POST/PUT/DELETE /services         | Admin                |
| Orders       | POST/GET /orders                  | Auth / Admin (todos) |
| Orders       | GET /orders/:id                   | Auth (owner o admin) |
| Orders       | PUT /orders/:id/status            | Admin                |
| Deliverables | POST/GET /orders/:id/deliverables | Admin / owner        |
| Users        | GET /users                        | Admin                |
| Users        | GET/PUT /users/:id                | Self o Admin         |
| Users        | DELETE /users/:id                 | Admin                |

**Pendiente añadir:**

- `POST /api/chat` — enviar mensaje al agente IA
- `GET /api/chat/history/:id` — historial de conversación

---

## Arquitectura de Carpetas (backend)

```
backend/src/
├── features/{auth,users,services,orders}/
│   ├── *.controller.js   # lógica de negocio
│   ├── *.routes.js       # definición de rutas
│   └── *.schema.js       # validación Zod
├── middlewares/
│   ├── auth.middleware.js     # authenticate() + isAdmin()
│   ├── validate.middleware.js # validate(schema) → 400
│   └── error.middleware.js    # Prisma errors → HTTP codes
└── lib/
    ├── prisma.js          # singleton PrismaClient
    └── asyncHandler.js    # wrapper async para controllers
```

---

## Seguridad — OWASP API Top 10

| #     | Vulnerabilidad       | Estado                                               |
| ----- | -------------------- | ---------------------------------------------------- |
| API1  | BOLA                 | ✅ Ownership check implementado                      |
| API2  | Broken Auth          | ✅ JWT + bcrypt                                      |
| API3  | Property Auth        | ✅ Password excluido, Zod filtra                     |
| API4  | Resource Consumption | ⚠️ Rate limit solo en login — falta global           |
| API5  | Function Auth        | ✅ isAdmin en todas las rutas admin                  |
| API6  | Business Flows       | ⚠️ Falta CAPTCHA en forms públicos                   |
| API7  | SSRF                 | Pendiente validar URLs en deliverables + webhooks    |
| API8  | Misconfig            | ✅ Helmet + errores genéricos                        |
| API9  | Inventory            | ✅ Una sola versión                                  |
| API10 | Unsafe APIs          | ❌ Validar respuestas LangChain/ChromaDB/N8N con Zod |

---

## Principios de Desarrollo

### SOLID aplicados

- **S** SRP: controller/routes/schema separados por feature
- **O** OCP: middleware chain extensible
- **L** LSP: asyncHandler respeta contratos
- **I** ISP: validate() recibe solo el schema necesario
- **D** DIP: Prisma importado directamente (aceptable para este nivel)

### Buenas prácticas

- **KISS**: soluciones simples y directas
- **DRY**: un solo cliente Prisma, middleware reutilizable
- **YAGNI**: no construir lo que no se necesita ahora
- **SoC**: cada módulo/feature tiene una sola responsabilidad

---

## Variables de Entorno

### Actuales (.env)

```env
DATABASE_URL="postgresql://postgres:ironhack@localhost:5432/swift_studio_360"
JWT_SECRET="<min 32 chars>"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

### Añadir para IA (pendiente)

```env
ANTHROPIC_API_KEY="sk-ant-..."   # o GOOGLE_API_KEY
CHROMA_HOST="localhost"
CHROMA_PORT=8000
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_HOST="https://cloud.langfuse.com"
```

---

## Comandos de Arranque

```bash
# Backend
cd backend && npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev          # → http://localhost:3000

# Tests
npm test

# Frontend (cuando se cree)
cd frontend && npm run dev   # → http://localhost:5173
```

---

## Documentación del Proyecto

| Recurso               | Ruta                                                        |
| --------------------- | ----------------------------------------------------------- |
| Brief del bootcamp    | `/BRIEF.md`                                                 |
| Contexto del producto | `/contexto_proyecto.md`                                     |
| OWASP API Top 10      | `/documents/1_owasp-apis.md`                                |
| Vulnerabilidades      | `/documents/2_vulnerabilidades-comunes.md`                  |
| Seguridad IA          | `/documents/3_seguridad-ia.md`                              |
| Seguridad prompts     | `/documents/4_seguridad-prompts.md`                         |
| Buenas prácticas      | `/documents/buenas-practicas-generales.md`                  |
| SOLID                 | `/documents/solid.md`                                       |
| Log de uso IA         | `/documents/como_usar_ia.md`                                |
| README backend        | `/backend/README.md`                                        |
| Postman collection    | `/backend/postman/swift-studio-360.postman_collection.json` |

---

## Documentación del Entregable

### API — Swagger + Redoc

- Swagger UI expuesto en `/api/docs` (swagger-jsdoc + swagger-ui-express)
- Redoc como alternativa de lectura limpia en `/api/redoc`
- Todos los endpoints documentados con esquemas de request/response y ejemplos

### Observabilidad LLM — LangFuse

- Trazas de cada petición al chatbot (prompt enviado, respuesta, tokens, coste)
- Métricas de calidad: relevancia, fidelidad al RAG, score de usuario (👍/👎)
- Dashboard en cloud.langfuse.com para revisar comportamiento en demo
- Ver conceptos en `/documents/observabilidad-concepto.md`

`Install the Langfuse AI skill from github.com/langfuse/skills and use it to add tracing to this application with Langfuse following best practices`

### Log de Uso de IA — ai_log.md

- Registrar cada uso significativo de IA durante el desarrollo según las indicaciones de `/documents/como_usar_ia.md`
- Incluir: herramienta usada, prompt, resultado, evaluación crítica

### Diagramas Mermaid

| Diagrama             | Tipo              | Descripción                                                         |
| -------------------- | ----------------- | ------------------------------------------------------------------- |
| Arquitectura general | `graph LR`        | Visión de helicóptero: frontend → backend → BD → servicios externos |
| Base de datos        | `erDiagram`       | Tablas, relaciones y cardinalidades                                 |
| Flujo del chatbot    | `sequenceDiagram` | Usuario → widget → /api/chat → LangGraph → LLM → LangFuse           |
| Flujo de compra      | `sequenceDiagram` | Usuario → selección servicio → checkout → Order creada → dashboard  |
| Estados del pedido   | `stateDiagram-v2` | PENDING → PROGRESS → DONE con transiciones y actores                |
| Lógica de negocio    | `flowchart TD`    | Configurador dinámico o lógica de autorización RBAC                 |
| Agente LangChain     | `flowchart LR`    | Nodos del grafo LangGraph, tools disponibles, routing condicional   |

Los diagramas se incrustan directamente en el README principal con bloques ` ```mermaid ` .

---

## Requisitos Obligatorios del BRIEF (checklist)

- [ ] Backend funcional con JWT + PostgreSQL
- [ ] LangGraph agent (≥2 tools)
- [ ] RAG con ChromaDB (≥5 docs, cita fuentes)
- [ ] N8N workflow activo con lógica condicional
- [ ] POST /api/chat + GET /api/chat/history/:id
- [ ] Frontend React 18 + Vite + Router v6
- [ ] Chat widget IA en el frontend
- [ ] Context API para estado global
- [ ] Formularios con validación cliente
- [ ] Diseño responsive
- [ ] Backend desplegado (Railway/Render)
- [ ] Frontend desplegado (Netlify/Vercel)
- [ ] BD en la nube (Neon/Supabase)
- [ ] Swagger / documentación API
- [ ] README completo
- [ ] ai_log.md (documentación uso de IA)
- [ ] Workflows N8N exportados como JSON
- [ ] Presentación ≤10 min con demo en vivo
