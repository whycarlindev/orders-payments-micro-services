import { OrderStatus } from '../../models/order'

export class InvalidStatusTransitionError extends Error {
  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Invalid status transition from "${from}" to "${to}"`)
    this.name = 'InvalidStatusTransitionError'
  }
}
