/* global describe, it, beforeEach, expect */
const Scope = require('../../../app/models/Scope')
const scopeService = require('../../../app/services/scopeService')

require('../../support/node')

describe('scopeService', function () {
  describe('create', function () {
    let insertStub, returningStub
    beforeEach(function () {
      insertStub = this.sinon.stub()
      returningStub = this.sinon.stub()
      this.sinon.stub(Scope, 'query').returns({ insert: insertStub })

      insertStub.returns({ returning: returningStub })
    })
    it('creates a user with the appropriate fields mapped', async function () {
      const name = 'scope:name'
      const description = 'scope description'
      returningStub.resolves({ name, description })
      const results = await scopeService.create({ name, description })
      expect(results).to.deep.equal({ name, description })

      const insertArgs = insertStub.getCall(0).args[0]
      delete insertArgs.id
      expect(insertArgs).to.deep.equal({ name, description })
    })
  })

  describe('deleteById', function () {
    let findByIdStbub
    beforeEach(function () {
      const deleteStub = this.sinon.stub()
      findByIdStbub = this.sinon.stub().returns({ delete: deleteStub })
      this.sinon.stub(Scope, 'query').returns({ findById: findByIdStbub })
    })
    it('finds place by id', async function () {
      const id = 'abc'
      await scopeService.deleteById(id)

      const findByIdArgs = findByIdStbub.getCall(0).args
      expect(findByIdArgs[0]).to.equal(id)
    })
  })

  describe('get', function () {
    let orderByStub
    beforeEach(function () {
      orderByStub = this.sinon.stub()
      this.sinon.stub(Scope, 'query').returns({ orderBy: orderByStub })
    })
    it('returns all scopes', async function () {
      const scopes = [{ id: '123' }]
      orderByStub.resolves(scopes)
      const result = await scopeService.get()
      expect(result).to.deep.equal(scopes)
    })
  })

  describe('getById', function () {
    let findByIdStbub
    beforeEach(function () {
      findByIdStbub = this.sinon.stub()
      this.sinon.stub(Scope, 'query').returns({ findById: findByIdStbub })
    })
    it('finds place by id', async function () {
      const id = 'abc'
      const scope = { id: '123' }
      findByIdStbub.resolves(scope)
      const result = await scopeService.getById(id)
      expect(result).to.deep.equal(scope)

      const findByIdArgs = findByIdStbub.getCall(0).args
      expect(findByIdArgs[0]).to.equal(id)
    })
  })

  describe('update', function () {
    let patchAndFetchByIdStub
    beforeEach(function () {
      patchAndFetchByIdStub = this.sinon.stub()
      this.sinon.stub(Scope, 'query').returns({ patchAndFetchById: patchAndFetchByIdStub })
    })
    it('updates place by id', async function () {
      const id = 'abc'
      const updates = { name: 'test:scope', description: 'scope for testing' }
      patchAndFetchByIdStub.resolves(updates)
      const result = await scopeService.update(id, updates)
      expect(result).to.deep.equal(updates)

      const patchAndFetchByIdArgs = patchAndFetchByIdStub.getCall(0).args
      expect(patchAndFetchByIdArgs[0]).to.equal(id)
      expect(patchAndFetchByIdArgs[1]).to.deep.equal(updates)
    })
  })

  describe('getBaseScopes', function () {
    let whereInStub
    beforeEach(function () {
      whereInStub = this.sinon.stub()
      const selectStub = this.sinon.stub().returns({ whereIn: whereInStub })
      this.sinon.stub(Scope, 'query').returns({ select: selectStub })
    })
    it('updates place by id', async function () {
      const baseScopes = [{ name: 'test:scope', description: 'scope for testing' }]
      whereInStub.resolves(baseScopes)
      const result = await scopeService.getBaseScopes()
      expect(result).to.deep.equal(baseScopes)

      const whereInArgs = whereInStub.getCall(0).args
      expect(whereInArgs[0]).to.equal('name')
      expect(whereInArgs[1]).to.deep.equal(['objects:edit', 'objects:create'])
    })
  })
})
