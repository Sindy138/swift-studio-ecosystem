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

/**
 * @openapi
 * /chat:
 *   post:
 *     tags: [Chat]
 *     summary: Enviar mensaje al agente IA
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *                 maxLength: 2000
 *                 example: "¿Qué servicios de SEO ofrecéis?"
 *               conversationId:
 *                 type: string
 *                 description: UUID de conversación existente (omitir para nueva conversación)
 *     responses:
 *       200:
 *         description: Respuesta del agente
 *         content:
 *           application/json:
 *             example:
 *               conversationId: "uuid-conversacion"
 *               message:
 *                 id: "cuid"
 *                 role: "ASSISTANT"
 *                 content: "Ofrecemos auditorías SEO desde 299€..."
 *                 sources: ["services-seo.md"]
 *                 traceId: "uuid-langfuse"
 *       400:
 *         description: Mensaje vacío o demasiado largo
 *       401:
 *         description: No autenticado
 *       429:
 *         description: Límite de peticiones alcanzado (30/min)
 *       502:
 *         description: El agente devolvió una respuesta inesperada
 */
router.post('/', authenticate, chatLimiter, validate(SendMessageSchema), detectPromptInjection, sendMessage)

/**
 * @openapi
 * /chat/history/{conversationId}:
 *   get:
 *     tags: [Chat]
 *     summary: Obtener historial de una conversación (owner)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial de mensajes
 *         content:
 *           application/json:
 *             example:
 *               conversationId: "uuid-conversacion"
 *               messages:
 *                 - id: "cuid"
 *                   role: "USER"
 *                   content: "¿Qué servicios de SEO ofrecéis?"
 *                   sources: []
 *                   createdAt: "2026-06-09T10:00:00.000Z"
 *       401:
 *         description: No autenticado
 *       403:
 *         description: La conversación no pertenece a este usuario
 */
router.get('/history/:conversationId', authenticate, getChatHistory)

/**
 * @openapi
 * /chat/{traceId}/feedback:
 *   post:
 *     tags: [Chat]
 *     summary: Enviar feedback 👍/👎 sobre una respuesta del agente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: traceId
 *         required: true
 *         schema:
 *           type: string
 *         description: traceId devuelto en la respuesta del agente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [score]
 *             properties:
 *               score:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: 1 = positivo, 0 = negativo
 *     responses:
 *       200:
 *         description: Feedback registrado
 *         content:
 *           application/json:
 *             example:
 *               traceId: "uuid-langfuse"
 *               score: 1
 *               recorded: true
 *       401:
 *         description: No autenticado
 *       404:
 *         description: traceId no encontrado o no pertenece al usuario
 */
router.post('/:traceId/feedback', authenticate, validate(FeedbackSchema), submitFeedback)

module.exports = router
