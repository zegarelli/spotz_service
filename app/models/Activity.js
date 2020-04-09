const Knex = require('knex')
const connection = require('../../knexfile')
const { Model } = require('objection')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class Activity extends Model {
  static get tableName () {
    return 'activities'
  }

  static get relationMappings () {
    const Place = require('./Place')
    const User = require('./User')
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'activities.created_by',
          to: 'users.id'
        }
      },
      place: {
        relation: Model.BelongsToOneRelation,
        modelClass: Place,
        join: {
          from: 'activities.place_id',
          to: 'places.id'
        }
      }
    }
  }
}

module.exports = Activity
