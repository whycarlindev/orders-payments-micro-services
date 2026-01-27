import { FastifyInstance } from 'fastify'
import { CreateOrderController } from '../controllers/create-order.controller'
import { FetchOrdersController } from '../controllers/fetch-orders.controller'
import { GetOrderByIdController } from '../controllers/get-order-by-id.controller'

export async function ordersRoutes(app: FastifyInstance) {
  const createOrderController = new CreateOrderController()
  const fetchOrdersController = new FetchOrdersController()
  const getOrderByIdController = new GetOrderByIdController()

  app.post('/orders', (request, reply) =>
    createOrderController.handle(request, reply),
  )

  app.get('/orders', (request, reply) =>
    fetchOrdersController.handle(request, reply),
  )

  app.get('/orders/:id', (request, reply) =>
    getOrderByIdController.handle(request, reply),
  )
}
