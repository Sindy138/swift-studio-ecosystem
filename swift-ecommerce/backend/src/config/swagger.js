const swaggerJsdoc = require('swagger-jsdoc')

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swift Studio 360 API',
      version: '1.0.0',
      description:
        'API REST de la plataforma e-commerce de servicios productizados de Swift Studio 360. Autenticación con JWT Bearer.',
    },
    servers: [{ url: '/api', description: 'Base path' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT obtenido en POST /auth/login',
        },
      },
    },
  },
  apis: ['./src/features/**/*.routes.js'],
})

module.exports = spec
