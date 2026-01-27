import { GetOrderByIdUseCase } from '@/application/use-cases/get-order-by-id'
import { KnexOrdersRepository } from '@/infra/database/repositories/knex-orders-repository'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export class GetOrderByIdController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const getOrderByIdParamsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = getOrderByIdParamsSchema.parse(request.params)

    const ordersRepository = new KnexOrdersRepository()

    const getOrderByIdUseCase = new GetOrderByIdUseCase(ordersRepository)

    const result = await getOrderByIdUseCase.execute({ id })

    if (result.isLeft()) {
      return reply.status(404).send({
        message: result.value.message,
      })
    }

    return reply.status(200).send(result.value)
  }
}
