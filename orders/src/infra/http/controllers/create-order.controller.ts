import { PaymentMethod } from '@/application/dtos/order'
import { CreateOrderUseCase } from '@/application/use-cases/create-order'
import { KnexOrdersRepository } from '@/infra/database/repositories/knex-orders-repository'
import { messageBroker } from '@/infra/message-broker'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const createOrderBodySchema = z.object({
  cost: z.number().positive(),
  paymentMethod: z.enum(PaymentMethod),
})

export class CreateOrderController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { cost, paymentMethod } = createOrderBodySchema.parse(request.body)

    const ordersRepository = new KnexOrdersRepository()

    const createOrderUseCase = new CreateOrderUseCase(
      messageBroker,
      ordersRepository,
    )

    const result = await createOrderUseCase.execute({
      cost,
      paymentMethod,
    })

    return reply.status(201).send(result.value)
  }
}
