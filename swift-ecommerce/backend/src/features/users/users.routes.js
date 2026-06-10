const { Router } = require('express')
const rateLimit = require('express-rate-limit')
const { listUsers, getUser, updateUser, deleteUser } = require('./users.controller')
const { UpdateUserSchema } = require('./users.schema')
const { validate } = require('../../middlewares/validate.middleware')
const { authenticate, isAdmin } = require('../../middlewares/auth.middleware')

const adminListLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many list requests, please try again later' },
})

const router = Router()

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Listar todos los usuarios (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo administradores
 */
router.get('/', authenticate, isAdmin, adminListLimiter, listUsers)

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por ID (propio o Admin)
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
 *         description: Usuario encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo el propio usuario o un administrador
 *       404:
 *         description: Usuario no encontrado
 *   put:
 *     tags: [Users]
 *     summary: Actualizar usuario (propio o Admin)
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
 *               email:
 *                 type: string
 *                 format: email
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               companyName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar usuario (Admin)
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
 *         description: Usuario eliminado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo administradores
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', authenticate, getUser)
router.put('/:id', authenticate, validate(UpdateUserSchema), updateUser)
router.delete('/:id', authenticate, isAdmin, deleteUser)

module.exports = router
