import { InMemoryPaymentsRepository } from 'test/in-memory-payments-repository'
import { PaymentMethod, PaymentStatus } from '../models/payment'
import { PaymentNotFoundError } from './errors/payment-not-found'
import { GetPaymentByOrderIdUseCase } from './get-payment-by-order-id'

let inMemoryPaymentsRepository: InMemoryPaymentsRepository
let sut: GetPaymentByOrderIdUseCase

describe('Get Payment By Order Id Use Case', () => {
  beforeEach(() => {
    setup()
  })

  it('should be able to get a payment by order id', async () => {
    const payment = {
      id: 'payment-123',
      orderId: 'order-123',
      cost: 100,
      idempotencyKey: 'idempotency-key-123',
      method: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.PENDING,
    }

    await inMemoryPaymentsRepository.create(payment)

    const result = await sut.execute({ id: payment.orderId })

    expect(result.isRight()).toBe(true)

    const typedResult = result.value as { payment: typeof payment }

    expect(typedResult.payment).toEqual(payment)
  })

  it('should not be able to get a payment with invalid order id', async () => {
    const result = await sut.execute({ id: 'invalid-order-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PaymentNotFoundError)
  })
})

function setup() {
  inMemoryPaymentsRepository = new InMemoryPaymentsRepository()
  sut = new GetPaymentByOrderIdUseCase(inMemoryPaymentsRepository)
}
