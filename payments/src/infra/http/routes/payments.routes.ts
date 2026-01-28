import { FastifyInstance } from 'fastify'
import { GetPaymentByIdController } from '../controllers/get-payment-by-id.controller'
import { GetPaymentByOrderIdController } from '../controllers/get-payment-by-order-id.controller'
import { ResolvePaymentController } from '../webhooks/resolve-payment.controller'

export async function paymentsRoutes(app: FastifyInstance) {
  const getPaymentByIdController = new GetPaymentByIdController()
  const getPaymentByOrderIdController = new GetPaymentByOrderIdController()
  const resolvePaymentController = new ResolvePaymentController()

  app.get('/payments/:id', (request, reply) =>
    getPaymentByIdController.handle(request, reply),
  )

  app.get('/payments/order/:orderId', (request, reply) =>
    getPaymentByOrderIdController.handle(request, reply),
  )

  app.post('/payments/:id/resolve', (request, reply) =>
    resolvePaymentController.handle(request, reply),
  )
}
