/* global describe, it, beforeEach, expect */

require('../../support/node')
const placeService = require('../../../app/services/placeService')
const Place = require('../../../app/models/Place')

describe('placeService', function () {
  describe('search', function () {
    let whereStub, withGraphFetchedStub
    beforeEach(function () {
      whereStub = this.sinon.stub()
      withGraphFetchedStub = this.sinon.stub()
      this.sinon.stub(Place, 'query').returns({ withGraphFetched: withGraphFetchedStub })
      withGraphFetchedStub.returns({ where: whereStub })
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
      withGraphFetchedStub.returns(place)
      const result = await placeService.search(undefined, undefined)
      expect(result).to.equal(place)
      this.sinon.assert.notCalled(whereStub)
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
