const uuid = require('uuid')

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('scope').del()

  // Inserts seed entries
  await knex('scope').insert([
    {
      id: uuid.v4(),
      name: 'objects:view',
      description: 'allows a user to view'
    },
    {
      id: uuid.v4(),
      name: 'objects:edit',
      description: 'allows a user to edit'
    },
    {
      id: uuid.v4(),
      name: 'objects:create',
      description: 'allows a user to create'
    },
    {
      id: uuid.v4(),
      name: 'admin:manage',
      description: 'allows a user manage admin stuff'
    }
  ])
}
