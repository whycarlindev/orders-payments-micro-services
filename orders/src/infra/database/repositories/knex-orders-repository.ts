import { Order, OrderStatus } from '@/application/dtos/order'
import {
  FindManyParams,
  OrdersRepository,
} from '@/application/interfaces/orders-repository'
import { db } from '@/infra/database/connection'

export class KnexOrdersRepository implements OrdersRepository {
  async create(data: Order) {
    await db('orders').insert({
      id: data.id,
      status: data.status,
      created_at: data.createdAt,
    })
  }

  async findById(id: string) {
    const order = await db('orders').where('id', id).first()

    if (!order) {
      return null
    }

    return {
      id: order.id,
      status: order.status as OrderStatus,
      createdAt: new Date(order.created_at),
    }
  }

  async findMany(params: FindManyParams) {
    const { page = 1, limit = 20, dateTo, dateFrom, status } = params

    const offset = (page - 1) * limit

    let query = db('orders')

    if (status) {
      query = query.where('status', status)
    }

    if (dateFrom) {
      query = query.where('created_at', '>=', dateFrom)
    }

    if (dateTo) {
      query = query.where('created_at', '<=', dateTo)
    }

    const [{ count }] = await query.clone().count('* as count')
    const total = Number(count)

    const orders = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset)

    const totalPages = Math.ceil(total / limit)

    return {
      orders: orders.map((order) => ({
        id: order.id,
        status: order.status as OrderStatus,
        createdAt: new Date(order.created_at),
      })),
      total,
      limit,
      page,
      totalPages,
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    await db('orders').where('id', id).update({
      status,
    })
  }
}
