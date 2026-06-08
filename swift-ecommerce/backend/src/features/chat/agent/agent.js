// Stub — será reemplazado en Tarea 2 (LangGraph + ChromaDB + Groq)
// Firma que debe respetar la implementación real:
//   runAgent(message: string, history: ConversationMessage[]) → { answer: string, sources: string[], traceId: string|null }

async function runAgent(message, history) {
  return {
    answer: `[Agente IA no configurado] Recibí tu mensaje: "${message}". Vuelve cuando el agente LangGraph esté integrado.`,
    sources: [],
    traceId: null,
  }
}

module.exports = { runAgent }
