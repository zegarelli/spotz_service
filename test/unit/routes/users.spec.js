/* global describe, beforeEach, it, expect */
const { stubRes, createDeferredNext } = require('../../support/testUtil')
const users = require('../../../app/routes/users')
const User = require('../../../app/models/User')

require('../../support/node')

describe('users router', function () {
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
  describe('/users', function () {
    let placeQueryStub
    beforeEach(function () {
      expectedOutput = { id: '123abc' }
      placeQueryStub = this.sinon.stub(User, 'query')
      placeQueryStub.resolves(expectedOutput)
    })
    it('searches and responds', async function () {
      users(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      placeQueryStub.throws(error)
      users(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('/users/:id', function () {
    let findByIdStub, userId, eagerStub
    beforeEach(function () {
      userId = '123abc'
      req.url = `/${userId}`
      expectedOutput = { id: userId }
      findByIdStub = this.sinon.stub()
      eagerStub = this.sinon.stub()
      this.sinon.stub(User, 'query').returns({ findById: findByIdStub })
      findByIdStub.returns({ eager: eagerStub })
    })
    it('searches and responds', async function () {
      eagerStub.resolves(expectedOutput)
      users(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
        const findByIdArgs = findByIdStub.getCall(0).args
        expect(findByIdArgs[0]).to.equal(userId)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      findByIdStub.throws(error)
      users(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
        const findByIdArgs = findByIdStub.getCall(0).args
        expect(findByIdArgs[0]).to.equal(userId)
      })
    })
  })
  describe('/users/:id/places', function () {
    let findByIdStub, eagerStub, userId
    beforeEach(function () {
      userId = '123abc'
      req.url = `/${userId}/places`
      expectedOutput = { id: userId }
      findByIdStub = this.sinon.stub()
      eagerStub = this.sinon.stub()
      this.sinon.stub(User, 'query').returns({ findById: findByIdStub })
      findByIdStub.returns({ eager: eagerStub })
    })
    it('searches and responds', async function () {
      eagerStub.resolves(expectedOutput)
      users(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
        const findByIdArgs = findByIdStub.getCall(0).args
        expect(findByIdArgs[0]).to.equal(userId)
        const eagerStubArgs = eagerStub.getCall(0).args
        expect(eagerStubArgs[0]).to.equal('places')
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      eagerStub.throws(error)
      users(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('/users/:id/activities', function () {
    let findByIdStub, eagerStub, userId
    beforeEach(function () {
      userId = '123abc'
      req.url = `/${userId}/activities`
      expectedOutput = { id: userId }
      findByIdStub = this.sinon.stub()
      eagerStub = this.sinon.stub()
      this.sinon.stub(User, 'query').returns({ findById: findByIdStub })
      findByIdStub.returns({ eager: eagerStub })
    })
    it('searches and responds', async function () {
      eagerStub.resolves(expectedOutput)
      users(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
        const findByIdArgs = findByIdStub.getCall(0).args
        expect(findByIdArgs[0]).to.equal(userId)
        const eagerStubArgs = eagerStub.getCall(0).args
        expect(eagerStubArgs[0]).to.equal('activities')
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      eagerStub.throws(error)
      users(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
})
