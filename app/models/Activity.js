const Knex = require('knex')
const connection = require('../../knexfile')
const { Model } = require('objection')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class Activity extends Model {
  static get tableName () {
    return 'activity'
  }

  static get relationMappings () {
    const Place = require('./Place')
    const User = require('./User')
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'activity.created_by',
          to: 'user.id'
        }
      },
      places: {
        relation: Model.ManyToManyRelation,
        modelClass: Place,
        join: {
          from: 'activity.id',
          through: {
            from: 'place_activity.activity_id',
            to: 'place_activity.place_id'
          },
          to: 'place.id'
        }
      }
    }
  }
}

module.exports = Activity
