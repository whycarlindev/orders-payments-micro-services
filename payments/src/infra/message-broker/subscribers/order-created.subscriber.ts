import { PaymentMethod } from '@/application/dtos/payment'
import type { MessageHandler } from '@/application/interfaces/message-broker'
import { StartProcessingPaymentUseCase } from '@/application/use-cases/start-processing-payment'
import { KnexPaymentsRepository } from '@/infra/database/repositories/knex-payments-repository'
import { messageBroker } from '..'

export const orderCreatedSubscriber: MessageHandler = async (data) => {
  const { orderId, cost, paymentMethod, idempotencyKey } = data as {
    orderId: string
    cost: number
    paymentMethod: PaymentMethod
    idempotencyKey: string
  }

  console.log(
    `Processing order.created: orderId=${orderId}, cost=${cost}, paymentMethod=${paymentMethod}`,
  )

  const paymentsRepository = new KnexPaymentsRepository()
  const startProcessingPaymentUseCase = new StartProcessingPaymentUseCase(
    messageBroker,
    paymentsRepository,
  )

  const result = await startProcessingPaymentUseCase.execute({
    orderId,
    cost,
    method: paymentMethod,
    idempotencyKey,
  })

  if (result.isLeft()) {
    console.error('Failed to start processing payment: Unknown error')
    throw new Error('Unknown error')
  }

  console.log(
    `Payment ${result.value.payment.id} started processing for order ${orderId}`,
  )
}
