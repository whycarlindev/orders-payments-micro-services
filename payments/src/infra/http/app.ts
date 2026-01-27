import fastify from 'fastify'
import { ZodError, z } from 'zod'
import { paymentsRoutes } from './routes/payments.routes'

export const app = fastify()

app.register(paymentsRoutes)

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
