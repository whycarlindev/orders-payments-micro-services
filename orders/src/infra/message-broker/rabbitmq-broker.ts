import amqp from 'amqplib'
import type {
  MessageBroker,
  MessageHandler,
} from '../../application/interfaces/message-broker'
import { logger } from '../logger'

export class RabbitMQBroker implements MessageBroker {
  private connection: amqp.ChannelModel | null = null
  private channel: amqp.Channel | null = null
  private readonly url: string

  constructor(url: string) {
    this.url = url
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.url)
      this.channel = await this.connection.createChannel()

      this.connection.on('error', (err) => {
        logger.error(`RabbitMQ connection error: ${err.message}`)
      })

      this.connection.on('close', () => {
        logger.info('RabbitMQ connection closed')
      })

      logger.info('Connected to RabbitMQ')
    } catch (error) {
      logger.error(`Failed to connect to RabbitMQ: ${(error as Error).message}`)
      throw error
    }
  }

  async publish(event: string, data: Record<string, unknown>) {
    await this.channel.assertQueue(event, { durable: true })

    const message = Buffer.from(JSON.stringify(data))

    this.channel.sendToQueue(event, message, {
      persistent: true,
    })

    logger.info(`Published message to queue "${event}"`)
  }

  async subscribe(event: string, handler: MessageHandler) {
    await this.channel.assertQueue(event, { durable: true })

    this.channel.consume(
      event,
      async (msg) => {
        if (msg !== null) {
          try {
            const data = JSON.parse(msg.content.toString())
            await handler(data)
            this.channel.ack(msg)
            logger.info(`Processed message from queue "${event}"`)
          } catch (error) {
            logger.error(
              `Failed to process message from queue "${event}": ${
                (error as Error).message
              }`,
            )

            this.channel.nack(msg, false, true)
          }
        }
      },
      {
        noAck: false,
      },
    )

    logger.info(`Subscribed to queue '${event}'`)
  }

  async close() {
    try {
      await this.channel.close()
      await this.connection.close()
      logger.info('RabbitMQ connection closed successfully')
    } catch (error) {
      logger.error(
        `Failed to close RabbitMQ connection: ${(error as Error).message}`,
      )
      throw error
    }
  }
}
