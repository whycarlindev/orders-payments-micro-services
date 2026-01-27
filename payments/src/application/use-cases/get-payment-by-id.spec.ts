import { InMemoryPaymentsRepository } from 'test/in-memory-payments-repository'
import { PaymentMethod, PaymentStatus } from '../models/payment'
import { PaymentNotFoundError } from './errors/payment-not-found'
import { GetPaymentByIdUseCase } from './get-payment-by-id'

let inMemoryPaymentsRepository: InMemoryPaymentsRepository
let sut: GetPaymentByIdUseCase

describe('Get Payment By Id Use Case', () => {
  beforeEach(() => {
    setup()
  })

  it('should be able to get a payment by id', async () => {
    const payment = {
      id: 'payment-123',
      orderId: 'order-123',
      cost: 100,
      idempotencyKey: 'idempotency-key-123',
      method: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.PENDING,
    }

    await inMemoryPaymentsRepository.create(payment)

    const result = await sut.execute({ id: payment.id })

    expect(result.isRight()).toBe(true)

    const typedResult = result.value as { payment: typeof payment }

    expect(typedResult.payment).toEqual(payment)
  })

  it('should not be able to get a payment with invalid id', async () => {
    const result = await sut.execute({ id: 'invalid-payment-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PaymentNotFoundError)
  })
})

function setup() {
  inMemoryPaymentsRepository = new InMemoryPaymentsRepository()
  sut = new GetPaymentByIdUseCase(inMemoryPaymentsRepository)
}
