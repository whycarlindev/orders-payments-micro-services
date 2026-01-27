import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '@/application/dtos/payment'
import type { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface Tables {
    payments: {
      id: string
      order_id: string
      cost: number
      idempotency_key: string
      method: PaymentMethod
      status: PaymentStatus
      created_at: Date
    }
  }
}

interface PaymentRow {
  id: string
  order_id: string
  cost: number
  idempotency_key: string
  method: PaymentMethod
  status: PaymentStatus
  created_at: Date
}
