/* global describe, beforeEach, it, expect */
const { stubRes, createDeferredNext } = require('../../support/testUtil')
const activities = require('../../../app/routes/activities')
const activityService = require('../../../app/services/activityService')
const Activity = require('../../../app/models/Activity')

require('../../support/node')

describe('activities router', function () {
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
  describe('/activities', function () {
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
  describe('/activities/all', function () {
    let findByIdStub
    beforeEach(function () {
      req.url = '/activities'
      expectedOutput = { id: '123abc' }
      findByIdStub = this.sinon.stub()
      this.sinon.stub(Activity, 'query').returns({ findById: findByIdStub })
    })
    it('searches and responds', async function () {
      findByIdStub.resolves(expectedOutput)
      activities(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      findByIdStub.throws(error)
      activities(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
})
