import type { MessageBroker } from '@/application/interfaces/message-broker'
import { paymentUpdateSubscriber } from './payment-update.subscriber'

export async function registerSubscribers(broker: MessageBroker) {
  await broker.subscribe('payment.update', paymentUpdateSubscriber)

  console.log('✅ All subscribers registered')
}
