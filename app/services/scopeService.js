const Scope = require('../models/Scope')
const uuid = require('uuid')

async function create (data) {
  const result = await Scope.query().insert({
    id: uuid.v4(),
    name: data.name,
    description: data.description
  }).returning('*')

  return result
}

async function deleteById (id) {
  return Scope.query().findById(id).delete()
}

async function get () {
  const query = await Scope.query().orderBy('name')
  return query
}

async function getById (id) {
  return Scope.query().findById(id)
}

async function getBaseScopes () {
  const result = await Scope.query().select('id').whereIn('name', ['objects:edit', 'objects:create'])
  return result
}

async function update (id, data) {
  const result = await Scope.query().patchAndFetchById(id, {
    name: data.name,
    description: data.description
  })

  return result
}

module.exports = {
  create,
  deleteById,
  get,
  getById,
  update,
  getBaseScopes
}
