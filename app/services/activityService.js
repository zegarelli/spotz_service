const Activity = require('../models/Activity')
const placeActivityService = require('../services/placeActivityService')
const { selectIdAndDescription, selectNameAndId } = require('./common/builders')
const uuid = require('uuid')

async function search (name, creator, place) {
  let query = await Activity.query()
    .withGraphFetched('[placeActivities(selectIdAndDescription).place(selectNameAndId)]')
    .modifiers({
      selectNameAndId,
      selectIdAndDescription
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
    result.places = await placeActivityService.createMultiple(places)
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
