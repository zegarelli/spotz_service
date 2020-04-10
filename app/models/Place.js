const Knex = require('knex')
const connection = require('../../knexfile')
const { Model } = require('objection')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class Place extends Model {
  static get tableName () {
    return 'place'
  }

  static get relationMappings () {
    const User = require('./User')
    const PlaceActivity = require('./PlaceActivity')
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'place.created_by',
          to: 'user.id'
        }
      },
      placeActivities: {
        relation: Model.HasManyRelation,
        modelClass: PlaceActivity,
        join: {
          from: 'place.id',
          to: 'place_activity.place_id'
        }
      }
    }
  }
}

module.exports = Place
