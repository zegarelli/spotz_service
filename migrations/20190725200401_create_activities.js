
exports.up = async function (knex) {
  await knex.schema.createTable('activities', table => {
    table.increments('id').primary()
    table.string('name')
    table.integer('creator_id').references('users.id')
    table.integer('place_id').references('places.id')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('activities')
}
