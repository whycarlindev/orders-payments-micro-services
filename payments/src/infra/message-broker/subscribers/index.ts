import type { MessageBroker } from '@/application/interfaces/message-broker'
import { orderCreatedSubscriber } from './order-created.subscriber'

export async function registerSubscribers(broker: MessageBroker) {
  await broker.subscribe('order.created', orderCreatedSubscriber)

  console.log('✅ All subscribers registered')
}
