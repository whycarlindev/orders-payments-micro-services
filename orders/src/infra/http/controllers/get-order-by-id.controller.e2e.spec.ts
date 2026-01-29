import { OrderStatus } from '@/application/dtos/order'
import { app, db } from 'test/setup-e2e'
import { uuidv7 } from 'uuidv7'

describe('Get Order By Id Controller E2E', () => {
  it('[GET /orders/:id]', async () => {
    const orderId = uuidv7()

    await db('orders').insert({
      id: orderId,
      status: OrderStatus.CREATED,
      created_at: new Date('2026-01-20'),
    })

    const response = await app.inject({
      method: 'GET',
      url: `/orders/${orderId}`,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(
      expect.objectContaining({
        order: {
          id: orderId,
          status: OrderStatus.CREATED,
          createdAt: expect.any(String),
        },
      }),
    )
  })

  it('[GET /orders/:id] should return 404 when order does not exist', async () => {
    const nonExistentOrderId = uuidv7()

    const response = await app.inject({
      method: 'GET',
      url: `/orders/${nonExistentOrderId}`,
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      message: expect.any(String),
    })
  })
})
