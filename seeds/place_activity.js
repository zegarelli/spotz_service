const uuid = require('uuid')

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('place_activity').del()

  // finds places and activities to join
  const places = await knex.from('place').select('id')
  const activities = await knex.from('activity').select('id')

  // Inserts seed entries
  await knex('place_activity').insert([
    {
      id: uuid.v4(),
      place_id: places[0].id,
      activity_id: activities[0].id,
      details: { hours: { open: 800, close: 2230 }, price: 20.00, description: 'I don\'t know man' }
    },
    {
      id: uuid.v4(),
      place_id: places[1].id,
      activity_id: activities[1].id,
      details: { hours: { open: 800, close: 2230 }, price: 20.00, description: 'I don\'t know man' }
    },
    {
      id: uuid.v4(),
      place_id: places[2].id,
      activity_id: activities[1].id,
      details: { hours: { open: 800, close: 2230 }, price: 20.00, description: 'I don\'t know man' }
    },
    {
      id: uuid.v4(),
      place_id: places[1].id,
      activity_id: activities[2].id,
      details: { hours: { open: 800, close: 2230 }, price: 20.00, description: 'I don\'t know man' }
    },
    {
      id: uuid.v4(),
      place_id: places[2].id,
      activity_id: activities[3].id,
      details: { hours: { open: 800, close: 2230 }, price: 20.00, description: 'I don\'t know man' }
    }
  ])
}
