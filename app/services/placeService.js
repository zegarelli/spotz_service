const Place = require('../models/Place')

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

async function getById (id) {
  return Place.query().withGraphFetched('[placeActivities.activity, creator]').findById(id)
}

module.exports = {
  search,
  getById
}
