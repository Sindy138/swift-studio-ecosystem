const { Router } = require('express')
const { sendMessage, getChatHistory, submitFeedback } = require('./chat.controller')
const { SendMessageSchema, FeedbackSchema } = require('./chat.schema')
const { validate } = require('../../middlewares/validate.middleware')
const { authenticate } = require('../../middlewares/auth.middleware')

const router = Router()

router.post('/', authenticate, validate(SendMessageSchema), sendMessage)
router.get('/history/:conversationId', authenticate, getChatHistory)
router.post('/:traceId/feedback', authenticate, validate(FeedbackSchema), submitFeedback)

module.exports = router
