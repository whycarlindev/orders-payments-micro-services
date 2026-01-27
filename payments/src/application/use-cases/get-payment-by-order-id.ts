import { PaymentsRepository } from '../interfaces/payments-repository'
import { Payment, PaymentStatus } from '../models/payment'
import { Either, left, right } from '../utils/either'
import { PaymentNotFoundError } from './errors/payment-not-found'

type GetPaymentByOrderIdUseCaseInput = {
  id: string
}

type GetPaymentByOrderIdUseCaseOutput = Either<
  PaymentNotFoundError,
  { payment: Payment }
>

export class GetPaymentByOrderIdUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute({
    id,
  }: GetPaymentByOrderIdUseCaseInput): Promise<GetPaymentByOrderIdUseCaseOutput> {
    const payment = await this.paymentsRepository.findByOrderId(id)

    if (!payment) {
      return left(new PaymentNotFoundError())
    }

    return right({ payment })
  }
}
