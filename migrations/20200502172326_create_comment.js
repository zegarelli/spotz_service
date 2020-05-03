
exports.up = async function (knex) {
  await knex.schema.createTable('comment', table => {
    table.uuid('id').primary()
    table.uuid('created_by').references('user.id')
    table.uuid('reference_id')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.string('text')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('comment')
}
