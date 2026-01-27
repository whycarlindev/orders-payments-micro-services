import { GetPaymentByIdUseCase } from '@/application/use-cases/get-payment-by-id'
import { KnexPaymentsRepository } from '@/infra/database/repositories/knex-payments-repository'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const getPaymentByIdParamsSchema = z.object({
  id: z.uuid(),
})

export class GetPaymentByIdController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = getPaymentByIdParamsSchema.parse(request.params)

    const paymentsRepository = new KnexPaymentsRepository()

    const getPaymentByIdUseCase = new GetPaymentByIdUseCase(paymentsRepository)

    const result = await getPaymentByIdUseCase.execute({ id })

    if (result.isLeft()) {
      return reply.status(404).send({
        message: result.value.message,
      })
    }

    return reply.status(200).send(result.value)
  }
}
