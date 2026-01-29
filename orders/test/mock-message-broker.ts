import {
  MessageBroker,
  MessageHandler,
} from '@/application/interfaces/message-broker'

export class MockMessageBroker implements MessageBroker {
  private handlers = new Map<string, MessageHandler[]>()
  public publishedMessages: Array<{
    event: string
    data: Record<string, unknown>
  }> = []

  async publish(event: string, data: Record<string, unknown>) {
    this.publishedMessages.push({ event, data })

    const handlers = this.handlers.get(event) || []
    for (const handler of handlers) {
      await handler(data)
    }
  }

  async subscribe(event: string, handler: MessageHandler) {
    const handlers = this.handlers.get(event) || []
    handlers.push(handler)
    this.handlers.set(event, handlers)
  }

  clearMessages() {
    this.publishedMessages = []
  }

  getMessagesByEvent(event: string) {
    return this.publishedMessages.filter((msg) => msg.event === event)
  }
}
