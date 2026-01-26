import { Order, OrderStatus } from '@/application/models/order'

export type FindManyParams = {
  page?: number
  limit?: number

  dateTo?: Date
  dateFrom?: Date
  status?: OrderStatus
}

export type FindManyResult = {
  orders: Order[]
  total: number
  limit: number
  page: number
  totalPages: number
}

export interface OrdersRepository {
  create(data: Order): Promise<void>
  findById(id: string): Promise<Order | null>
  findMany(data: FindManyParams): Promise<FindManyResult>
  updateOrderStatus(id: string, status: OrderStatus): Promise<void>
}
