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
    const PlaceActivity = require('./PlaceActivity')
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
      placeActivities: {
        relation: Model.HasManyRelation,
        modelClass: PlaceActivity,
        join: {
          from: 'activity.id',
          to: 'place_activity.activity_id'
        }
      }
    }
  }
}

module.exports = Activity
