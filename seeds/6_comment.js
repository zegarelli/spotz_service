const uuid = require('uuid')

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('comment').del()

  // finds users to call creator and updater
  const bazookas = await knex.from('place').select('id').where({ name: 'Bazookas' })
  const users = await knex.from('user').select('id')

  // Inserts seed entries
  await knex('comment').insert([
    {
      id: uuid.v4(),
      object_id: bazookas[0].id,
      created_by: users[0].id,
      text: 'This is brilliant'
    },
    {
      id: uuid.v4(),
      object_id: bazookas[0].id,
      created_by: users[1].id,
      text: 'Hmm, I think I\'d try it'
    },
    {
      id: uuid.v4(),
      object_id: users[1].id,
      created_by: users[2].id,
      text: 'No chance, not even once'
    }])

  const parentComment = await knex.from('comment').select('id').where({ text: 'This is brilliant' })

  await knex('comment').insert([
    {
      id: uuid.v4(),
      object_id: bazookas[0].id,
      parent_id: parentComment[0].id,
      created_by: users[0].id,
      text: 'Ehh, I don\'t think so'
    }
  ])
}
