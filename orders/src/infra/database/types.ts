import { Order, OrderStatus } from '@/application/dtos/order'
import type { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface Tables {
    orders: Order
  }
}

interface OrderRow {
  id: string
  status: OrderStatus
  created_at: Date
}
