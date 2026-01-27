import { uuidv7 } from 'uuidv7'
import { MessageBroker } from '../interfaces/message-broker'
import { PaymentsRepository } from '../interfaces/payments-repository'
import { Payment, PaymentMethod } from '../models/payment'
import { Either, right } from '../utils/either'

type StartProcessingPaymentUseCaseInput = {
  orderId: string
  cost: number
  idempotencyKey: string
  method: PaymentMethod
}

type StartProcessingPaymentUseCaseOutput = Either<
  null,
  {
    payment: Payment
  }
>

export class StartProcessingPaymentUseCase {
  constructor(
    private messageBroker: MessageBroker,
    private paymentsRepository: PaymentsRepository,
  ) {}

  async execute({
    cost,
    method,
    orderId,
    idempotencyKey,
  }: StartProcessingPaymentUseCaseInput): Promise<StartProcessingPaymentUseCaseOutput> {
    const existingPayment =
      await this.paymentsRepository.findByIdempotencyKey(idempotencyKey)

    if (existingPayment) {
      return right({ payment: existingPayment })
    }

    const generatedId = uuidv7()

    const payment: Payment = {
      id: generatedId,
      orderId,
      cost,
      idempotencyKey,
      method,
    }

    await this.paymentsRepository.create(payment)

    // Payment processing logic would go here (e.g., interacting with a payment gateway)
    // For simplicity, we assume the payment will be processing asynchronously

    await this.messageBroker.publish('payment.processing', {
      orderId: payment.orderId,
    })

    return right({ payment })
  }
}
