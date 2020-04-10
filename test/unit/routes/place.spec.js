/* global describe, beforeEach, it, expect */
const { stubRes, createDeferredNext } = require('../../support/testUtil')
const places = require('../../../app/routes/places')
const placeService = require('../../../app/services/placeService')

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
    let searchStub
    beforeEach(function () {
      expectedOutput = { id: '123abc' }
      searchStub = this.sinon.stub(placeService, 'search')
      searchStub.resolves(expectedOutput)
    })
    it('searches and responds', async function () {
      places(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      searchStub.throws(error)
      places(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('/places/:id', function () {
    let getByIdStub
    beforeEach(function () {
      req.url = '/123abc'
      expectedOutput = { id: '123abc' }
      getByIdStub = this.sinon.stub(placeService, 'getById')
    })
    it('searches and responds', async function () {
      getByIdStub.resolves(expectedOutput)
      places(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      getByIdStub.throws(error)
      places(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
})
