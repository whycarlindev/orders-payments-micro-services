import { OrderStatus } from '@/application/dtos/order'
import type { MessageHandler } from '@/application/interfaces/message-broker'
import { UpdateOrderStatusUseCase } from '@/application/use-cases/update-order-status'
import { KnexOrdersRepository } from '@/infra/database/repositories/knex-orders-repository'

export const paymentUpdateSubscriber: MessageHandler = async (data) => {
  const { orderId, status } = data as { orderId: string; status: string }

  console.log(`Processing payment.update: orderId=${orderId}, status=${status}`)

  const ordersRepository = new KnexOrdersRepository()
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(
    ordersRepository,
  )

  const statusMap: Record<string, OrderStatus> = {
    success: OrderStatus.PAID,
    failed: OrderStatus.FAILED,
    processing: OrderStatus.PENDING_PAYMENT,
  }

  const orderStatus = statusMap[status]

  const result = await updateOrderStatusUseCase.execute({
    id: orderId,
    status: orderStatus,
  })

  if (result.isLeft()) {
    console.error(`Failed to update order status: ${result.value.message}`)
    throw new Error(result.value.message)
  }

  console.log(`Order ${orderId} status updated to ${orderStatus}`)
}
