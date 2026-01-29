import { OrderStatus } from '@/application/dtos/order'
import { app, db } from 'test/setup-e2e'
import { uuidv7 } from 'uuidv7'

describe('Fetch Orders Controller E2E', () => {
  it('[GET /orders]', async () => {
    await Promise.all([
      db('orders').insert([
        {
          id: uuidv7(),
          status: OrderStatus.CREATED,
          created_at: new Date('2026-01-20'),
        },
        {
          id: uuidv7(),
          status: OrderStatus.PAID,
          created_at: new Date('2026-01-21'),
        },
      ]),
    ])

    const response = await app.inject({
      method: 'GET',
      url: '/orders',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            status: OrderStatus.CREATED,
            createdAt: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(String),
            status: OrderStatus.PAID,
            createdAt: expect.any(String),
          }),
        ]),
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    )
  })
})
