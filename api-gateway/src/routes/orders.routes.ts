import { env } from '@/env/index.js'
import httpProxy from '@fastify/http-proxy'
import { FastifyInstance } from 'fastify'

export async function ordersRoutes(app: FastifyInstance) {
  // Proxy all /api/v1/orders/* requests to orders service
  await app.register(httpProxy, {
    upstream: env.ORDERS_SERVICE_URL,
    prefix: '/api/v1/orders',
    rewritePrefix: '/orders',
    http2: false,
    replyOptions: {
      rewriteRequestHeaders: (request, headers) => {
        return {
          ...headers,
          'x-correlation-id': request.id,
        }
      },
    },
  })
}
