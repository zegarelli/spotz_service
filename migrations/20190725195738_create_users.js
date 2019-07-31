
exports.up = async function (knex) {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('firstName')
    table.string('lastName')
    table.string('email')
    table.json('extended_data')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('users')
}
