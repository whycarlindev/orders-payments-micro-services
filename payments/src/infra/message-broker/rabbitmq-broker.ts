import amqp from 'amqplib'
import type {
  MessageBroker,
  MessageHandler,
} from '../../application/interfaces/message-broker'

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
        console.error('RabbitMQ connection error:', err)
      })

      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed')
      })

      console.log('Connected to RabbitMQ')
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error)
      throw error
    }
  }

  async publish(event: string, data: Record<string, unknown>) {
    await this.channel.assertQueue(event, { durable: true })

    const message = Buffer.from(JSON.stringify(data))

    this.channel.sendToQueue(event, message, {
      persistent: true,
    })

    console.log(`Published message to queue "${event}"`)
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
            console.log(`Processed message from queue "${event}"`)
          } catch (error) {
            console.error(
              `Error processing message from queue "${event}":`,
              error,
            )

            this.channel.nack(msg, false, true)
          }
        }
      },
      {
        noAck: false,
      },
    )

    console.log(`Subscribed to queue "${event}"`)
  }

  async close() {
    try {
      await this.channel.close()
      await this.connection.close()
      console.log('RabbitMQ connection closed successfully')
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error)
      throw error
    }
  }
}
