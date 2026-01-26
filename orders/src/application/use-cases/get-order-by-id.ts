import { OrdersRepository } from '../interfaces/orders-repository'
import { Order } from '../models/order'
import { Either, left, right } from '../utils/either'
import { OrderNotFoundError } from './errors/order-not-found'

type GetOrderByIdUseCaseInput = {
  id: string
}

type GetOrderByIdUseCaseOutput = Either<
  OrderNotFoundError,
  {
    order: Order
  }
>

export class GetOrderByIdUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    id,
  }: GetOrderByIdUseCaseInput): Promise<GetOrderByIdUseCaseOutput> {
    const order = await this.ordersRepository.findById(id)

    if (!order) {
      return left(new OrderNotFoundError())
    }

    return right({ order })
  }
}
