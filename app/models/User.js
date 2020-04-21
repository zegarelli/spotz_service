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
    const Scope = require('./Scope')
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
          from: 'user.id',
          to: 'activity.created_by'
        }
      },
      scopes: {
        relation: Model.ManyToManyRelation,
        modelClass: Scope,
        join: {
          from: 'user.id',
          through: {
            from: 'user_scope.user_id',
            to: 'user_scope.scope_id'
          },
          to: 'scope.id'
        }
      }
    }
  }
}

module.exports = User
