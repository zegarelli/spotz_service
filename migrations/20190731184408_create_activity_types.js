
exports.up = async function (knex) {
  await knex.schema.createTable('activity_types', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('description')
    table.json('extended_data')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('activity_types')
}
