import { Order, OrderStatus } from '@/application/dtos/order'
import type { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface Tables {
    orders: {
      id: string
      status: OrderStatus
      created_at: Date
    }
  }
}

interface OrderRow {
  id: string
  status: OrderStatus
  created_at: Date
}
