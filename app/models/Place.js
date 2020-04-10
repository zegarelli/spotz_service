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
    const Activity = require('./Activity')
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'place.created_by',
          to: 'user.id'
        }
      },
      activities: {
        relation: Model.ManyToManyRelation,
        modelClass: Activity,
        join: {
          from: 'place.id',
          through: {
            from: 'place_activity.place_id',
            to: 'place_activity.activity_id'
          },
          to: 'activity.id'
        }
      }
    }
  }
}

module.exports = Place
