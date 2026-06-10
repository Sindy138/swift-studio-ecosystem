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
- [x] `LoginPage.jsx` — split-panel (brand izquierda + form derecha), light mode, animaciones fadeUp
- [x] `RegisterPage.jsx` — password strength indicator, validación inline
- [x] Componentes UI base: `Button`, `Input`, `Card`, `Badge` (pulse), `Spinner`, `EmptyState`
- [x] `AuthContext` — `isAuthenticated`, `isAdmin`, persistencia en localStorage
- [x] `ProtectedRoute` — guard auth + guard adminOnly

---

### ✅ REDISEÑO VISUAL — COMPLETADO (entre Fase 2 y Fase 3)
- [x] `tokens.css` — paleta light mode: coral `#FE8C7C` + malva `#8A52F7`, mismo naming de variables
- [x] `global.css` — ::selection actualizado a malva
- [x] `Topbar.module.css` — fondo glassmorphism hardcodeado → `color-mix` sobre token
- [x] `Sidebar.module.css` — rgba purples → malva, logo filter para fondo claro
- [x] `Input.module.css` + `Button.module.css` — focus glow rgba → malva
- [x] `LoginPage` — rediseñada: split-panel con brand panel (gradient, stats, orbs) + form panel

---

### ✅ FASE 2 — Layout del Dashboard — COMPLETADA
- [x] `AppShell.jsx` — wrapper con Sidebar + Topbar + `<Outlet />`, overlay móvil
- [x] `Sidebar.jsx` — nav links activos (gradient highlight), SVG icons, sección admin, avatar gradient, logout
- [x] `Topbar.jsx` — sticky glassmorphism, título dinámico por ruta, hamburger móvil
- [x] `DashboardPage.jsx` — stats (total/activos/completados), lista recientes, CTA vacío, staggered fadeUp
- [x] `useOrders.js` + `useServices.js` — hooks con loading/error/data
- [x] Build verificado: ✓ 707ms sin errores

**Verificación:** Build OK. Conectado y probado contra backend en vivo.

---

### ✅ FASE 3 — Catálogo de Servicios + Checkout — COMPLETADA
- [x] `ServicesPage.jsx` — grid 4→2→1 cols, filtro por categoría animado, tilt 3D CSS en hover
- [x] `ServiceDetailPage.jsx` — layout two-col (info sticky + form card), precio con gradient text
- [x] `DynamicServiceForm.jsx` — renderiza `formConfig.fields` dinámicamente (text/number/textarea/select)
- [x] `Modal.jsx` — portal React, overlay blur, escape/click-fuera para cerrar
- [x] Modal de confirmación (nombre + precio) + error 409 (`ERRORS.duplicateOrder`)
- [x] Build verificado: ✓ 128 módulos, 1.16s, sin errores

**Verificación:** Crear pedido desde UI, verificar en BD.

---

### ✅ FASE 4 — Panel de Pedidos — COMPLETADA
- [x] `OrdersPage.jsx` — lista con status badges animados, banner de éxito post-checkout
- [x] `OrderDetailPage.jsx` — stepper visual PENDING/PROGRESS/DONE, configData grid, deliverables como links externos
- [x] `useOrders.js` — hooks `useOrders()` y `useOrder(id)`
- [x] Build verificado: ✓ sin errores

**Verificación:** Lista muestra datos reales. Deliverables son clickables.

---

### ✅ FASE 5 — Perfil de Usuario — COMPLETADA
- [x] `ProfilePage.jsx` — layout two-col (avatar card sticky + form card)
- [x] Avatar con iniciales y gradient brand, rol badge, fecha de alta
- [x] Form con `fullName`, `phone`, `companyName`, `email` — 2 fieldRows
- [x] `isDirty` check (JSON.stringify) — botón Guardar deshabilitado sin cambios
- [x] Botón "Descartar cambios" aparece solo cuando hay cambios sin guardar
- [x] Sincroniza email en AuthContext si cambia
- [x] Build verificado: ✓ 132 módulos sin errores

**Verificación:** Editar y refrescar muestra datos actualizados.

---

### ✅ FASE 6 — Chat Widget IA — COMPLETADA
- [x] `useChat.js` — estado de mensajes, conversationId en sessionStorage, send/feedback/clear
- [x] `ChatWidget.jsx` — FAB flotante bottom-right, panel slide-up con animación spring, header gradient, Escape para cerrar
- [x] `ChatMessage.jsx` — burbuja USER (derecha, brand) vs ASSISTANT (izquierda, surface), source pills, feedback 👍/👎
- [x] `ChatInput.jsx` — textarea auto-resize, throttle 1.5s, detección injection, counter al 80%, Enter/Shift+Enter
- [x] Typing indicator (3 dots bounce animation)
- [x] Unread dot en FAB cuando hay mensajes y panel cerrado
- [x] Lazy-loaded desde AppShell (no impacta bundle inicial)
- [x] Build verificado: ✓ 142 módulos, 2.27s, sin errores

**Verificación:** Conversación real contra agente LangGraph.

---

### ✅ FASE 7 — Panel de Administración — COMPLETADA
- [x] Rutas `/admin/*` con guard `isAdmin` (ya existía en router)
- [x] `AdminDashboardPage.jsx` — 6 stat cards + quick links + tabla últimos 6 pedidos
- [x] `AdminOrdersPage.jsx` (NUEVA) — todos los pedidos, filtros por estado, select inline de cambio de estado, modal entregable (label + URL); join userId→email en frontend
- [x] `AdminUsersPage.jsx` — tabla de usuarios con buscador, delete con confirm Modal, auto-bloqueo si elimina el propio admin
- [x] `AdminServicesPage.jsx` — CRUD completo: create/edit Modal (nombre, descripción, precio, categoría, formConfig JSON), delete confirm Modal
- [x] Sidebar actualizado: 4 links admin (Resumen, Pedidos, Usuarios, Servicios)
- [x] Router actualizado: nueva ruta `/admin/orders`
- [x] Build verificado: ✓ 147 módulos, sin errores

**Verificación:** Admin cambia estado → usuario lo ve. Deliverable añadido → visible.

---

### ✅ FASE 8 — Polish, Accesibilidad y QA — COMPLETADA
- [x] `ErrorBoundary.jsx` — class component con reset + reload, montado en `App.jsx`
- [x] ARIA fix en `Modal.jsx` — `role="dialog"` en `.dialog`, no en overlay; `aria-labelledby`
- [x] `RegisterPage.module.css` — reescrito completo a light mode (eliminada paleta oscura hardcoded)
- [x] `robots.txt` → `Disallow: /` en `frontend/public/`
- [x] `theme-color` en `index.html` corregido a `#f4f4f9`
- [x] Auditoría `console.log` — ninguno en `src/`
- [x] `ai_log.md` actualizado con Fases 7 y 8
- [x] Build final: ✓ 149 módulos, 2.29s, cero errores

**Verificación:** Build limpio. ARIA correcto en Modal. RegisterPage visual coherente con LoginPage.

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
