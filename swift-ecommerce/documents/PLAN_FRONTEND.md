# Plan de Ejecución Técnico — Swift Studio 360 Frontend
**Fecha:** 2026-06-09 | **Deadline:** 2026-06-15 18:00 (hora canaria)

---

## Contexto

El backend está 100% operativo (Express.js + Prisma + JWT). El frontend existe como scaffold vacío de Vite + React 19 sin ningún código de aplicación. Este plan construye la plataforma eCommerce privada (B2B) de Swift Studio 360: login-gated, con gestión de pedidos, catálogo de servicios, perfil de usuario, chat IA y panel admin. La arquitectura White-Label centraliza todo el contenido de marca en `config/content.js` para que sea 100% reutilizable.

---

## 1. Análisis de Conectividad y Estado

**Decisión: Context API + Axios (wrapper con interceptores)**

- El brief exige Context API → no introducir Redux/Zustand.
- `AuthContext` almacena `{ user, token, login, logout }` — consumido por toda la app.
- Capa de API en `src/api/` — un `client.js` con axios que inyecta automáticamente `Authorization: Bearer <token>` desde `localStorage`.
- Token almacenado en `localStorage` (opción pragmática para el bootcamp). Mitigación: expiración a 7 días, limpieza en logout, nunca en código ni logs.
- Proxy de Vite (`/api → http://localhost:3000`) evita CORS en desarrollo y oculta el origin del backend.

**Custom hooks por dominio:** `useAuth`, `useServices`, `useOrders`, `useChat` — encapsulan lógica de fetch + estado local (loading/error/data).

---

## 2. Reestructuración del Frontend

### Archivos ELIMINADOS del scaffold Vite
```
src/App.css           → eliminado; cada componente usa su propio .module.css co-localizado
public/vite.svg       → ya existía logo-swift.svg en /logo/
```

### Archivos MODIFICADOS
```
src/index.css         → reemplazado con design tokens globales
src/App.jsx           → reemplazado (Router + Providers)
src/main.jsx          → StrictMode + imports de tokens/global
index.html            → título, meta, theme-color, lang="es", Google Fonts
vite.config.js        → alias @, proxy /api, path imports
```

### Estructura de carpetas implementada
```
frontend/src/
├── api/
│   ├── client.js           # axios con interceptores JWT + redirect 401
│   ├── auth.api.js
│   ├── services.api.js
│   ├── orders.api.js
│   ├── users.api.js
│   └── chat.api.js
├── config/
│   └── content.js          # ÚNICO archivo de contenido de marca (White-Label)
├── context/
│   └── AuthContext.jsx
├── hooks/
│   ├── useAuth.js          (pendiente)
│   ├── useServices.js      (pendiente)
│   ├── useOrders.js        (pendiente)
│   └── useChat.js          (pendiente)
├── pages/                  # cada página tiene su propio .module.css co-localizado
│   ├── Auth/
│   │   ├── LoginPage.jsx + LoginPage.module.css
│   │   └── RegisterPage.jsx + RegisterPage.module.css
│   ├── Dashboard/
│   │   └── DashboardPage.jsx + .module.css
│   ├── Services/
│   │   ├── ServicesPage.jsx + .module.css
│   │   └── ServiceDetailPage.jsx + .module.css
│   ├── Orders/
│   │   ├── OrdersPage.jsx + .module.css
│   │   └── OrderDetailPage.jsx + .module.css
│   ├── Profile/
│   │   └── ProfilePage.jsx + .module.css
│   └── Admin/
│       ├── AdminDashboardPage.jsx + .module.css
│       ├── AdminUsersPage.jsx + .module.css
│       └── AdminServicesPage.jsx + .module.css
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx + .module.css
│   │   ├── Sidebar.jsx + .module.css
│   │   ├── Topbar.jsx + .module.css
│   │   └── ProtectedRoute.jsx
│   ├── ui/                 # design system (cada uno con su .module.css)
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── Spinner/
│   │   ├── Modal/
│   │   └── EmptyState/
│   ├── chat/
│   │   ├── ChatWidget.jsx + .module.css
│   │   ├── ChatMessage.jsx + .module.css
│   │   └── ChatInput.jsx + .module.css
│   └── forms/
│       └── DynamicServiceForm.jsx + .module.css
├── styles/
│   ├── tokens.css          # CSS custom properties globales (design tokens)
│   └── global.css          # reset + tipografía base
├── utils/
│   ├── validators.js
│   ├── formatters.js
│   └── sanitize.js         # DOMPurify wrapper + detección prompt injection
├── router.jsx
├── App.jsx
└── main.jsx
```

---

## 3. Dependencias Instaladas

```bash
npm install react-router-dom axios dompurify clsx date-fns
```

---

## 4. Sistema de Diseño — Paleta y Tipografía

### Paleta (Dark-first, premium agency)

| Token                | Valor           | Uso |
|----------------------|-----------------|-----|
| `--color-bg`         | `#080810`       | Fondo base |
| `--color-surface`    | `#12121E`       | Cards, paneles |
| `--color-surface-2`  | `#1A1A2E`       | Modales, overlays |
| `--color-brand`      | `#6C63FF`       | CTA primary, active states |
| `--color-brand-2`    | `#00D4FF`       | Highlights, links, tags |
| `--color-gradient`   | `135deg, #6C63FF → #00D4FF` | Botones premium |
| `--color-text`       | `#F0F0FF`       | Texto principal |
| `--color-text-muted` | `#8B8B9E`       | Labels, placeholders |
| `--color-success`    | `#00D68F`       | Badge DONE |
| `--color-warning`    | `#FFD166`       | Badge PROGRESS |
| `--color-error`      | `#EF4765`       | Errores, badge PENDING |
| `--color-border`     | `rgba(255,255,255,0.08)` | Bordes sutiles |

### Tipografía (Google Fonts — `index.html`)
- **Headings:** `Space Grotesk` — geométrica, moderna
- **Body:** `Inter` — legible, neutra
- **Monospace:** `JetBrains Mono` — código en chat

### Interacciones por pantalla

| Pantalla | Interacción |
|----------|-------------|
| Login | Frosted-glass card + shimmer gradient en botón + glow en input focus |
| Register | Validación inline en tiempo real + password strength indicator (3 niveles) |
| Dashboard | Staggered entrance animation (fade-in + translate-y escalonado) |
| Services | Tilt card 3D en hover (CSS perspective) + precio reveal |
| Order Detail | Status progress bar animado (PENDING → PROGRESS → DONE) |
| Chat Widget | Slide-up desde esquina + typing indicator + pills de fuentes |
| Botones CTA | Shimmer gradient que recorre el botón en hover |

---

## 5. Estrategia de Seguridad Frontend

- JWT en `localStorage` — expiración 7d, limpiado en logout, nunca en logs ni URLs
- `ProtectedRoute` — redirige a `/login` si no autenticado, a `/dashboard` si no es admin
- `dangerouslySetInnerHTML` **PROHIBIDO** — respuestas IA sanitizadas con DOMPurify
- Validación de inputs en todos los formularios (email, password min 8, required)
- Mensajes de error genéricos — no revelar detalles del backend
- Longitud máxima en chat: 2000 chars + detección de patrones de prompt injection
- Error boundaries para evitar stack traces en producción

---

## 6. Fases de Desarrollo

### ✅ FASE 0 — Setup y Scaffolding — COMPLETADA
- [x] Scaffold limpio, dependencias instaladas
- [x] `index.html`, `vite.config.js`, `tokens.css`, `global.css`
- [x] `config/content.js` (White-Label)
- [x] Capa API completa (`client.js` + 5 módulos)
- [x] `utils/` (validators, formatters, sanitize)
- [x] `AuthContext.jsx`, `router.jsx` con lazy loading
- [x] `main.jsx`, `App.jsx`, `ProtectedRoute.jsx`

---

### ✅ FASE 1 — Autenticación — COMPLETADA
- [x] `LoginPage.jsx` — frosted glass, shimmer button, error handling
- [x] `RegisterPage.jsx` — password strength indicator, validación inline
- [x] Componentes UI base: `Button`, `Input`, `Card`, `Badge` (pulse), `Spinner`, `EmptyState`
- [x] `AuthContext` — `isAuthenticated`, `isAdmin`, persistencia en localStorage
- [x] `ProtectedRoute` — guard auth + guard adminOnly

---

### ✅ FASE 2 — Layout del Dashboard — COMPLETADA
- [x] `AppShell.jsx` — wrapper con Sidebar + Topbar + `<Outlet />`, overlay móvil
- [x] `Sidebar.jsx` — nav links activos (gradient highlight), SVG icons, sección admin, avatar gradient, logout
- [x] `Topbar.jsx` — sticky glassmorphism, título dinámico por ruta, hamburger móvil
- [x] `DashboardPage.jsx` — stats (total/activos/completados), lista recientes, CTA vacío, staggered fadeUp
- [x] `useOrders.js` + `useServices.js` — hooks con loading/error/data
- [x] Build verificado: ✓ 707ms sin errores

**Verificación:** Build OK. Pendiente de probar contra backend en vivo.

---

### ⬜ FASE 3 — Catálogo de Servicios + Checkout
- [ ] `ServicesPage.jsx` — grid 8 servicios, filtro categoría, tilt 3D hover
- [ ] `ServiceDetailPage.jsx` — descripción, precio, `DynamicServiceForm`
- [ ] `DynamicServiceForm.jsx` — renderiza `formConfig.fields` dinámicamente
- [ ] Modal de confirmación + error 409 (pedido duplicado)

**Verificación:** Crear pedido desde UI, verificar en BD.

---

### ⬜ FASE 4 — Panel de Pedidos
- [ ] `OrdersPage.jsx` — lista con status badges animados
- [ ] `OrderDetailPage.jsx` — configData, total, deliverables (links)

**Verificación:** Lista muestra datos reales. Deliverables son clickables.

---

### ⬜ FASE 5 — Perfil de Usuario
- [ ] `ProfilePage.jsx` — form `fullName`, `phone`, `companyName`, `email`
- [ ] Validación inline + feedback de éxito/error

**Verificación:** Editar y refrescar muestra datos actualizados.

---

### ⬜ FASE 6 — Chat Widget IA
- [ ] `ChatWidget.jsx` — floating button + slide-up panel
- [ ] `ChatMessage.jsx` — USER/ASSISTANT, pills de fuentes
- [ ] `ChatInput.jsx` — counter 2000 chars, detección injection, throttle
- [ ] Feedback 👍/👎 por respuesta + typing indicator
- [ ] Sanitización con DOMPurify

**Verificación:** Conversación real contra agente LangGraph.

---

### ⬜ FASE 7 — Panel de Administración
- [ ] Rutas `/admin/*` con guard `isAdmin`
- [ ] `AdminDashboardPage.jsx` — resumen usuarios/pedidos
- [ ] `AdminUsersPage.jsx` — tabla de usuarios
- [ ] `AdminServicesPage.jsx` — CRUD servicios
- [ ] Cambio de estado de pedidos + upload de deliverables

**Verificación:** Admin cambia estado → usuario lo ve. Deliverable añadido → visible.

---

### ⬜ FASE 8 — Polish, Accesibilidad y QA
- [ ] `ErrorBoundary.jsx` en App y páginas críticas
- [ ] Loading skeletons en listas
- [ ] ARIA labels completos
- [ ] Revisión Mobile-First (320px → 1440px)
- [ ] `robots.txt` con `Disallow: /`
- [ ] Limpiar `console.log`
- [ ] Actualizar `ai_log.md`

**Verificación:** Lighthouse ≥ 90 Accessibility. Funcional en móvil 320px.

---

## 7. Verificación End-to-End (flujo completo)

1. `/` → redirige a `/login`
2. Registro → token → `/dashboard`
3. `/services` → selecciona servicio → rellena form → pedido creado
4. `/orders` → pedido aparece en estado PENDING
5. Chat → mensaje → respuesta con fuentes → feedback 👍
6. `/profile` → editar → guardar → datos persistidos
7. Admin: `/admin` → cambia pedido a DONE → añade deliverable
8. Usuario: ve pedido DONE + deliverable con link
9. Logout → token eliminado → `/login`

---

## 8. Formato ai_log (entrada por fase)

```markdown
## 2026-06-XX — Frontend Fase N: [nombre]

- **Herramienta:** Claude Sonnet 4.6 (Claude Code)
- **Contexto:** [qué se construyó]
- **Prompt usado:** [resumen del prompt / role dado]
- **Qué obtuvo:** [componentes/archivos creados]
- **Qué modificó o descartó:** [adaptaciones realizadas]
- **Tiempo con IA:** X min | **Tiempo sin IA (estimado):** X min
- **Aprendizaje:** [concepto nuevo aplicado]
```
