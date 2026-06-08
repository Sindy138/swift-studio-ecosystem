const { tool } = require('@langchain/core/tools')
const { z } = require('zod')
const prisma = require('../../../lib/prisma')

// Tool 1: RAG — busca en documentación de la agencia
// Stub hasta Tarea B3 (ChromaDB). La firma y el contrato de respuesta no cambian.
const searchAgencyDocs = tool(
  async ({ query }) => {
    // TODO (Tarea B3): reemplazar con consulta real a ChromaDB
    return JSON.stringify({
      results: [],
      sources: [],
      note: 'La documentación RAG aún no está indexada. Responde solo con lo que sabes de Swift Studio 360.',
    })
  },
  {
    name: 'search_agency_docs',
    description:
      'Busca en la documentación interna de Swift Studio 360: historia de la agencia, metodología, FAQs, portfolio y procesos de trabajo. Usa esta herramienta para preguntas generales sobre la agencia.',
    schema: z.object({
      query: z.string().describe('Consulta de búsqueda en lenguaje natural'),
    }),
  }
)

// Tool 2: DB — consulta servicios y precios en tiempo real desde PostgreSQL
const searchServices = tool(
  async ({ category, name }) => {
    const where = { isActive: true }
    if (category) where.category = { contains: category, mode: 'insensitive' }
    if (name) where.name = { contains: name, mode: 'insensitive' }

    const services = await prisma.service.findMany({
      where,
      select: { name: true, description: true, price: true, category: true },
      orderBy: { category: 'asc' },
    })

    if (services.length === 0) {
      return 'No se encontraron servicios activos con esos criterios.'
    }

    return JSON.stringify(services)
  },
  {
    name: 'search_services',
    description:
      'Consulta los servicios activos de Swift Studio 360 con sus precios y descripciones. Úsala cuando el usuario pregunte por servicios específicos, precios, categorías o qué opciones tiene disponibles.',
    schema: z.object({
      category: z
        .string()
        .optional()
        .describe('Categoría del servicio: SEO, Contenidos, Fotografía o Automatización'),
      name: z.string().optional().describe('Nombre o parte del nombre del servicio'),
    }),
  }
)

module.exports = { searchAgencyDocs, searchServices }
