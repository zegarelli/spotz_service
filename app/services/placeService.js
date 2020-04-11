const Place = require('../models/Place')
const uuid = require('uuid')

async function search (name, creator) {
  let query = await Place.query()
    .withGraphFetched('[placeActivities(selectIdAndDescription).activity(selectNameAndId)]')
    .modifiers({
      selectNameAndId (builder) {
        builder.select('name', 'id')
      },
      selectIdAndDescription (builder) {
        builder.select('id', 'details')
      }
    })
  query = name ? query.where({ name }) : query
  query = creator ? query.where({ creator }) : query
  return query
}

async function create (data) {
  const activities = []
  if (data.activities && data.activities.length) {
    activities.forEach(activity => {
      activities.push({ activity_id: activity })
    })
  }

  const result = await Place.query().insertGraph({
    id: uuid.v4(),
    name: data.name,
    extended_data: { description: data.description },
    placeActivities: activities
  }).returning('*')

  // if (data.activities && data.activities.length) {

  // }
  return result
}

async function getById (id) {
  return Place.query().withGraphFetched('[placeActivities.activity, creator]').findById(id)
}

module.exports = {
  search,
  create,
  getById
}
