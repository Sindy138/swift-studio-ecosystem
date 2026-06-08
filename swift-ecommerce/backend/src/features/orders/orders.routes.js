const { Router } = require('express')
const rateLimit = require('express-rate-limit')

const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many orders created, please try again later' },
})
const {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  addDeliverable,
  listDeliverables,
} = require('./orders.controller')
const { CreateOrderSchema, UpdateOrderStatusSchema, CreateDeliverableSchema } = require('./orders.schema')
const { validate } = require('../../middlewares/validate.middleware')
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware')

const router = Router()

router.post('/', authenticate, createOrderLimiter, validate(CreateOrderSchema), createOrder)
router.get('/', authenticate, listOrders)
router.get('/:id', authenticate, getOrder)
router.put('/:id/status', authenticate, isAdmin, validate(UpdateOrderStatusSchema), updateOrderStatus)

router.post('/:id/deliverables', authenticate, isAdmin, validate(CreateDeliverableSchema), addDeliverable)
router.get('/:id/deliverables', authenticate, listDeliverables)

module.exports = router
