const { Router } = require('express')
const { listServices, getService, createService, updateService, deleteService } = require('./services.controller')
const { CreateServiceSchema, UpdateServiceSchema } = require('./services.schema')
const { validate } = require('../../middlewares/validate.middleware')
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware')

const router = Router()

/**
 * @openapi
 * /services:
 *   get:
 *     tags: [Services]
 *     summary: Listar todos los servicios activos
 *     responses:
 *       200:
 *         description: Lista de servicios
 *         content:
 *           application/json:
 *             example:
 *               - id: "cuid"
 *                 name: "Auditoría SEO Express"
 *                 description: "Análisis completo del estado SEO"
 *                 price: 299
 *                 category: "SEO"
 *                 isActive: true
 */
router.get('/', listServices)

/**
 * @openapi
 * /services/{id}:
 *   get:
 *     tags: [Services]
 *     summary: Obtener un servicio por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/:id', getService)

/**
 * @openapi
 * /services:
 *   post:
 *     tags: [Services]
 *     summary: Crear servicio (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, category]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               formConfig:
 *                 type: object
 *     responses:
 *       201:
 *         description: Servicio creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo administradores
 */
router.post('/', authenticate, isAdmin, validate(CreateServiceSchema), createService)

/**
 * @openapi
 * /services/{id}:
 *   put:
 *     tags: [Services]
 *     summary: Actualizar servicio (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Servicio actualizado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo administradores
 *       404:
 *         description: Servicio no encontrado
 *   delete:
 *     tags: [Services]
 *     summary: Eliminar servicio (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Servicio eliminado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo administradores
 *       404:
 *         description: Servicio no encontrado
 */
router.put('/:id', authenticate, isAdmin, validate(UpdateServiceSchema), updateService)
router.delete('/:id', authenticate, isAdmin, deleteService)

module.exports = router
