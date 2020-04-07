const Knex = require('knex')
const connection = require('../../knexfile')
const { Model } = require('objection')
const Place = require('./Place')
const User = require('./User')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class Activity extends Model {
  static get tableName () {
    return 'activities'
  }

  static get relationMappings () {
    return {
      creator_id: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'activities.created_by',
          to: 'user.id'
        }
      },
      place_id: {
        relation: Model.BelongsToOneRelation,
        modelClass: Place,
        join: {
          from: 'activities.place_id',
          to: 'place.id'
        }
      }
    }
  }
}

module.exports = Activity
