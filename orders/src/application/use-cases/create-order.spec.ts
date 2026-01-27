import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { Order, PaymentMethod } from '../dtos/order'
import { MessageBroker } from '../interfaces/message-broker'
import { CreateOrderUseCase } from './create-order'

let messageBroker: MessageBroker
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: CreateOrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(() => {
    setup()
  })

  it('should create an order successfully', async () => {
    const result = await sut.execute({
      cost: 100.45,
      paymentMethod: PaymentMethod.CREDIT_CARD,
    })

    expect(result.isRight()).toBe(true)

    const typedResult = result.value as { order: Order }

    expect(typedResult.order).toHaveProperty('id')
    expect(typedResult.order.status).toBe('created')
    expect(typedResult.order).toHaveProperty('created_at')
  })
})

function setup() {
  messageBroker = {
    publish: vi.fn(),
  }

  inMemoryOrdersRepository = new InMemoryOrdersRepository()

  sut = new CreateOrderUseCase(messageBroker, inMemoryOrdersRepository)
}
