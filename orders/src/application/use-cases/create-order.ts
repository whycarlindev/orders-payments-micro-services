import { OrdersRepository } from '@/application/interfaces/orders-repository'
import { Order, OrderStatus, PaymentMethod } from '@/application/models/order'
import { uuidv7 } from 'uuidv7'
import { MessageBroker } from '../interfaces/message-broker'
import { Either, right } from '../utils/either'

type CreateOrderUseCaseInput = {
  cost: number
  paymentMethod: PaymentMethod
}

type CreateOrderUseCaseOutput = Either<
  null,
  {
    order: Order
    idempotencyKey: string
  }
>

export class CreateOrderUseCase {
  constructor(
    private messageBroker: MessageBroker,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    cost,
    paymentMethod,
  }: CreateOrderUseCaseInput): Promise<CreateOrderUseCaseOutput> {
    const generatedId = uuidv7()
    const idempotencyKey = uuidv7()

    const order: Order = {
      id: generatedId,
      status: OrderStatus.CREATED,
      created_at: new Date(),
    }

    await this.ordersRepository.create(order)

    await this.messageBroker.publish('order.created', {
      orderId: order.id,
      cost,
      paymentMethod,
      idempotencyKey,
    })

    return right({ order, idempotencyKey })
  }
}
