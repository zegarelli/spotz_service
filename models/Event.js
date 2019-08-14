const Knex = require('knex')
const connection = require('../knexfile')
const { Model } = require('objection')
const Place = require('./Place')
const User = require('./User')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class Activity extends Model {
  static get tableName () {
    return 'events'
  }

  static get relationMappings () {
    return {
      event_id: {
        relation: Model.BelongsToOneRelation,
        modelClass: Place,
        join: {
          from: 'activities.place_id',
          to: 'place.id'
        }
      },
      creator_id: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'events.creator_id',
          to: 'user.id'
        }
      }
    }
  }
}

module.exports = Event
