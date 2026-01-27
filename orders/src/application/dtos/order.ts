export interface Order {
  id: string
  status: OrderStatus
  createdAt: Date
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  PIX = 'pix',
  BILLET = 'billet',
}

export enum OrderStatus {
  CREATED = 'created',
  PENDING_PAYMENT = 'pending_payment',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}
