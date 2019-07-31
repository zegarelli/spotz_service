const Activity = require('../models/Activity')

function get (activityId) {
  return Activity.getById(activityId)
}

function search ({ name, creator, place }) {
  let query = Activity.query()
  query = name ? query.where({ name }) : query
  query = creator ? query.where({ creator }) : query
  query = place ? query.where({ place }) : query
  //   query = after ? query.where('createdAt', '>=', after) : query
  //   query = before ? query.where('createdAt', '<=', before) : query
  return query
}

module.exports = {
  get,
  search
}
