const Comment = require('../models/Comment')
const uuid = require('uuid')
const commentTree = require('../common/commentTree')

async function create (data, userId) {
  const result = await Comment.query().insert({
    id: uuid.v4(),
    object_id: data.objectId,
    parent_id: data.parentId,
    text: data.text,
    created_by: userId
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
