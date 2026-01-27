import { Payment, PaymentStatus } from '../models/payment'

export interface PaymentsRepository {
  create(data: Payment): Promise<void>
  findByIdempotencyKey(idempotencyKey: string): Promise<Payment | null>
  findById(id: string): Promise<Payment | null>
  findByOrderId(orderId: string): Promise<Payment | null>
  updateStatus(id: string, status: PaymentStatus): Promise<void>
}
