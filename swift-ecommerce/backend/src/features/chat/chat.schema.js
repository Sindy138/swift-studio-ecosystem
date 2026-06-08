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

module.exports = { SendMessageSchema, FeedbackSchema }
