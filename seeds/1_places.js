
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('places').del()
    .then(function () {
      // Inserts seed entries
      return knex('places').insert([
        { name: 1, creator_id: 3 },
        { name: 2, creator_id: 2 },
        { name: 3, creator_id: 1 }
      ])
    })
}
