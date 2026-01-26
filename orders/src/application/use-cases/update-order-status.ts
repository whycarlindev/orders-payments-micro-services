import { OrdersRepository } from '../interfaces/orders-repository'
import { Order, OrderStatus } from '../models/order'
import { Either, left, right } from '../utils/either'
import { InvalidStatusTransitionError } from './errors/invalid-status-transition'
import { OrderNotFoundError } from './errors/order-not-found'

type UpdateOrderStatusUseCaseInput = {
  id: string
  status: OrderStatus
}

type UpdateOrderStatusUseCaseOutput = Either<
  OrderNotFoundError | InvalidStatusTransitionError,
  {
    order: Order
  }
>

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  created: [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED],
  pending_payment: [
    OrderStatus.PAID,
    OrderStatus.FAILED,
    OrderStatus.CANCELLED,
  ],
  paid: [],
  failed: [],
  cancelled: [],
}

export class UpdateOrderStatusUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    id,
    status,
  }: UpdateOrderStatusUseCaseInput): Promise<UpdateOrderStatusUseCaseOutput> {
    const order = await this.ordersRepository.findById(id)

    if (!order) {
      return left(new OrderNotFoundError())
    }

    const allowedTransitions = VALID_TRANSITIONS[order.status]

    if (!allowedTransitions.includes(status)) {
      return left(new InvalidStatusTransitionError(order.status, status))
    }

    order.status = status

    await this.ordersRepository.updateOrderStatus(id, status)

    return right({ order })
  }
}
