# SWIFT STUDIO ECOSYSTEM: PLATAFORMA INTEGRAL DE MARKETING E IA

## 1. DESCRIPCIÓN GENERAL DEL PROYECTO

Swift Studio es un ecosistema digital diseñado para ser una "Plantilla Maestra Escalable". El proyecto se divide en dos plataformas independientes pero conectadas funcionalmente para cubrir el ciclo de vida completo del cliente: desde la captación orgánica hasta la gestión privada de servicios productizados [1, 2].

El ecosistema implementa una arquitectura robusta que combina un frontend de alto rendimiento para SEO con un entorno fullstack privado que integra agentes de Inteligencia Artificial y automatizaciones de flujos de trabajo.

---

## 2. SWIFT STUDIO: PLATAFORMA DE CAPITALIZACIÓN Y SEO

Este entorno actúa como el motor de captación del ecosistema. Es un frontend desacoplado diseñado específicamente para la optimización en buscadores (SEO) y la conversión de tráfico en leads cualificados.

### CARACTERÍSTICAS TÉCNICAS Y ESTRUCTURALES

- **Arquitectura de Plantilla Maestra Escalable:** Implementación de un sistema de diseño modular en React que permite la extrapolación del sitio a diferentes sectores verticales (ej. Inmobiliaria) mediante la sustitución de capas de servicio y contenido sin alterar la infraestructura lógica.
- **Estructura de Navegación:**
  - **Home:** Optimizada para métricas Core Web Vitals y posicionamiento SEO.
  - **The Origin (Quienes Somos):** Enfoque narrativo en el perfil híbrido Marketing + Full Stack, destacando la eficiencia de la ingeniería aplicada al marketing.
  - **Service Pages:** Basadas en una plantilla única con flujo lógico (Problema -> Solución -> Proceso Automatizado) y call-to-action directo al Hub privado.
  - **Blog SEO Engine:** Sistema categorizado por verticales estratégicos (Estrategia, Visual, Automate).
    > Automatizado con n8n???
- **Gestión de Leads:** Integración de formularios de contacto mediante automatización externa con n8n para el procesamiento de datos sin necesidad de backend propio en este módulo.
- **Seguridad Frontend:** Infraestructura en React fortalecida contra vulnerabilidades comunes y ataques externos mediante la higienización de entradas y configuraciones seguras de cabeceras.

---

## 3. SWIFT STUDIO 360: HUB DE E-COMMERCE Y GESTIÓN DE CLIENTES

Plataforma fullstack privada destinada a la contratación y gestión de servicios. Este entorno centraliza la lógica de negocio y la interacción avanzada con el usuario a través de IA.

### STACK TECNOLÓGICO Y FUNCIONALIDADES

- **Backend:** Desarrollado en Node.js (Express v5) con arquitectura SOLID, utilizando Prisma ORM para la interacción con una base de datos PostgreSQL de 5 tablas relacionadas.
- **Seguridad:** Autenticación mediante JSON Web Tokens (JWT) con duración de 7 días, cifrado bcryptjs y control de acceso basado en roles (RBAC: USER/ADMIN) [4, 7].
- **Sistema de E-commerce:** Catálogo de servicios productizados (SEO, Contenidos, Fotografía, Automatización) con gestión de estados de pedido (PENDING, PROGRESS, DONE) [5, 7].
- **Integración de IA (Agente LangGraph):** Implementación de un agente inteligente con memoria conversacional persistente y capacidad de ejecución de herramientas (tools).
- **Motor RAG (Retrieval-Augmented Generation):** Uso de ChromaDB como base de datos vectorial para indexar documentación del dominio, permitiendo al agente responder consultas técnicas citando fuentes específicas.

---

## 4. CUMPLIMIENTO DE REQUISITOS DEL BRIEF

El proyecto satisface los requisitos obligatorios establecidos para el Proyecto Final del Bootcamp:

| REQUISITO             | ESTADO | IMPLEMENTACIÓN                                                    |
| :-------------------- | :----: | :---------------------------------------------------------------- |
| Backend Fullstack     |   ✅   | Node.js + Express + PostgreSQL [4, 8]                             |
| Autenticación JWT     |   ✅   | Registro, Login y Rutas Protegidas [4, 8]                         |
| Agente LangGraph      |   ✅   | Agente con ≥2 tools y memoria persistente [5, 9]                  |
| Sistema RAG           |   ✅   | ChromaDB con ≥5 documentos indexados y citas [5, 9]               |
| Automatización N8N    |   ✅   | Flujo activo con lógica condicional para leads y contacto [5, 10] |
| Frontend React 18+    |   ✅   | Vite + React Router v6 + Context API [4, 9]                       |
| Interfaz de Chat IA   |   ✅   | Widget de chat integrado en el panel privado [4, 9]               |
| Diseño Responsive     |   ✅   | Adaptabilidad completa para mobile y desktop [4, 9]               |
| Despliegue Cloud      |   ✅   | Backend en Render, Frontend en Netlify/Vercel, BD en Neon [5, 10] |
| Documentación Técnica |   ✅   | Swagger, Colección Postman y README detallado [12, 13]            |

---

## 5. INFRAESTRUCTURA Y SEGURIDAD

El proyecto sigue las directrices del OWASP API Top 10 para mitigar vulnerabilidades de seguridad [14]:

- **Validación de Datos:** Uso de Zod y Pydantic/Joi para la validación estricta de inputs y outputs [4, 14].
- **Protección de Recursos:** Implementación de Rate Limiting y Helmet para la seguridad de cabeceras HTTP [4, 14].
- **Control de Acceso:** Verificación de propiedad (BOLA check) y autorización por roles en todos los endpoints sensibles [14].
- **Variables de Entorno:** Configuración segregada de claves API (Groq, DB, JWT) mediante archivos `.env` y ejemplos documentados [13].

---

## 6. INSTALACIÓN Y DESPLIEGUE

El repositorio está organizado siguiendo una estructura de monorepo para facilitar la gestión de ambos entornos [15].

1.  **Backend:** `npm install` en `/backend`, configuración de `.env` y despliegue en Render.
2.  **Frontend (Hub 360):** `npm install` en `/frontend`, configuración de API endpoint y despliegue en Vercel/Netlify.
3.  **Frontend (Marketing):** Despliegue independiente enfocado en rendim
