const Activity = require('../models/Activity')

async function search (name, creator, place) {
  let query = await Activity.query().withGraphFetched('[place, creator]')
  query = name ? query.where({ name }) : query
  query = creator ? query.where({ creator }) : query
  query = place ? query.where({ place }) : query
  //   query = after ? query.where('createdAt', '>=', after) : query
  //   query = before ? query.where('createdAt', '<=', before) : query
  return query
}

async function getById (id) {
  return Activity.query().withGraphFetched('[place, creator]').findById(id)
}

module.exports = {
  search,
  getById
}
