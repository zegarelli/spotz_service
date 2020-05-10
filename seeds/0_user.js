const uuid = require('uuid')

exports.seed = async function (knex) {
  // Deletes ALL existing entries in all tables
  await knex('comment').del()
  await knex('place_activity').del()
  await knex('activity').del()
  await knex('place').del()
  await knex('user_scope').del()
  await knex('scope').del()
  await knex('user').del()

  // Inserts seed entries
  return knex('user').insert([
    {
      id: uuid.v4(),
      firstName: 'martin',
      lastName: 'zegarelli2',
      email: 'prepxc@gmail.com',
      username: 'martin',
      verified: true,
      extended_data: { profilePic: 'https://spotzstatic.s3.us-east-2.amazonaws.com/bitmoji.png' }
    },
    { id: uuid.v4(), firstName: 'peter', lastName: 'dirks', username: 'peter', email: 'pete@gmail.com' },
    { id: uuid.v4(), firstName: 'jackson', lastName: 'braatz', username: 'jackson', email: 'jackson@gmail.com' }
  ])
}
