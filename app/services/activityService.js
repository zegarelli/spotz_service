const Activity = require('../models/Activity')
const PlaceActivity = require('../models/PlaceActivity')
const uuid = require('uuid')

async function search (name, creator, place) {
  let query = await Activity.query()
    .withGraphFetched('[placeActivities(selectIdAndDescription).place(selectNameAndId)]')
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
  query = place ? query.where({ place }) : query

  return query
}

async function create (data) {
  const result = await Activity.query().insert({
    id: uuid.v4(),
    name: data.name,
    extended_data: { description: data.description }
  }).returning('*')

  // Create PlaceActivities if needed
  if (data.places && data.places.length) {
    const places = []
    await data.places.forEach(place => {
      places.push({
        id: uuid.v4(),
        activity_id: result.id,
        place_id: place
      })
    })
    result.activities = await PlaceActivity.query().insertGraph(places).returning('*')
  }
  return result
}

async function getById (id) {
  return Activity.query().withGraphFetched('[placeActivities.place, creator]').findById(id)
}

module.exports = {
  search,
  create,
  getById
}
