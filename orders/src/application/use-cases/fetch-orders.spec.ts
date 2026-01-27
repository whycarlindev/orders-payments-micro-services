import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { Order, OrderStatus } from '../dtos/order'
import { FindManyResult } from '../interfaces/orders-repository'
import { FetchOrdersUseCase } from './fetch-orders'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchOrdersUseCase

describe('Fetch Orders Use Case', () => {
  beforeEach(() => {
    setup()
  })

  it('should be able to fetch orders with pagination and filters', async () => {
    const ordersData = [
      {
        id: 'order-1',
        status: OrderStatus.CREATED,
        created_at: new Date('2024-01-01'),
      },
      {
        id: 'order-2',
        status: OrderStatus.PAID,
        created_at: new Date('2024-02-01'),
      },
      {
        id: 'order-3',
        status: OrderStatus.CREATED,
        created_at: new Date('2024-03-01'),
      },
    ]

    for (const orderData of ordersData) {
      await inMemoryOrdersRepository.create(orderData)
    }

    const result = await sut.execute({
      page: 1,
      limit: 2,
      status: OrderStatus.CREATED,
      dateFrom: new Date('2024-01-01'),
      dateTo: new Date('2024-03-31'),
    })

    expect(result.isRight()).toBe(true)

    const typedResult = result as typeof result & { value: FindManyResult }

    expect(typedResult.value.orders).toHaveLength(2)
    expect(typedResult.value.total).toBe(2)
    expect(typedResult.value.limit).toBe(2)
    expect(typedResult.value.page).toBe(1)
    expect(typedResult.value.totalPages).toBe(1)
  })
})

function setup() {
  inMemoryOrdersRepository = new InMemoryOrdersRepository()
  sut = new FetchOrdersUseCase(inMemoryOrdersRepository)
}
