/* global describe, it, beforeEach, expect */

require('../../support/node')
const placeService = require('../../../app/services/placeService')
const Place = require('../../../app/models/Place')
const placeActivityService = require('../../../app/services/placeActivityService')
const uuid = require('uuid')

describe('placeService', function () {
  describe('search', function () {
    let whereStub, withGraphFetchedStub, modifiersStub
    beforeEach(function () {
      whereStub = this.sinon.stub()
      modifiersStub = this.sinon.stub()
      withGraphFetchedStub = this.sinon.stub()
      this.sinon.stub(Place, 'query').returns({ withGraphFetched: withGraphFetchedStub })
      withGraphFetchedStub.returns({ modifiers: modifiersStub })
      modifiersStub.returns({ where: whereStub })
    })
    it('it is a function', function () {
      expect(typeof placeService.search).to.equal('function')
    })
    it('searches correctly', async function () {
      const place = { id: '123' }
      whereStub.onCall(0).returns({ where: whereStub })
      whereStub.onCall(1).returns(place)
      const name = 'running'
      const creator = 'martin'
      const result = await placeService.search(name, creator)
      expect(result).to.equal(place)

      const firstCallArgs = whereStub.getCall(0).args
      expect(firstCallArgs[0]).to.deep.equal({ name })

      const secondCallArgs = whereStub.getCall(1).args
      expect(secondCallArgs[0]).to.deep.equal({ creator })
    })
    it('it skips name when name isn\'t provided', async function () {
      const place = { id: '123' }
      whereStub.returns(place)
      const creator = 'martin'
      const result = await placeService.search(undefined, creator)
      expect(result).to.equal(place)

      const firstCallArgs = whereStub.getCall(0).args
      expect(firstCallArgs[0]).to.deep.equal({ creator })

      expect(whereStub.calledOnce).to.equal(true)
    })
    it('doesnt call where', async function () {
      const place = { id: '123' }
      modifiersStub.returns(place)
      const result = await placeService.search(undefined, undefined)
      expect(result).to.equal(place)
      this.sinon.assert.notCalled(whereStub)
    })
  })

  describe('create', function () {
    let insertStub, returningStub, placeExpectedResult, data, createMultipleStub, activities
    beforeEach(function () {
      activities = [uuid.v4(), uuid.v4()]
      data = {
        name: 'Some Fresh New Place',
        description: 'Yo the best place around',
        activities
      }

      placeExpectedResult = { id: uuid.v4() }
      insertStub = this.sinon.stub()
      returningStub = this.sinon.stub()
      this.sinon.stub(Place, 'query').returns({ insert: insertStub })
      insertStub.returns({ returning: returningStub })
      returningStub.onFirstCall().returns(placeExpectedResult)

      createMultipleStub = this.sinon.stub(placeActivityService, 'createMultiple')
        .resolves(activities)
    })
    it('Creates a new Place & PlaceActivities', async function () {
      const result = await placeService.create(data)
      expect(result).to.deep.equal({ ...placeExpectedResult, activities })

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
          activity_id: activities[0],
          place_id: placeExpectedResult.id
        },
        {
          activity_id: activities[1],
          place_id: placeExpectedResult.id
        }
      ])
    })
    it('Doesn\'t create PlaceActivities when none are provided', async function () {
      delete data.activities
      const result = await placeService.create(data)
      expect(result).to.deep.equal(placeExpectedResult)
    })
  })

  describe('update', function () {
    let id, data, patchAndFetchByIdSub,
      patchExpectedResult, createdPlaceActivities, deletedPlaceActivities,
      createMultipleStub, existingPlaceActivities, deleteMultipleStub
    beforeEach(function () {
      id = uuid.v4()
      data = {
        name: 'Some Fresh New Place',
        description: 'Yo the best place around',
        activities: [uuid.v4(), uuid.v4()]
      }

      patchExpectedResult = { id }

      patchAndFetchByIdSub = this.sinon.stub()
      this.sinon.stub(Place, 'query').returns({ patchAndFetchById: patchAndFetchByIdSub })
      patchAndFetchByIdSub.returns(patchExpectedResult)

      existingPlaceActivities = [
        { id: uuid.v4(), activity_id: data.activities[0], name: 'no change' },
        { id: uuid.v4(), activity_id: uuid.v4(), name: 'needs deleted' }
      ]
      this.sinon.stub(placeActivityService, 'findByPlaceId')
        .resolves(existingPlaceActivities)

      createdPlaceActivities = [{ id: data.activities[1] }]
      deletedPlaceActivities = [existingPlaceActivities[1]]

      createMultipleStub = this.sinon.stub(placeActivityService, 'createMultiple')
        .resolves(createdPlaceActivities)
      deleteMultipleStub = this.sinon.stub(placeActivityService, 'deleteMultiple')
        .resolves(deletedPlaceActivities)
    })
    it('Updates the specified place, and handles activities properly', async function () {
      const result = await placeService.update(id, data)
      expect(result).to.deep.equal({
        ...patchExpectedResult,
        createdPlaceActivities,
        deletedPlaceActivities
      })

      const createMultipleArgs = createMultipleStub.getCall(0).args[0]
      delete createMultipleArgs[0].id
      expect(createMultipleArgs).to.deep.equal([{
        activity_id: data.activities[1],
        place_id: result.id
      }])

      const deleteMultipleArgs = deleteMultipleStub.getCall(0).args[0]
      delete deleteMultipleArgs[0].id
      expect(deleteMultipleArgs).to.deep.equal([existingPlaceActivities[1].id])
    })
    it('Doesn\'t create PlaceActivities when provided match existing', async function () {
      existingPlaceActivities[1].activity_id = data.activities[1]
      const result = await placeService.update(id, data)
      expect(result).to.deep.equal(patchExpectedResult)
    })
  })

  describe('getById', function () {
    let findByIdStbub
    beforeEach(function () {
      findByIdStbub = this.sinon.stub()
      const withGraphFetchedStub = this.sinon.stub()
      this.sinon.stub(Place, 'query').returns({ withGraphFetched: withGraphFetchedStub })
      withGraphFetchedStub.returns({ findById: findByIdStbub })
    })
    it('finds place by id', async function () {
      const id = 'abc'
      const place = { id: '123' }
      findByIdStbub.resolves(place)
      const result = await placeService.getById(id)
      expect(result).to.deep.equal(place)

      const findByIdArgs = findByIdStbub.getCall(0).args
      expect(findByIdArgs[0]).to.equal(id)
    })
  })
})
