const { createReactAgent } = require('@langchain/langgraph/prebuilt')
const { ChatGroq } = require('@langchain/groq')
const { HumanMessage, AIMessage, SystemMessage } = require('@langchain/core/messages')
const { searchAgencyDocs, searchServices } = require('./tools')

const SYSTEM_PROMPT = `Eres el asistente de IA de Swift Studio 360, una agencia de marketing digital y contenido audiovisual.
Tu misión es ayudar a los clientes a conocer los servicios, precios, procesos de trabajo y resolver sus dudas.

Instrucciones:
- Sé profesional, cercano y conciso. Responde siempre en español.
- Usa 'search_agency_docs' para preguntas sobre la agencia, metodología, FAQs o portfolio.
- Usa 'search_services' para preguntas sobre servicios concretos, precios o categorías disponibles.
- Cuando utilices información de documentos, menciona la fuente entre paréntesis.
- Si no encuentras información relevante, dilo con honestidad y ofrece alternativas.
- Nunca inventes precios ni datos que no hayan sido confirmados por las herramientas.`

function buildMessages(history) {
  const recentHistory = history.slice(-10) // últimos 10 turnos para no saturar el contexto
  return [
    new SystemMessage(SYSTEM_PROMPT),
    ...recentHistory.map((m) =>
      m.role === 'USER' ? new HumanMessage(m.content) : new AIMessage(m.content)
    ),
  ]
}

function extractSources(messages) {
  const sources = []
  for (const msg of messages) {
    const type = typeof msg._getType === 'function' ? msg._getType() : null
    if (type === 'tool') {
      try {
        const parsed = JSON.parse(msg.content)
        if (Array.isArray(parsed.sources)) sources.push(...parsed.sources)
      } catch (_) {
        // contenido no es JSON estructurado — ignorar
      }
    }
  }
  return [...new Set(sources)]
}

async function runAgent(message, history) {
  if (!process.env.GROQ_API_KEY) {
    return {
      answer: '[Agente IA no configurado] Falta la variable GROQ_API_KEY en el entorno.',
      sources: [],
      traceId: null,
    }
  }

  try {
    const llm = new ChatGroq({
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.3,
      apiKey: process.env.GROQ_API_KEY,
    })

    const agent = createReactAgent({ llm, tools: [searchAgencyDocs, searchServices] })

    // history ya incluye el mensaje actual del usuario como último elemento
    const messages = buildMessages(history)
    const result = await agent.invoke({ messages })

    const lastMessage = result.messages[result.messages.length - 1]
    const sources = extractSources(result.messages)

    return {
      answer: lastMessage.content,
      sources,
      traceId: null, // se rellenará en Tarea B4 (LangFuse)
    }
  } catch (err) {
    console.error('[Agent error]', err.message)
    return {
      answer:
        'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, inténtalo de nuevo en unos momentos.',
      sources: [],
      traceId: null,
    }
  }
}

module.exports = { runAgent }
