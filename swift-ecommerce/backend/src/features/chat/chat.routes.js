const { Router } = require('express')
const rateLimit = require('express-rate-limit')
const { sendMessage, getChatHistory, submitFeedback } = require('./chat.controller')
const { SendMessageSchema, FeedbackSchema } = require('./chat.schema')
const { validate } = require('../../middlewares/validate.middleware')
const { authenticate } = require('../../middlewares/auth.middleware')
const { detectPromptInjection } = require('../../middlewares/promptSecurity.middleware')

// Capa 4: rate limiter específico para el endpoint de IA (más restrictivo que el global)
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones al chat. Espera un momento antes de continuar.' },
})

const router = Router()

router.post('/', authenticate, chatLimiter, validate(SendMessageSchema), detectPromptInjection, sendMessage)
router.get('/history/:conversationId', authenticate, getChatHistory)
router.post('/:traceId/feedback', authenticate, validate(FeedbackSchema), submitFeedback)

module.exports = router
