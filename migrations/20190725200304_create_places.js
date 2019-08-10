
exports.up = async function (knex) {
  await knex.schema.createTable('places', table => {
    table.increments('id').primary()
    table.string('name')
    table.integer('created_by').references('users.id')
    table.integer('updated_by').references('users.id')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.json('extended_data')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('places')
}
