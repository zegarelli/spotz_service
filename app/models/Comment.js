const Knex = require('knex')
const connection = require('../../knexfile')
const { Model } = require('objection')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class Comment extends Model {
  static get tableName () {
    return 'comment'
  }

  static get relationMappings () {
    const User = require('./User')
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'comment.created_by',
          to: 'user.id'
        }
      }
    }
  }
}

module.exports = Comment
