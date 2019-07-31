// Update with your config settings.

module.exports = {
  client: 'pg',
  connection: {
    database: 'spots_db',
    user: 'test_user',
    password: 'testpass'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}
