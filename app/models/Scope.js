const Knex = require('knex')
const connection = require('../../knexfile')
const { Model } = require('objection')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class Scope extends Model {
  static get tableName () {
    return 'scope'
  }

  static get relationMappings () {
    const User = require('./User')
    return {
      scopes: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'scope.id',
          through: {
            from: 'user_scope.scope_id',
            to: 'user_scope.user_id'
          },
          to: 'user.id'
        }
      }
    }
  }
}

module.exports = Scope
