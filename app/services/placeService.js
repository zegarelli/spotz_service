const Place = require('../models/Place')

async function search (name, creator) {
  let query = await Place.query().withGraphFetched('[activities, creator]')
  query = name ? query.where({ name }) : query
  query = creator ? query.where({ creator }) : query
  return query
}

async function getById (id) {
  return Place.query().withGraphFetched('[activities, creator]').findById(id)
}

module.exports = {
  search,
  getById
}
