import { Payment, PaymentStatus } from '@/application/dtos/payment'
import { PaymentsRepository } from '@/application/interfaces/payments-repository'
import { db } from '@/infra/database/connection'

export class KnexPaymentsRepository implements PaymentsRepository {
  async create(data: Payment) {
    await db('payments').insert({
      id: data.id,
      order_id: data.orderId,
      cost: data.cost,
      idempotency_key: data.idempotencyKey,
      method: data.method,
      status: data.status,
    })
  }

  async findById(id: string) {
    const payment = await db('payments').where('id', id).first()

    if (!payment) {
      return null
    }

    return {
      id: payment.id,
      orderId: payment.order_id,
      cost: Number(payment.cost),
      idempotencyKey: payment.idempotency_key,
      method: payment.method,
      status: payment.status as PaymentStatus,
      createdAt: payment.created_at,
    }
  }

  async findByOrderId(orderId: string) {
    const payment = await db('payments').where('order_id', orderId).first()

    if (!payment) {
      return null
    }

    return {
      id: payment.id,
      orderId: payment.order_id,
      cost: Number(payment.cost),
      idempotencyKey: payment.idempotency_key,
      method: payment.method,
      status: payment.status as PaymentStatus,
      createdAt: payment.created_at,
    }
  }

  async findByIdempotencyKey(idempotencyKey: string) {
    const payment = await db('payments')
      .where('idempotency_key', idempotencyKey)
      .first()

    if (!payment) {
      return null
    }

    return {
      id: payment.id,
      orderId: payment.order_id,
      cost: Number(payment.cost),
      idempotencyKey: payment.idempotency_key,
      method: payment.method,
      status: payment.status as PaymentStatus,
      createdAt: payment.created_at,
    }
  }

  async update(id: string, data: Partial<Payment>) {
    const updateData: Record<string, unknown> = {}

    if (data.status) {
      updateData.status = data.status
    }

    await db('payments').where('id', id).update(updateData)
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<void> {
    return this.update(id, { status })
  }
}
