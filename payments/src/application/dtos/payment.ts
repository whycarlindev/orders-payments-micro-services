export interface Payment {
  id: string
  orderId: string
  cost: number
  idempotencyKey: string
  method: PaymentMethod
  status: PaymentStatus
  createdAt: Date
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  PIX = 'pix',
  BILLET = 'billet',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE = 'failure',
}
