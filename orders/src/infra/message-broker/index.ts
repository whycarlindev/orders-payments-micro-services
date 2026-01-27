import { env } from '../env'
import { RabbitMQBroker } from './rabbitmq-broker'

export const messageBroker = new RabbitMQBroker(env.RABBITMQ_URL)
