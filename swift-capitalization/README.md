# 🚀 Swift Studio - Web de Captación Modular

## 📌 Resumen Ejecutivo

Plantilla maestra escalable para captación de leads con **5 módulos independientes** que se adapta a cualquier sector en minutos.

✅ **Propuesta de Valor:** Transforma marketing en un sistema automatizado y medible  
✅ **Arquitectura:** Data-driven (config centralizada) + componentes modulares reutilizables  
✅ **Escalabilidad:** Cambia un archivo de config → obtén web completamente diferente (Inmobiliaria, Fintech, etc.)  
✅ **Responsividad:** Diseño perfectamente adaptado a desktop, tablet y mobile  
✅ **SEO-First:** Structured data JSON-LD + KPIs visuales + autoridad local

---

## ⚡ Empezar en 3 Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor (http://localhost:5173/)
npm run dev

# 3. Abre en navegador
# http://localhost:5173/
```

✅ Deberías ver el Home con **5 secciones funcionales**.

---

## 📋 Requisitos Previos

- **Node.js** v16+ ([descargar](https://nodejs.org/))
- **npm** (incluido con Node.js)

Verifica:

```bash
node --version
npm --version
```

---

## 📦 Instalación Completa

### Opción A: Primer Uso (Setup Inicial)

```bash
# 1. Navega al proyecto
cd c:/Users/sindy/desktop/ironhack-class/proyecto-SwiftStudio/swift-web

# 2. Instala dependencias
npm install

# 3. Inicia dev server
npm run dev

# 4. Abre http://localhost:5173en el navegador
```

### Opción B: Siguientes Sesiones (Ya Instalado)

```bash
# Solo iniciar servidor
npm run dev

# Servidor listo en http://localhost:5173/
```

### Stack Técnico

| Tecnología       | Versión | Propósito               |
| ---------------- | ------- | ----------------------- |
| **React**        | 19.2.5  | Framework principal     |
| **React Router** | 7.15.0  | Routing (subpáginas)    |
| **Vite**         | 8.0.10  | Build tool + dev server |
| **Node.js**      | 16+     | Runtime                 |
| **npm**          | -       | Gestor de dependencias  |

---

## 📂 Estructura del Proyecto

```
src/
├── config/
│   ├── content.js          🔑 CORAZÓN: Toda la data de Swift Studio
│   └── TEMPLATE.js         📋 Template para nuevos sectores
│
├── components/
│   ├── home/
│   │   ├── Home.jsx               🏠 Ensamblador principal
│   │   ├── HeroSection.jsx        1️⃣ Propuesta de valor + CTA
│   │   ├── SocialProof.jsx        2️⃣ Logos + Testimonios
│   │   ├── ServiceGrid.jsx        3️⃣ The Core (5 servicios)
│   │   ├── EngineSection.jsx      4️⃣ Engine (diferenciación)
│   │   ├── SEOAuthority.jsx       5️⃣ Autoridad + SEO
│   │   ├── ARCHITECTURE.md        📚 Documentación técnica
│   │   └── styles/
│   │       ├── Home.css
│   │       ├── HeroSection.css
│   │       ├── SocialProof.css
│   │       ├── ServiceGrid.css
│   │       ├── EngineSection.css
│   │       └── SEOAuthority.css
│   │
│   └── layout/
│       ├── NavBar.jsx
│       └── Footer.jsx
│
└── App.jsx (✅ importa Home)
```

---

## 🎯 Los 5 Módulos Implementados

### 1️⃣ **Hero Section** - Propuesta de Valor

- Headline impactante + subheadline
- Background dinámico (video/imagen)
- 2 CTAs (primaria + secundaria)
- Scroll indicator animado

### 2️⃣ **Social Proof** - Autoridad Social

- Grid de logos de clientes
- Carrusel de testimonios interactivo
- Rating stars (5 ⭐)
- Navegación con dots y flechas

### 3️⃣ **Service Grid** - The Core (5 Servicios)

5 pilares de Swift Studio con cards interactivas:

1. 📊 **SEO & Posicionamiento** - Domina Google
2. 📱 **Social Media & Community** - Engagement + Audiencia
3. 📸 **Fotografía Profesional** - Contenido visual
4. ✍️ **Content & Blogs** - Contenido que convierte
5. ⚙️ **Automatización con n8n** - 24/7 sin intervención

Cada card: icono, descripción, 4 features, color accent, CTA link

### 4️⃣ **Engine Section** - Diferenciación Tecnológica

**4 Ventajas Clave:**

- 📈 Dashboard Propio (ROI visible en tiempo real)
- 🔗 Integraciones n8n (Automatización total)
- 🤖 Optimización Continua (IA + Datos)
- 👥 Equipo Especializado (5 disciplinas integradas)

**Tabla Comparativa:** Agencia Tradicional ❌ vs Swift Studio ✅

### 5️⃣ **SEO Authority** - Autoridad + Structured Data

- **4 KPI Stats:** 150+ proyectos, 95% satisfacción, 6 meses, 300% ROI
- **Authority Content:** Párrafo diferenciador
- **JSON-LD Schema:** LocalBusiness para SEO local

---

## 🎨 Sistema de Diseño

### Colores Globales (Escalables)

```css
--color-primary: #ff6b6b /* Rojo accent */ --color-secondary: #4ecdc4
  /* Turquesa */ --color-accent: #ffe66d /* Amarillo */ --color-dark: #2c3e50
  /* Azul oscuro */ --color-light: #eceff1 /* Gris claro */;
```

### Responsive Breakpoints

- **Desktop:** 1200px+
- **Tablet:** 768px - 1199px
- **Mobile:** 480px - 767px

---

## ⚡ Personalización

### Opción 1: Cambiar Contenido Swift Studio

1. Abre `src/config/content.js`
2. Edita valores de:
   - `hero.valueProp.headline`
   - `socialProof.logos[]` y `testimonials[]`
   - `services.serviceCards[]` (5 servicios)
   - `engine.advantages[]` (4 ventajas)
   - `seoAuthority.keyStats[]` (4 KPIs)

✅ Home se actualiza automáticamente

### Opción 2: Cambiar Colores Globales

1. Abre `src/components/home/styles/Home.css`
2. Edita variables en `:root { }`
3. Todos los componentes se actualizan

### Opción 3: Crear Config para Otro Sector

1. Copia `src/config/TEMPLATE.js` → `src/config/realestate.js`
2. Reemplaza valores específicos del sector
3. En `src/components/home/Home.jsx` importa la nueva config
4. ¡Funciona! Web completamente diferente

**Ejemplo Inmobiliaria (15 minutos):**

```javascript
// Cambias estos 5 servicios:
✓ Fotografía de Propiedades
✓ Tours Virtuales 3D
✓ Posicionamiento Local
✓ Publicidad Digital
✓ CRM + Leads
// Y todo lo demás es automático
```

---

## 🏗️ Arquitectura Data-Driven

```
content.js (SECTOR_CONFIG)
    ↓
    ├─→ Home.jsx (ensamblador)
    │   ├─→ HeroSection (prop: config.hero)
    │   ├─→ SocialProof (prop: config.socialProof)
    │   ├─→ ServiceGrid (prop: config.services)
    │   ├─→ EngineSection (prop: config.engine)
    │   └─→ SEOAuthority (prop: config.seoAuthority)
    │
    └─→ Componentes renderean datos + estilos únicos
```

**Ventaja:** Cambias un archivo = cambia todo el sitio (content + estructura)

### Responsive Design por Breakpoint

```
Desktop (1200px+)    →   Tablet (768px)        →   Mobile (480px)
─────────────────       ────────────────           ──────────────
Hero (full)             Hero (ajustado)           Hero (mobile)
Logos (4/row)           Logos (2/row)            Logos (1/row)
Services (3/row)        Services (2/row)         Services (1/row)
Engine (1x4)            Engine (2x2)             Engine (1x4)
Stats (4/row)           Stats (2x2)              Stats (1/row)
```

---

## ✅ Verificación Post-Instalación

Después de `npm install` y `npm run dev`, verifica:

```
✅ npm install completó sin errores
✅ npm run dev inicia en http://localhost:5173
✅ Home carga con 5 secciones visibles
✅ Responsive en mobile (F12 → DevTools)
✅ Sin errores rojos en console (F12)
✅ Animations funcionan suave
✅ Carrusel de testimonios navega
✅ Hover effects en service cards
```

---

## 🚀 Comandos Disponibles

| Comando           | Función                      |
| ----------------- | ---------------------------- |
| `npm run dev`     | 🟢 Iniciar dev server (5173) |
| `npm run build`   | 🏗️ Build para producción     |
| `npm run preview` | 👁️ Preview versión compilada |
| `npm run lint`    | ✔️ Validar código con ESLint |

**Ejemplos:**

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción (archivos optimizados en /dist)
npm run build

# Ver preview antes de deploy
npm run preview

# Validar código
npm run lint
```

---

## 📱 Testing Responsive

```
1. Abre http://localhost:5173
2. Presiona F12 (DevTools)
3. Click icono de dispositivo (Ctrl+Shift+M)
4. Prueba breakpoints:
   • 375px (iPhone SE)
   • 768px (iPad)
   • 1200px (Desktop)
5. Verifica que layout se adapta correctamente
```

---

## 🐛 Troubleshooting

### ❌ "npm: command not found"

```bash
# Node.js no está instalado
# Descarga desde https://nodejs.org/
node --version
npm --version
```

### ❌ "Port 5173 already in use"

```bash
# Usa otro puerto
npm run dev -- --port 3000
```

### ❌ "Cannot find module 'react'"

```bash
# Dependencias no instaladas
npm install
```

### ❌ "Home no aparece / estilos rotos"

```bash
# Limpia cache del navegador
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)

# O fuerza refresh del servidor
npm run dev
```

### ❌ "Carrusel no funciona"

```bash
# Revisa console (F12) por errores
# Verifica que testimonials[] no esté vacío en content.js
```

---

## 🎯 Siguientes Pasos

### Fase 1: Refinamiento Inicial

- [ ] Validar contenido de content.js para Swift Studio
- [ ] Revisar enlaces internos/externos
- [ ] Testing en mobile (DevTools)

### Fase 2: Subpáginas

- [ ] `/servicios` - Grid de servicios
- [ ] `/servicios/[servicio]` - Detail pages
- [ ] `/blog` - Blog posts
- [ ] `/contacto` - Contact form

### Fase 3: Integración Ecommerce

- [ ] Links → Dashboard (ecommerce.swiftstudio.com)
- [ ] Google Analytics
- [ ] Lead tracking

### Fase 4: Escalabilidad

- [ ] Crear configs para otros sectores
- [ ] Admin dashboard (CMS)
- [ ] Deployment (Vercel/Netlify)

---

## 📚 Archivos Importantes

| Archivo                               | Propósito                       |
| ------------------------------------- | ------------------------------- |
| `src/config/content.js`               | 🔑 Contenido (edita aquí)       |
| `src/components/home/Home.jsx`        | 🏠 Componente principal         |
| `src/components/home/styles/Home.css` | 🎨 Variables globales           |
| `src/config/TEMPLATE.js`              | 📋 Template para otros sectores |
| `src/components/home/ARCHITECTURE.md` | 📖 Guía técnica completa        |

---

## 🌍 Escalabilidad: Swift Studio → Otros Sectores

Para crear web completamente diferente (ej. Inmobiliaria):

1. **Copia:** `src/config/TEMPLATE.js` → `src/config/realestate.js`
2. **Edita:** Reemplaza valores en la nueva config
3. **Importa:** En `Home.jsx` cambia import a `REAL_ESTATE_CONFIG`
4. **¡Listo!** Web funcionando con diseño, estructura y contenido diferente

Tiempo: ~15 minutos | Cambios de código: 0

---

## ✨ Características

- ✅ 5 componentes modulares (Hero, Social, Services, Engine, SEO)
- ✅ Data-driven (config centralizada)
- ✅ 100% Responsive (3 breakpoints)
- ✅ Animaciones suaves y transiciones
- ✅ Carrusel de testimonios
- ✅ Hover effects interactivos
- ✅ Structured data JSON-LD
- ✅ SEO-optimizado
- ✅ Escalable a otros sectores
- ✅ Cero hardcoding de contenido

---

**¿Listo para empezar?** Ejecuta `npm install` y `npm run dev` 🚀
