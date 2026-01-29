import type { MessageBroker } from '@/application/interfaces/message-broker'
import { logger } from '@/infra/logger'
import { paymentUpdateSubscriber } from './payment-update.subscriber'

export async function registerSubscribers(broker: MessageBroker) {
  await broker.subscribe('payment.update', paymentUpdateSubscriber)

  logger.info('All subscribers registered')
}
