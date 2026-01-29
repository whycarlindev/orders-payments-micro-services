import { OrderStatus } from '@/application/dtos/order'
import { db } from 'test/setup-e2e'
import { uuidv7 } from 'uuidv7'

describe('Payment Update Subscriber E2E', () => {
  it('should update order status to PAID when payment is successful', async () => {
    const { paymentUpdateSubscriber } = await import(
      './payment-update.subscriber'
    )

    const orderId = uuidv7()

    await db('orders').insert({
      id: orderId,
      status: OrderStatus.PENDING_PAYMENT,
      created_at: new Date(),
    })

    await paymentUpdateSubscriber({
      orderId,
      status: 'success',
    })

    const order = await db('orders').where({ id: orderId }).first()

    expect(order).toBeTruthy()
    expect(order.status).toBe(OrderStatus.PAID)
  })

  it('should update order status to FAILED when payment fails', async () => {
    const { paymentUpdateSubscriber } = await import(
      './payment-update.subscriber'
    )

    const orderId = uuidv7()

    await db('orders').insert({
      id: orderId,
      status: OrderStatus.PENDING_PAYMENT,
      created_at: new Date(),
    })

    await paymentUpdateSubscriber({
      orderId,
      status: 'failed',
    })

    const order = await db('orders').where({ id: orderId }).first()

    expect(order).toBeTruthy()
    expect(order.status).toBe(OrderStatus.FAILED)
  })

  it('should update order status to PENDING_PAYMENT when payment is processing', async () => {
    const { paymentUpdateSubscriber } = await import(
      './payment-update.subscriber'
    )

    const orderId = uuidv7()

    await db('orders').insert({
      id: orderId,
      status: OrderStatus.CREATED,
      created_at: new Date(),
    })

    await paymentUpdateSubscriber({
      orderId,
      status: 'processing',
    })

    const order = await db('orders').where({ id: orderId }).first()

    expect(order).toBeTruthy()
    expect(order.status).toBe(OrderStatus.PENDING_PAYMENT)
  })

  it('should not throw error when status transition is invalid', async () => {
    const { paymentUpdateSubscriber } = await import(
      './payment-update.subscriber'
    )

    const orderId = uuidv7()

    await db('orders').insert({
      id: orderId,
      status: OrderStatus.PAID,
      created_at: new Date(),
    })

    await expect(
      paymentUpdateSubscriber({
        orderId,
        status: 'failed',
      }),
    ).resolves.not.toThrow()

    const order = await db('orders').where({ id: orderId }).first()

    expect(order.status).toBe(OrderStatus.PAID)
  })

  it('should throw error when order does not exist', async () => {
    const { paymentUpdateSubscriber } = await import(
      './payment-update.subscriber'
    )

    const nonExistentOrderId = uuidv7()

    await expect(
      paymentUpdateSubscriber({
        orderId: nonExistentOrderId,
        status: 'success',
      }),
    ).rejects.toThrow()
  })
})
