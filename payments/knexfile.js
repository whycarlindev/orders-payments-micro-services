require('dotenv/config')

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: './src/infra/database/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './src/infra/database/seeds',
    extension: 'ts',
  },
}
