import fastify from 'fastify'
import { ZodError, z } from 'zod'
import { ordersRoutes } from './routes/orders.routes'

export function buildApp() {
  const app = fastify()

  app.register(ordersRoutes)

  app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        code: 400,
        message: 'Invalid parameters.',
        errors: z.treeifyError(error),
      })
    }

    return reply.status(500).send({
      code: 500,
      message: `Internal Server Error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    })
  })

  return app
}
