import { app, db, mockMessageBroker } from 'test/setup-e2e'

describe('Create Order Controller E2E', () => {
  it('[POST /orders]', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/orders',
      payload: {
        cost: 100.5,
        paymentMethod: 'credit_card',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toEqual(
      expect.objectContaining({
        order: {
          id: expect.any(String),
          status: 'created',
          createdAt: expect.any(String),
        },
      }),
    )

    const orderOnDatabase = await db('orders')
      .where({
        id: response.json().order.id,
      })
      .first()

    expect(orderOnDatabase).toBeTruthy()

    const messages = mockMessageBroker.getMessagesByEvent('order.created')

    expect(messages).toHaveLength(1)
    expect(messages[0].data).toEqual(
      expect.objectContaining({
        orderId: expect.any(String),
        cost: 100.5,
      }),
    )
  })
})
