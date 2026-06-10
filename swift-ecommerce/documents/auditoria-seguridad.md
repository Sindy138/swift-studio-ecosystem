# Auditoría de Seguridad — Swift Studio 360
**Fecha:** 2026-06-10 | **Auditora:** Claude Sonnet 4.6 (Claude Code)  
**Alcance:** Backend (Express.js + Prisma) + Frontend (React 19 + Vite)  
**Marco de referencia:** OWASP API Security Top 10 (2023) · OWASP Top 10 Web (2021) · OWASP LLM Top 10

---

## Resumen Ejecutivo

| Severidad  | Hallazgos |
|------------|-----------|
| 🔴 ALTA    | 3         |
| 🟠 MEDIA   | 6         |
| 🟡 BAJA    | 5         |
| ℹ️ INFO     | 3         |
| ✅ CORRECTO | 12        |

La plataforma tiene una base de seguridad sólida para un proyecto académico. Las 3 vulnerabilidades de severidad alta deben resolverse **antes del despliegue a producción**. Ninguna de ellas requiere cambios arquitecturales grandes; son correcciones puntuales de configuración.

---

## 1. Hallazgos por Severidad

---

### 🔴 ALTA — 1. Fallback CORS a wildcard (`*`)

**Archivo:** `backend/src/app.js`  
**OWASP:** API8 — Security Misconfiguration

**Descripción:**  
La configuración de CORS usa `process.env.CORS_ORIGIN || "*"`. Si la variable de entorno no está definida en producción (olvido en Render, typo en el nombre), el servidor aceptará peticiones de **cualquier origen**, eliminando por completo la protección CORS.

```js
// VULNERABLE
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }))
```

**Impacto:** Cualquier sitio web malicioso podría hacer peticiones autenticadas a la API usando las credenciales de un usuario con sesión activa (CSRF-like via CORS).

**Remediación:**
```js
// SEGURO — lanzar error si CORS_ORIGIN no está definido
const allowedOrigin = process.env.CORS_ORIGIN
if (!allowedOrigin) throw new Error('CORS_ORIGIN env var is required')
app.use(cors({ origin: allowedOrigin, credentials: true }))
```

---

### 🔴 ALTA — 2. Swagger UI expuesto sin autenticación

**Archivo:** `backend/src/app.js`  
**OWASP:** API9 — Improper Inventory Management

**Descripción:**  
Los endpoints `/api/docs` (Swagger UI) y `/api/redoc` están disponibles sin ningún control de acceso. En producción, cualquier persona puede explorar la documentación completa de la API: esquemas de request/response, ejemplos de payload, estructuras de errores y flujos de autenticación.

**Impacto:** Facilita enormemente el reconocimiento para un atacante. Expone la superficie de ataque completa de la API.

**Remediación — opción A (deshabilitar en producción):**
```js
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.use('/api/redoc', redocHandler)
}
```

**Remediación — opción B (proteger con auth básica):**
```js
import basicAuth from 'express-basic-auth'
const docsAuth = basicAuth({
  users: { admin: process.env.DOCS_PASSWORD },
  challenge: true
})
app.use('/api/docs', docsAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec))
```

---

### 🔴 ALTA — 3. Rol de usuario embebido en JWT sin invalidación

**Archivo:** `backend/src/features/auth/auth.controller.js`, `backend/src/middlewares/auth.middleware.js`  
**OWASP:** API2 — Broken Authentication

**Descripción:**  
El rol (`role: USER | ADMIN`) se incluye en el payload del JWT en el momento del login. El middleware `authenticate()` lee el rol **directamente del token** sin consultar la base de datos. Si un administrador revoca privilegios a un usuario, el token existente seguirá teniendo `role: ADMIN` durante **hasta 7 días** hasta su expiración.

```js
// auth.controller.js — rol fijado en el token
const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, ...)

// auth.middleware.js — rol leído del token, sin verificar BD
req.user = decoded  // { id, email, role } — potencialmente desactualizado
```

**Impacto:** Un ex-administrador comprometido mantiene acceso admin hasta que el token expire. No existe mecanismo de revocación.

**Remediación (solución pragmática para el proyecto):**  
Para una aplicación académica, la solución más simple es reducir el TTL del token de 7 días a 15 minutos (con refresh token), o agregar una consulta a BD en `isAdmin()`:

```js
// isAdmin — verificar rol desde BD en rutas sensibles
export const isAdmin = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { role: true } })
  if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })
  next()
})
```

---

### 🟠 MEDIA — 4. `morgan("dev")` en producción filtra información

**Archivo:** `backend/src/app.js`  
**OWASP:** API8 — Security Misconfiguration

**Descripción:**  
El formato `"dev"` de morgan incluye la ruta completa, método, status y tiempo de respuesta en colores ANSI. Aunque no es crítico, en producción el formato `"combined"` (estándar Apache) incluye IP, user-agent y timestamp — más útil para auditoría — y no usa caracteres de color que ensucian logs estructurados.

**Remediación:**
```js
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
```

---

### 🟠 MEDIA — 5. Mensajes de error internos expuestos al cliente

**Archivo:** `backend/src/middlewares/error.middleware.js`  
**OWASP:** API8 — Security Misconfiguration

**Descripción:**  
El handler de errores genérico envía `err.message` al cliente para cualquier error que no sea 500. Mensajes como `"Unique constraint failed on the fields: (\`email\`)"` (Prisma) o nombres de campos de la BD pueden llegar al frontend.

```js
// VULNERABLE — revela detalles de implementación
res.status(statusCode).json({ error: err.message })
```

**Remediación:**
```js
const safeMessage = statusCode >= 500 
  ? 'Error interno del servidor' 
  : err.message  // solo para errores de negocio controlados (400, 401, 403, 404)
res.status(statusCode).json({ error: safeMessage })
```
Asegurarse además de que los errores de Prisma se mapean antes de llegar al handler genérico (el `error.middleware.js` actual ya lo hace para los códigos conocidos de Prisma — verificar cobertura completa).

---

### 🟠 MEDIA — 6. JWT en `localStorage` (riesgo XSS)

**Archivos:** `frontend/src/context/AuthContext.jsx`, `frontend/src/api/client.js`  
**OWASP:** A07 — Identification and Authentication Failures

**Descripción:**  
El token JWT se almacena en `localStorage`. Si existe alguna vulnerabilidad XSS (presente o futura), un script malicioso podría extraer el token y reutilizarlo desde otro origen.

**Contexto:** Es una decisión explícita del plan de arquitectura del proyecto ("opción pragmática para el bootcamp"). No es crítica dado que:
- React escapa automáticamente todas las variables en JSX
- `dangerouslySetInnerHTML` está prohibido en el proyecto
- DOMPurify está disponible en `sanitize.js`
- `noindex, nofollow` en `index.html` reduce exposición

**Remediación para producción real:** Migrar a `httpOnly` cookies con `SameSite=Strict` gestionadas por el backend.

---

### 🟠 MEDIA — 7. Cambio de email sin verificación (vector de account takeover)

**Archivo:** `backend/src/features/users/users.controller.js`  
**OWASP:** API2 — Broken Authentication

**Descripción:**  
El endpoint `PUT /users/:id` permite actualizar el email sin ningún paso de verificación (ni confirmación al email antiguo, ni al nuevo). Si una sesión activa es comprometida, un atacante puede cambiar el email de la cuenta y bloquear al usuario legítimo permanentemente.

**Remediación:**  
Antes del despliegue, elegir una de estas opciones:
1. **Deshabilitar** el cambio de email en el frontend (solución rápida)
2. **Requiere confirmación** vía OTP o enlace al email antiguo antes de aplicar el cambio
3. **Invalidar sesión** inmediatamente tras cambio de email, forzando re-login

---

### 🟠 MEDIA — 8. Sin expiración corta de sesión ni revocación de token

**Archivo:** `backend/src/features/auth/auth.controller.js`  
**OWASP:** API2 — Broken Authentication

**Descripción:**  
El JWT tiene una expiración de 7 días (`expiresIn: '7d'`) y el logout solo elimina el token del `localStorage` en el cliente. No existe ningún mecanismo de blacklist o revocación en el servidor.

**Impacto:** Un token robado (p. ej. de un backup de localStorage, logs del navegador, extensión maliciosa) es válido 7 días sin posibilidad de invalidarlo.

**Remediación para producción:**
- Reducir TTL a 15-60 minutos con refresh token de 7 días
- O implementar una blacklist en Redis/BD para tokens revocados en logout

---

### 🟠 MEDIA — 9. Sin CAPTCHA en registro y login

**Archivos:** `backend/src/features/auth/auth.routes.js`  
**OWASP:** API6 — Unrestricted Access to Sensitive Business Flows

**Descripción:**  
Los endpoints de registro y login tienen rate-limiting (5 registros/hora, 10 logins/15min por IP) pero no tienen CAPTCHA. Los rate limits por IP son fácilmente eludibles con rotación de IPs desde botnets.

**Remediación:**  
Integrar Google reCAPTCHA v3 (invisible) o hCaptcha en los formularios de login/registro del frontend, y verificar el token en el backend antes de procesar la solicitud.

---

### 🟡 BAJA — 10. URLs de deliverables sin validación (SSRF potencial)

**Archivo:** `backend/src/features/orders/` (deliverables controller)  
**OWASP:** API7 — Server Side Request Forgery

**Descripción:**  
Las URLs de deliverables se almacenan y devuelven al cliente sin validación. Si en algún momento el servidor realiza una petición a esas URLs (p.ej. para generar previsualizaciones, thumbnails o webhooks), existiría un vector SSRF.

**Estado actual:** El servidor no parece hacer peticiones a las URLs de deliverables — solo las almacena y el cliente las usa como `<a href>`. El riesgo es **bajo** mientras no se añada esa funcionalidad.

**Remediación preventiva (añadir al schema Zod de deliverables):**
```js
url: z.string().url().refine(
  (url) => url.startsWith('https://'),
  { message: 'Solo se permiten URLs HTTPS' }
)
```

---

### 🟡 BAJA — 11. Detección de prompt injection bypassable

**Archivos:** `backend/src/middlewares/promptSecurity.middleware.js`, `frontend/src/utils/sanitize.js`  
**OWASP LLM:** LLM01 — Prompt Injection

**Descripción:**  
Los 14 patrones regex de detección de prompt injection (tanto en frontend como en backend) cubren los ataques más conocidos pero son bypassables mediante:
- Variaciones de mayúsculas: `IgnOrE pReViOuS`
- Leet speak: `1gn0r3 pr3v10us`
- Separación de caracteres: `i g n o r e`
- Idiomas alternativos o sinónimos no contemplados
- Codificación Unicode: `𝐢𝐠𝐧𝐨𝐫𝐞`

**Remediación:**  
Las reglas regex son la primera línea de defensa, no la única. Complementar con:
1. Un sistema prompt robusto con instrucciones explícitas anti-jailbreak en el LLM
2. Validación semántica en el nodo LangGraph (detectar desviaciones del dominio)
3. LangFuse para monitorizar conversaciones anómalas en producción

---

### 🟡 BAJA — 12. Sin Content Security Policy (CSP)

**Archivo:** `backend/src/app.js` (Helmet)  
**OWASP:** A05 — Security Misconfiguration

**Descripción:**  
Helmet aplica headers de seguridad por defecto (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, etc.) pero **no configura `Content-Security-Policy` por defecto** en versiones recientes. Sin CSP, el navegador no tiene instrucciones sobre qué recursos son legítimos, lo que facilita ataques XSS si alguno llega a ejecutarse.

**Remediación:**
```js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", process.env.LANGFUSE_HOST],
    }
  }
}))
```

---

### 🟡 BAJA — 13. Rate limit global no aplicado a todos los endpoints

**Archivo:** `backend/src/app.js`  
**OWASP:** API4 — Unrestricted Resource Consumption

**Descripción:**  
El rate limit global (`globalLimiter: 100/15min`) está configurado pero es necesario verificar que se aplica como middleware global antes del router, no solo a rutas específicas. El endpoint `/api/chat` tiene su propio `chatLimiter` (30 msg/min), pero rutas de lectura pesadas como `GET /orders` (admin, todos los pedidos) o `GET /users` podrían ser abusadas para DoS o scraping.

**Remediación:**  
Confirmar que `app.use(globalLimiter)` aparece antes de `app.use('/api', router)` en `app.js`.

---

### 🟡 BAJA — 14. Exposición de patrones regex en logs del servidor

**Archivo:** `backend/src/middlewares/promptSecurity.middleware.js`  
**OWASP:** API8 — Security Misconfiguration

**Descripción:**  
El middleware de seguridad registra en logs el patrón regex que disparó la detección:
```js
console.warn(`[SECURITY] Prompt injection detectado`, { pattern: pattern.toString(), userId })
```
Loguear `pattern.toString()` expone la lista completa de expresiones regulares en los logs del servidor. Si un atacante tiene acceso a los logs (p.ej. panel de Render, Sentry, etc.), conoce exactamente qué patrones evitar.

**Remediación:**
```js
console.warn(`[SECURITY] Prompt injection detectado`, { 
  ruleIndex: patterns.indexOf(pattern),  // índice, no el pattern
  userId,
  messageLength: message.length 
})
```

---

### ℹ️ INFO — 15. Documentos RAG sin segmentación por rol

**OWASP LLM:** LLM06 — Sensitive Information Disclosure

**Descripción:**  
Todos los documentos indexados en ChromaDB son accesibles para cualquier usuario autenticado que consulte el chatbot. No hay segmentación por rol (USER vs ADMIN) ni por nivel de confidencialidad del documento.

**Impacto actual:** Bajo — los documentos de un portfolio de agencia son información comercial, no datos sensibles de usuarios.

**Recomendación:** Si en el futuro se indexan documentos con datos de clientes, contratos o precios especiales, implementar metadatos de `access_level` en ChromaDB y filtrar en la query del RAG según el rol del usuario.

---

### ℹ️ INFO — 16. Sin token CSRF en formularios

**OWASP:** A01 — Broken Access Control (CSRF)

**Descripción:**  
La API usa JWT en header `Authorization` (no en cookies), lo que la hace **inmune a CSRF por diseño** — un sitio malicioso no puede inyectar el header `Authorization`. Sin embargo, si en el futuro se migra a cookies `httpOnly`, será necesario implementar tokens CSRF.

**Estado:** No es un problema actual. Documentado para referencia futura.

---

### ℹ️ INFO — 17. Sin política de contraseñas más allá de longitud mínima

**Archivo:** `backend/src/features/auth/auth.schema.js`  
**OWASP:** API2 — Broken Authentication

**Descripción:**  
La validación de password solo requiere mínimo 8 caracteres. No hay requisitos de complejidad (mayúsculas, números, símbolos) ni detección de contraseñas comunes (p.ej. lista HaveIBeenPwned).

**Contexto:** Para un proyecto académico B2B con registro controlado, es aceptable. En producción real se recomienda añadir `zxcvbn` para evaluación de entropía o integrar con HaveIBeenPwned API.

---

## 2. Lo Que Está Bien Implementado ✅

| # | Control | Implementación |
|---|---------|----------------|
| 1 | **BOLA / IDOR** | Checks de ownership en pedidos, deliverables e historial de chat. Los usuarios solo acceden a sus propios recursos. |
| 2 | **Autenticación JWT** | `jsonwebtoken` con `jwt.verify()`, clave secreta mínima 32 chars, algoritmo HS256. bcrypt salt 10. |
| 3 | **Autorización por rol** | `isAdmin` middleware aplicado en todas las rutas administrativas. Sin rutas admin sin proteger. |
| 4 | **Exclusión de password** | `password` excluido en todos los `prisma.user.findUnique/findMany` usando `select`. Nunca expuesto en responses. |
| 5 | **Validación de inputs (Zod)** | Zod schemas en todos los endpoints. `AgentResponseSchema` valida incluso las respuestas del LLM antes de enviarlas al cliente (API10). |
| 6 | **Rate limiting por endpoint** | `loginLimiter` (10/15min), `registerLimiter` (5/h), `globalLimiter` (100/15min), `chatLimiter` (30/min). |
| 7 | **Headers de seguridad** | Helmet aplicado globalmente: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `X-XSS-Protection`. |
| 8 | **SQL Injection** | Prisma ORM usa prepared statements nativamente. Imposible inyección SQL a través de la capa de datos. |
| 9 | **Prompt injection — primera línea** | 14 patrones regex en backend + detección en frontend. Throttle 1.5s en chat. |
| 10 | **Self-protect admin** | Bloqueado `DELETE /users/:id` si `id === req.user.id`. Bloqueado `role` en self-update. |
| 11 | **XSS en frontend** | `dangerouslySetInnerHTML` prohibido. React escapa JSX. `white-space: pre-wrap` en chat (no HTML). DOMPurify disponible. |
| 12 | **Plataforma privada** | `robots.txt` con `Disallow: /`. `meta robots noindex,nofollow` en `index.html`. No indexable por buscadores. |

---

## 3. Checklist Pre-Despliegue

Acciones **bloqueantes** (resolver antes de desplegar):

- [x] **[ALTA]** Eliminar fallback `|| "*"` en CORS — lanzar error si `CORS_ORIGIN` no está definido
- [x] **[ALTA]** Deshabilitar `/api/docs` y `/api/redoc` en producción (`NODE_ENV === 'production'`)
- [x] **[ALTA]** Verificar que `isAdmin()` consulta el rol desde BD (o reducir JWT TTL a ≤1h)
- [x] **[MEDIA]** Cambiar `morgan("dev")` a `morgan("combined")` en producción
- [x] **[MEDIA]** Revisar que errores 5xx devuelven mensaje genérico, no `err.message`
- [x] **[BAJA]** Añadir validación `z.string().url().startsWith('https://')` en schema de deliverables
- [x] **[BAJA]** Confirmar que `globalLimiter` se aplica antes del router en `app.js`
- [x] **[BAJA]** Cambiar log de promptSecurity para no exponer el pattern regex

Acciones **recomendadas** (mejorarían la postura de seguridad):

- [ ] Configurar CSP en Helmet con directivas restrictivas
- [ ] Deshabilitar o requerir confirmación para cambio de email
- [ ] Reducir TTL del JWT a 1h-24h como compromiso
- [ ] Añadir validación HTTPS-only en URLs de deliverables

---

## 4. Variables de Entorno — Checklist Producción

Verificar que estas variables están correctamente configuradas en el panel de Render/Railway antes del despliegue. **Ninguna debe tener valor por defecto en código.**

| Variable | Requerida | Notas |
|----------|-----------|-------|
| `DATABASE_URL` | ✅ | Connection string de Neon/Supabase con SSL |
| `JWT_SECRET` | ✅ | Mínimo 32 chars, generado con `openssl rand -hex 32` |
| `CORS_ORIGIN` | ✅ | URL exacta del frontend en producción (sin trailing slash) |
| `PORT` | ✅ | Render lo asigna automáticamente vía `$PORT` |
| `GROQ_API_KEY` | ✅ | No commitear nunca — verificar `.gitignore` |
| `LANGFUSE_SECRET_KEY` | ✅ | Clave privada de LangFuse Cloud |
| `LANGFUSE_PUBLIC_KEY` | ✅ | Clave pública de LangFuse Cloud |
| `NODE_ENV` | ✅ | Configurar como `production` explícitamente |
| `CHROMA_HOST` | ⚠️ | Verificar accesibilidad del servidor ChromaDB desde Render |

---

## 5. Resumen OWASP API Top 10 (2023)

| # | Vulnerabilidad | Estado |
|---|---------------|--------|
| API1 | BOLA | ✅ Ownership checks implementados |
| API2 | Broken Auth | ⚠️ TTL reducido a 1h, rol verificado en BD — pendiente: sin revocación en logout |
| API3 | Broken Object Property Auth | ✅ Password excluido, Zod filtra campos |
| API4 | Unrestricted Resource Consumption | ✅ globalLimiter global + limiters específicos en listados masivos |
| API5 | Broken Function Level Auth | ✅ isAdmin en todas las rutas admin |
| API6 | Unrestricted Business Flow | ⚠️ Sin CAPTCHA en login/registro (mejora futura) |
| API7 | SSRF | ✅ URLs deliverables validadas: solo HTTPS |
| API8 | Security Misconfiguration | ✅ CORS sin wildcard, morgan por entorno, errores 5xx genéricos |
| API9 | Improper Inventory Management | ✅ Swagger deshabilitado en producción |
| API10 | Unsafe Consumption of APIs | ✅ AgentResponseSchema valida output del LLM |

---

*Auditoría generada el 2026-06-10. Basada en revisión estática de código fuente. No incluye pruebas de penetración dinámicas ni análisis de dependencias (npm audit).*
