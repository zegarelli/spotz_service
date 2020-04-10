const uuid = require('uuid')

exports.seed = async function (knex) {
  // Deletes ALL existing entries in all tables
  await knex('place_activity').del()
  await knex('activity').del()
  await knex('place').del()
  await knex('user').del()

  // Inserts seed entries
  return knex('user').insert([
    { id: uuid.v4(), firstName: 'martin', lastName: 'zegarelli', email: 'martin@gmail.com' },
    { id: uuid.v4(), firstName: 'peter', lastName: 'dirks', email: 'pete@gmail.com' },
    { id: uuid.v4(), firstName: 'jackson', lastName: 'braatz', email: 'jackson@gmail.com' }
  ])
}
