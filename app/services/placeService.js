const Place = require('../models/Place')
const placeActivityService = require('./placeActivityService')
const uuid = require('uuid')
const { selectIdAndDescription, selectNameAndId } = require('./common/builders')

async function mapPlaceActivityForCreate (activityIds, placeId) {
  const placeActivities = []
  await activityIds.forEach(activity => {
    placeActivities.push({
      id: uuid.v4(),
      activity_id: activity,
      place_id: placeId
    })
  })
  return placeActivities
}

async function search (name, creator) {
  let query = await Place.query()
    .withGraphFetched('[placeActivities(selectIdAndDescription).activity(selectNameAndId)]')
    .modifiers({
      selectNameAndId,
      selectIdAndDescription
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
    const placeActivities = await mapPlaceActivityForCreate(data.activities, result.id)
    result.activities = await placeActivityService.createMultiple(placeActivities)
  }
  return result
}

async function update (id, data) {
  const result = await Place.query().patchAndFetchById(id, {
    name: data.name,
    'extended_data:description': data.description
  })

  const existingActivities = await placeActivityService.findByPlaceId(result.id)

  const needsDeleted = existingActivities.filter((existing) => {
    return data.activities.indexOf(existing.activity_id) < 0
  }).map(obj => obj.id)

  const needsCreated = data.activities.filter((activity) => {
    for (const existing of existingActivities) {
      if (existing.activity_id === activity) {
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
  return Place.query().withGraphFetched('[placeActivities.activity, creator]').findById(id)
}

module.exports = {
  search,
  create,
  update,
  getById
}
