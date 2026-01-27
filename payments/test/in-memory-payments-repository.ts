import { Payment } from '@/application/dtos/payment'
import { PaymentsRepository } from '@/application/interfaces/payments-repository'

export class InMemoryPaymentsRepository implements PaymentsRepository {
  public items: Payment[] = []

  async create(data: Payment) {
    this.items.push(data)
  }

  async findByIdempotencyKey(idempotencyKey: string) {
    const payment = this.items.find(
      (payment) => payment.idempotencyKey === idempotencyKey,
    )

    return payment || null
  }

  async findById(id: string) {
    const payment = this.items.find((payment) => payment.id === id)
    return payment || null
  }

  async findByOrderId(orderId: string) {
    const payment = this.items.find((payment) => payment.orderId === orderId)
    return payment || null
  }

  async updateStatus(id: string, status: Payment['status']) {
    const paymentIndex = this.items.findIndex((payment) => payment.id === id)

    if (paymentIndex >= 0) {
      this.items[paymentIndex].status = status
    }
  }
}
