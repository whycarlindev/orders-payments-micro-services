import { randomUUID } from 'node:crypto'
import cors from '@fastify/cors'
import fastify from 'fastify'
import { env } from './env/index.js'

export const app = fastify({
  logger: {
    level: env.NODE_ENV === 'local' ? 'info' : 'warn',
    transport:
      env.NODE_ENV === 'local'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
  genReqId: () => randomUUID(),
  requestIdHeader: 'x-correlation-id',
})

await app.register(cors, {
  origin: true,
})

app.addHook('onRequest', async (request, reply) => {
  const correlationId =
    (request.headers['x-correlation-id'] as string) || request.id
  request.id = correlationId
  reply.header('x-correlation-id', correlationId)
})

app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})
