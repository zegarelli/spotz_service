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
          extended_data: {
            description: "It's where you finish your night",
            opens: '1:30 AM',
            closes: '3:00 AM',
            imagePath: 'https://lh5.googleusercontent.com/p/AF1QipPhBburW6CsBl35dO-ygHZaDq-z8dyIoV_R1lHc=s387-k-no'
          }
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
            closes: '1:00 AM',
            imagePath: 'https://visitkcfiles.s3-us-west-2.amazonaws.com/37326-Harpos-01-1323.jpg'
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
            closes: '3:00 AM',
            imagePath: 'https://ak.jogurucdn.com/media/image/p25/place-2018-02-5-11-43deaf18569ea64b04aaaf5cabebe0d8.jpg'
          }
        }
      ])
    })
}
