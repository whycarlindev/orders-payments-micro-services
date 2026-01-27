import { GetPaymentByOrderIdUseCase } from '@/application/use-cases/get-payment-by-order-id'
import { KnexPaymentsRepository } from '@/infra/database/repositories/knex-payments-repository'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const getPaymentByOrderIdParamsSchema = z.object({
  orderId: z.uuid(),
})

export class GetPaymentByOrderIdController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { orderId } = getPaymentByOrderIdParamsSchema.parse(request.params)

    const paymentsRepository = new KnexPaymentsRepository()

    const getPaymentByOrderIdUseCase = new GetPaymentByOrderIdUseCase(
      paymentsRepository,
    )

    const result = await getPaymentByOrderIdUseCase.execute({ id: orderId })

    if (result.isLeft()) {
      return reply.status(404).send({
        message: result.value.message,
      })
    }

    return reply.status(200).send(result.value)
  }
}
