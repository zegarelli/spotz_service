const Comment = require('../models/Comment')
const uuid = require('uuid')
const commentTree = require('../common/commentTree')

async function create (data) {
  const result = await Comment.query().insert({
    id: uuid.v4(),
    name: data.name,
    description: data.description
  }).returning('*')

  return result
}

async function deleteById (id) {
  return Comment.query().findById(id).delete()
}

async function get (objectId) {
  const where = {}
  if (objectId) {
    where.object_id = objectId
  }
  const query = await Comment.query().where(where).orderBy('created_at')
  const threaded = commentTree(query)
  return threaded
}

async function update (id, data) {
  const result = await Comment.query().patchAndFetchById(id, {
    text: data.text
  })

  return result
}

module.exports = {
  create,
  deleteById,
  get,
  update
}
