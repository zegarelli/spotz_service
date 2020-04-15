const Activity = require('../models/Activity')
const placeActivityService = require('../services/placeActivityService')
const { selectIdAndDescription, selectNameAndId } = require('./common/builders')

async function mapPlaceActivityForCreate (placeIds, activityId) {
  const placeActivities = []
  await placeIds.forEach(place => {
    placeActivities.push({
      id: uuid.v4(),
      activity_id: activityId,
      place_id: place
    })
  })
  return placeActivities
}
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
    const placeActivities = await mapPlaceActivityForCreate(data.places, result.id)
    result.places = await placeActivityService.createMultiple(placeActivities)
  }
  return result
}

async function update (id, data) {
  const result = await Activity.query().patchAndFetchById(id, {
    name: data.name,
    'extended_data:description': data.description
  })

  const existingPlaces = await placeActivityService.findByActivityId(result.id)

  const needsDeleted = existingPlaces.filter((existing) => {
    return data.places.indexOf(existing.place_id) < 0
  }).map(obj => obj.id)

  const needsCreated = data.places.filter((activity) => {
    for (const existing of existingPlaces) {
      if (existing.place_id === activity) {
        return
      }
    }
    return true
  })

  const placeActivities = await mapPlaceActivityForCreate(needsCreated, id)

  if (placeActivities.length) {
    result.createdPlaceActivities = await placeActivityService.createMultiple(placeActivities)
  }
  if (needsDeleted.length) {
    result.deletedPlaceActivities = await placeActivityService.deleteMultiple(needsDeleted)
  }
  return result
}

async function getById (id) {
  return Activity.query().withGraphFetched('[placeActivities.place, creator]').findById(id)
}

module.exports = {
  search,
  create,
  update,
  getById
}
