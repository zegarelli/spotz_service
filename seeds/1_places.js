const moment = require('moment')

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('places').del()
    .then(function () {
      // Inserts seed entries
      return knex('places').insert([
        {
          name: 'Buzzard Beach',
          created_by: 3,
          updated_by: 3,
          created_at: moment().subtract(2, 'hours'),
          updated_at: moment().subtract(1, 'minute'),
          extended_data: { description: "It's where you finish your night", opens: '1:30 AM', closes: '3:00 AM' }
        },
        {
          name: 'Harpos',
          created_by: 2,
          updated_by: 1,
          created_at: moment().subtract(1, 'hour'),
          updated_at: moment().subtract(5, 'minutes'),
          extended_data: {
            description: 'All they serve is RBVs',
            opens: '7 PM',
            closes: '1:00 AM'
          }
        },
        {
          name: 'Bazookas',
          created_by: 1,
          updated_by: 2,
          created_at: moment().subtract(30, 'minutes'),
          updated_at: moment().subtract(15, 'minutes'),
          extended_data: {
            description: 'We have boobs',
            opens: '1:30 AM',
            closes: '3:00 AM'
          }
        }
      ])
    })
}
