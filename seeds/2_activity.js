const uuid = require('uuid')

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('activity').del()

  // finds users to call creator and updater
  const users = await knex.from('user').select('id')

  // Inserts seed entries
  await knex('activity').insert([
    {
      id: uuid.v4(),
      name: 'drinking',
      created_by: users[0].id,
      extended_data: {
        description: 'Say goodbye to your sorrows'
      }
    },
    {
      id: uuid.v4(),
      name: 'eating',
      created_by: users[1].id,
      extended_data: {
        description: 'Feed your face'
      }
    },
    {
      id: uuid.v4(),
      name: 'dancing',
      created_by: users[1].id,
      extended_data: {
        description: 'Strange body movements. Typically done in an attempt to attract a mate'
      }
    },
    {
      id: uuid.v4(),
      name: 'pool',
      created_by: users[2].id,
      extended_data: {
        description: 'Heavy balls & green velvet.'
      }
    }
  ])
}
