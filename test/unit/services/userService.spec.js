/* global describe, it, beforeEach, expect */

const userService = require('../../../app/services/userService')
const User = require('../../../app/models/User')
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
  describe('getUserScopes', function () {
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
})
