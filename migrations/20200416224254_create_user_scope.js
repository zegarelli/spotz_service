
exports.up = async function (knex) {
  await knex.schema.createTable('user_scope', table => {
    table.uuid('id').primary()
    table.uuid('user_id').references('id').inTable('user').notNullable().onDelete('CASCADE')
    table.uuid('scope_id').references('id').inTable('scope').notNullable().onDelete('CASCADE')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('user_scope')
}
