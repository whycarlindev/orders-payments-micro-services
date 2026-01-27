import { PaymentStatus } from '../dtos/payment'
import { MessageBroker } from '../interfaces/message-broker'
import { PaymentsRepository } from '../interfaces/payments-repository'
import { Either, left, right } from '../utils/either'
import { PaymentNotFoundError } from './errors/payment-not-found'

type ResolvePaymentUseCaseInput = {
  paymentId: string
  status: 'success' | 'failure'
}

type ResolvePaymentUseCaseOutput = Either<PaymentNotFoundError, void>

export class ResolvePaymentUseCase {
  constructor(
    private messageBroker: MessageBroker,
    private paymentsRepository: PaymentsRepository,
  ) {}

  async execute({
    status,
    paymentId,
  }: ResolvePaymentUseCaseInput): Promise<ResolvePaymentUseCaseOutput> {
    const payment = await this.paymentsRepository.findById(paymentId)

    if (!payment) {
      return left(new PaymentNotFoundError())
    }

    if (status === 'success') {
      await this.messageBroker.publish('payment.update', {
        status: 'success',
        orderId: payment.orderId,
      })

      await this.paymentsRepository.updateStatus(
        payment.id,
        PaymentStatus.SUCCESS,
      )

      return right(void 0)
    }

    await this.messageBroker.publish('payment.update', {
      status: 'failure',
      orderId: payment.orderId,
    })

    await this.paymentsRepository.updateStatus(
      payment.id,
      PaymentStatus.FAILURE,
    )

    return right(void 0)
  }
}
