export interface Payment {
  id: string
  orderId: string
  cost: number
  idempotencyKey: string
  method: PaymentMethod
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  PIX = 'pix',
  BILLET = 'billet',
}
