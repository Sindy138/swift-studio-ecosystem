const { Router } = require('express')
const rateLimit = require('express-rate-limit')
const { register, login } = require('./auth.controller')
const { RegisterSchema, LoginSchema } = require('./auth.schema')
const { validate } = require('../../middlewares/validate.middleware')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again in 15 minutes' },
})

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many accounts created from this IP, please try again in 1 hour' },
})

const router = Router()

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@swiftstudio.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: MiPassword123
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             example:
 *               user: { id: "cuid", email: "usuario@swiftstudio.com", role: "USER", createdAt: "2026-06-09T10:00:00.000Z" }
 *               token: "eyJhbGci..."
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: El email ya está registrado
 */
router.post('/register', registerLimiter, validate(RegisterSchema), register)

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@swiftstudio.com
 *               password:
 *                 type: string
 *                 example: MiPassword123
 *     responses:
 *       200:
 *         description: Login correcto — devuelve JWT
 *         content:
 *           application/json:
 *             example:
 *               user: { id: "cuid", email: "usuario@swiftstudio.com", role: "USER" }
 *               token: "eyJhbGci..."
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', loginLimiter, validate(LoginSchema), login)

module.exports = router
