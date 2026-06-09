/* ============================================================
   SWIFT STUDIO 360 — CONFIGURACIÓN DE CONTENIDO (WHITE-LABEL)
   Para adaptar la plataforma a otra marca, solo edita este archivo.
   ============================================================ */

export const BRAND = {
  name: 'Swift Studio 360',
  shortName: 'Swift Studio',
  tagline: 'Impulsa tu negocio con marketing digital de alto rendimiento.',
  description:
    'Plataforma exclusiva de servicios productizados para agencias, startups y empresas que quieren crecer.',
  logo: '/logo/logo-swift.svg',
  email: 'hola@swiftstudio360.com',
  url: 'https://swiftstudio360.com',
}

export const AUTH = {
  login: {
    title: 'Bienvenido de nuevo',
    subtitle: 'Accede a tu panel de cliente.',
    ctaLabel: 'Iniciar sesión',
    registerPrompt: '¿No tienes cuenta?',
    registerLink: 'Regístrate',
  },
  register: {
    title: 'Crea tu cuenta',
    subtitle: 'Empieza a contratar servicios en minutos.',
    ctaLabel: 'Crear cuenta',
    loginPrompt: '¿Ya tienes cuenta?',
    loginLink: 'Inicia sesión',
  },
}

export const NAV = {
  dashboard: 'Dashboard',
  services: 'Servicios',
  orders: 'Mis pedidos',
  profile: 'Mi perfil',
  admin: 'Administración',
  logout: 'Cerrar sesión',
}

export const DASHBOARD = {
  welcome: (name) => `Hola, ${name || 'cliente'} 👋`,
  subtitle: 'Aquí tienes el resumen de tu actividad.',
  stats: {
    totalOrders: 'Pedidos totales',
    activeOrders: 'Pedidos activos',
    completedOrders: 'Completados',
  },
  emptyOrders: {
    title: 'Aún no tienes pedidos',
    subtitle: 'Explora nuestros servicios y contrata el que mejor se adapte a tu negocio.',
    cta: 'Ver servicios',
  },
}

export const SERVICES = {
  title: 'Nuestros Servicios',
  subtitle: 'Resultados medibles. Ejecución rápida. Sin sorpresas.',
  categories: ['Todos', 'SEO', 'Contenidos', 'Fotografía', 'Automatización'],
  cta: 'Contratar servicio',
  priceLabel: 'desde',
  emptyState: {
    title: 'No se encontraron servicios',
    subtitle: 'Inténtalo con otra categoría.',
  },
}

export const ORDERS = {
  title: 'Mis Pedidos',
  subtitle: 'Seguimiento de todos tus servicios contratados.',
  statusLabels: {
    PENDING: 'Pendiente',
    PROGRESS: 'En progreso',
    DONE: 'Completado',
  },
  emptyState: {
    title: 'No tienes pedidos activos',
    subtitle: 'Cuando contrates un servicio, aparecerá aquí.',
    cta: 'Explorar servicios',
  },
  totalLabel: 'Total',
  deliverablesLabel: 'Entregables',
  noDeliverables: 'Aún no hay entregables. Te avisaremos cuando estén listos.',
}

export const PROFILE = {
  title: 'Mi Perfil',
  subtitle: 'Gestiona tu información personal y de empresa.',
  fields: {
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    companyName: 'Empresa',
  },
  saveLabel: 'Guardar cambios',
  successMessage: 'Perfil actualizado correctamente.',
}

export const CHAT = {
  title: 'Asistente Swift',
  subtitle: 'Pregúntame sobre nuestros servicios, precios o cualquier duda.',
  placeholder: 'Escribe tu mensaje…',
  sendLabel: 'Enviar',
  emptyState: '¡Hola! Soy el asistente de Swift Studio 360. ¿En qué puedo ayudarte hoy?',
  sourcesLabel: 'Fuentes consultadas',
  feedbackLabel: '¿Te fue útil esta respuesta?',
  maxLength: 2000,
  injectionWarning: 'Mensaje no permitido. Por favor, reformula tu pregunta.',
}

export const ADMIN = {
  title: 'Panel de Administración',
  sections: {
    users: 'Usuarios',
    orders: 'Todos los Pedidos',
    services: 'Gestión de Servicios',
  },
}

export const ERRORS = {
  generic: 'Algo salió mal. Por favor, inténtalo de nuevo.',
  unauthorized: 'Sesión expirada. Vuelve a iniciar sesión.',
  forbidden: 'No tienes permisos para realizar esta acción.',
  notFound: 'El recurso solicitado no existe.',
  duplicateOrder: 'Ya tienes un pedido activo para este servicio.',
  rateLimit: 'Demasiadas peticiones. Espera un momento.',
  network: 'Error de red. Comprueba tu conexión a internet.',
}
