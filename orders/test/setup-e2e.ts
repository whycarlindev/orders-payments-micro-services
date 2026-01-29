import { execSync } from 'child_process'
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import { FastifyInstance } from 'fastify'
import knex, { Knex } from 'knex'
import { MockMessageBroker } from './mock-message-broker'

let postgressContainer: StartedPostgreSqlContainer
export let db: Knex

export let app: FastifyInstance
export const mockMessageBroker = new MockMessageBroker()

beforeAll(async () => {
  postgressContainer = await new PostgreSqlContainer('postgres:15-alpine')
    .withExposedPorts(5432)
    .start()

  const postgressConnectionString = postgressContainer.getConnectionUri()

  process.env.NODE_ENV = 'test'
  process.env.DATABASE_CONNECTION_STRING = postgressConnectionString

  vi.doMock('@/infra/message-broker', () => ({
    messageBroker: mockMessageBroker,
  }))

  // Import after setting environment variables and mocking
  const { buildApp } = await import('@/infra/http/app')

  db = knex({
    client: 'pg',
    connection: postgressConnectionString,
  })

  execSync('knex migrate:latest --knexfile=./knexfile.ts')

  app = buildApp()
})

afterEach(() => {
  mockMessageBroker.clearMessages()
})

afterAll(async () => {
  await db.raw('DROP TABLE IF EXISTS orders CASCADE;')

  await app.close()
  await db.destroy()
  await postgressContainer.stop()
})
