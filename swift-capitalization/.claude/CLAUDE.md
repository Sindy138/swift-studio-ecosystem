# CLAUDE.md — swift-capitalization

## SCOPE: QUÉ ES ESTE REPO Y QUÉ NO ES

Este repo es **exclusivamente la plataforma de capitalización y SEO de Swift Studio** (punto 2 del ecosistema). Es el motor de captación de leads: una web de marketing 100% pública construida en React.

**Este repo NO contiene y NO debe contener:**
- Backend (Node.js, FastAPI, Express)
- Autenticación / JWT / sesiones de usuario
- Chatbot ni IA conversacional (eso vive en `swift-ecommerce`)
- Base de datos ni llamadas a API propia
- Lógica de e-commerce ni gestión de pedidos

El ecosistema tiene dos repos independientes:
- `swift-capitalization` → esta web (captación pública, SEO, leads)
- `swift-ecommerce` → hub privado (fullstack, IA, RAG, chatbot, auth, e-commerce)

---

## STACK TÉCNICO

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19.x | Framework principal |
| React Router | 7.x | Routing de páginas |
| Vite | 8.x | Build tool + dev server |
| n8n | externo | Procesamiento de formularios/leads vía webhook |

**Comandos:**
```bash
npm run dev      # dev server en http://localhost:5173
npm run build    # build producción
npm run preview  # preview del build
npm run lint     # ESLint
```

---

## ARQUITECTURA ACTUAL

El proyecto es **data-driven**: todo el contenido vive en `src/config/content.js`. Los componentes reciben props desde esa config — cambiar el archivo cambia toda la web.

```
src/
├── config/
│   ├── content.js       ← FUENTE DE VERDAD de todo el contenido
│   └── TEMPLATE.js      ← Plantilla para adaptar a otros sectores
├── components/
│   ├── home/            ← Secciones del Home (ya implementadas)
│   │   ├── Home.jsx
│   │   ├── HeroSection.jsx
│   │   ├── SocialProof.jsx
│   │   ├── ServiceGrid.jsx
│   │   ├── EngineSection.jsx
│   │   └── SEOAuthority.jsx
│   └── layout/
│       ├── NavBar.jsx
│       └── Footer.jsx
└── App.jsx
```

---

## PÁGINAS A CONSTRUIR (según documents/README.md)

El README del proyecto define estas páginas para la plataforma de capitalización. La base del Home ya existe pero puede requerir ajustes.

### Páginas requeridas

| Ruta | Nombre | Descripción |
|---|---|---|
| `/` | Home | Optimizada para Core Web Vitals y SEO. **Ya existe**, revisar/ajustar |
| `/quienes-somos` | The Origin | Narrativa del perfil híbrido Marketing + FullStack. Nueva |
| `/servicios/:slug` | Service Pages | Plantilla única con flujo: Problema → Solución → Proceso Automatizado → CTA al hub privado. Nueva |
| `/blog` | Blog SEO Engine | Categorizado por verticales: Estrategia, Visual, Automate. Nueva |
| `/blog/:slug` | Blog Post | Artículo individual. Nueva |
| `/contacto` | Contacto | Formulario de leads conectado a n8n. Nueva |

### CTA del hub privado

Los CTAs de las service pages apuntan al hub de e-commerce (`swift-ecommerce`). La URL de producción se configura en variables de entorno, nunca hardcodeada.

---

## INTEGRACIÓN N8N + RESEND (FORMULARIO DE LEADS) — FASE 7

El formulario de contacto/leads es la **única integración externa** de este repo. Flujo completo:

1. El usuario rellena el formulario en `/contacto`
2. El frontend valida los datos en cliente
3. Se hace un `fetch` POST al webhook de n8n con los datos del lead
4. **n8n procesa el lead y usa Resend para enviar los emails**
5. El frontend muestra confirmación o error al usuario

**Variables de entorno de este repo (`.env`):**
```
VITE_N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/leads
```

El prefijo `VITE_` es obligatorio para que Vite exponga la variable al frontend.

**IMPORTANTE:** Nunca guardar la URL del webhook de n8n directamente en el código. Siempre desde `import.meta.env.VITE_N8N_WEBHOOK_URL`.

### Resend — dónde va la API key

**La API key de Resend NO va en el `.env` de este repo.** Va en n8n como credencial, porque Resend es llamado por n8n en el servidor, nunca por el frontend (exponerla en el cliente sería una vulnerabilidad grave).

Pasos para configurarla en n8n:
1. En n8n → Credentials → New Credential → buscar "Resend"
2. Pegar la API key (`re_xxxxxxxxx`)
3. Referenciar esa credencial en el nodo de Resend dentro del workflow de leads

### Workflow n8n a construir en Fase 7

> **PENDIENTE: Generar guía paso a paso al iniciar la Fase 7.**

El workflow tendrá esta lógica general:
- **Trigger:** Webhook POST (recibe el formulario del frontend)
- **Validación:** Nodo IF para verificar campos obligatorios
- **Email al equipo:** Nodo Resend — notificación interna con los datos del lead
- **Email al lead:** Nodo Resend — confirmación automática al usuario
- **CRM (opcional):** Guardar el lead en Notion, Airtable o Google Sheets
- **Respuesta:** HTTP 200 de vuelta al frontend para mostrar el estado al usuario

---

## SEGURIDAD FRONTEND (lo que aplica sin backend)

### Lo que SÍ aplica en este repo

**1. Sanitización de inputs (XSS)**
- React escapa automáticamente el JSX — no usar `dangerouslySetInnerHTML` sin sanitizar
- Si se renderiza HTML (ej: contenido de blog desde CMS o markdown), usar `DOMPurify`
- Los inputs del formulario se validan antes de enviarse a n8n

**2. Validación de formularios en cliente**
- Longitud máxima de campos (nombre ≤ 100 chars, mensaje ≤ 2000 chars)
- Formato de email validado con regex antes del envío
- Solo caracteres permitidos en campos de nombre (letras, espacios, tildes)
- Campos vacíos bloqueados

**3. Gestión de secretos**
- La URL del webhook de n8n en `.env` (nunca en el código)
- `.env` en `.gitignore` — verificar que está incluido
- `.env.example` documentado con todas las variables necesarias

**4. Headers de seguridad**
- Configurables en `vite.config.js` para dev y en `netlify.toml` / `vercel.json` para producción
- Mínimo recomendado: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`

**5. CAPTCHA en formularios** (API6 - flujos de negocio)
- Considerar hCaptcha o Cloudflare Turnstile en el formulario de leads para evitar spam bots
- Es especialmente importante al no tener rate limiting de backend

### Lo que NO aplica en este repo (requiere backend)

- OWASP API Top 10 (BOLA, broken auth, rate limiting, CORS server-side)
- JWT / autenticación / RBAC
- Prompt injection / seguridad de IA / RAG
- SQL injection (no hay base de datos)
- Observabilidad LangFuse (no hay LLM)

---

## REGLAS GLOBALES DE DESARROLLO

### Coherencia visual entre páginas
Todas las páginas (Quiénes Somos, Servicios, Blog, Contacto) deben sentirse parte del mismo sistema visual que la Home. Antes de implementar cualquier página nueva, revisar la Home como referencia. Misma paleta, tipografía, efectos, alternancia de secciones, componentes compartidos.

### Regla de clamp()
`clamp()` se aplica **únicamente** a `font-size`, `gap`, y el tamaño del **logo** (única excepción de elemento visual). Todo lo demás usa valores fijos: `border-radius`, `margin`, `padding`, `min-height`, `max-width`, `width`/`height` de imágenes, tamaño de iconos.
```css
/* Obligatorio con clamp — solo estos tres */
font-size: clamp(1rem, 2.5vw, 1.25rem);
gap: clamp(1rem, 3vw, 2rem);
width: clamp(150px, 20vw, 280px); /* solo logo */
/* Todo lo demás — valor fijo */
padding: 1.5rem 2rem;
border-radius: 12px;
min-height: 80vh;
max-width: 1200px;
```

## PRINCIPIOS DE CÓDIGO

### Generales (KISS, DRY, YAGNI)
- El código más simple que funcione es siempre el mejor
- No implementar funcionalidad que no se necesite ahora
- Cada componente tiene una única responsabilidad

### Específicos de este proyecto
- Todo el contenido textual va en `src/config/content.js`, nunca hardcodeado en componentes
- Los componentes reciben datos por props desde la config, no los importan directamente
- Los estilos CSS de cada componente viven en `components/[seccion]/styles/`
- Las variables CSS globales (colores, tipografías) se definen en `Home.css` `:root`

### Escalabilidad (objetivo del proyecto)
- La arquitectura debe permitir crear una web para otro sector (ej. Inmobiliaria) solo cambiando `content.js`
- Los componentes son agnósticos al sector

---

## SEO (prioritario para este repo)

El SEO es el objetivo central de esta plataforma. Considerar siempre:

- **Core Web Vitals:** LCP, FID/INP, CLS — optimizar imágenes, lazy loading, no layout shifts
- **Structured data JSON-LD:** `LocalBusiness` en Home, `BlogPosting` en artículos de blog, `Service` en páginas de servicio
- **Meta tags:** title y description únicos por página, Open Graph para redes
- **React Router:** usar `<Link>` en vez de `<a>` para navegación interna, gestionar scroll en navegación
- **SSG/SSR:** si el SEO lo requiere en producción, considerar migración a Next.js o usar Vite SSR (decisión futura, no implementar ahora sin pedirlo)

---

## DESPLIEGUE

- **Plataforma objetivo:** Netlify o Vercel (frontend estático)
- **Variables de entorno:** configurar en el panel de la plataforma, no en archivos
- El build es `npm run build` → carpeta `/dist`
- Las dos plataformas (capitalización + ecommerce) se despliegan de forma **independiente**

---

## DOCUMENTACIÓN REQUERIDA POR EL BRIEF

El brief del bootcamp exige documentar el uso de IA. En este repo mantener:

- `ai_log.md` en la raíz — registro de cada sesión de IA significativa con: herramienta, contexto, prompt, output, adaptaciones y aprendizaje
- Este `CLAUDE.md` cuenta como documentación técnica del proyecto

---

## LO QUE NO SE DEBE HACER EN ESTE REPO

- No crear backend, rutas de servidor ni endpoints propios
- No añadir autenticación ni zonas privadas
- No integrar chatbot ni llamadas a LLM (eso es ecommerce)
- No hardcodear texto de contenido en JSX — todo va en `content.js`
- No subir `.env` al repositorio
- No modificar nada en `swift-ecommerce` desde este repo
