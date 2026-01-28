import { env } from '@/env/index.js'
import httpProxy from '@fastify/http-proxy'
import { FastifyInstance } from 'fastify'

export async function paymentsRoutes(app: FastifyInstance) {
  // Proxy GET /api/v1/payments/* requests to payments service
  await app.register(httpProxy, {
    upstream: env.PAYMENTS_SERVICE_URL,
    prefix: '/api/v1/payments',
    rewritePrefix: '/payments',
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
