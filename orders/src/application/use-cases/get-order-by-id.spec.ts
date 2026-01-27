import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { OrderStatus } from '../dtos/order'
import { OrderNotFoundError } from './errors/order-not-found'
import { GetOrderByIdUseCase } from './get-order-by-id'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: GetOrderByIdUseCase

describe('Get Order By Id Use Case', () => {
  beforeEach(() => {
    setup()
  })

  it('should be able to get an order by id', async () => {
    const createdOrder = {
      id: 'order-123',
      status: OrderStatus.CREATED,
      created_at: new Date(),
    }

    await inMemoryOrdersRepository.create(createdOrder)

    const result = await sut.execute({ id: createdOrder.id })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to get an order with invalid id', async () => {
    const result = await sut.execute({ id: 'invalid-order-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrderNotFoundError)
  })
})

function setup() {
  inMemoryOrdersRepository = new InMemoryOrdersRepository()
  sut = new GetOrderByIdUseCase(inMemoryOrdersRepository)
}
