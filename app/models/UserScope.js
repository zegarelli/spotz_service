const Knex = require('knex')
const connection = require('../../knexfile')
const { Model } = require('objection')
const User = require('./Place')
const Scope = require('./Scope')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class UserScope extends Model {
  static get tableName () {
    return 'user_scope'
  }

  static get relationMappings () {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'user_scope.user_id',
          to: 'user.id'
        }
      },
      scope: {
        relation: Model.HasOneRelation,
        modelClass: Scope,
        join: {
          from: 'user_scope.scope_id',
          to: 'scope.id'
        }
      }
    }
  }
}

module.exports = UserScope
