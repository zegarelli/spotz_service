const Knex = require('knex')
const connection = require('../../knexfile')
const { Model } = require('objection')

const knexConnection = Knex(connection)

Model.knex(knexConnection)

class PlaceActivity extends Model {
  static get tableName () {
    return 'place_activity'
  }

  static get relationMappings () {
    const Place = require('./Place')
    const Activity = require('./Activity')
    return {
      place: {
        relation: Model.BelongsToOneRelation,
        modelClass: Place,
        join: {
          from: 'place_activity.place_id',
          to: 'place.id'
        }
      },
      activity: {
        relation: Model.BelongsToOneRelation,
        modelClass: Activity,
        join: {
          from: 'place_activity.activity_id',
          to: 'activity.id'
        }
      }
    }
  }
}

module.exports = PlaceActivity
