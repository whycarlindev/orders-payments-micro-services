import { execSync } from 'child_process'
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import {
  RabbitMQContainer,
  StartedRabbitMQContainer,
} from '@testcontainers/rabbitmq'
import knex, { Knex } from 'knex'

let postgressContainer: StartedPostgreSqlContainer
let rabbitMqContainer: StartedRabbitMQContainer
let db: Knex

beforeAll(async () => {
  postgressContainer = await new PostgreSqlContainer('postgres:15-alpine')
    .withExposedPorts(5432)
    .start()

  rabbitMqContainer = await new RabbitMQContainer(
    'rabbitmq:3.12.11-management-alpine',
  )
    .withExposedPorts(5672)
    .start()

  const connectionString = postgressContainer.getConnectionUri()

  process.env.NODE_ENV = 'test'
  process.env.DATABASE_CONNECTION_STRING = connectionString
  process.env.RABBITMQ_URL = `amqp://${rabbitMqContainer.getHost()}:${rabbitMqContainer.getMappedPort(
    5672,
  )}`

  db = knex({
    client: 'pg',
    connection: connectionString,
  })

  execSync('knex migrate:latest --knexfile=./knexfile.ts')
})

afterAll(async () => {
  await db.destroy()
  await postgressContainer.stop()
  await rabbitMqContainer.stop()
})
