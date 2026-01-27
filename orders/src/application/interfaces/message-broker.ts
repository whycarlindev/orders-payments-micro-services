export type MessageHandler = (data: Record<string, unknown>) => Promise<void>

export interface MessageBroker {
  publish(event: string, data: Record<string, unknown>): Promise<void>
  subscribe(event: string, handler: MessageHandler): Promise<void>
}
