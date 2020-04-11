const Place = require('../models/Place')
const PlaceActivity = require('../models/PlaceActivity')
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
  const result = await Place.query().insert({
    id: uuid.v4(),
    name: data.name,
    extended_data: { description: data.description }
  }).returning('*')

  // Create PlaceActivities if needed
  if (data.activities && data.activities.length) {
    const activities = []
    await data.activities.forEach(activity => {
      activities.push({
        id: uuid.v4(),
        activity_id: activity,
        place_id: result.id
      })
    })
    result.activities = await PlaceActivity.query().insertGraph(activities).returning('*')
  }
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
