
exports.up = async function (knex) {
  await knex.schema.createTable('places', table => {
    table.increments('id').primary()
    table.string('name')
    table.integer('creator_id').references('users.id')
    table.json('extended_data')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('places')
}
