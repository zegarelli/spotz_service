/* global describe, beforeEach, it, expect */
const { stubRes, createDeferredNext } = require('../../support/testUtil')
const places = require('../../../app/routes/places')
const Place = require('../../../app/models/Place')

require('../../support/node')

describe('places router', function () {
  let req, res, expectedOutput, nextSpy
  beforeEach(function () {
    expectedOutput = { outputs: 'stuff' }
    req = {
      method: 'GET',
      url: '/',
      user: { scopes: [] },
      body: {},
      query: {}
    }
    res = stubRes()
    nextSpy = this.sinon.spy(createDeferredNext())
  })
  describe('/places', function () {
    let placeQueryStub
    beforeEach(function () {
      expectedOutput = { id: '123abc' }
      placeQueryStub = this.sinon.stub(Place, 'query')
      placeQueryStub.resolves(expectedOutput)
    })
    it('searches and responds', async function () {
      places(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      placeQueryStub.throws(error)
      places(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('/places/:id', function () {
    let findByIdStub, withGraphFetchedStub
    beforeEach(function () {
      req.url = '/123abc'
      expectedOutput = { id: '123abc' }
      findByIdStub = this.sinon.stub()
      withGraphFetchedStub = this.sinon.stub()
      withGraphFetchedStub = this.sinon.stub()
      this.sinon.stub(Place, 'query').returns({ findById: findByIdStub })
      findByIdStub.returns({ withGraphFetched: withGraphFetchedStub })
    })
    it('searches and responds', async function () {
      withGraphFetchedStub.resolves(expectedOutput)
      places(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      withGraphFetchedStub.throws(error)
      places(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
})
