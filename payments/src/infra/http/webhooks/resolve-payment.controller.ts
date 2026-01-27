import { ResolvePaymentUseCase } from '@/application/use-cases/resolve-payment'
import { KnexPaymentsRepository } from '@/infra/database/repositories/knex-payments-repository'
import { messageBroker } from '@/infra/message-broker'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const resolvePaymentBodySchema = z.object({
  status: z.enum(['success', 'failed']),
})

const resolvePaymentParamsSchema = z.object({
  id: z.uuid(),
})

export class ResolvePaymentController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { status } = resolvePaymentBodySchema.parse(request.body)
    const { id } = resolvePaymentParamsSchema.parse(request.params)

    const paymentsRepository = new KnexPaymentsRepository()

    const resolvePaymentUseCase = new ResolvePaymentUseCase(
      messageBroker,
      paymentsRepository,
    )

    const result = await resolvePaymentUseCase.execute({
      paymentId: id,
      status,
    })

    if (result.isLeft()) {
      return reply.status(404).send({
        message: result.value.message,
      })
    }

    return reply.status(200).send()
  }
}
