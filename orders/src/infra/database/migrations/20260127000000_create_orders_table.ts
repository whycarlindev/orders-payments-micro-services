import type { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.raw(`
    CREATE TYPE order_status AS ENUM (
      'created',
      'pending_payment',
      'paid',
      'cancelled',
      'failed'
    );
  `)

  await knex.schema.createTable('orders', (table) => {
    table.uuid('id').primary()
    table
      .specificType('status', 'order_status')
      .notNullable()
      .defaultTo('created')
    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('orders')
  await knex.raw('DROP TYPE IF EXISTS order_status;')
}
