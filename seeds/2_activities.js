
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('activities').del()
    .then(function () {
      // Inserts seed entries
      return knex('activities').insert([
        { name: 'drinking', created_by: 2, place_id: 2 },
        { name: 'eating', created_by: 1, place_id: 2 },
        { name: 'dancing', created_by: 3, place_id: 2 },
        { name: 'drinking', created_by: 3, place_id: 1 },
        { name: 'drinking', created_by: 3, place_id: 3 },
        { name: 'dancing', created_by: 3, place_id: 1 }
      ])
    })
}
