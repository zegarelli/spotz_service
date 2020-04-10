const uuid = require('uuid')

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('activity').del()

  // finds users to call creator and updater
  const users = await knex.from('user').select('id')

  // Inserts seed entries
  await knex('activity').insert([
    { id: uuid.v4(), name: 'drinking', created_by: users[0].id },
    { id: uuid.v4(), name: 'eating', created_by: users[1].id },
    { id: uuid.v4(), name: 'dancing', created_by: users[1].id },
    { id: uuid.v4(), name: 'pool', created_by: users[2].id }
  ])
}
