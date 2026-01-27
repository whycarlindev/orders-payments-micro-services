import { OrderStatus } from '@/application/dtos/order'
import { FetchOrdersUseCase } from '@/application/use-cases/fetch-orders'
import { KnexOrdersRepository } from '@/infra/database/repositories/knex-orders-repository'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const fetchOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(50).optional(),
  status: z.enum(OrderStatus).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
})

export class FetchOrdersController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { page, limit, status, dateFrom, dateTo } =
      fetchOrdersQuerySchema.parse(request.query)

    const ordersRepository = new KnexOrdersRepository()

    const fetchOrdersUseCase = new FetchOrdersUseCase(ordersRepository)

    const result = await fetchOrdersUseCase.execute({
      page,
      limit,
      status,
      dateFrom,
      dateTo,
    })

    return reply.status(200).send(result.value)
  }
}
