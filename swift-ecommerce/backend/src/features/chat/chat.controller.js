const { randomUUID } = require('crypto')
const prisma = require('../../lib/prisma')
const asyncHandler = require('../../lib/asyncHandler')
const { runAgent } = require('./agent/agent')
const { AgentResponseSchema } = require('./chat.schema')

const sendMessage = asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body
  const userId = req.user.id

  // Capa 5: log de auditoría — solo metadatos, nunca el contenido del mensaje
  console.info(`[CHAT] userId: ${userId} | length: ${message.length} | convId: ${conversationId ?? 'new'}`)

  // Si se provee conversationId, verificar que pertenece al usuario
  if (conversationId) {
    const belongs = await prisma.conversationMessage.findFirst({
      where: { conversationId, userId },
    })
    if (!belongs) return res.status(403).json({ error: 'Forbidden' })
  }

  const convId = conversationId || randomUUID()

  // Guardar mensaje del usuario
  await prisma.conversationMessage.create({
    data: { conversationId: convId, role: 'USER', content: message, userId },
  })

  // Recuperar historial para dárselo al agente como contexto
  const history = await prisma.conversationMessage.findMany({
    where: { conversationId: convId },
    orderBy: { createdAt: 'asc' },
  })

  const rawResponse = await runAgent(message, history)

  // API10: validar la respuesta del agente con Zod antes de guardar en BD
  const parsed = AgentResponseSchema.safeParse(rawResponse)
  if (!parsed.success) {
    console.error('[CHAT] Respuesta del agente no válida:', parsed.error.flatten())
    return res.status(502).json({ error: 'El agente devolvió una respuesta inesperada. Inténtalo de nuevo.' })
  }

  const agentResponse = parsed.data

  // Guardar respuesta del agente
  const assistantMessage = await prisma.conversationMessage.create({
    data: {
      conversationId: convId,
      role: 'ASSISTANT',
      content: agentResponse.answer,
      sources: agentResponse.sources,
      traceId: agentResponse.traceId,
      userId,
    },
  })

  return res.json({ conversationId: convId, message: assistantMessage })
})

const getChatHistory = asyncHandler(async (req, res) => {
  const { conversationId } = req.params
  const userId = req.user.id

  // Verificar que la conversación pertenece al usuario
  const belongs = await prisma.conversationMessage.findFirst({
    where: { conversationId, userId },
  })
  if (!belongs) return res.status(403).json({ error: 'Forbidden' })

  const messages = await prisma.conversationMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, role: true, content: true, sources: true, createdAt: true },
  })

  return res.json({ conversationId, messages })
})

const submitFeedback = asyncHandler(async (req, res) => {
  const { traceId } = req.params
  const { score } = req.body

  // Verificar que el traceId corresponde a un mensaje del usuario autenticado
  const message = await prisma.conversationMessage.findFirst({
    where: { traceId, userId: req.user.id },
  })
  if (!message) return res.status(404).json({ error: 'Trace not found' })

  // La integración con LangFuse se añade en Tarea 4
  // Por ahora confirmamos que se recibió el feedback
  return res.json({ traceId, score, recorded: false })
})

module.exports = { sendMessage, getChatHistory, submitFeedback }
