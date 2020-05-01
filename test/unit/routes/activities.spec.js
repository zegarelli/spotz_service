/* global describe, beforeEach, it, expect */
const { stubRes, createDeferredNext } = require('../../support/testUtil')
const activities = require('../../../app/routes/activities')
const activityService = require('../../../app/services/activityService')
const uuid = require('uuid')

require('../../support/node')

describe('activities router', function () {
  let req, res, expectedOutput, nextSpy
  beforeEach(function () {
    expectedOutput = { outputs: 'stuff' }
    req = {
      method: 'GET',
      url: '/',
      user: { scopes: [], id: uuid.v4() },
      body: {},
      query: {}
    }
    res = stubRes()
    nextSpy = this.sinon.spy(createDeferredNext())
  })
  describe('GET /activities', function () {
    let activityServiceStub
    beforeEach(function () {
      expectedOutput = { id: '123abc' }
      activityServiceStub = this.sinon.stub(activityService, 'search')
      activityServiceStub.resolves(expectedOutput)
    })
    it('searches and responds', async function () {
      activities(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
      })
    })
    it('passes along the search criteria', async function () {
      req.query = {
        name: 'run',
        creator: 'martin',
        place: 'trolley trail'
      }
      activities(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
        const searchArgs = activityServiceStub.getCall(0).args
        expect(searchArgs[0]).to.equal(req.query.name)
        expect(searchArgs[1]).to.equal(req.query.creator)
        expect(searchArgs[2]).to.equal(req.query.place)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      activityServiceStub.throws(error)
      activities(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('POST /activities', function () {
    let createStub
    beforeEach(function () {
      req.method = 'POST'
      req.user.scopes = ['admin:manage']
      expectedOutput = { id: '123abc' }
      createStub = this.sinon.stub(activityService, 'create')
    })
    it('searches and responds', async function () {
      createStub.resolves(expectedOutput)
      activities(req, res, nextSpy)

      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)

        const createArgs = createStub.getCall(0).args
        expect(createArgs[0]).to.deep.equal(req.body)
        expect(createArgs[1]).to.equal(req.user.id)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      createStub.throws(error)
      activities(req, res, nextSpy)
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
      updateStub = this.sinon.stub(activityService, 'update')
      updateStub.resolves(expectedOutput)
      req.method = 'put'
      req.url = `/${id}`
      req.body = { data: 'some data' }
      req.user.scopes = ['admin:manage']
    })
    it('updates and responds', async function () {
      activities(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)

        const updateArgs = updateStub.getCall(0).args
        expect(updateArgs).to.deep.equal([id, req.body, req.user.id])
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      updateStub.throws(error)
      activities(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('/activities/:id', function () {
    let getByIdStub
    beforeEach(function () {
      req.url = '/123abc'
      expectedOutput = { id: '123abc' }
      getByIdStub = this.sinon.stub(activityService, 'getById')
    })
    it('searches and responds', async function () {
      getByIdStub.resolves(expectedOutput)
      activities(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      getByIdStub.throws(error)
      activities(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
})
