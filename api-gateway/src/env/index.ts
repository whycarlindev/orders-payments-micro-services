import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['local', 'hml', 'prod']).default('local'),
  PORT: z.coerce.number().default(3000),
  ORDERS_SERVICE_URL: z.url(),
  PAYMENTS_SERVICE_URL: z.url(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
