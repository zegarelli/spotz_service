/* global describe, it, beforeEach, after, expect */
const { stubRes } = require('../../support/testUtil')
const errorHandler = require('../../../app/common/errorHandler')
const { UnauthorizedError, PermissionError, TokenError } = require('../../../app/common/errors')

describe('errorHandler', function () {
  let req, res, nextCallback
  beforeEach(function () {
    req = {
      method: 'POST',
      url: '/'
    }
    res = stubRes()
    nextCallback = this.sinon.stub()
  })
  it('catches Unauthorized error; strips description', function () {
    errorHandler(new UnauthorizedError('this is an error'), req, res, nextCallback)
    return res.then(data => {
      expect(res.statusCode).to.eql(401)
      const response = JSON.parse(res.text)
      expect(response.error).to.eql('Unauthorized')
      expect(response.error_description).to.be.null()
    })
  })
  it('catches Permission error; strips description', function () {
    errorHandler(new PermissionError('this is an error'), req, res, nextCallback)
    return res.then(data => {
      expect(res.statusCode).to.eql(403)
      const response = JSON.parse(res.text)
      expect(response.error).to.eql('Unauthorized')
      expect(response.error_description).to.be.null()
    })
  })
  it('catches Token error; strips description', function () {
    errorHandler(new TokenError('this is an error', { errData: 'err' }), req, res, nextCallback)
    return res.then(data => {
      expect(res.statusCode).to.eql(401)
      const response = JSON.parse(res.text)
      expect(response.error).to.eql('Token Error')
      expect(response.error_description).to.be.null()
    })
  })
  it('passes on other errors', function () {
    return errorHandler(new Error('this is an error'), req, res, function (err) {
      expect(err).to.not.be.undefined()
    })
  })
  describe('node_env == dev', function () {
    beforeEach(function () {
      process.env.NODE_ENV = 'development'
    })
    after(function () {
      process.env.NODE_ENV = 'test'
    })
    it('catches Unauthorized error; leaves description', function () {
      errorHandler(new UnauthorizedError('this is an error'), req, res, nextCallback)
      return res.then(() => {
        expect(res.text).to.eql(JSON.stringify({ error: 'Unauthorized', error_description: 'No authorization token was found' }))
      })
    })
    it('catches Permission error; leaves description', function () {
      errorHandler(new PermissionError('this is an error'), req, res, nextCallback)
      return res.then(() => {
        expect(res.text).to.eql(JSON.stringify({ error: 'Unauthorized', error_description: 'Not authorized to view this content' }))
      })
    })
    it('catches Token error; leaves description', function () {
      errorHandler(new TokenError('this is an error'), req, res, nextCallback)
      return res.then(() => {
        expect(res.text).to.eql(JSON.stringify({ error: 'Token Error', error_description: 'Issue with authorization token' }))
      })
    })
  })
})
