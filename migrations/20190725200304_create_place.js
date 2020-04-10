
exports.up = async function (knex) {
  await knex.schema.createTable('place', table => {
    table.uuid('id').primary()
    table.string('name')
    table.uuid('created_by').references('user.id')
    table.uuid('updated_by').references('user.id')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.json('extended_data')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('place')
}
