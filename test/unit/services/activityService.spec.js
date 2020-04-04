/* global describe, it, beforeEach, expect */

require('../../support/node')
const activityService = require('../../../app/services/activityService')
const Activity = require('../../../app/models/Activity')

describe('activityService', function () {
  describe('search', function () {
    let whereStub, queryStub
    beforeEach(function () {
      whereStub = this.sinon.stub()
      queryStub = this.sinon.stub(Activity, 'query').returns({ where: whereStub })
    })
    it('it is a function', function () {
      expect(typeof activityService.search).to.equal('function')
    })
    it('searches correctly', async function () {
      const activity = { id: '123' }
      whereStub.onCall(0).returns({ where: whereStub })
      whereStub.onCall(1).returns({ where: whereStub })
      whereStub.onCall(2).returns(activity)
      const name = 'running'
      const creator = 'martin'
      const place = 'trolly trail'
      const result = await activityService.search(name, creator, place)
      expect(result).to.equal(activity)

      const firstCallArgs = whereStub.getCall(0).args
      expect(firstCallArgs[0]).to.deep.equal({ name })

      const secondCallArgs = whereStub.getCall(1).args
      expect(secondCallArgs[0]).to.deep.equal({ creator })

      const thirdCallArgs = whereStub.getCall(2).args
      expect(thirdCallArgs[0]).to.deep.equal({ place })
    })
    it('it skips name when name isn\'t provided', async function () {
      const activity = { id: '123' }
      whereStub.onCall(0).returns({ where: whereStub })
      whereStub.onCall(1).returns(activity)
      const creator = 'martin'
      const place = 'trolly trail'
      const result = await activityService.search(undefined, creator, place)
      expect(result).to.equal(activity)

      const firstCallArgs = whereStub.getCall(0).args
      expect(firstCallArgs[0]).to.deep.equal({ creator })

      const secondCallArgs = whereStub.getCall(1).args
      expect(secondCallArgs[0]).to.deep.equal({ place })
    })
    it('doesnt call where', async function () {
      const activity = { id: '123' }
      queryStub.returns(activity)
      const result = await activityService.search(undefined, undefined, undefined)
      expect(result).to.equal(activity)
      this.sinon.assert.notCalled(whereStub)
    })
  })
})
