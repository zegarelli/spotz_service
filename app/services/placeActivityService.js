const PlaceActivity = require('../models/PlaceActivity')

async function createMultiple (placeActivities) {
  const createdPlaceActivities = await PlaceActivity.query()
    .insertGraph(placeActivities)
    .returning('*')
  return createdPlaceActivities
}

async function deleteMultiple (ids) {
  const deletedPlaceActivities = await PlaceActivity.query()
    .delete()
    .whereIn('id', ids)
  return deletedPlaceActivities
}

async function findByPlaceId (id) {
  const placeActivity = await PlaceActivity.query()
    .select('id', 'activity_id')
    .where({ place_id: id })
  return placeActivity
}

module.exports = {
  createMultiple,
  deleteMultiple,
  findByPlaceId
}
