const Knex = require('knex')
const connection = require('../../knexfile')
const { Model } = require('objection')
const User = require('./User')
const Activity = require('./Activity')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class Place extends Model {
  static get tableName () {
    return 'places'
  }

  static get relationMappings () {
    return {
      creator_id: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'places.creator_id',
          to: 'user.id'
        }
      },
      activities: {
        relation: Model.HasManyRelation,
        modelClass: Activity,
        join: {
          from: 'place.id',
          to: 'activities.place_id'
        }
      }
    }
  }
}

module.exports = Place
