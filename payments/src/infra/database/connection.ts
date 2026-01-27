import knex, { Knex } from 'knex'
import { env } from '../env'

const config: Knex.Config = {
  client: 'pg',
  connection: env.DATABASE_CONNECTION_STRING,
  migrations: {
    directory: './src/infra/database/migrations',
    extension: 'ts',
  },
}

export const db: Knex = knex(config)
