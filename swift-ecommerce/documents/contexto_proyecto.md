# Swift Studio 360:

Swift Studio 360 es una plataforma **Full-Stack diseñada** como un ecosistema digital de servicios productizados para una agencia de marketing y contenido audiovisual. El proyecto destaca por una **arquitectura modular, universal y altamente escalable que funciona a modo de "plantilla"**, permitiendo adaptar todo el sistema a cualquier otro sector comercial.

## Descripción Global del Proyecto

La plataforma se divide en dos grandes entornos totalmente integrados:

1. **Página de Comercialización (swiftstudio.com)**

Es el escaparate público de la agencia, **orientado a la captación de tráfico mediante SEO y a la generación de leads**. Cuenta con secciones de Home, Quiénes Somos, Blog y el catálogo de Servicios que actúa como puerta de entrada al e-commerce. Para la conversión, integra formularios (Lead Magnets) conectados con n8n y protegidos mediante Captcha; cuando un usuario solicita información, el sistema automatizado le envía un correo electrónico personalizado con los detalles del servicio de forma inmediata.

2. **E-commerce y Panel Privado (swiftstudio360.com)**

Es el **motor transaccional y el área privada de la plataforma**, donde el registro y autenticación de usuarios es obligatorio. En este entorno, los clientes acceden a funcionalidades exclusivas:

- **Catálogo de servicios**: Página donde el usuario encuentra todos los servicios disponibles. Usuario contratar desde esta página.

- **Configurador Dinámico**: Al contratar un servicio, el usuario responde a un formulario inteligente que adapta las preguntas según el tipo de proyecto (SEO, branding, fotografía, etc.) y gestiona los plazos de entrega requeridos.

- **Flujo de Pedido y Checkout**: Al enviar la solicitud, el pedido queda en estado "Pendiente" en la base de datos PostgreSQL. A través de una automatización, el equipo revisa la disponibilidad; una vez aprobado, el sistema envía un email al cliente para agendar la reunión de briefing y proporciona el enlace de pago seguro para formalizar el proyecto, cambiando su estado a "En progreso".

- **Dashboard de Cliente**: Un panel post-venta desde el cual el usuario puede realizar el seguimiento de sus proyectos en tiempo real y descargar sus entregables finales.

- **Chatbot de Asistencia**: Un asistente inteligente integrado en el panel privado y limitado exclusivamente a resolver dudas sobre los servicios detallados y las cláusulas de contratación.
