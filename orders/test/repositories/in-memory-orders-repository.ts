import {
  FindManyParams,
  OrdersRepository,
} from '@/application/interfaces/orders-repository'
import { Order, OrderStatus } from '@/application/models/order'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async create(data: Order) {
    this.items.push(data)
  }

  async findById(id: string) {
    const order = this.items.find((item) => item.id === id)
    return order || null
  }

  async findMany({
    status,
    dateTo,
    dateFrom,
    page = 1,
    limit = 15,
  }: FindManyParams) {
    let filteredItems = this.items

    if (dateFrom) {
      filteredItems = filteredItems.filter(
        (item) => item.created_at >= dateFrom,
      )
    }

    if (dateTo) {
      filteredItems = filteredItems.filter((item) => item.created_at <= dateTo)
    }

    if (status) {
      filteredItems = filteredItems.filter((item) => item.status === status)
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const total = filteredItems.length

    return {
      orders: filteredItems.slice(startIndex, endIndex),
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const orderIndex = this.items.findIndex((item) => item.id === id)

    if (orderIndex >= 0) {
      this.items[orderIndex].status = status
    }
  }
}
