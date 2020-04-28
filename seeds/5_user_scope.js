const uuid = require('uuid')

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('user_scope').del()

  // finds users to call creator and updater
  const martin = await knex.from('user').select('id').where({ firstName: 'martin' })
  const users = await knex.from('user').select('id')
  const admin = await knex.from('scope').select('id').where({ name: 'admin:manage' })
  const scopes = await knex.from('scope').select('id')

  console.log(martin)
  // Inserts seed entries
  await knex('user_scope').insert([
    {
      id: uuid.v4(),
      user_id: martin[0].id,
      scope_id: admin[0].id
    },
    {
      id: uuid.v4(),
      user_id: martin[0].id,
      scope_id: scopes[1].id
    },
    {
      id: uuid.v4(),
      user_id: users[1].id,
      scope_id: scopes[1].id
    }])
}
