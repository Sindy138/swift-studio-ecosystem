const { z } = require('zod')

const SendMessageSchema = z.object({
  message: z.string().min(1, { message: 'Message is required' }).max(2000),
  conversationId: z.string().optional(),
})

const FeedbackSchema = z.object({
  score: z.union([z.literal(0), z.literal(1)], {
    errorMap: () => ({ message: 'Score must be 0 (negative) or 1 (positive)' }),
  }),
})

// Valida la respuesta del agente antes de guardarla en BD (OWASP API10)
const AgentResponseSchema = z.object({
  answer: z.string().min(1),
  sources: z.array(z.string()).default([]),
  traceId: z.string().nullable().default(null),
})

module.exports = { SendMessageSchema, FeedbackSchema, AgentResponseSchema }
