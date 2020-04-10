const Knex = require('knex')
const connection = require('../../knexfile')
const { Model } = require('objection')
const Place = require('./Place')
const Activity = require('./Activity')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class User extends Model {
  static get tableName () {
    return 'user'
  }

  static get relationMappings () {
    return {
      places: {
        relation: Model.HasManyRelation,
        modelClass: Place,
        join: {
          from: 'user.id',
          to: 'place.created_by'
        }
      },
      activities: {
        relation: Model.HasManyRelation,
        modelClass: Activity,
        join: {
          from: 'users.id',
          to: 'activity.created_by'
        }
      }
    }
  }
}

module.exports = User
