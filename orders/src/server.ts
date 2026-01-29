import { env } from './infra/env'
import { buildApp } from './infra/http/app'
import { messageBroker } from './infra/message-broker'
import { registerSubscribers } from './infra/message-broker/subscribers'

const app = buildApp()

async function bootstrap() {
  try {
    await messageBroker.connect()
    await registerSubscribers(messageBroker)

    await app.listen({
      host: '0.0.0.0',
      port: env.PORT,
    })

    console.log(`🚀 HTTP Server running on port ${env.PORT}`)

    const signals = ['SIGINT', 'SIGTERM'] as const
    for (const signal of signals) {
      process.on(signal, async () => {
        console.log(`\n${signal} received, shutting down gracefully...`)
        await messageBroker.close()
        await app.close()
        process.exit(0)
      })
    }
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

bootstrap()
