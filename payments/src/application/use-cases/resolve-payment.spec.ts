import { InMemoryPaymentsRepository } from 'test/in-memory-payments-repository'
import { MessageBroker } from '../interfaces/message-broker'
import { PaymentMethod, PaymentStatus } from '../models/payment'
import { PaymentNotFoundError } from './errors/payment-not-found'
import { ResolvePaymentUseCase } from './resolve-payment'

let inMemoryPaymentsRepository: InMemoryPaymentsRepository
let messageBroker: MessageBroker
let sut: ResolvePaymentUseCase

describe('Resolve Payment Use Case', () => {
  beforeEach(() => {
    setup()
  })

  it('should be able to resolve a payment with success status', async () => {
    const payment = {
      id: 'payment-123',
      orderId: 'order-123',
      cost: 100,
      idempotencyKey: 'idempotency-key-123',
      method: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.PENDING,
    }

    await inMemoryPaymentsRepository.create(payment)

    const result = await sut.execute({
      paymentId: payment.id,
      status: 'success',
    })

    expect(result.isRight()).toBe(true)
    expect(messageBroker.publish).toHaveBeenCalledWith('payment.success', {
      orderId: payment.orderId,
    })

    const paymentInRepository = await inMemoryPaymentsRepository.findById(
      payment.id,
    )

    expect(paymentInRepository).toBeDefined()
    expect(paymentInRepository.status).toBe(PaymentStatus.SUCCESS)
  })

  it('should be able to resolve a payment with failure status', async () => {
    const payment = {
      id: 'payment-123',
      orderId: 'order-123',
      cost: 100,
      idempotencyKey: 'idempotency-key-123',
      method: PaymentMethod.PIX,
      status: PaymentStatus.PENDING,
    }

    await inMemoryPaymentsRepository.create(payment)

    const result = await sut.execute({
      paymentId: payment.id,
      status: 'failure',
    })

    expect(result.isRight()).toBe(true)
    expect(messageBroker.publish).toHaveBeenCalledWith('payment.failure', {
      orderId: payment.orderId,
    })

    const paymentInRepository = await inMemoryPaymentsRepository.findById(
      payment.id,
    )

    expect(paymentInRepository).toBeDefined()
    expect(paymentInRepository.status).toBe(PaymentStatus.FAILURE)
  })

  it('should not be able to resolve a payment that does not exist', async () => {
    const result = await sut.execute({
      paymentId: 'non-existent-payment-id',
      status: 'success',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PaymentNotFoundError)
    expect(messageBroker.publish).not.toHaveBeenCalled()
  })
})

function setup() {
  inMemoryPaymentsRepository = new InMemoryPaymentsRepository()
  messageBroker = { publish: vi.fn() }
  sut = new ResolvePaymentUseCase(messageBroker, inMemoryPaymentsRepository)
}
