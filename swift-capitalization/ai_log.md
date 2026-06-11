# AI Log — Swift Capitalization

Registro de sesiones de IA significativas. Formato por entrada: herramienta, contexto, lo implementado, adaptaciones y aprendizaje.

---

## Sesión 1 — Setup, NavBar, Home (Fases 0–2.6)

**Herramienta:** Claude Code (claude-sonnet-4-6)
**Contexto:** Inicio del proyecto. El repo tenía una base de React + Vite con algunas secciones del Home parcialmente implementadas. Se estableció el sistema de diseño completo y se construyó toda la Home sección a sección.

**Lo implementado:**
- Fase 0: limpieza base, estructura de carpetas, `.env.example` con `VITE_N8N_WEBHOOK_URL` y `VITE_HUB_URL`, eliminación de emojis
- Fase 1: NavBar responsive con hamburger menu, glassmorphism, cerrar al cambiar ruta / click fuera / scroll
- Fase 2.1: HeroSection — centrado, CTA único, scroll indicator con `RiBookOpenLine`, clamp() en tipografía
- Fase 2.2: SocialProof — infinite ticker de logos duplicando array en JSX, `translateX(-50%)` seamless loop
- Fase 2.3: Testimonials — glassmorphism cards, avatar 44×44px, `FaStar` amarillo, chevrons de react-icons
- Fase 2.4: ServiceGrid — NO TOCAR (cero cambios)
- Fase 2.5: EngineSection — ICON_MAP string→componente, comparativa `FiXCircle`/`FiCheckCircle`, flex wrap centrado
- Fase 2.6: SEOAuthority — stats planos con gradiente en texto, authority content sin caja, CTA sutil

**Adaptaciones durante la sesión:**
- H1 reducido de `clamp(2rem, 5vw, 4rem)` a `clamp(1.75rem, 3.5vw, 2.8rem)` porque el usuario estaba a zoom 80%
- H2 ajustado a `clamp(1.25rem, 2.2vw, 1.75rem)` para mantener jerarquía tipográfica
- Hero padding cambiado a `min-height: 80vh; padding: 0` (ajuste manual del usuario en IDE)
- Logo hover: eliminado grayscale, reemplazado por `scale(1.1)` color siempre visible
- `.authority-cta-section` padding lateral corregido a `0` (el container ya provee los 2rem)
- Background del hero NO se modificó (error inicial revertido — el plan decía conservarlo)

**Aprendizaje:**
- Siempre verificar el plan antes de añadir cambios no solicitados
- El usuario trabaja con zoom del navegador — verificar tamaños al 100%
- Padding vertical preferido sobre margin para secciones alternantes (el background se extiende)

---

## Sesión 2 — Footer, Quiénes Somos, Service Pages, Blog (Fases 3–6)

**Herramienta:** Claude Code (claude-sonnet-4-6)
**Contexto:** Continuación tras resumen de contexto. Sistema de diseño ya establecido. Se construyeron las páginas internas del sitio.

**Lo implementado:**

### Fase 3 — Footer
- 3 columnas: brand (logo + tagline + redes) + Servicios + Empresa
- `FaInstagram`, `FaLinkedin`, `FaFacebook` con hover `color: #aa73fa`
- Underline animado en nav links via pseudo-elemento `::after`
- `HUB_URL` desde `import.meta.env.VITE_HUB_URL`

### Fase 4 — Quiénes Somos (`/quienes-somos`)
- Hero blanco centrado, headline con `headlineAccent` en gradiente de marca
- Sección Origen: dark + dotted, 2 columnas (texto + stat glassmorphism)
- Sección Perfil: light, 2 columnas, `border-image` gradiente en cabecera de área
- Sección Filosofía: dark + dotted, glassmorphism cards con `useInView` stagger
- CTA: caja sutil con gradiente a `/contacto`
- Hook `useInView.js` creado: IntersectionObserver + disconnect una vez visible
- JSON-LD `AboutPage`

### Fase 5 — Service Pages (`/servicios/:slug`)
- 5 servicios en `content.js`: `seo`, `social-media`, `fotografia`, `content`, `automatizacion`
- Template único `ServicioDetailPage.jsx` con 6 secciones: Hero → Problema → Solución → Proceso → Resultados → CTA
- Hero con `serviceTag` coloreado por servicio (color propio de cada uno)
- Sección Problema: glassmorphism + `FiAlertTriangle` rojo
- Proceso: stepper 4 pasos en grid, línea conectora via `::before`
- Resultados: stats planos (mismo estilo SEOAuthority)
- `ICON_MAP` string→componente en el template
- JSON-LD `Service` por página
- `ServiciosPage.jsx`: listing con cards glassmorphism sobre dark
- `ScrollToTop.jsx`: componente que escucha `pathname` y hace `window.scrollTo(0,0)` — resuelve el scroll no resetear en SPA

### Fase 6 — Blog (`/blog` + `/blog/:slug`)
- Artículos en archivos `.md` en `src/content/blog/` (3 artículos iniciales)
- `import.meta.glob` con `query: '?raw', import: 'default'` para cargar markdown como string
- `src/utils/blog.js`: parser de frontmatter custom (sin dependencia gray-matter), `marked` para MD→HTML, `DOMPurify` para sanitizar el output
- `getAllPosts()` y `getPostBySlug(slug)` como utilidades
- `BlogPage`: hero dark editorial, filtros sticky por categoría (Todos/Estrategia/Visual/Automate), cards con animación
- `BlogPostPage`: hero dark, prose con `:global()` selectors en CSS Module para estilos del markdown renderizado, JSON-LD `BlogPosting`, CTA al hub
- Paquetes instalados: `marked@18`, `dompurify@3`

**Adaptaciones durante la sesión:**
- Blog decidido como markdown estático en `/src/content/blog/` (no CMS headless) para el MVP — CMS headless queda como mejora futura
- `ScrollToTop` añadido al identificar que React Router no resetea el scroll en navegación SPA

**Aprendizaje:**
- En CSS Modules, el selector `.input:focus ~ .label` funciona correctamente porque ambas clases son del mismo módulo — el compilador mantiene la relación de hermanos
- `import.meta.glob` con `as: 'raw'` está deprecado en Vite 5+ — usar `query: '?raw', import: 'default'`
- `marked.parse()` en v18 es síncrono por defecto si no hay hooks async registrados

---

## Sesión 3 — Formulario de Contacto + n8n (Fase 7)

**Herramienta:** Claude Code (claude-sonnet-4-6)
**Contexto:** El usuario tiene plantillas de email en Resend para cada tema del formulario y la API key de Resend configurada en n8n. El frontend solo envía a n8n via webhook.

**Lo implementado:**

### Fase 7 — Contacto (`/contacto`)

**Campos del formulario:**
- Nombre (required), Email (required), Empresa (optional), Tema (required — pills visuales)

**6 temas disponibles (pills radio):**
- Solicitar presupuesto, Reservar una cita, SEO, Automatizaciones, Fotografía, Contenido

**Seguridad y validación:**
- Regex email RFC-compliant: `/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@.../`
- Whitelist de temas con `Set` — si el valor no está en el Set, falla la validación
- Regex nombre: solo letras, espacios, tildes, guiones y apóstrofes
- Límites de longitud: nombre ≤ 100, email ≤ 254 (límite RFC), empresa ≤ 100
- Sanitización antes del envío: `trim()` + eliminación de `<>"'\`` + truncado a 500 chars
- Honeypot: campo oculto `name="website"` con `tabIndex="-1"` y `aria-hidden` — si tiene valor, finge éxito sin enviar
- Protección doble envío: `useRef(false)` que se activa al primer submit y bloquea reenvíos

**UX del formulario:**
- Labels flotantes CSS puro: `input:not(:placeholder-shown) ~ label` + `input:focus ~ label`
- `placeholder=" "` (espacio) necesario para que el selector `:not(:placeholder-shown)` funcione
- Estado loading: spinner `FiRefreshCw` con `@keyframes spin`, botón deshabilitado
- Estado éxito: reemplaza el formulario con mensaje personalizado por tema + link a servicios
- Estado error: banner `FiAlertCircle` con opción de reintentar

**Payload enviado a n8n:**
```json
{ "nombre": "...", "email": "...", "empresa": "...", "tema": "seo" }
```

**Arquitectura Resend:**
- La API key de Resend NO va en `.env` de este repo — va en n8n como credencial
- n8n recibe el webhook → Switch por `tema` → Resend envía email al lead + notificación interna

**Archivos creados:**
- `src/pages/ContactoPage.jsx`
- `src/pages/styles/ContactoPage.module.css`

**Aprendizaje:**
- El honeypot debe tener `aria-hidden="true"` y estar fuera del flujo visual real — no solo `display:none` para que screen readers tampoco lo lean
- La whitelist de temas con `Set` es más segura que comparar strings directamente porque evita manipulación del payload desde DevTools antes del envío
- `useRef` para bloquear doble envío es preferible a `useState` para evitar re-renders innecesarios durante el submit

---

## Sesión 4 — Integración n8n + Resend + SEO Global (Fase 7 finalización + Fase 8)

**Herramienta:** Claude Code (claude-sonnet-4-6)
**Contexto:** Continuación tras resumen de contexto. Fase 7 ya implementada en frontend. Se resolvieron los problemas de integración con n8n y se completó la Fase 8 de SEO global.

**Lo implementado:**

### Fase 7 — Integración n8n (resolución de problemas)

**Instalación del nodo Resend en n8n:**
- El directorio `C:\Users\SINDY\.n8n\nodes\node_modules\n8n-nodes-resend\` existía vacío (instalación previa fallida)
- Se eliminó el directorio vacío y se reinstalló desde la terminal: `npm install n8n-nodes-resend` en `C:\Users\SINDY\.n8n\nodes\`
- Resultado: 94 paquetes instalados, nodo disponible en n8n tras reiniciar

**Configuración del workflow n8n:**
- Webhook recibe POST con `{ nombre, email, empresa, tema }`
- Nodo Switch con `{{ $json.body.tema }}` (no `$json.tema` — el body llega anidado bajo `.body`)
- Nodo Resend por cada rama: Operation "Send", From `onboarding@resend.dev` (sender verificado de prueba), To `{{ $('Webhook').item.json.body.email }}`
- Subject: vacío — Resend usa el subject de la plantilla automáticamente
- Template Variables: `nombre` → `{{ $json.body.nombre }}`
- Variables en plantilla Resend con triple llave: `{{{nombre}}}`

**Problemas resueltos:**
- CORS error + preflight 404: la URL del webhook era `/webhook-test/leads` (solo escucha activamente). Solución: activar el workflow y usar `/webhook/leads` en el `.env`
- Switch sin outputs: condición usaba `$json.tema` en lugar de `$json.body.tema`

### Fase 8 — SEO Global y Optimización

**Paquete instalado:** `react-helmet-async`

**Arquitectura SEO:**
- `HelmetProvider` en `src/main.jsx` envuelve toda la app
- Componente compartido `src/components/SEO.jsx` con props: `title`, `description`, `canonical`, `ogType`, `jsonLd`
- Genera automáticamente: `<title>`, `<meta description>`, canonical, Open Graph completo (5 tags), Twitter Card (3 tags), JSON-LD opcional
- Formato de título: `"Nombre página | Swift Studio"`

**Meta tags únicos por página:**
| Página | Title | JSON-LD |
|---|---|---|
| Home `/` | Agencia de Marketing Digital & Automatización | LocalBusiness |
| Quiénes Somos | Quiénes Somos — Agencia Digital Híbrida | AboutPage |
| Servicios `/servicios` | Servicios de Marketing Digital | — |
| ServicioDetail `/servicios/:slug` | Desde `meta.title` en `content.js` | Service |
| Blog `/blog` | Blog de Marketing Digital | — |
| BlogPost `/blog/:slug` | Desde frontmatter del markdown | BlogPosting |
| Contacto `/contacto` | Contacto — Solicita Presupuesto | — |

**Migración de JSON-LD:**
- JSON-LD inline con `dangerouslySetInnerHTML` eliminado de: `SEOAuthority.jsx`, `QuienesSomosPage.jsx`, `ServicioDetailPage.jsx`, `BlogPostPage.jsx`
- Todos migrados al prop `jsonLd` del componente `SEO.jsx` — se inyectan en `<head>` via Helmet

**`index.html` actualizado:**
- `lang="en"` → `lang="es"`
- `<title>` genérico → título y meta description base reales

**`public/sitemap.xml` creado:**
- 13 URLs: home, quienes-somos, servicios, 5 service pages, blog, 3 blog posts, contacto
- `priority` y `changefreq` diferenciados por tipo de página
- `lastmod` en artículos de blog

**`public/robots.txt` creado:**
- `User-agent: * / Allow: /`
- Referencia al sitemap

**Archivos creados/modificados:**
- `src/components/SEO.jsx` (nuevo)
- `src/main.jsx` (HelmetProvider)
- `index.html` (lang + meta base)
- `src/pages/HomePage.jsx` (SEO + LocalBusiness LD)
- `src/pages/QuienesSomosPage.jsx` (SEO + AboutPage LD migrado)
- `src/pages/ServiciosPage.jsx` (SEO)
- `src/pages/ServicioDetailPage.jsx` (SEO + Service LD migrado)
- `src/pages/BlogPage.jsx` (SEO)
- `src/pages/BlogPostPage.jsx` (SEO + BlogPosting LD migrado)
- `src/pages/ContactoPage.jsx` (SEO)
- `src/components/home/SEOAuthority.jsx` (eliminado JSON-LD inline)
- `public/sitemap.xml` (nuevo)
- `public/robots.txt` (nuevo)

**Aprendizaje:**
- En n8n, los datos del body de un webhook POST llegan siempre bajo `$json.body.*`, no directamente en `$json.*`
- El campo Subject del nodo Resend puede dejarse vacío cuando se usa template — Resend usa el subject definido en la plantilla, con variables sustituidas
- El sender de Resend debe ser de un dominio verificado; `onboarding@resend.dev` sirve para testing sin dominio propio
- Migrar JSON-LD a Helmet garantiza que siempre va en `<head>` — los scripts inline dentro del `<body>` JSX son válidos pero no siguen el estándar
