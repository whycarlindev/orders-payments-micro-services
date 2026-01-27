import type { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.raw(`
    CREATE TYPE payment_method AS ENUM (
      'credit_card',
      'paypal',
      'pix',
      'billet'
    );
  `)

  await knex.raw(`
    CREATE TYPE payment_status AS ENUM (
      'pending',
      'success',
      'failure'
    );
  `)

  await knex.schema.createTable('payments', (table) => {
    table.uuid('id').primary()
    table.uuid('order_id').notNullable().unique().index()
    table.decimal('cost', 10, 2).notNullable()
    table.uuid('idempotency_key').notNullable().unique().index()
    table.specificType('method', 'payment_method').notNullable()
    table
      .specificType('status', 'payment_status')
      .notNullable()
      .defaultTo('pending')
    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('payments')
  await knex.raw('DROP TYPE IF EXISTS payment_status;')
  await knex.raw('DROP TYPE IF EXISTS payment_method;')
}
