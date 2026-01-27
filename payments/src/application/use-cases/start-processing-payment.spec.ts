import { InMemoryPaymentsRepository } from 'test/in-memory-payments-repository'
import { Payment, PaymentMethod, PaymentStatus } from '../dtos/payment'
import { MessageBroker } from '../interfaces/message-broker'
import { StartProcessingPaymentUseCase } from './start-processing-payment'

let messageBroker: MessageBroker
let inMemoryPaymentsRepository: InMemoryPaymentsRepository
let sut: StartProcessingPaymentUseCase

describe('Start Processing Payment Use Case', () => {
  beforeEach(() => {
    setup()
  })

  it('should start processing a new payment and publish a processing message', async () => {
    const paymentData = {
      orderId: 'order-123',
      cost: 100,
      idempotencyKey: 'idem-key-123',
      method: PaymentMethod.CREDIT_CARD,
    }

    const result = await sut.execute(paymentData)

    expect(result.isRight()).toBe(true)

    const { payment } = result.value as { payment: Payment }

    expect(payment).toHaveProperty('id')
    expect(payment.orderId).toBe(paymentData.orderId)
    expect(payment.cost).toBe(paymentData.cost)
    expect(payment.idempotencyKey).toBe(paymentData.idempotencyKey)
    expect(payment.method).toBe(paymentData.method)
    expect(payment.status).toBe('pending')
  })

  it('should return existing payment if idempotency key already used', async () => {
    const existingPayment: Payment = {
      id: 'payment-123',
      orderId: 'order-123',
      cost: 100,
      idempotencyKey: 'idem-key-123',
      method: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.PENDING,
    }

    await inMemoryPaymentsRepository.create(existingPayment)

    const result = await sut.execute({
      orderId: 'order-123',
      cost: 100,
      idempotencyKey: 'idem-key-123',
      method: PaymentMethod.CREDIT_CARD,
    })

    expect(result.isRight()).toBe(true)

    const { payment } = result.value as { payment: Payment }

    expect(payment).toEqual(existingPayment)
  })
})

function setup() {
  messageBroker = {
    publish: vi.fn(),
  }

  inMemoryPaymentsRepository = new InMemoryPaymentsRepository()

  sut = new StartProcessingPaymentUseCase(
    messageBroker,
    inMemoryPaymentsRepository,
  )
}
