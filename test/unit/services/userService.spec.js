/* global describe, it, beforeEach, expect */

const userService = require('../../../app/services/userService')
const User = require('../../../app/models/User')
const UserScope = require('../../../app/models/UserScope')
const scopeService = require('../../../app/services/scopeService')
const token = require('../../../app/common/token')
const uuid = require('uuid')

require('../../support/node')

describe('userService', function () {
  describe('create', function () {
    let insertStub, returningStub
    beforeEach(function () {
      insertStub = this.sinon.stub()
      returningStub = this.sinon.stub()
      this.sinon.stub(User, 'query').returns({ insert: insertStub })

      insertStub.returns({ returning: returningStub })
    })
    it('creates a user with the appropriate fields mapped', async function () {
      const email = 'martin@spots.com'
      const username = 'martin'
      const verified = true
      returningStub.resolves({ email, username, verified })
      const results = await userService.createUser(email, username, verified)
      expect(results).to.deep.equal({ email, username, verified })

      const insertArgs = insertStub.getCall(0).args[0]
      delete insertArgs.id
      expect(insertArgs).to.deep.equal({ email, username, verified })
    })
    it('requires boolean true to set verified to true', async function () {
      const email = 'martin@spots.com'
      const username = 'martin'
      const verified = 'notbooleantrue'
      returningStub.resolves({ email, username, verified })
      const results = await userService.createUser(email, username, verified)
      expect(results).to.deep.equal({ email, username, verified })

      const insertArgs = insertStub.getCall(0).args[0]
      delete insertArgs.id
      expect(insertArgs).to.deep.equal({ email, username, verified: false })
    })
  })
  describe('getUsers', function () {
    let withGraphFetchedStub, expected
    beforeEach(function () {
      withGraphFetchedStub = this.sinon.stub()
      this.sinon.stub(User, 'query').returns({ withGraphFetched: withGraphFetchedStub })

      expected = ['some', 'list', 'of', 'users']
      withGraphFetchedStub.resolves(expected)
    })
    it('gets users', async function () {
      const result = await userService.getUsers()
      expect(result).to.deep.equal(expected)
    })
  })
  describe('getUserIdAndScopes', function () {
    let whereStub, user
    beforeEach(function () {
      whereStub = this.sinon.stub()
      const withGraphFetchedStub = this.sinon.stub()
      this.sinon.stub(User, 'query').returns({ withGraphFetched: withGraphFetchedStub })
      withGraphFetchedStub.returns({ where: whereStub })

      user = {
        id: uuid.v4(),
        email: 'martin@spotz.com',
        scopes: [
          {
            name: 'admin:manage'
          },
          {
            name: 'nothing'
          }
        ]

      }
    })
    it('returns a users scopes', async function () {
      whereStub.resolves([user])
      const results = await userService.getUserIdAndScopes(user.email)
      expect(results.id).to.deep.equal(user.id)
      expect(results.scopes).to.deep.equal([user.scopes[0].name, user.scopes[1].name])

      expect(whereStub.getCall(0).args[0]).to.deep.equal({ email: user.email })
    })
    it('throws when multiple users are found', async function () {
      whereStub.resolves([user, user])
      try {
        await userService.getUserIdAndScopes(user.email)
      } catch (err) {
        expect(err.message).to.equal(`Multiple Users with the same email: ${user.email} found`)
      }
    })
    it('throws when no users are found', async function () {
      whereStub.resolves([])
      try {
        await userService.getUserIdAndScopes(user.email)
      } catch (err) {
        expect(err.message).to.equal(`No user with email: ${user.email} found`)
      }
    })
  })
  describe('ensureUser', function () {
    let whereStub, user, tokenData, returningStub
    beforeEach(function () {
      user = {
        email: 'martin@spotz.com',
        username: 'martin',
        verified: true
      }

      tokenData = {
        'cognito:username': user.username,
        email: user.email,
        email_verified: true
      }
      whereStub = this.sinon.stub()
      const insertStub = this.sinon.stub()
      returningStub = this.sinon.stub()
      const querystub = this.sinon.stub(User, 'query')
      querystub.onFirstCall().returns({ where: whereStub })
      querystub.onSecondCall().returns({ insert: insertStub })
      insertStub.returns({ returning: returningStub })

      this.sinon.stub(token, 'decode').resolves(tokenData)
      this.sinon.stub(scopeService, 'getBaseScopes').resolves([])
    })
    it('returns a user when one exists', async function () {
      whereStub.resolves([user])
      const results = await userService.ensureUser(user.email)
      expect(results).to.deep.equal(user)

      expect(whereStub.getCall(0).args[0]).to.deep.equal({ email: user.email })
      expect(returningStub.notCalled).to.equal(true)
    })
    it('creates a user when none exists', async function () {
      whereStub.resolves([])
      returningStub.resolves(user)
      const results = await userService.ensureUser(user.email)
      expect(results).to.deep.equal(user)

      expect(whereStub.getCall(0).args[0]).to.deep.equal({ email: user.email })
      expect(returningStub.calledOnce).to.equal(true)
    })
    it('throws an error when tokenData doesn\'t have email', async function () {
      delete tokenData.email
      whereStub.resolves([])
      returningStub.resolves(user)
      try {
        await userService.ensureUser(user.email)
      } catch (err) {
        expect(err).to.match(/Error: username or email not found in tokenData/)
      }
    })
    it('throws an error when tokenData doesn\'t have username', async function () {
      delete tokenData.username
      whereStub.resolves([])
      returningStub.resolves(user)
      try {
        await userService.ensureUser(user.email)
      } catch (err) {
        expect(err).to.match(/Error: username or email not found in tokenData/)
      }
    })
    it('throws an error when tokenData doesn\'t have username', async function () {
      delete tokenData.username
      whereStub.resolves([])
      returningStub.resolves(user)
      try {
        await userService.ensureUser(user.email)
      } catch (err) {
        expect(err).to.match(/Error: username or email not found in tokenData/)
      }
    })
    it('throws an error when multiple users are found', async function () {
      whereStub.resolves([user, user])
      try {
        await userService.ensureUser(user.email)
      } catch (err) {
        expect(err).to.match(/Error: multiple Users with the same email: /)
        expect(err.message).to.include(user.email)
      }
    })
  })
  describe('giveBaseScopes', function () {
    let insertStub, baseScopes
    beforeEach(function () {
      baseScopes = [{ id: 123 }, { id: 4657 }]
      this.sinon.stub(scopeService, 'getBaseScopes').resolves(baseScopes)
      insertStub = this.sinon.stub().resolves()
      this.sinon.stub(UserScope, 'query').returns({ insert: insertStub })
    })
    it('gets base scopes and creates userScopes for each', async function () {
      await userService.giveBaseScopes()
      expect(insertStub.callCount).to.equal(2)
    })
    it('gets base scopes and creates userScopes for each', async function () {
      insertStub.throws({ message: 'some error' })
      try {
        await userService.giveBaseScopes()
      } catch (err) {
        expect(insertStub.callCount).to.equal(2)
        expect(err.message).to.include(baseScopes[0].id)
        expect(err.message).to.include(baseScopes[1].id)
      }
    })
  })
  describe('addScope', function () {
    let insertStub, data, userId
    beforeEach(function () {
      userId = uuid.v4()
      data = { scopeId: uuid.v4() }
      insertStub = this.sinon.stub().resolves()
      this.sinon.stub(UserScope, 'query').returns({ insert: insertStub })
    })
    it('inserts a new userScope item for the user & scope', async function () {
      await userService.addScope(userId, data)
      expect(insertStub.callCount).to.equal(1)
      const insertArgs = insertStub.getCall(0).args[0]
      delete insertArgs.id
      expect(insertArgs).to.deep.equal({ user_id: userId, scope_id: data.scopeId })
    })
    it('it throws if scopeId is not provided', async function () {
      let result
      try {
        await userService.addScope(userId, {})
      } catch (err) {
        result = err
      }
      expect(insertStub.notCalled).to.equal(true)
      expect(result.message).to.include('No scopeId included in body')
    })
  })
  describe('removeScope', function () {
    let deleteStub, data, userId, whereStub
    beforeEach(function () {
      userId = uuid.v4()
      data = { scopeId: uuid.v4() }
      deleteStub = this.sinon.stub().resolves()
      whereStub = this.sinon.stub().returns({ delete: deleteStub })
      this.sinon.stub(UserScope, 'query').returns({ where: whereStub })
    })
    it('removes userScopes matching the scopeId & userId', async function () {
      await userService.removeScope(userId, data)
      expect(deleteStub.callCount).to.equal(1)
      const whereArgs = whereStub.getCall(0).args[0]
      delete whereArgs.id
      expect(whereArgs).to.deep.equal({ user_id: userId, scope_id: data.scopeId })
    })
    it('it throws if scopeId is not provided', async function () {
      let result
      try {
        await userService.removeScope(userId, {})
      } catch (err) {
        result = err
      }
      expect(deleteStub.notCalled).to.equal(true)
      expect(result.message).to.include('No scopeId included in body')
    })
  })
})
