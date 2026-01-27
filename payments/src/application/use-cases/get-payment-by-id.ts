import { Payment } from '../dtos/payment'
import { PaymentsRepository } from '../interfaces/payments-repository'
import { Either, left, right } from '../utils/either'
import { PaymentNotFoundError } from './errors/payment-not-found'

type GetPaymentByIdUseCaseInput = {
  id: string
}

type GetPaymentByIdUseCaseOutput = Either<
  PaymentNotFoundError,
  { payment: Payment }
>

export class GetPaymentByIdUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute({
    id,
  }: GetPaymentByIdUseCaseInput): Promise<GetPaymentByIdUseCaseOutput> {
    const payment = await this.paymentsRepository.findById(id)

    if (!payment) {
      return left(new PaymentNotFoundError())
    }

    return right({ payment })
  }
}
