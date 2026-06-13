/**
 * PLANTILLA MAESTRA ESCALABLE - Swift Studio
 * Este archivo es el "corazón" modular del contenido.
 * Estructura agnóstica de sector para permitir transposición a Inmobiliaria, Fintech, etc.
 *
 * Uso: Reemplaza valores de {sector} y servicios sin tocar componentes
 */

export const SECTOR_CONFIG = {
  // =========================================
  // 1. CONFIGURACIÓN GLOBAL DEL SECTOR
  // =========================================
  sector: "Marketing Digital & Agencia 360º",
  companyName: "Swift Studio",
  industry: "Agencia Digital",
  ecommerceUrl: "https://ecommerce.swiftstudio.com", // Será variable

  // =========================================
  // 2. HERO SECTION
  // =========================================

  hero: {
    valueProp: {
      headline:
        "Servicios de Marketing y Contenido potenciados por Automatización Avanzada",
      subheadline:
        "Transformamos tu Marketing en un Sistema Automatizado y Medible",
      /*description:
        "Somos la agencia que combina creatividad humana con poder de automatización. 5 servicios integrados. 1 sistema. Infinitas posibilidades.",
      */
    },
    cta: {
      primary: {
        text: "Explorar Servicios",
        link: "/servicios", // Link interno
      },
      secondary: {
        text: "Ver Demo",
        link: "/demo",
      },
    },
    backgroundType: "video", // 'video', 'image', 'gradient'
    backgroundUrl: "/assets/hero-bg.mp4",
  },

  // =========================================
  // 3. SOCIAL PROOF (Logos + Testimonios)
  // =========================================
  socialProof: {
    title: "Más de 150 proyectos completados y clientes satisfechos",
    subtitle: "Confían en nosotros:",

    logos: [
      {
        id: "client-1",
        name: "Cliente 1",
        image: "/logos/airbnb-logo.svg",
        alt: "Logo cliente 1",
      },
      {
        id: "client-2",
        name: "Cliente 2",
        image: "/logos/amazon-logo.svg",
        alt: "Logo cliente 2",
      },
      {
        id: "client-3",
        name: "Cliente 3",
        image: "/logos/google-logo.svg",
        alt: "Logo cliente 3",
      },
      {
        id: "client-4",
        name: "Cliente 4",
        image: "/logos/fedex-logo.svg",
        alt: "Logo cliente 4",
      },
    ],

    testimonials: [
      {
        id: "testimonial-1",
        quote:
          "Swift Studio transformó nuestro flujo de marketing. Resultado: 3x más leads en 6 meses.",
        author: "Juan Pérez",
        role: "CEO, TechCorp",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=11",
      },
      {
        id: "testimonial-2",
        quote:
          "La automatización que implementaron nos ahorraba 40 horas mensuales. Impresionante ROI.",
        author: "María García",
        role: "Marketing Manager, RetailPro",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=47",
      },
      {
        id: "testimonial-3",
        quote: "El mejor equipo en creatividad + datos que hemos contratado.",
        author: "Carlos López",
        role: "Founder, StartupX",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=32",
      },
      {
        id: "testimonial-4",
        quote:
          "Nuestra campaña superó todas las expectativas gracias a Swift Studio. Profesionalidad y resultados reales.",
        author: "Ana Martínez",
        role: "Directora de Marketing, EduTech Solutions",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=56",
      },
    ],
  },

  // =========================================
  // 4. GRID DE SERVICIOS (The Core - 5 Pilares)
  // =========================================
  services: {
    title: "SEOAUTHORITY / DIGITAL GROWTH",
    subtitle: "Todo tu crecimiento digital, conectado en un mismo núcleo.",
    // description:"Cada servicio está optimizado para trabajar en sinergia. Tu visión. Nuestro poder de ejecución.",

    serviceCards: [
      {
        id: "seo",
        name: "SEO & Posicionamiento",
        image: "/services/seo-score.svg",
        shortDescription: "Domina la primera página de Google",
        longDescription:
          "Estrategia integral SEO técnico, contenido y link building para autoridad digital.",
        features: [
          "Auditoría técnica completa",
          "Estrategia de palabras clave",
          "Contenido optimizado",
          "Link building ético",
        ],
        ctaText: "Conocer SEO",
        link: "/servicios/seo",
        color: "#FF6B6B", // Color para diferenciación visual
        learningPath: "/learn/seo", // Subpágina de captación
      },
      {
        id: "social",
        name: "Social Media",
        image: "/services/social-media.svg",
        shortDescription: "Community. Engagement. Sales.",
        longDescription:
          "Estrategia de redes sociales integrada con automatización y análisis de datos.",
        features: [
          "Calendario de contenidos",
          "Gestión de comunidad",
          "Automatización de posts",
          "Análisis y reportes",
        ],
        ctaText: "Explorar Social",
        link: "/servicios/social-media",
        color: "#4ECDC4",
        learningPath: "/learn/social-media",
      },
      {
        id: "fotografia",
        name: "Fotografía Profesional",
        image: "/services/photo-session.svg",
        shortDescription: "Storytelling. Historias visuales que venden",
        longDescription:
          "Sesiones fotográficas profesionales para productos, eventos y corporate.",
        features: [
          "Sesiones en estudio",
          "Fotografía de productos",
          "Cobertura de eventos",
          "Retoque profesional",
        ],
        ctaText: "Ver Portafolio",
        link: "/servicios/fotografia",
        color: "#FFE66D",
        learningPath: "/learn/fotografia",
      },
      {
        id: "blogs",
        name: "Content & Blogs",
        image: "/services/content-seo.svg",
        shortDescription: "Contenido que atrae y convierte",
        longDescription:
          "Estrategia de contenido integrada: blogs, whitepapers, casos de estudio.",
        features: [
          "Investigación y estrategia",
          "Redacción SEO",
          "Edición y diseño",
          "Distribución multicanal",
        ],
        ctaText: "Leer Blog",
        link: "/servicios/content",
        color: "#95E1D3",
        learningPath: "/learn/content",
      },
      {
        id: "automatizacion",
        name: "Automation n8n",
        image: "/services/automation.svg",
        shortDescription: "Tu agencia funcionando en 24/7",
        longDescription:
          "Flujos de trabajo automatizados que integran todos tus sistemas y herramientas.",
        features: [
          "Integración de CRM",
          "Automatización de leads",
          "Sincronización de datos",
          "Workflows personalizados",
        ],
        ctaText: "Ver Automatizaciones",
        link: "/servicios/automatizacion",
        color: "#A8E6CF",
        learningPath: "/learn/automatizacion",
      },
    ],
  },

  // =========================================
  // 5. THE ENGINE SECTION
  // =========================================
  engine: {
    title: "Ingeniería de procesos enfocada en el retorno de inversión",
    description:
      "Conectamos tecnología, automatización de infraestructura y analítica avanzada para transformar tu operativa en resultados predecibles",

    leftCol: {
      heading: "Elevamos tu infraestructura digital. Escalamos tu impacto.",
      body: "No te ofrecemos servicios aislados; desplegamos un sistema integral de crecimiento operativo. Diseñamos la infraestructura que permite a tu empresa operar a máxima velocidad, optimizar recursos y visualizar el impacto real de cada acción con total claridad técnica y estratégica.",
    },

    advantages: [
      {
        id: "advantage-1",
        title: "Dashboard Propio",
        description:
          "Panel centralizado para monitorear todos tus servicios en tiempo real. Con un ROI completamente visible.",
        iconName: "Monitor",
        iconColor: "#3b82f6",
        iconBg: "#eff6ff",
      },
      {
        id: "advantage-2",
        title: "Integraciones n8n",
        description:
          "Conecta todos tus sistemas de forma automatizada (CRM, Email, Analytics, Social). Sin duplicar trabajo.",
        iconName: "GitMerge",
        iconColor: "#f97316",
        iconBg: "#fff7ed",
      },
      {
        id: "advantage-3",
        title: "Optimización Continua",
        description:
          "Implementación de Machine Learning y análisis de datos permanente para una mejora continua. No nos quedamos solo en la ejecución.",
        iconName: "BarChart2",
        iconColor: "#a855f7",
        iconBg: "#faf5ff",
      },
      {
        id: "advantage-4",
        title: "Equipo Especializado",
        description:
          "Acceso directo a SEO Experts, Fotógrafos, Content Writers y Automation Engineers. Todo tu ecosistema integrado en un mismo lugar.",
        iconName: "Users",
        iconColor: "#ca8a04",
        iconBg: "#fefce8",
      },
    ],

    cta: {
      text: "Explorar solución",
      link: "/servicios",
    },

    ctaBanner: {
      headline: "¿Cuántos clientes estás perdiendo hoy en Google?",
      subtext:
        "Obtén una auditoría gratuita y descubre exactamente qué keywords atacar, qué errores frenan tu web y cómo superarlos en 30 días. Sin permanencia. Sin letra pequeña.",
      button: "Solicitar auditoría gratuita",
      buttonLink: "/contacto",
    },
  },

  // =========================================
  // 6. SEO LOCAL & AUTORIDAD
  // =========================================
  seoAuthority: {
    title: "Autoridad Digital para tu Negocio",
    subtitle: "Posicionamiento Orgánico + Brand Trust",

    keyStats: [
      {
        metric: "150+",
        label: "Proyectos Completados",
      },
      {
        metric: "99%",
        label: "Satisfacción de Clientes",
      },
      {
        metric: "6",
        label: "Meses, resultados",
      },
      {
        metric: "300%",
        label: "ROI promedio",
      },
    ],

    authorityContent: {
      mainText: `Swift Studio es una agencia digital especializada en Marketing 360º y Automatización. 
      Nuestro enfoque integrado combina fotografía profesional, estrategia SEO, content marketing, 
      gestión de redes sociales y automatización avanzada con n8n.
      
      Trabajamos con empresas que buscan no solo creatividad, sino resultados medibles y sostenibles.`,

      schemaType: "LocalBusiness", // Para structured data
    },
  },

  // =========================================
  // 7. QUIÉNES SOMOS
  // =========================================
  quienesSomos: {
    hero: {
      headline: "Donde el Marketing creativo se encuentra con la Ingeniería",
      headlineAccent: "Marketing creativo",
      subheadline:
        "Somos Swift Studio — una agencia digital que integra estrategia, creatividad y automatización avanzada para transformar la presencia digital de tu negocio.",
    },
    origen: {
      headline: "El Origen",
      subheadline: "Una agencia que nace diferente",
      paragraphs: [
        "Swift Studio nació de una convicción simple: el marketing moderno no puede estar separado de la tecnología. Vimos cómo las agencias tradicionales entregaban campañas creativas sin métricas reales, sin automatización, sin visión técnica.",
        "Decidimos construir algo diferente. Un estudio donde el diseño estratégico y el desarrollo fullstack trabajan en sincronía — donde cada decisión de marketing está respaldada por datos en tiempo real y flujos automatizados.",
      ],
      stat: { value: "4+", label: "años transformando negocios digitales" },
    },
    perfil: {
      headline: "Un Perfil Diferente",
      subheadline: "La fusión de dos mundos que normalmente no se hablan",
      areas: [
        {
          category: "Marketing & Creatividad",
          iconName: "Target",
          skills: [
            "SEO Técnico & Contenido",
            "Social Media Strategy",
            "Fotografía & Visual",
            "Content Marketing",
            "Email & Automatización",
          ],
        },
        {
          category: "FullStack & Tecnología",
          iconName: "Code",
          skills: [
            "React & Frontend moderno",
            "Node.js & APIs REST",
            "n8n & Automatización",
            "Bases de datos & Cloud",
            "Integraciones & CRM",
          ],
        },
      ],
    },
    filosofia: {
      headline: "Nuestra Filosofía",
      subheadline: "Los principios que guían cada proyecto",
      principles: [
        {
          iconName: "Target",
          title: "Resultados sobre promesas",
          description:
            "Medimos todo. Cada acción tiene un KPI. Si no se puede medir, no entra en la estrategia.",
        },
        {
          iconName: "Zap",
          title: "Automatización primero",
          description:
            "Los procesos repetibles se automatizan. El talento humano se reserva para la creatividad y la estrategia.",
        },
        {
          iconName: "GitMerge",
          title: "Integración total",
          description:
            "Marketing, tecnología y datos no son silos. Se diseñan juntos desde el inicio para que se potencien mutuamente.",
        },
        {
          iconName: "TrendingUp",
          title: "Escalabilidad desde el día 1",
          description:
            "No construimos soluciones que hay que reemplazar en 6 meses. Cada sistema está diseñado para crecer contigo.",
        },
      ],
    },
    cta: {
      headline: "¿Listo para trabajar con un equipo diferente?",
      subheadline: "Cuéntanos tu proyecto y diseñamos juntos la estrategia.",
      buttonText: "Iniciar Conversación",
    },
  },

  // =========================================
  // 8. SERVICIOS — páginas de detalle
  // =========================================
  servicios: {
    seo: {
      meta: {
        title: "SEO & Posicionamiento — Swift Studio",
        description:
          "Estrategia SEO integral para dominar la primera página de Google y multiplicar tu tráfico orgánico.",
      },
      hero: {
        tag: "SEO & Posicionamiento",
        headline: "Domina la primera página de Google",
        subheadline:
          "Estrategia SEO integral que combina técnica, contenido y autoridad para posicionarte por encima de tu competencia.",
        color: "#FF6B6B",
      },
      problema: {
        headline: "¿Te identificas con alguno de estos problemas?",
        points: [
          {
            iconName: "AlertTriangle",
            text: "Tu web lleva meses activa pero no aparece en Google cuando buscan tus servicios.",
          },
          {
            iconName: "AlertTriangle",
            text: "Tus competidores te superan en resultados a pesar de ofrecer peor producto.",
          },
          {
            iconName: "AlertTriangle",
            text: "Recibes tráfico pero no convierte — las visitas no se traducen en clientes.",
          },
          {
            iconName: "AlertTriangle",
            text: "Has probado agencias antes sin ver resultados medibles en SEO.",
          },
        ],
      },
      solucion: {
        headline: "Nuestra solución SEO",
        subheadline:
          "Un sistema integral que construye autoridad real, no atajos que duren 3 meses.",
        features: [
          {
            iconName: "Search",
            title: "Auditoría técnica completa",
            description:
              "Analizamos velocidad, indexación, estructura y Core Web Vitals para eliminar cada freno técnico.",
          },
          {
            iconName: "Target",
            title: "Estrategia de palabras clave",
            description:
              "Investigación de intención de búsqueda para atacar las keywords que generan clientes, no solo tráfico.",
          },
          {
            iconName: "FileText",
            title: "Contenido SEO optimizado",
            description:
              "Artículos, páginas de servicio y landing pages redactadas para posicionar y convertir.",
          },
          {
            iconName: "Link",
            title: "Link building ético",
            description:
              "Construcción de autoridad mediante menciones y enlaces de calidad en medios relevantes de tu sector.",
          },
        ],
      },
      proceso: {
        headline: "Nuestro proceso SEO",
        steps: [
          {
            number: "01",
            iconName: "Search",
            title: "Auditoría inicial",
            description:
              "Análisis técnico exhaustivo de tu web y benchmarking frente a la competencia.",
          },
          {
            number: "02",
            iconName: "Target",
            title: "Estrategia & keywords",
            description:
              "Mapeamos el universo de búsqueda de tu sector y priorizamos por impacto y viabilidad.",
          },
          {
            number: "03",
            iconName: "Settings",
            title: "Implementación",
            description:
              "Aplicamos las mejoras técnicas y de contenido de forma ordenada y medida.",
          },
          {
            number: "04",
            iconName: "BarChart2",
            title: "Seguimiento y escala",
            description:
              "Reporting mensual con datos reales. Iteramos la estrategia basándonos en resultados.",
          },
        ],
      },
      resultados: {
        headline: "Resultados esperados",
        stats: [
          { value: "3x", label: "tráfico orgánico en 6 meses" },
          { value: "Top 3", label: "posiciones en keywords objetivo" },
          { value: "6", label: "meses para ver resultados sólidos" },
        ],
      },
      cta: {
        headline: "¿Listo para dominar Google?",
        subheadline: "Empieza con una auditoría gratuita de tu web.",
        buttonText: "Empezar ahora",
      },
    },

    "social-media": {
      meta: {
        title: "Social Media & Community — Swift Studio",
        description:
          "Estrategia de redes sociales integrada con automatización y análisis de datos para crecer y vender.",
      },
      hero: {
        tag: "Social Media",
        headline: "Community. Engagement. Resultados reales.",
        subheadline:
          "Gestionamos tu presencia en redes con estrategia, contenido de calidad y automatización para que cada post trabaje a favor de tu negocio.",
        color: "#4ECDC4",
      },
      problema: {
        headline: "¿Te suena familiar?",
        points: [
          {
            iconName: "AlertTriangle",
            text: "Publicas con regularidad pero el engagement es casi nulo — nadie interactúa.",
          },
          {
            iconName: "AlertTriangle",
            text: "No tienes una estrategia definida: publicas lo que se ocurre sin un hilo conductor.",
          },
          {
            iconName: "AlertTriangle",
            text: "Las redes te consumen tiempo sin generar retorno visible en clientes o ventas.",
          },
          {
            iconName: "AlertTriangle",
            text: "Tus competidores tienen comunidades activas y tú no sabes cómo lograrlo.",
          },
        ],
      },
      solucion: {
        headline: "Gestión social que genera negocio",
        subheadline:
          "No solo publicamos — construimos una comunidad que compra.",
        features: [
          {
            iconName: "Calendar",
            title: "Calendario editorial estratégico",
            description:
              "Planificación mensual alineada con tus objetivos, temporadas y tendencias del sector.",
          },
          {
            iconName: "Users",
            title: "Gestión de comunidad",
            description:
              "Respuesta activa a comentarios y mensajes. Construimos relaciones, no solo seguidores.",
          },
          {
            iconName: "Zap",
            title: "Automatización de publicaciones",
            description:
              "Programación inteligente para publicar en los momentos de mayor alcance e impacto.",
          },
          {
            iconName: "BarChart2",
            title: "Análisis y reporting",
            description:
              "Métricas reales cada mes: alcance, engagement, conversiones y ROI de cada red.",
          },
        ],
      },
      proceso: {
        headline: "Cómo trabajamos tu Social Media",
        steps: [
          {
            number: "01",
            iconName: "Search",
            title: "Análisis de marca y competencia",
            description:
              "Estudiamos tu posicionamiento actual y lo que hace bien tu competencia para superarlo.",
          },
          {
            number: "02",
            iconName: "Target",
            title: "Estrategia y tono de voz",
            description:
              "Definimos pilares de contenido, audiencia objetivo y la voz que diferencia tu marca.",
          },
          {
            number: "03",
            iconName: "Edit",
            title: "Producción de contenido",
            description:
              "Creación de piezas visuales, copies y formatos adaptados a cada plataforma.",
          },
          {
            number: "04",
            iconName: "BarChart2",
            title: "Publicación y optimización",
            description:
              "Publicamos, monitorizamos y ajustamos la estrategia según los datos semanalmente.",
          },
        ],
      },
      resultados: {
        headline: "Resultados que conseguimos",
        stats: [
          { value: "+200%", label: "engagement medio en 3 meses" },
          { value: "40h", label: "mensuales ahorradas en gestión" },
          { value: "+150%", label: "crecimiento de seguidores cualificados" },
        ],
      },
      cta: {
        headline: "¿Quieres una comunidad que compra?",
        subheadline:
          "Te mostramos cómo transformar tus redes en un canal de ventas.",
        buttonText: "Empezar ahora",
      },
    },

    fotografia: {
      meta: {
        title: "Fotografía Profesional — Swift Studio",
        description:
          "Sesiones fotográficas profesionales para producto, empresa y eventos. Storytelling visual que vende.",
      },
      hero: {
        tag: "Fotografía Profesional",
        headline: "Historias visuales que venden",
        subheadline:
          "Fotografía profesional para producto, corporate y eventos. Imágenes que comunican el valor de tu marca antes de que el cliente lea una sola palabra.",
        color: "#FFE66D",
      },
      problema: {
        headline: "Las imágenes importan más de lo que crees",
        points: [
          {
            iconName: "AlertTriangle",
            text: "Tus fotos no transmiten la calidad real de tu producto o servicio.",
          },
          {
            iconName: "AlertTriangle",
            text: "Usas imágenes de stock que cualquier competidor podría usar — no hay diferenciación.",
          },
          {
            iconName: "AlertTriangle",
            text: "Tu web y redes no tienen cohesión visual — cada sección parece de una marca diferente.",
          },
          {
            iconName: "AlertTriangle",
            text: "Las fotos actuales frenan la conversión: el cliente no confía en lo que ve.",
          },
        ],
      },
      solucion: {
        headline: "Fotografía que trabaja por tu marca",
        subheadline:
          "Cada sesión está diseñada para crear un banco de imágenes que funciona en todos tus canales.",
        features: [
          {
            iconName: "Camera",
            title: "Fotografía de producto",
            description:
              "Imágenes de producto con luz profesional, para e-commerce, catálogos y campañas publicitarias.",
          },
          {
            iconName: "Users",
            title: "Fotografía corporativa",
            description:
              "Retratos de equipo, fotos de instalaciones y material para branding empresarial.",
          },
          {
            iconName: "Globe",
            title: "Cobertura de eventos",
            description:
              "Documentamos lanzamientos, ferias y eventos con discreción y ojo narrativo.",
          },
          {
            iconName: "Settings",
            title: "Retoque y postproducción",
            description:
              "Edición profesional con coherencia de color y estilo para toda la sesión.",
          },
        ],
      },
      proceso: {
        headline: "Así trabajamos cada sesión",
        steps: [
          {
            number: "01",
            iconName: "FileText",
            title: "Briefing creativo",
            description:
              "Entendemos tu marca, tus canales y el uso que darás a las imágenes antes de preparar nada.",
          },
          {
            number: "02",
            iconName: "Target",
            title: "Dirección artística",
            description:
              "Definimos el mood, los espacios, el estilismo y el plan de rodaje al detalle.",
          },
          {
            number: "03",
            iconName: "Camera",
            title: "Sesión fotográfica",
            description:
              "Ejecutamos la sesión con equipo profesional y atención máxima al detalle.",
          },
          {
            number: "04",
            iconName: "Settings",
            title: "Edición y entrega",
            description:
              "Postproducción completa y entrega en 48h en los formatos que necesitas.",
          },
        ],
      },
      resultados: {
        headline: "Lo que consigues",
        stats: [
          {
            value: "+80%",
            label: "tasa de conversión con imágenes profesionales",
          },
          { value: "48h", label: "tiempo de entrega tras la sesión" },
          { value: "100%", label: "derechos de uso sobre todas las imágenes" },
        ],
      },
      cta: {
        headline: "¿Listo para mostrar tu mejor versión?",
        subheadline:
          "Cuéntanos qué necesitas y preparamos el presupuesto en 24h.",
        buttonText: "Pedir presupuesto",
      },
    },

    content: {
      meta: {
        title: "Content Marketing & Blogs — Swift Studio",
        description:
          "Estrategia de contenidos SEO, blogs y redacción profesional para atraer tráfico orgánico y convertir visitantes en clientes.",
      },
      hero: {
        tag: "Content & Blogs",
        headline: "Contenido que atrae, convierte y posiciona",
        subheadline:
          "Estrategia editorial integrada con SEO para que tu blog y tus contenidos trabajen 24/7 atrayendo clientes cualificados.",
        color: "#95E1D3",
      },
      problema: {
        headline: "¿Tu contenido no está generando resultados?",
        points: [
          {
            iconName: "AlertTriangle",
            text: "Tienes un blog con artículos pero no genera tráfico ni leads.",
          },
          {
            iconName: "AlertTriangle",
            text: "Escribes sin una estrategia: sin keywords, sin estructura SEO, sin intención de búsqueda.",
          },
          {
            iconName: "AlertTriangle",
            text: "No tienes tiempo ni recursos para mantener una producción de contenido constante.",
          },
          {
            iconName: "AlertTriangle",
            text: "El contenido que publicas no diferencia tu marca de la competencia.",
          },
        ],
      },
      solucion: {
        headline: "Contenido con estrategia y resultados",
        subheadline:
          "Cada pieza de contenido está diseñada para posicionar, atraer y convertir.",
        features: [
          {
            iconName: "Search",
            title: "Investigación y estrategia",
            description:
              "Análisis de keywords, intención de búsqueda y mapa de contenidos alineado con tu embudo de ventas.",
          },
          {
            iconName: "Edit",
            title: "Redacción SEO profesional",
            description:
              "Artículos, landing pages y copies escritos para posicionar en Google y persuadir al lector.",
          },
          {
            iconName: "Layers",
            title: "Diseño y maquetación",
            description:
              "Contenido visual enriquecido con infografías, imágenes y estructura que mejora la experiencia.",
          },
          {
            iconName: "Share2",
            title: "Distribución multicanal",
            description:
              "Adaptamos cada contenido a newsletter, redes sociales y otros canales para maximizar el alcance.",
          },
        ],
      },
      proceso: {
        headline: "Nuestro flujo de contenidos",
        steps: [
          {
            number: "01",
            iconName: "Search",
            title: "Investigación de keywords",
            description:
              "Identificamos las oportunidades de contenido con mayor potencial de tráfico y conversión.",
          },
          {
            number: "02",
            iconName: "FileText",
            title: "Planificación editorial",
            description:
              "Calendario de contenidos mensual con temas, formatos y fechas de publicación.",
          },
          {
            number: "03",
            iconName: "Edit",
            title: "Redacción y diseño",
            description:
              "Producción del contenido con optimización SEO integrada desde el primer borrador.",
          },
          {
            number: "04",
            iconName: "Share2",
            title: "Publicación y distribución",
            description:
              "Publicamos y distribuimos cada pieza para maximizar su impacto y alcance.",
          },
        ],
      },
      resultados: {
        headline: "Resultados de una estrategia de contenidos",
        stats: [
          { value: "10x", label: "tráfico orgánico en 12 meses" },
          { value: "+DA", label: "autoridad de dominio creciente" },
          { value: "3x", label: "más leads desde el blog" },
        ],
      },
      cta: {
        headline: "¿Tu contenido debería estar trabajando por ti?",
        subheadline:
          "Diseñamos una estrategia editorial a medida para tu negocio.",
        buttonText: "Empezar ahora",
      },
    },

    automatizacion: {
      meta: {
        title: "Automatización n8n — Swift Studio",
        description:
          "Flujos de trabajo automatizados con n8n para integrar tus sistemas, eliminar procesos manuales y escalar tu negocio.",
      },
      hero: {
        tag: "Automatización n8n",
        headline: "Tu agencia funcionando en piloto automático",
        subheadline:
          "Diseñamos e implementamos flujos de trabajo automatizados con n8n que conectan todos tus sistemas y eliminan las tareas repetitivas para siempre.",
        color: "#A8E6CF",
      },
      problema: {
        headline: "¿Cuánto tiempo pierdes en procesos manuales?",
        points: [
          {
            iconName: "AlertTriangle",
            text: "Tu equipo dedica horas cada semana a tareas repetitivas que podría hacer un sistema.",
          },
          {
            iconName: "AlertTriangle",
            text: "Los datos de tu negocio están en silos — CRM, email, analytics y redes no se hablan entre sí.",
          },
          {
            iconName: "AlertTriangle",
            text: "Los errores humanos en procesos repetitivos te están costando clientes y reputación.",
          },
          {
            iconName: "AlertTriangle",
            text: "No puedes escalar: cada nuevo cliente multiplica la carga de trabajo manual.",
          },
        ],
      },
      solucion: {
        headline: "Automatización real con n8n",
        subheadline:
          "Conectamos todos tus sistemas y construimos flujos que trabajan 24/7 sin supervisión.",
        features: [
          {
            iconName: "GitMerge",
            title: "Integración de sistemas",
            description:
              "Conectamos tu CRM, email marketing, facturación, analytics y redes en un solo flujo coherente.",
          },
          {
            iconName: "Zap",
            title: "Automatización de leads",
            description:
              "Captura, clasificación, notificación y seguimiento de leads de forma totalmente automática.",
          },
          {
            iconName: "BarChart2",
            title: "Reportes automáticos",
            description:
              "Informes semanales y mensuales generados y enviados automáticamente a tu equipo.",
          },
          {
            iconName: "Settings",
            title: "Workflows personalizados",
            description:
              "Diseñamos flujos a medida para los procesos únicos de tu negocio, sin soluciones genéricas.",
          },
        ],
      },
      proceso: {
        headline: "Cómo implementamos la automatización",
        steps: [
          {
            number: "01",
            iconName: "Search",
            title: "Mapeo de procesos",
            description:
              "Identificamos todos los procesos repetitivos y manuales de tu negocio y su impacto.",
          },
          {
            number: "02",
            iconName: "Target",
            title: "Diseño de flujos",
            description:
              "Diseñamos la arquitectura de automatización: qué se conecta con qué y cómo.",
          },
          {
            number: "03",
            iconName: "Settings",
            title: "Implementación en n8n",
            description:
              "Construimos y configuramos cada workflow con pruebas exhaustivas en entorno de staging.",
          },
          {
            number: "04",
            iconName: "Monitor",
            title: "Monitoreo continuo",
            description:
              "Dashboard de estado de todos los flujos. Alertas automáticas si algo falla.",
          },
        ],
      },
      resultados: {
        headline: "El impacto de la automatización",
        stats: [
          { value: "40h", label: "mensuales liberadas por automatización" },
          { value: "0", label: "errores en procesos automatizados" },
          { value: "30", label: "días para ver el ROI" },
        ],
      },
      cta: {
        headline: "¿Listo para dejar de hacer trabajo manual?",
        subheadline:
          "Te mostramos qué procesos de tu negocio podemos automatizar esta semana.",
        buttonText: "Ver automatizaciones",
      },
    },
  },

  // =========================================
  // 9. CONFIGURACIÓN FOOTER & NAVEGACIÓN
  // =========================================
  navigation: {
    internal: [
      { label: "Inicio", href: "/" },
      { label: "Servicios", href: "/servicios" },
      { label: "Portafolio", href: "/portafolio" },
      { label: "Blog", href: "/blog" },
      { label: "Contacto", href: "/contacto" },
    ],
    external: [
      {
        label: "Dashboard",
        href: "https://ecommerce.swiftstudio.com",
        external: true,
      },
    ],
  },
};

export default SECTOR_CONFIG;
