export interface MessageBroker {
  publish(event: string, data: Record<string, unknown>): Promise<void>
}
