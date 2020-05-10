/* global describe, beforeEach, it, expect */
const { stubRes, createDeferredNext } = require('../../support/testUtil')
const users = require('../../../app/routes/users')
const User = require('../../../app/models/User')
const userService = require('../../../app/services/userService')
const { UnauthorizedError } = require('../../../app/common/errors')

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
    let getUsersStub
    beforeEach(function () {
      expectedOutput = { id: '123abc' }
      getUsersStub = this.sinon.stub(userService, 'getUsers')
      getUsersStub.resolves(expectedOutput)
    })
    it('searches and responds', async function () {
      users(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      getUsersStub.throws(error)
      users(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('/users/verify', function () {
    let ensureUserStub
    beforeEach(function () {
      req = {
        method: 'POST',
        url: '/verify',
        user: { scopes: [] },
        body: { id_token: '12345' },
        query: {}
      }

      expectedOutput = { id: '123abc' }
      ensureUserStub = this.sinon.stub(userService, 'ensureUser')
      ensureUserStub.resolves(expectedOutput)
    })
    it('ensures user and responds', async function () {
      users(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
        const ensureUserArgs = ensureUserStub.getCall(0).args
        expect(ensureUserArgs[0]).to.equal(req.body.id_token)
      })
    })
    it('requires an id_token in the body', async function () {
      delete req.body.id_token
      users(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy.getCall(0).args[0]).instanceOf(UnauthorizedError)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      ensureUserStub.throws(error)
      users(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('/users/:id', function () {
    let findByIdStub, userId, withGraphFetchedStub
    beforeEach(function () {
      userId = '123abc'
      req.url = `/${userId}`
      expectedOutput = { id: userId }
      findByIdStub = this.sinon.stub()
      withGraphFetchedStub = this.sinon.stub()
      this.sinon.stub(User, 'query').returns({ findById: findByIdStub })
      findByIdStub.returns({ withGraphFetched: withGraphFetchedStub })
    })
    it('searches and responds', async function () {
      withGraphFetchedStub.resolves(expectedOutput)
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
    let findByIdStub, withGraphFetchedStub, userId
    beforeEach(function () {
      userId = '123abc'
      req.url = `/${userId}/places`
      expectedOutput = { id: userId }
      findByIdStub = this.sinon.stub()
      withGraphFetchedStub = this.sinon.stub()
      this.sinon.stub(User, 'query').returns({ findById: findByIdStub })
      findByIdStub.returns({ withGraphFetched: withGraphFetchedStub })
    })
    it('searches and responds', async function () {
      withGraphFetchedStub.resolves(expectedOutput)
      users(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
        const findByIdArgs = findByIdStub.getCall(0).args
        expect(findByIdArgs[0]).to.equal(userId)
        const eagerStubArgs = withGraphFetchedStub.getCall(0).args
        expect(eagerStubArgs[0]).to.equal('places')
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      withGraphFetchedStub.throws(error)
      users(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('/users/:id/activities', function () {
    let findByIdStub, withGraphFetchedStub, userId
    beforeEach(function () {
      userId = '123abc'
      req.url = `/${userId}/activities`
      expectedOutput = { id: userId }
      findByIdStub = this.sinon.stub()
      withGraphFetchedStub = this.sinon.stub()
      this.sinon.stub(User, 'query').returns({ findById: findByIdStub })
      findByIdStub.returns({ withGraphFetched: withGraphFetchedStub })
    })
    it('searches and responds', async function () {
      withGraphFetchedStub.resolves(expectedOutput)
      users(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
        const findByIdArgs = findByIdStub.getCall(0).args
        expect(findByIdArgs[0]).to.equal(userId)
        const eagerStubArgs = withGraphFetchedStub.getCall(0).args
        expect(eagerStubArgs[0]).to.equal('activities')
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      withGraphFetchedStub.throws(error)
      users(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('POST /users/:id/scope', function () {
    let addScopeStub, userId
    beforeEach(function () {
      userId = '123abc'
      req.url = `/${userId}/scope`
      req.method = 'POST'
      req.body = { scopeId: '12345' }
      expectedOutput = { id: userId }
      addScopeStub = this.sinon.stub(userService, 'addScope')
    })
    it('searches and responds', async function () {
      addScopeStub.resolves(expectedOutput)
      users(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
        const addScopeArgs = addScopeStub.getCall(0).args
        expect(addScopeArgs[0]).to.equal(userId)
        expect(addScopeArgs[1]).to.deep.equal(req.body)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      addScopeStub.throws(error)
      users(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
  describe('DELETE /users/:id/scope', function () {
    let removeScopeStub, userId
    beforeEach(function () {
      userId = '123abc'
      req.url = `/${userId}/scope`
      req.method = 'DELETE'
      req.body = { scopeId: '12345' }
      expectedOutput = { id: userId }
      removeScopeStub = this.sinon.stub(userService, 'removeScope')
    })
    it('searches and responds', async function () {
      removeScopeStub.resolves(expectedOutput)
      users(req, res, nextSpy)
      return res.then(async function () {
        expect(JSON.parse(res.text)).to.deep.equal(expectedOutput)
        const addScopeArgs = removeScopeStub.getCall(0).args
        expect(addScopeArgs[0]).to.equal(userId)
        expect(addScopeArgs[1]).to.deep.equal(req.body)
      })
    })
    it('passes on errors', async function () {
      const error = new Error('blah')
      removeScopeStub.throws(error)
      users(req, res, nextSpy)
      return nextSpy.then(() => {
        expect(nextSpy).calledWith(error)
      })
    })
  })
})
