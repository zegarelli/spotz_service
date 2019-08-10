
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('places').del()
    .then(function () {
      // Inserts seed entries
      return knex('places').insert([
        { name: 'Buzzard Beach', creator_id: 3, extended_data: { description: "It's where you finish your night", opens: '1:30 AM', closes: '3:00 AM' } },
        { name: 'Harpos', creator_id: 2, extended_data: { description: 'All they serve is RBVs', opens: '7 PM', closes: '1:00 AM' } },
        { name: 'Bazookas', creator_id: 1, extended_data: { description: 'We have boobs', opens: '1:30 AM', closes: '3:00 AM' } }
      ])
    })
}
