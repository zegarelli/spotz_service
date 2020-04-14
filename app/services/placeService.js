const Place = require('../models/Place')
const PlaceActivity = require('../models/PlaceActivity')
const uuid = require('uuid')

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
    const placeActivities = mapPlaceActivityForCreate(data.activities)
    result.activities = await PlaceActivity.query().insertGraph(placeActivities).returning('*')
  }
  return result
}

async function update (id, data) {
  const result = await Place.query().patchAndFetchById(id, {
    name: data.name,
    'extended_data:description': data.description
  })

  const existingActivities = await PlaceActivity.query()
    .select('id', 'activity_id')
    .where({ place_id: id })

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

  result.createdPlaceActivities = await PlaceActivity.query().insertGraph(placeActivities).returning('*')
  result.deletedPlaceActivities = await PlaceActivity.query().delete().whereIn('id', needsDeleted)
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
