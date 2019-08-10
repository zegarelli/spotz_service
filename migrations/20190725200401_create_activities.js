
exports.up = async function (knex) {
  await knex.schema.createTable('activities', table => {
    table.increments('id').primary()
    table.string('name')
    table.integer('created_by').references('users.id')
    table.integer('updated_by').references('users.id')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.integer('place_id').references('places.id')
    table.json('extended_data')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('activities')
}
