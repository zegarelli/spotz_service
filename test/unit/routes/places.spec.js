/* global describe, beforeEach, it, expect */
const { stubRes, createDeferredNext } = require('../../support/testUtil')
const places = require('../../../app/routes/places')
const placeService = require('../../../app/services/placeService')
const uuid = require('uuid')

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
  describe('GET /places', function () {
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
  describe('POST /places', function () {
    let createStub
    beforeEach(function () {
      expectedOutput = { id: '123abc' }
      createStub = this.sinon.stub(placeService, 'create')
      createStub.resolves(expectedOutput)
      req.method = 'POST'
    })
    it('creates and responds', async function () {
      places(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      createStub.throws(error)
      places(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('PUT /places/:id', function () {
    let updateStub, id
    beforeEach(function () {
      id = uuid.v4()
      expectedOutput = { id }
      updateStub = this.sinon.stub(placeService, 'update')
      updateStub.resolves(expectedOutput)
      req.method = 'put'
      req.url = `/${id}`
      req.body = { data: 'some data' }
    })
    it('updates and responds', async function () {
      places(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)

        const updateArgs = updateStub.getCall(0).args
        expect(updateArgs).to.deep.equal([id, req.body])
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      updateStub.throws(error)
      places(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('GET /places/:id', function () {
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
