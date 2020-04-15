/* global describe, it, beforeEach, expect */
const builders = require('../../../../app/services/common/builders')

describe('services/common/builders', function () {
  let builder, selectStub
  beforeEach(function () {
    selectStub = this.sinon.stub()
    builder = { select: selectStub }
  })
  describe('selectNameAndId', function () {
    it('it calls builder.select with name & id', function () {
      builders.selectNameAndId(builder)
      const selectArgs = selectStub.getCall(0).args
      expect(selectArgs).to.deep.equal(['name', 'id'])
    })
  })
  describe('selectIdAndDescription', function () {
    it('it calls builder.select with name & details', function () {
      builders.selectIdAndDescription(builder)
      const selectArgs = selectStub.getCall(0).args
      expect(selectArgs).to.deep.equal(['id', 'details'])
    })
  })
})
