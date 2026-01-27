import { Order, OrderStatus } from '../dtos/order'
import {
  FindManyResult,
  OrdersRepository,
} from '../interfaces/orders-repository'
import { Either, right } from '../utils/either'

type FetchOrdersUseCaseInput = {
  page?: number
  limit?: number

  dateTo?: Date
  dateFrom?: Date
  status?: OrderStatus
}

type FetchOrdersUseCaseOutput = Either<null, FindManyResult>

export class FetchOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    page,
    limit,
    status,
    dateTo,
    dateFrom,
  }: FetchOrdersUseCaseInput): Promise<FetchOrdersUseCaseOutput> {
    const orders = await this.ordersRepository.findMany({
      page,
      limit,
      status,
      dateTo,
      dateFrom,
    })

    return right(orders)
  }
}
