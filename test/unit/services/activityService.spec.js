/* global describe, it, beforeEach, expect */

require('../../support/node')
const activityService = require('../../../app/services/activityService')
const Activity = require('../../../app/models/Activity')
const placeActivityService = require('../../../app/services/placeActivityService')
const uuid = require('uuid')

describe('activityService', function () {
  describe('search', function () {
    let whereStub, withGraphFetchedStub, modifiersStub
    beforeEach(function () {
      whereStub = this.sinon.stub()
      modifiersStub = this.sinon.stub()
      withGraphFetchedStub = this.sinon.stub()
      this.sinon.stub(Activity, 'query').returns({ withGraphFetched: withGraphFetchedStub })
      withGraphFetchedStub.returns({ modifiers: modifiersStub })
      modifiersStub.returns({ where: whereStub })
    })
    it('it is a function', function () {
      expect(typeof activityService.search).to.equal('function')
    })
    it('searches correctly', async function () {
      const activity = { id: '123' }
      whereStub.onCall(0).returns({ where: whereStub })
      whereStub.onCall(1).returns({ where: whereStub })
      whereStub.onCall(2).returns(activity)
      const name = 'running'
      const creator = 'martin'
      const place = 'trolly trail'
      const result = await activityService.search(name, creator, place)
      expect(result).to.equal(activity)

      const firstCallArgs = whereStub.getCall(0).args
      expect(firstCallArgs[0]).to.deep.equal({ name })

      const secondCallArgs = whereStub.getCall(1).args
      expect(secondCallArgs[0]).to.deep.equal({ creator })

      const thirdCallArgs = whereStub.getCall(2).args
      expect(thirdCallArgs[0]).to.deep.equal({ place })
    })
    it('it skips name when name isn\'t provided', async function () {
      const activity = { id: '123' }
      whereStub.onCall(0).returns({ where: whereStub })
      whereStub.onCall(1).returns(activity)
      const creator = 'martin'
      const place = 'trolly trail'
      const result = await activityService.search(undefined, creator, place)
      expect(result).to.equal(activity)

      const firstCallArgs = whereStub.getCall(0).args
      expect(firstCallArgs[0]).to.deep.equal({ creator })

      const secondCallArgs = whereStub.getCall(1).args
      expect(secondCallArgs[0]).to.deep.equal({ place })
    })
    it('doesnt call where', async function () {
      const activity = { id: '123' }
      modifiersStub.returns(activity)
      const result = await activityService.search(undefined, undefined, undefined)
      expect(result).to.equal(activity)
      this.sinon.assert.notCalled(whereStub)
    })
  })
  describe('create', function () {
    let insertStub, returningStub, activityExpectedResult, data,
      createMultipleStub, createMultipleResult
    beforeEach(function () {
      data = {
        name: 'Some Fresh New Activity',
        description: 'Yo the best Activity around',
        places: [uuid.v4(), uuid.v4()]
      }

      activityExpectedResult = { id: uuid.v4() }
      insertStub = this.sinon.stub()
      returningStub = this.sinon.stub()
      this.sinon.stub(Activity, 'query').returns({ insert: insertStub })
      insertStub.returns({ returning: returningStub })
      returningStub.returns(activityExpectedResult)

      createMultipleResult = { id: uuid.v4() }
      createMultipleStub = this.sinon.stub(placeActivityService, 'createMultiple')
        .resolves(createMultipleResult)
    })
    it('Creates a new Place & PlaceActivities', async function () {
      const result = await activityService.create(data)
      expect(result).to.deep.equal({ ...activityExpectedResult, places: createMultipleResult })

      const insertData = insertStub.getCall(0).args[0]
      delete insertData.id
      expect(insertData).to.deep.equal({
        name: data.name,
        extended_data: { description: data.description }
      })

      const createMultipleArgs = createMultipleStub.getCall(0).args[0]
      delete createMultipleArgs[0].id
      delete createMultipleArgs[1].id
      expect(createMultipleArgs).to.deep.equal([
        {
          place_id: data.places[0],
          activity_id: activityExpectedResult.id
        },
        {
          place_id: data.places[1],
          activity_id: activityExpectedResult.id
        }
      ])
    })
    it('Doesn\'t create PlaceActivities when none are provided', async function () {
      delete data.activities
      const result = await activityService.create(data)
      expect(result).to.deep.equal(activityExpectedResult)
    })
  })
  describe('getById', function () {
    let findByIdStbub
    beforeEach(function () {
      findByIdStbub = this.sinon.stub()
      const withGraphFetchedStub = this.sinon.stub()
      this.sinon.stub(Activity, 'query').returns({ withGraphFetched: withGraphFetchedStub })
      withGraphFetchedStub.returns({ findById: findByIdStbub })
    })
    it('finds activity by id', async function () {
      const id = 'abc'
      const activity = { id: '123' }
      findByIdStbub.resolves(activity)
      const result = await activityService.getById(id)
      expect(result).to.deep.equal(activity)

      const findByIdArgs = findByIdStbub.getCall(0).args
      expect(findByIdArgs[0]).to.equal(id)
    })
  })
})
