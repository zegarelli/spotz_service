
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('activities').del()
    .then(function () {
      // Inserts seed entries
      return knex('activities').insert([
        { name: 'drinking', creator_id: 2, place_id: 2 },
        { name: 'eating', creator_id: 1, place_id: 2 },
        { name: 'dancing', creator_id: 3, place_id: 2 },
        { name: 'drinking', creator_id: 3, place_id: 1 },
        { name: 'drinking', creator_id: 3, place_id: 3 },
        { name: 'dancing', creator_id: 3, place_id: 1 }
      ])
    })
}
