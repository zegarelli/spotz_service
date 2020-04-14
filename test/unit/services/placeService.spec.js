/* global describe, it, beforeEach, expect */

require('../../support/node')
const placeService = require('../../../app/services/placeService')
const Place = require('../../../app/models/Place')
const PlaceActivity = require('../../../app/models/PlaceActivity')
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
    let insertStub, insertGraphStub, returningStub, placeExpectedResult, placeActivityExpectedResult, data
    beforeEach(function () {
      data = {
        name: 'Some Fresh New Place',
        description: 'Yo the best place around',
        activities: [uuid.v4(), uuid.v4()]
      }

      placeExpectedResult = { id: uuid.v4() }
      placeActivityExpectedResult = { id: uuid.v4() }
      insertStub = this.sinon.stub()
      insertGraphStub = this.sinon.stub()
      returningStub = this.sinon.stub()
      this.sinon.stub(Place, 'query').returns({ insert: insertStub })
      this.sinon.stub(PlaceActivity, 'query').returns({ insertGraph: insertGraphStub })
      insertStub.returns({ returning: returningStub })
      insertGraphStub.returns({ returning: returningStub })
      returningStub.onFirstCall().returns(placeExpectedResult)
      returningStub.onSecondCall().returns(placeActivityExpectedResult)
    })
    it('Creates a new Place & PlaceActivities', async function () {
      const result = await placeService.create(data)
      expect(result).to.deep.equal({ ...placeExpectedResult, activities: placeActivityExpectedResult })

      const insertData = insertStub.getCall(0).args[0]
      delete insertData.id
      expect(insertData).to.deep.equal({
        name: data.name,
        extended_data: { description: data.description }
      })

      const insertGraphData = insertGraphStub.getCall(0).args[0]
      const firstPlaceActivityData = insertGraphData[0]
      delete firstPlaceActivityData.id
      expect(firstPlaceActivityData).to.deep.equal({
        activity_id: data.activities[0],
        place_id: placeExpectedResult.id
      })
    })
    it('Doesn\'t create PlaceActivities when none are provided', async function () {
      delete data.activities
      const result = await placeService.create(data)
      expect(result).to.deep.equal(placeExpectedResult)
    })
  })

  describe('update', function () {
    let id, data, patchAndFetchByIdSub, insertGraphStub, returningStub,
      patchExpectedResult, placeActivityExpectedResult
    beforeEach(function () {
      id = uuid.v4()
      data = {
        name: 'Some Fresh New Place',
        description: 'Yo the best place around',
        activities: [uuid.v4(), uuid.v4()]
      }

      patchExpectedResult = { id: uuid.v4() }

      patchAndFetchByIdSub = this.sinon.stub()
      insertGraphStub = this.sinon.stub()
      this.sinon.stub(Place, 'query').returns({ insert: patchAndFetchByIdSub })
      this.sinon.stub(PlaceActivity, 'query').returns({ insertGraph: insertGraphStub })
      patchAndFetchByIdSub.returns(patchExpectedResult)
      insertGraphStub.returns({ returning: returningStub })
    })
    it('Creates a new Place & PlaceActivities', async function () {
      const result = await placeService.create(data)
      expect(result).to.deep.equal({ ...placeExpectedResult, activities: placeActivityExpectedResult })

      const insertData = insertStub.getCall(0).args[0]
      delete insertData.id
      expect(insertData).to.deep.equal({
        name: data.name,
        extended_data: { description: data.description }
      })

      const insertGraphData = insertGraphStub.getCall(0).args[0]
      const firstPlaceActivityData = insertGraphData[0]
      delete firstPlaceActivityData.id
      expect(firstPlaceActivityData).to.deep.equal({
        activity_id: data.activities[0],
        place_id: placeExpectedResult.id
      })
    })
    it('Doesn\'t create PlaceActivities when none are provided', async function () {
      delete data.activities
      const result = await placeService.create(data)
      expect(result).to.deep.equal(placeExpectedResult)
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
