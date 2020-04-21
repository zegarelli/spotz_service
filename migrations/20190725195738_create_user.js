
exports.up = async function (knex) {
  await knex.schema.createTable('user', table => {
    table.uuid('id').primary()
    table.string('firstName')
    table.string('lastName')
    table.string('username')
    table.string('email')
    table.boolean('verified')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.json('extended_data')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('user')
}
