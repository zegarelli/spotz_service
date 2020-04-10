
exports.up = async function (knex) {
  await knex.schema.createTable('place_activity', table => {
    table.uuid('id').primary()
    table.uuid('place_id').references('id').inTable('place').notNullable().onDelete('CASCADE')
    table.uuid('activity_id').references('id').inTable('activity').notNullable().onDelete('CASCADE')
    table.json('details')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('place_activity')
}
