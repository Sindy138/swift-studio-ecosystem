# PLAN DE ACCIÓN — Swift Capitalization

Web de captación y SEO de Swift Studio. Frontend React puro, sin backend.
Objetivo dual: **máximo posicionamiento en Google** + **diseño de vanguardia** que impacte visualmente.

---

## IDENTIDAD VISUAL (conservar siempre)

### Paleta de colores — NO modificar

```css
/* Gradiente de marca — usar en CTAs, hovers, acentos */
--gradient-brand: linear-gradient(90deg, #ffae8e, #ff7da2, #aa73fa);

/* Colores base */
--color-base: #202020; /* fondo dark (testimonials, engine) */
--color-dark: #2c3e50; /* azul oscuro (engine background) */
--color-primary: #ff6b6b; /* coral/rojo */
--color-secondary: #4ecdc4; /* turquesa */
--color-accent: #ffe66d; /* amarillo */
--color-purple: #7d7aff; /* violeta (nombres de autores) */
--color-bg: #ffffff; /* fondo general */
```

### Tipografía — NO modificar

```css
--font-heading: "Inter", system-ui, -apple-system, sans-serif;
--font-family-sans: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

/* Escalas responsive (clamp) ya definidas en index.css */
h1: clamp(2rem, 5vw, 3.5rem) — font-weight 500 — letter-spacing -0.025em
h2: clamp(1.5rem, 3.5vw, 2.5rem) — font-weight 700 — letter-spacing -0.02em
```

### Efectos de diseño existentes — mantener y extender

- **Glassmorphism**: `background: rgba(255,255,255,0.11)` + `backdrop-filter: blur()` — usar en secciones dark
- **Dotted pattern**: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)` — fondo de secciones dark
- **Gradiente de marca en hover**: todos los elementos interactivos usan el gradiente `#ffae8e → #ff7da2 → #aa73fa`

### Iconos — REGLA FIJA

- **Solo react-icons o Lucide React** — instalar si no está disponible
- **Cero emojis** en el código (ni en JSX ni en CSS ni en content.js)
- Reemplazar todos los ❌ ✅ 📊 🔗 etc. existentes por iconos de react-icons

---

## REGLAS GLOBALES DE DESARROLLO (aplicar siempre, en todas las fases)

### 1. Coherencia de diseño entre páginas

Todas las páginas del sitio (Quiénes Somos, Servicios, Blog, Contacto) deben seguir el mismo lenguaje visual que la Home:

- Misma paleta de colores y gradiente de marca
- Misma tipografía (Inter / Segoe UI) y escalas con `clamp()`
- Mismos efectos: glassmorphism en secciones dark, dotted pattern, hover en gradiente de marca
- Alternancia de secciones blancas y dark (igual que en Home)
- Mismos estilos de botón, card, y navegación
- Microanimaciones de entrada con el mismo patrón `fadeInUp` + `IntersectionObserver`

Antes de empezar cualquier página nueva, revisar cómo luce la Home y asegurarse de que la nueva página se siente parte del mismo sistema. Los componentes compartidos (NavBar, Footer, botones, cards) son los mismos en todas partes.

### 2. Tipografía y medidas fluidas — regla de clamp()

`clamp()` se aplica **únicamente** a:

- `font-size` — siempre
- `gap` — siempre
- Tamaño del **logo** — única excepción de elemento visual con clamp

Todo lo demás usa valores fijos:

```
VALORES FIJOS (no usar clamp): border-radius, margin, padding, width/height de imágenes, tamaño de iconos, min-height, max-width, line-height
```

Ejemplos de aplicación correcta:

```css
/* OBLIGATORIO con clamp */
font-size: clamp(1rem, 2.5vw, 1.25rem);
font-size: clamp(2rem, 5vw, 3.5rem);
gap: clamp(1rem, 3vw, 2rem);
width: clamp(150px, 20vw, 280px); /* solo para el logo */

/* VALORES FIJOS — correcto */
padding: 1.5rem 2rem;
margin-bottom: 2rem;
border-radius: 12px;
min-height: 80vh;
max-width: 1200px;
```

---

## CRITERIOS DE DISEÑO VANGUARDISTA (aplicar en todas las fases)

- Layout asimétrico — romper grids convencionales donde aporte
- Tipografía editorial: tamaños extremos, pesos variables, tracking amplio
- Espaciado generoso (whitespace como elemento visual)
- Glassmorphism en secciones oscuras (ya establecido en testimonials)
- Formas con `clip-path` para separar secciones de forma orgánica
- Mezcla de fondos: secciones blancas alternadas con dark (`#202020` / `#2c3e50`)

---

## MICROANIMACIONES (incluir durante cada fase — NO al final)

### A implementar con CSS puro (IntersectionObserver + clases CSS)

- Aparición en viewport: `opacity: 0 → 1` + `translateY(30px → 0)` en stagger
- Hover en botones: `translateY(-2px)` + sombra
- Hover en cards: elevación + `scale(1.01)`
- Links de nav: underline animado con pseudo-elemento
- Inputs: `border-color` transition + label flotante

### Animaciones complejas — BACKLOG (no bloquean MVP)

- Scroll-triggered con GSAP ScrollTrigger (parallax, pin sections)
- Page transitions con Framer Motion `AnimatePresence`
- Split-text / typewriter en hero headline
- Contadores animados en KPI stats
- SVG animados en sección de proceso
- Fondo mesh gradient animado
- Cursor personalizado en hero
- Fondo de partículas interactivo (Three.js / tsParticles)
- Lottie animations en iconos
- Morphing entre secciones

---

## RESPONSIVE — PRIORIDAD TRANSVERSAL

El responsive **no está implementado correctamente** actualmente. Aplicar en cada componente que se toque:

### Breakpoints

```css
/* Mobile: hasta 480px */
/* Tablet: 481px — 768px */
/* Desktop: 769px+ */
```

### Navbar mobile — pendiente de implementar

- El navbar actual en mobile hace wrap del menú (no es válido para producción)
- Implementar hamburger menu: botón + menú desplegable overlay
- Animación de apertura: `translateY` + `opacity`
- Cerrar al hacer click en un link

### Reglas generales responsive por sección

- Grids de N columnas → 2 columnas en tablet → 1 columna en mobile
- Tipografía con `clamp()` — ya definida en index.css, asegurarse de usarla
- CTAs en mobile: `width: 100%` o al menos `min-width: 280px`
- Imágenes: `width: 100%` + `height: auto` + `object-fit: cover`
- Secciones con padding lateral mínimo de `1rem` en mobile
- Infinite ticker: reducir velocidad en mobile para mejor legibilidad

---

## FASE 0 — Setup y limpieza base

> Objetivo: dejar el proyecto en estado limpio y preparado para construir encima

**Tareas:**

- [ ] Instalar `react-icons` (o Lucide React) si no están disponibles
- [ ] Auditar y limpiar imports huérfanos en componentes existentes
- [ ] Configurar React Router v7 con todas las rutas (aunque páginas estén vacías)
- [ ] Crear estructura de carpetas definitiva: `pages/`, `components/shared/`, `hooks/`, `utils/`
- [ ] Crear `.env` y `.env.example` con `VITE_N8N_WEBHOOK_URL` y `VITE_HUB_URL`
- [ ] Verificar que `.env` está en `.gitignore`
- [ ] Crear `src/config/routes.js` — rutas centralizadas
- [ ] Reemplazar todos los emojis en `content.js` y componentes por strings vacíos o por nombres de icono para mapear con react-icons

**Entregable:** proyecto arranca sin errores, rutas configuradas, cero emojis en código.

---

## FASE 1 — NavBar (conservar estética + añadir hamburger mobile)

> NavBar actual está bien en desktop — CONSERVAR diseño, solo añadir responsive mobile

**Desktop — conservar:**

- Glassmorphism actual (`rgba(255,255,255,0.65)` + `backdrop-filter: blur(10px)`)
- Logo SVG
- Links con hover en gradiente de marca
- Botón 360º con gradiente de marca
- Sticky

**Mobile — implementar hamburger menu (actualmente no existe):**

- [ ] Botón hamburger visible en `≤ 768px`: tres líneas → X animado con CSS
- [ ] Menú como overlay full-width o sidebar que aparece desde arriba con `translateY`
- [ ] Links del menú: tamaño grande, espaciado generoso, fáciles de tapear
- [ ] Cerrar al hacer click en enlace
- [ ] Cerrar al hacer click fuera del menú
- [ ] Botón 360º visible dentro del menú mobile

**Entregable:** NavBar funcional en todos los breakpoints, hamburger animado en mobile.

---

## FASE 2 — Home (sub-fases, una por una)

> Hacer cada sub-fase por separado. No pasar a la siguiente hasta que la anterior esté completa y verificada en el navegador.

---

### FASE 2.1 — HeroSection

**Cambios concretos sobre el código actual:**

- [ ] Centrar el texto: `text-align: center` + `align-items: center` en `.hero-content`
- [ ] Eliminar el botón secundario "Ver demo" (solo dejar CTA primario)
- [ ] Scroll indicator: eliminar el texto "Scroll para explorar" — mantener solo el icono
- [ ] Icono del scroll: reemplazar el SVG de chevron actual por icono `BookOpen` de react-icons con animación `bounce`
- [ ] Aplicar `clamp()` en `font-size` del headline y subheadline — usar las escalas de `index.css`
- [ ] Verificar animaciones `fadeInUp` escalonadas en headline → subheadline → CTA
- [ ] Responsive: CTA a `width: 100%` en mobile (≤ 480px)

**Conservar:**

- Background dinámico (image/video) y overlay
- Gradiente de marca en el CTA
- Lógica `backgroundType` de `content.js`

---

### FASE 2.2 — SocialProof: Infinite Ticker de logos

**Cambios concretos sobre el código actual:**

- [ ] Eliminar el `.logos-grid` actual (CSS grid)
- [ ] Implementar Infinite Ticker: `overflow: hidden` + lista de logos duplicada + `@keyframes ticker` con `translateX(-50%)` en loop continuo
- [ ] Velocidad: `animation-duration: 30s` en desktop, `20s` en mobile
- [ ] Logos con `filter: grayscale(1)` → `grayscale(0)` en hover, con `transition`
- [ ] Duplicar el array de logos en el JSX para efecto seamless
- [ ] Responsive: verificar que el ticker no corta logos en mobile

---

### FASE 2.3 — SocialProof: Testimonials

**Cambios concretos sobre el código actual:**

Cards:

- [ ] Suavizar `border-radius` de `.testimonial-section` y `.testimonial-card` → `border-radius: 3px`
- [ ] Añadir avatar circular al lado del autor: `<img>` con `border-radius: 50%`, tamaño fijo `44px × 44px`
- [ ] `.testimonial-author`: `display: flex`, `align-items: center`, `gap` entre avatar y bloque nombre+rol
- [ ] Añadir campo `avatar` en los testimonials de `content.js` (usar placeholder si no hay foto real)
- [ ] `font-size` de quote y nombre con `clamp()`

Navegación (reemplazar ← →):

- [ ] Eliminar caracteres `←` `→` de los botones
- [ ] Añadir `ChevronLeft` / `ChevronRight` de react-icons dentro de los botones
- [ ] Botones: `border-radius: 0`, `border: 1px solid rgba(255,255,255,0.2)`, fondo transparente, hover con gradiente de marca

Estrellas:

- [ ] Reemplazar el emoji ⭐ por icono `FaStar` de `react-icons/fa` con `color: #ffe66d`

**Conservar:**

- Fondo `#202020`, glassmorphism, dotted pattern
- Lógica de carousel (prev/next, índice, slice)
- Color `#7d7aff` en nombre del autor

Responsive:

- [ ] Grid de testimonials → 2 cols en tablet → 1 col en mobile
- [ ] Botones de navegación visibles y con tamaño de tap adecuado en mobile (mínimo 44px)

---

### FASE 2.4 — ServiceGrid

> **NO TOCAR. Cero cambios. Pasar directamente a 2.5.**

---

### FASE 2.5 — EngineSection

> Actualmente: emojis como íconos, tabla comparativa básica, sección dark correcta

**Cambios concretos sobre el código actual:**

- [ ] `content.js`: reemplazar emojis en `advantage.icon` por claves de nombre de icono (ej: `"TrendingUp"`) y crear un mapa en el componente que resuelve `nombre → componente react-icons`
- [ ] `.advantage-card`: `text-align: left`, icono grande (fijo, ej: 32px) arriba-izquierda con `background: var(--gradient-brand)` en `background-clip: text`
- [ ] `font-size` de título y descripción de la card con `clamp()`
- [ ] Tabla comparativa: reemplazar ❌ por `XCircle` (color `#ff6b6b`) y ✅ por `CheckCircle` (color `#4ecdc4`) de react-icons
- [ ] Comparativa: dos columnas con línea divisoria `1px solid rgba(255,255,255,0.15)` central, header de cada columna con `border-bottom` en su color de marca
- [ ] CTA section: más espacio vertical, `font-size` del texto con `clamp()`, botón más prominente
- [ ] Responsive: 4 cards → grid 2×2 en tablet → 1 col en mobile; comparación 2 cols → 1 col en mobile

**Conservar:**

- Fondo dark `#2c3e50`, glassmorphism, dotted SVG pattern

---

### FASE 2.6 — SEOAuthority

> Actualmente: stat cards blancas con borde superior coloreado, bloque de texto con caja, CTA básico

**Cambios concretos:**

- [ ] Centrar título y subtítulo + `margin-bottom: 4rem` para separarlo de los elementos de abajo
- [ ] Eliminar stat cards completamente → métricas en plano: flex row centrado, sin fondo/borde/sombra. `.stat-metric` con gradiente de marca (`background-clip: text`), `.stat-label` uppercase
- [ ] Authority content: quitar background, border y border-radius → texto centrado en plano, `font-size: clamp(1rem, 2vw, 1.25rem)`, `max-width: 720px`, `margin: 0 auto`
- [ ] CTA: igual al CTA de ServiceGrid — subtle gradient bg, h3, botón con gradiente de marca, `border-radius: 3px`
- [ ] Mismo sistema de márgenes y padding vertical que el resto: `max-width: 1500px; padding: 5rem 2rem` — mobile `1.25rem`
- [ ] JSON-LD: conservar exactamente tal cual, mover a `<Helmet>` solo en Fase 8

---

## FASE 3 — Footer — rediseño vanguardista

> Actualmente: footer simple con grid de 4 columnas de links

**Cambios concretos:**

- [ ] Fondo: mantener dark pero usar `#202020` en lugar del degradado `#2c3e50 → #34495e` para coherencia con la sección de testimonials
- [ ] Layout superior: logo + tagline a la izquierda, links de navegación agrupados a la derecha
- [ ] Añadir iconos de redes sociales de react-icons (`FaInstagram`, `FaLinkedin`, `FaFacebook`) en lugar de texto plano — con hover en gradiente de marca
- [ ] Separador: línea fina `rgba(255,255,255,0.08)` antes del copyright
- [ ] Copyright: añadir link al hub 360º — "Acceder a Swift Studio 360º →"
- [ ] Quitar `margin-top: 4rem` — el espaciado lo gestiona la sección anterior
- [ ] Responsive: 4 cols → 2 cols en tablet → 1 col en mobile, redes sociales en fila horizontal siempre

---

## FASE 4 — The Origin (Quiénes somos)

> Página narrativa que construye autoridad y confianza

**Estructura de la página:**

- [ ] Hero: headline narrativo con tipografía editorial grande + imagen o elemento visual
- [ ] Historia / origen: texto con énfasis tipográfico, sin bloques de texto planos
- [ ] Perfil híbrido Marketing + FullStack: visualización de habilidades o enfoque diferencial
- [ ] Filosofía de trabajo: 3-4 principios con cards o timeline — iconos react-icons
- [ ] CTA final hacia `/contacto`
- [ ] Meta tags únicos
- [ ] JSON-LD `AboutPage`
- [ ] Microanimaciones: aparición en viewport con IntersectionObserver
- [ ] Responsive completo

**Entregable:** `/quienes-somos` completa con diseño editorial y SEO configurado.

---

## FASE 5 — Service Pages

> Página template por servicio con flujo de conversión claro

**Servicios (un slug por servicio):**

- `seo-posicionamiento`
- `social-media-community`
- `fotografia-profesional`
- `content-blogs`
- `automatizacion-n8n`

**Estructura de cada página (template único):**

- [ ] Hero: nombre del servicio + problema que resuelve (tipografía grande, sin emojis)
- [ ] Sección Problema: pain points del cliente (iconos react-icons)
- [ ] Sección Solución: qué ofrece Swift Studio
- [ ] Sección Proceso: timeline o stepper visual — iconos react-icons
- [ ] Resultados / métricas clave
- [ ] CTA al hub privado (`import.meta.env.VITE_HUB_URL`)
- [ ] Meta tags únicos por servicio (desde `content.js`)
- [ ] JSON-LD `Service`
- [ ] Microanimaciones: timeline steps en secuencia
- [ ] Responsive completo

**Entregable:** 5 service pages generadas desde el mismo template + datos en `content.js`.

---

## FASE 6 — Blog SEO Engine

> Sistema de blog categorizado para posicionamiento orgánico

**Verticales:** Estrategia · Visual · Automate

**Tareas:**

- [ ] `/blog`: grid de artículos con filtro por vertical
  - Cards: sin emojis, iconos de categoría con react-icons, diseño editorial
  - Filtros con transición animada (fade + scale)
- [ ] `/blog/:slug`: artículo individual
  - Hero con imagen de portada
  - HTML sanitizado con DOMPurify si el contenido viene de CMS
  - Artículos relacionados al final
  - JSON-LD `BlogPosting`
  - Meta tags y OG únicos por artículo
- [ ] Contenido inicial: mínimo 3 artículos (uno por vertical)
- [ ] Microanimaciones: cards en stagger, filtros con fade
- [ ] Responsive completo

**Nota:** sin backend, el contenido del blog es estático en `content.js` o archivos markdown en `/src/content/blog/`.

**Entregable:** `/blog` funcional con filtros, 3 artículos, SEO configurado.

---

## FASE 7 — Formulario de Contacto + n8n + Resend ✅ COMPLETADA

> Captura de leads con envío automático de email personalizado al lead según el tema seleccionado

### Campos del formulario

| Campo                     | Tipo        | Requerido     |
| ------------------------- | ----------- | ------------- |
| Nombre                    | text        | Sí            |
| Email                     | email       | Sí            |
| Empresa                   | text        | No (opcional) |
| ¿En qué podemos ayudarte? | radio pills | Sí            |

**6 temas disponibles (pills radio visuales):**

- Solicitar presupuesto · Reservar una cita · SEO · Automatizaciones · Fotografía · Contenido

### Lo implementado

- [x] Hero blanco — label + H1 + subheadline, mismo sistema que Quiénes Somos
- [x] Layout dos columnas: izquierda (proceso 01/02/03) + derecha (tarjeta del form)
- [x] Labels flotantes con CSS puro — `input:not(:placeholder-shown) ~ label` + `input:focus ~ label`
- [x] 6 pills de tema como radio buttons visualmente estilizados
- [x] Validación robusta en cliente:
  - Regex email RFC-compliant (longitud ≤ 254)
  - Whitelist de temas con `Set` — previene valores manipulados
  - Regex nombre: solo letras, tildes, espacios y guiones
  - Límites de longitud en todos los campos
  - Trim en todos los valores antes de validar
- [x] Sanitización antes del envío: `trim()` + eliminación de `<>"'\`` + truncado
- [x] Honeypot: campo `name="website"` oculto con `tabIndex="-1"` y `aria-hidden` — bot → finge éxito sin enviar
- [x] Protección doble envío con `useRef` (bloquea reenvíos sin re-renders extra)
- [x] Estado loading: `FiRefreshCw` con `@keyframes spin`, botón deshabilitado
- [x] Estado éxito: reemplaza el form con mensaje personalizado por tema + link a `/servicios`
- [x] Estado error: banner con `FiAlertCircle` y opción de reintentar
- [x] `fetch` POST a `import.meta.env.VITE_N8N_WEBHOOK_URL` con `{ nombre, email, empresa, tema }`
- [x] Responsive completo

### Workflow n8n

> **PENDIENTE: generar guía paso a paso detallada al configurar n8n.**

Lógica del workflow:

1. **Trigger — Webhook POST** recibe `{ nombre, email, empresa, tema }`
2. **Nodo Switch** — 6 ramas según valor de `tema` (presupuesto, cita, seo, automatizaciones, fotografia, contenido)
3. **Nodo Resend** — envía email al lead con la plantilla correspondiente al tema (plantillas ya creadas en Resend)
4. **Nodo Resend** — notificación interna al equipo con los datos del lead
5. **Respuesta HTTP 200** al frontend

### Resend — configuración

- La API key de Resend **NO va en el `.env` de este repo** — va en n8n como credencial
- En n8n: Credentials → New → "Resend" → pegar `re_xxxxxxxxx`
- Variable de entorno de este repo:

```
VITE_N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/leads
```

**Entregable:** ✅ `/contacto` funcional con validación robusta, honeypot, 6 temas, estados de UX completos.

---

## FASE 8 — SEO Global y Optimización

> Toda la web optimizada para indexación en Google

**Tareas:**

- [ ] Instalar y configurar `react-helmet-async`
- [ ] Meta tags únicos en cada página: title, description, canonical
- [ ] Open Graph por página: og:title, og:description, og:image, og:url
- [ ] Completar todos los JSON-LD: `LocalBusiness`, `Service`, `BlogPosting`, `AboutPage`
- [ ] `sitemap.xml` generado y accesible en `/sitemap.xml`
- [ ] `robots.txt` configurado
- [ ] Imágenes: `alt` descriptivo en todos los `<img>`, WebP donde sea posible, lazy loading
- [ ] Auditoría Lighthouse: objetivo SEO ≥ 90, Performance ≥ 80 en todas las páginas clave
- [ ] Verificar React Router + Netlify/Vercel redirects (no 404 en rutas directas)

**Entregable:** Lighthouse SEO ≥ 90 en todas las páginas principales.

---

## FASE 9 — Despliegue

> Web en producción

**Tareas:**

- [ ] Elegir plataforma: Netlify o Vercel
- [ ] Variables de entorno en panel de la plataforma (no en archivos)
- [ ] `_redirects` (Netlify) o `vercel.json`: redirigir todas las rutas a `index.html`
- [ ] Headers de seguridad en `netlify.toml` o `vercel.json`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Verificar CTAs al hub privado apuntan a URL de producción
- [ ] Verificar formulario contra n8n en producción
- [ ] Configurar dominio personalizado (si aplica)

**Entregable:** web pública y accesible, formulario operativo.

---

## BACKLOG — Animaciones complejas (extras post-MVP)

No bloquean el proyecto. Se añaden cuando todo lo anterior esté completo y el tiempo lo permita.

| Tarea                             | Tecnología sugerida             | Impacto visual |
| --------------------------------- | ------------------------------- | -------------- |
| Scroll-triggered (parallax, pin)  | GSAP ScrollTrigger              | Alto           |
| Transiciones de página            | Framer Motion `AnimatePresence` | Alto           |
| Split-text / typewriter en hero   | GSAP SplitText o CSS            | Medio          |
| Contadores animados en KPI stats  | GSAP o CountUp.js               | Medio          |
| SVG animados en proceso/servicios | GSAP DrawSVG                    | Alto           |
| Mesh gradient animado en hero     | CSS Houdini o Three.js          | Alto           |
| Cursor personalizado              | JS puro                         | Medio          |
| Fondo de partículas interactivo   | tsParticles o Three.js          | Alto           |
| Lottie animations en iconos       | Lottie + React                  | Medio          |
| Morphing entre secciones          | GSAP MorphSVG                   | Alto           |

---

## RESUMEN DE FASES

| Fase | Descripción                                  | Estado     |
| ---- | -------------------------------------------- | ---------- |
| 0    | Setup y limpieza base                        | Completada |
| 1    | NavBar: conservar desktop + hamburger mobile | Completada |
| 2.1  | Home — HeroSection                           | Pendiente  |
| 2.2  | Home — SocialProof: Infinite Ticker logos    | Pendiente  |
| 2.3  | Home — SocialProof: Testimonials             | Pendiente  |
| 2.4  | Home — ServiceGrid (NO TOCAR)                | —          |
| 2.5  | Home — EngineSection                         | Pendiente  |
| 2.6  | Home — SEOAuthority                          | Pendiente  |
| 3    | Footer: rediseño vanguardista                | Pendiente  |
| 4    | The Origin (Quiénes somos)                   | Pendiente  |
| 5    | Service Pages (template × 5)                 | Pendiente  |
| 6    | Blog SEO Engine                              | Pendiente  |
| 7    | Formulario + n8n + Resend                    | Completada |
| 8    | SEO Global y optimización                    | Pendiente  |
| 9    | Despliegue                                   | Pendiente  |
| —    | Backlog animaciones complejas                | Extra      |
