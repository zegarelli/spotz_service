
exports.up = async function (knex) {
  await knex.schema.createTable('scope', table => {
    table.uuid('id').primary()
    table.string('name')
    table.string('description')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('scope')
}
