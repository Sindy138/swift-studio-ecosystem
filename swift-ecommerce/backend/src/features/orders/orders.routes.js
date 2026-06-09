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

/**
 * @openapi
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Crear un pedido
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceId]
 *             properties:
 *               serviceId:
 *                 type: string
 *                 example: "cuid_del_servicio"
 *               configData:
 *                 type: object
 *                 example: { keywords: "marketing digital", location: "Madrid" }
 *     responses:
 *       201:
 *         description: Pedido creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *   get:
 *     tags: [Orders]
 *     summary: Listar pedidos (propios o todos si Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       401:
 *         description: No autenticado
 */
router.post('/', authenticate, createOrderLimiter, validate(CreateOrderSchema), createOrder)
router.get('/', authenticate, listOrders)

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Obtener pedido por ID (owner o Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/:id', authenticate, getOrder)

/**
 * @openapi
 * /orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Actualizar estado del pedido (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PROGRESS, DONE]
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Estado inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo administradores
 *       404:
 *         description: Pedido no encontrado
 */
router.put('/:id/status', authenticate, isAdmin, validate(UpdateOrderStatusSchema), updateOrderStatus)

/**
 * @openapi
 * /orders/{id}/deliverables:
 *   post:
 *     tags: [Orders]
 *     summary: Añadir entregable a un pedido (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [label, url]
 *             properties:
 *               label:
 *                 type: string
 *                 example: "Informe SEO final"
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: "https://drive.google.com/file/..."
 *     responses:
 *       201:
 *         description: Entregable añadido
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo administradores
 *   get:
 *     tags: [Orders]
 *     summary: Listar entregables de un pedido (owner o Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de entregables
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.post('/:id/deliverables', authenticate, isAdmin, validate(CreateDeliverableSchema), addDeliverable)
router.get('/:id/deliverables', authenticate, listDeliverables)

module.exports = router
