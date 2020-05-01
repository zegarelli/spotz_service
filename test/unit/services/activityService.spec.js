/* global describe, it, beforeEach, expect */

require('../../support/node')
const activityService = require('../../../app/services/activityService')
const Activity = require('../../../app/models/Activity')
const placeActivityService = require('../../../app/services/placeActivityService')
const uuid = require('uuid')

describe('activityService', function () {
  const userId = uuid.v4()
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
    it('Creates a new Activity & PlaceActivities', async function () {
      const result = await activityService.create(data, userId)
      expect(result).to.deep.equal({ ...activityExpectedResult, places: createMultipleResult })

      const insertData = insertStub.getCall(0).args[0]
      delete insertData.id
      expect(insertData).to.deep.equal({
        name: data.name,
        created_by: userId,
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
      delete data.places
      const result = await activityService.create(data)
      expect(result).to.deep.equal(activityExpectedResult)
    })
  })

  describe('update', function () {
    let id, data, patchAndFetchByIdSub,
      patchExpectedResult, createdPlaceActivities, deletedPlaceActivities,
      createMultipleStub, existingPlaceActivities, deleteMultipleStub
    beforeEach(function () {
      id = uuid.v4()
      data = {
        name: 'Some Fresh New thing to do',
        description: 'Yo the best activity around',
        places: [uuid.v4(), uuid.v4()]
      }

      patchExpectedResult = { id }

      patchAndFetchByIdSub = this.sinon.stub()
      this.sinon.stub(Activity, 'query').returns({ patchAndFetchById: patchAndFetchByIdSub })
      patchAndFetchByIdSub.returns(patchExpectedResult)

      existingPlaceActivities = [
        { id: uuid.v4(), place_id: data.places[0], name: 'no change' },
        { id: uuid.v4(), place_id: uuid.v4(), name: 'needs deleted' }
      ]
      this.sinon.stub(placeActivityService, 'findByActivityId')
        .resolves(existingPlaceActivities)

      createdPlaceActivities = [{ id: data.places[1] }]
      deletedPlaceActivities = [existingPlaceActivities[1]]

      createMultipleStub = this.sinon.stub(placeActivityService, 'createMultiple')
        .resolves(createdPlaceActivities)
      deleteMultipleStub = this.sinon.stub(placeActivityService, 'deleteMultiple')
        .resolves(deletedPlaceActivities)
    })
    it('Updates the specified place, and handles activities properly', async function () {
      const result = await activityService.update(id, data, userId)
      expect(result).to.deep.equal({
        ...patchExpectedResult,
        createdPlaceActivities,
        deletedPlaceActivities
      })

      const patchAndFetchByIdArgs = patchAndFetchByIdSub.getCall(0).args
      expect(patchAndFetchByIdArgs[0]).to.equal(id)
      expect(patchAndFetchByIdArgs[1]).to.deep.equal({
        name: data.name,
        updated_by: userId,
        'extended_data:description': data.description
      })

      const createMultipleArgs = createMultipleStub.getCall(0).args[0]
      delete createMultipleArgs[0].id
      expect(createMultipleArgs).to.deep.equal([{
        activity_id: result.id,
        place_id: data.places[1]
      }])

      const deleteMultipleArgs = deleteMultipleStub.getCall(0).args[0]
      delete deleteMultipleArgs[0].id
      expect(deleteMultipleArgs).to.deep.equal([existingPlaceActivities[1].id])
    })
    it('Doesn\'t create PlaceActivities when provided match existing', async function () {
      existingPlaceActivities[1].place_id = data.places[1]
      const result = await activityService.update(id, data)
      expect(result).to.deep.equal(patchExpectedResult)
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
