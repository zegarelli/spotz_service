/* global describe, it, beforeEach, expect */

const userService = require('../../../app/services/userService')
const User = require('../../../app/models/User')
const token = require('../../../app/common/token')

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
      const results = await userService.getUserScopes(user.email)
      expect(results).to.deep.equal([user.scopes[0].name, user.scopes[1].name])

      expect(whereStub.getCall(0).args[0]).to.deep.equal({ email: user.email })
    })
    it('throws when multiple users are found', async function () {
      whereStub.resolves([user, user])
      try {
        await userService.getUserScopes(user.email)
      } catch (err) {
        expect(err.message).to.equal(`Multiple Users with the same email: ${user.email} found`)
      }
    })
  })
  describe('ensureUser', function () {
    let whereStub, user
    beforeEach(function () {
      user = {
        email: 'martin@spotz.com'
      }
      whereStub = this.sinon.stub()
      this.sinon.stub(User, 'query').returns({ where: whereStub })

      this.sinon.stub(token, 'decode').resolves({ email: user.email })
    })
    it('returns a user when one exists', async function () {
      whereStub.resolves([user])
      const results = await userService.ensureUser(user.email)
      expect(results).to.deep.equal(user)

      expect(whereStub.getCall(0).args[0]).to.deep.equal({ email: user.email })
    })
  })
})
