import { app } from './app.js'
import { env } from './env/index.js'
import { ordersRoutes } from './routes/orders.routes.js'
import { paymentsRoutes } from './routes/payments.routes.js'

await app.register(ordersRoutes)
await app.register(paymentsRoutes)

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 API Gateway running on port: ${env.PORT}`)
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
