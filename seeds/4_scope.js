const uuid = require('uuid')

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('scope').del()

  // Inserts seed entries
  await knex('scope').insert([
    {
      id: uuid.v4(),
      name: 'activities:view',
      description: 'allows a user to view activities'
    },
    {
      id: uuid.v4(),
      name: 'activities:edit',
      description: 'allows a user to edit activities'
    },
    {
      id: uuid.v4(),
      name: 'admin:manage',
      description: 'allows a user manage admin stuff'
    }
  ])
}
