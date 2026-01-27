import type { Knex } from 'knex'
import { env } from './src/infra/env'

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: env.DATABASE_CONNECTION_STRING,
  migrations: {
    directory: './src/infra/database/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './src/infra/database/seeds',
    extension: 'ts',
  },
}

module.exports = knexConfig
export { knexConfig }
