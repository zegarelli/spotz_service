const Activity = require('../models/Activity')

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

async function getById (id) {
  return Activity.query().withGraphFetched('[placeActivities.place, creator]').findById(id)
}

module.exports = {
  search,
  getById
}
