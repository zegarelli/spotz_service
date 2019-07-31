
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { firstName: 'martin', lastName: 'zegarelli', email: 'martin@gmail.com' },
        { firstName: 'peter', lastName: 'dirks', email: 'pete@gmail.com' },
        { firstName: 'jackson', lastName: 'braatz', email: 'jackson@gmail.com' }
      ])
    })
}
