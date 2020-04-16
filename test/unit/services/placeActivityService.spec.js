/* global describe, it, beforeEach, expect */

require('../../support/node')
const placeActivityService = require('../../../app/services/placeActivityService')
const PlaceActivity = require('../../../app/models/PlaceActivity')
const uuid = require('uuid')

describe('placeActivityService', function () {
  describe('createMultiple', function () {
    let insertGraphStub, returningStub, placeActivityExpectedResult
    beforeEach(function () {
      placeActivityExpectedResult = { id: uuid.v4() }
      insertGraphStub = this.sinon.stub()
      this.sinon.stub(PlaceActivity, 'query').returns({ insertGraph: insertGraphStub })
      returningStub = this.sinon.stub()
      insertGraphStub.returns({ returning: returningStub })
      returningStub.returns(placeActivityExpectedResult)
    })
    it('creates place activities for all passed in', async function () {
      const placeActivities = [{ id: uuid.v4() }, { id: uuid.v4() }]
      const result = await placeActivityService.createMultiple(placeActivities)
      expect(result).to.deep.equal(placeActivityExpectedResult)

      const insertGraphArgs = insertGraphStub.getCall(0).args[0]
      expect(insertGraphArgs).to.deep.equal(placeActivities)
    })
  })
  describe('deleteMultiple', function () {
    let whereInStub
    beforeEach(function () {
      whereInStub = this.sinon.stub()
      const deleteStub = this.sinon.stub().returns({ whereIn: whereInStub })
      this.sinon.stub(PlaceActivity, 'query').returns({ delete: deleteStub })
    })
    it('deletes multiple placeActivities by id', async function () {
      const expectedDeleteResult = 'who knows'
      const idsToDelete = [uuid.v4(), uuid.v4()]
      whereInStub.returns(expectedDeleteResult)
      const result = await placeActivityService.deleteMultiple(idsToDelete)
      expect(result).to.equal(expectedDeleteResult)

      const whereInArgs = whereInStub.getCall(0).args
      expect(whereInArgs).to.deep.equal(['id', idsToDelete])
    })
  })
  describe('findByPlaceId', function () {
    let whereStub, selectStub
    beforeEach(function () {
      whereStub = this.sinon.stub()
      selectStub = this.sinon.stub().returns({ where: whereStub })
      this.sinon.stub(PlaceActivity, 'query').returns({ select: selectStub })
    })
    it('finds by placeId', async function () {
      const foundPlaceActivity = { id: uuid.v4() }
      const idToFind = uuid.v4()
      whereStub.returns(foundPlaceActivity)
      const result = await placeActivityService.findByPlaceId(idToFind)
      expect(result).to.equal(foundPlaceActivity)

      const whereArgs = whereStub.getCall(0).args
      expect(whereArgs).to.deep.equal([{ place_id: idToFind }])

      const selectArgs = selectStub.getCall(0).args
      expect(selectArgs).to.deep.equal(['id', 'activity_id'])
    })
  })
  describe('findByActivityId', function () {
    let whereStub, selectStub
    beforeEach(function () {
      whereStub = this.sinon.stub()
      selectStub = this.sinon.stub().returns({ where: whereStub })
      this.sinon.stub(PlaceActivity, 'query').returns({ select: selectStub })
    })
    it('finds by activityId', async function () {
      const foundPlaceActivity = { id: uuid.v4() }
      const idToFind = uuid.v4()
      whereStub.returns(foundPlaceActivity)
      const result = await placeActivityService.findByActivityId(idToFind)
      expect(result).to.equal(foundPlaceActivity)

      const whereArgs = whereStub.getCall(0).args
      expect(whereArgs).to.deep.equal([{ activity_id: idToFind }])

      const selectArgs = selectStub.getCall(0).args
      expect(selectArgs).to.deep.equal(['id', 'place_id'])
    })
  })
})
