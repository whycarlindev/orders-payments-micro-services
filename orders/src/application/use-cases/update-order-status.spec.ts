import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { OrderStatus } from '../models/order'
import { InvalidStatusTransitionError } from './errors/invalid-status-transition'
import { OrderNotFoundError } from './errors/order-not-found'
import { UpdateOrderStatusUseCase } from './update-order-status'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: UpdateOrderStatusUseCase

describe('Update Order Status Use Case', () => {
  beforeEach(() => {
    setup()
  })

  it('should be able to update order status from created to pending_payment', async () => {
    const createdOrder = {
      id: 'order-123',
      status: OrderStatus.CREATED,
      created_at: new Date(),
    }

    await inMemoryOrdersRepository.create(createdOrder)

    const result = await sut.execute({
      id: createdOrder.id,
      status: OrderStatus.PENDING_PAYMENT,
    })

    expect(result.isRight()).toBe(true)

    const order = await inMemoryOrdersRepository.findById(createdOrder.id)

    expect(order.status).toBe(OrderStatus.PENDING_PAYMENT)
  })

  it('should be able to update order status from created to cancelled', async () => {
    const createdOrder = {
      id: 'order-123',
      status: OrderStatus.CREATED,
      created_at: new Date(),
    }

    await inMemoryOrdersRepository.create(createdOrder)

    const result = await sut.execute({
      id: createdOrder.id,
      status: OrderStatus.CANCELLED,
    })

    expect(result.isRight()).toBe(true)

    const order = await inMemoryOrdersRepository.findById(createdOrder.id)

    expect(order.status).toBe(OrderStatus.CANCELLED)
  })

  it('should be able to update order status from pending_payment to paid', async () => {
    const createdOrder = {
      id: 'order-123',
      status: OrderStatus.PENDING_PAYMENT,
      created_at: new Date(),
    }

    await inMemoryOrdersRepository.create(createdOrder)

    const result = await sut.execute({
      id: createdOrder.id,
      status: OrderStatus.PAID,
    })

    expect(result.isRight()).toBe(true)

    const order = await inMemoryOrdersRepository.findById(createdOrder.id)

    expect(order.status).toBe(OrderStatus.PAID)
  })

  it('should be able to update order status from pending_payment to failed', async () => {
    const createdOrder = {
      id: 'order-123',
      status: OrderStatus.PENDING_PAYMENT,
      created_at: new Date(),
    }

    await inMemoryOrdersRepository.create(createdOrder)

    const result = await sut.execute({
      id: createdOrder.id,
      status: OrderStatus.FAILED,
    })

    expect(result.isRight()).toBe(true)

    const order = await inMemoryOrdersRepository.findById(createdOrder.id)

    expect(order.status).toBe(OrderStatus.FAILED)
  })

  it('should be able to update order status from pending_payment to cancelled', async () => {
    const createdOrder = {
      id: 'order-123',
      status: OrderStatus.PENDING_PAYMENT,
      created_at: new Date(),
    }

    await inMemoryOrdersRepository.create(createdOrder)

    const result = await sut.execute({
      id: createdOrder.id,
      status: OrderStatus.CANCELLED,
    })

    expect(result.isRight()).toBe(true)

    const order = await inMemoryOrdersRepository.findById(createdOrder.id)

    expect(order?.status).toBe(OrderStatus.CANCELLED)
  })

  it('should not be able to update order status with invalid id', async () => {
    const result = await sut.execute({
      id: 'invalid-order-id',
      status: OrderStatus.PENDING_PAYMENT,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrderNotFoundError)
  })

  it('should not be able to update order status from created to paid', async () => {
    const createdOrder = {
      id: 'order-123',
      status: OrderStatus.CREATED,
      created_at: new Date(),
    }

    await inMemoryOrdersRepository.create(createdOrder)

    const result = await sut.execute({
      id: createdOrder.id,
      status: OrderStatus.PAID,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidStatusTransitionError)
  })

  it('should not be able to update order status from created to failed', async () => {
    const createdOrder = {
      id: 'order-123',
      status: OrderStatus.CREATED,
      created_at: new Date(),
    }

    await inMemoryOrdersRepository.create(createdOrder)

    const result = await sut.execute({
      id: createdOrder.id,
      status: OrderStatus.FAILED,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidStatusTransitionError)
  })

  it('should not be able to update order status from paid to any status', async () => {
    const createdOrder = {
      id: 'order-123',
      status: OrderStatus.PAID,
      created_at: new Date(),
    }

    await inMemoryOrdersRepository.create(createdOrder)

    const result = await sut.execute({
      id: createdOrder.id,
      status: OrderStatus.CANCELLED,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidStatusTransitionError)
  })

  it('should not be able to update order status from failed to any status', async () => {
    const createdOrder = {
      id: 'order-123',
      status: OrderStatus.FAILED,
      created_at: new Date(),
    }

    await inMemoryOrdersRepository.create(createdOrder)

    const result = await sut.execute({
      id: createdOrder.id,
      status: OrderStatus.PAID,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidStatusTransitionError)
  })

  it('should not be able to update order status from cancelled to any status', async () => {
    const createdOrder = {
      id: 'order-123',
      status: OrderStatus.CANCELLED,
      created_at: new Date(),
    }

    await inMemoryOrdersRepository.create(createdOrder)

    const result = await sut.execute({
      id: createdOrder.id,
      status: OrderStatus.PENDING_PAYMENT,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidStatusTransitionError)
  })
})

function setup() {
  inMemoryOrdersRepository = new InMemoryOrdersRepository()
  sut = new UpdateOrderStatusUseCase(inMemoryOrdersRepository)
}
