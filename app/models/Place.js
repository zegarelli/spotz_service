const Knex = require('knex')
const connection = require('../../knexfile')
const { Model } = require('objection')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class Place extends Model {
  static get tableName () {
    return 'places'
  }

  static get relationMappings () {
    const User = require('./User')
    const Activity = require('./Activity')
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'places.created_by',
          to: 'users.id'
        }
      },
      activities: {
        relation: Model.HasManyRelation,
        modelClass: Activity,
        join: {
          from: 'places.id',
          to: 'activities.place_id'
        }
      }
    }
  }
}

module.exports = Place
